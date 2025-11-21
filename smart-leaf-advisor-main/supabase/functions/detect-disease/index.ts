import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    console.log('Received image data for disease detection');

    if (!imageData) {
      throw new Error('No image data provided');
    }

    // Remove data URL prefix if present
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to blob
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!HUGGING_FACE_TOKEN) {
      throw new Error('Hugging Face token not configured');
    }

    console.log('Calling Hugging Face API for plant disease detection');

    // Using a plant disease classification model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: bytes,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Disease detection result:', result);

    // Process results
    if (!result || result.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Could not analyze image',
          isLeaf: false 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get top prediction
    const topPrediction = result[0];
    const confidence = topPrediction.score;

    console.log('Top prediction:', topPrediction.label, 'Confidence:', confidence);

    // Check if confidence is too low
    if (confidence < 0.7) {
      return new Response(
        JSON.stringify({
          error: 'Low confidence. Please provide a clearer image of the leaf.',
          confidence: confidence,
          isLeaf: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the prediction label
    const label = topPrediction.label.toLowerCase();
    
    // Check if it's a valid leaf image
    if (label.includes('not') || label.includes('background') || label.includes('invalid')) {
      return new Response(
        JSON.stringify({
          error: 'Please upload a valid plant leaf image.',
          isLeaf: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if leaf is healthy
    if (label.includes('healthy')) {
      return new Response(
        JSON.stringify({
          isHealthy: true,
          message: 'This leaf is healthy. No treatment needed.',
          confidence: confidence,
          isLeaf: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map model output to our disease format
    const diseaseMapping: { [key: string]: string } = {
      'tomato___early_blight': 'tomato-early-blight',
      'tomato___late_blight': 'tomato-late-blight',
      'potato___early_blight': 'potato-early-blight',
      'potato___late_blight': 'potato-late-blight',
      'corn___common_rust': 'corn-common-rust',
      'apple___apple_scab': 'apple-scab',
      'grape___black_rot': 'grape-black-rot',
      'pepper___bacterial_spot': 'pepper-bacterial-spot',
    };

    // Try to find a matching disease
    let diseaseId = null;
    for (const [modelKey, ourKey] of Object.entries(diseaseMapping)) {
      if (label.includes(modelKey.toLowerCase().replace(/___/g, ' ').replace(/_/g, ' '))) {
        diseaseId = ourKey;
        break;
      }
    }

    // If no exact match, try to extract plant and disease type
    if (!diseaseId) {
      const parts = label.split('___');
      if (parts.length >= 2) {
        const plant = parts[0].trim();
        const disease = parts.slice(1).join(' ').trim();
        diseaseId = `${plant}-${disease.replace(/\s+/g, '-')}`;
      }
    }

    return new Response(
      JSON.stringify({
        diseaseId: diseaseId || 'unknown',
        diseaseName: topPrediction.label,
        confidence: confidence,
        isLeaf: true,
        isHealthy: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in detect-disease function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        isLeaf: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
