import { useState, useEffect } from 'react';
import { Leaf, Scan, Moon, Sun, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CameraCapture } from '@/components/CameraCapture';
import { DiseaseResult } from '@/components/DiseaseResult';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { diseases } from '@/data/diseases';
import { Disease, Feedback } from '@/types/disease';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { t } = useLanguage();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedDisease, setDetectedDisease] = useState<Disease | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [healthyCount, setHealthyCount] = useState(0);
  const [diseaseCount, setDiseaseCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('smart-leaf-stats');
    if (saved) {
      const stats = JSON.parse(saved);
      setAnalysisCount(stats.analysisCount || 0);
      setHealthyCount(stats.healthyCount || 0);
      setDiseaseCount(stats.diseaseCount || 0);
    }
    
    // Load dark mode preference
    const darkMode = localStorage.getItem('smart-leaf-dark-mode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save stats to localStorage
  const saveStats = (analysis: number, healthy: number, disease: number) => {
    localStorage.setItem('smart-leaf-stats', JSON.stringify({
      analysisCount: analysis,
      healthyCount: healthy,
      diseaseCount: disease
    }));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('smart-leaf-dark-mode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setError(null);
    toast.info(t('Analyzing leaf image...', 'ಎಲೆಯ ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...'));

    try {
      // Call local Flask API for ML detection
      const response = await fetch('https://leafdiseasedetector-x8fy.onrender.com/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: capturedImage })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Detection error:', errorData);
        const errorMsg = errorData.error || t('Failed to analyze image', 'ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲು ವಿಫಲವಾಗಿದೆ');
        setError(errorMsg);
        toast.error(errorMsg);
        setIsAnalyzing(false);
        return;
      }

      const data = await response.json();

      // Update analysis count
      const newAnalysisCount = analysisCount + 1;
      setAnalysisCount(newAnalysisCount);

      // Handle non-leaf images
      if (!data.isLeaf) {
        const errorMsg = data.error || t('Please upload a valid plant leaf image.', 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಸಸ್ಯ ಎಲೆಯ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.');
        setError(errorMsg);
        toast.error(errorMsg);
        setIsAnalyzing(false);
        setCapturedImage(null);
        saveStats(newAnalysisCount, healthyCount, diseaseCount);
        return;
      }

      // Handle healthy leaves
      if (data.isHealthy) {
        const newHealthyCount = healthyCount + 1;
        setHealthyCount(newHealthyCount);
        saveStats(newAnalysisCount, newHealthyCount, diseaseCount);
        toast.success(t('This leaf is healthy. No treatment needed.', 'ಈ ಎಲೆ ಆರೋಗ್ಯಕರವಾಗಿದೆ. ಯಾವುದೇ ಚಿಕಿತ್ಸೆ ಅಗತ್ಯವಿಲ್ಲ.'));
        setIsAnalyzing(false);
        return;
      }

      // Update disease count
      const newDiseaseCount = diseaseCount + 1;
      setDiseaseCount(newDiseaseCount);
      saveStats(newAnalysisCount, healthyCount, newDiseaseCount);

      // Find matching disease in our database
      const matchedDisease = diseases.find(d => d.id === data.diseaseId);
      
      if (matchedDisease) {
        // Sort treatments by success rate and feedback
        const sortedTreatments = [...matchedDisease.treatments].sort((a, b) => {
          const aFeedbacks = feedbacks.filter(f => f.treatmentId === a.id);
          const aPositive = aFeedbacks.filter(f => f.isUseful).length;
          const aTotal = aFeedbacks.length || 1;
          const aScore = (a.successRate + (aPositive / aTotal) * 100) / 2;

          const bFeedbacks = feedbacks.filter(f => f.treatmentId === b.id);
          const bPositive = bFeedbacks.filter(f => f.isUseful).length;
          const bTotal = bFeedbacks.length || 1;
          const bScore = (b.successRate + (bPositive / bTotal) * 100) / 2;

          return bScore - aScore;
        });

        setDetectedDisease({ ...matchedDisease, treatments: sortedTreatments });
        toast.success(t('Disease detected!', 'ರೋಗವನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ!'));
      } else {
        // Disease not in our database - create a generic disease entry
        const genericDisease: Disease = {
          id: data.diseaseId,
          name: data.diseaseName,
          nameKn: data.diseaseName,
          scientificName: data.diseaseName,
          severity: 'medium',
          description: `Detected disease: ${data.diseaseName} (Confidence: ${(data.confidence * 100).toFixed(1)}%)`,
          descriptionKn: `ಪತ್ತೆಯಾಗಿದೆ: ${data.diseaseName}`,
          symptoms: ['Visible damage on leaf'],
          symptomsKn: ['ಎಲೆಯಲ್ಲಿ ಗೋಚರ ಹಾನಿ'],
          treatments: [
            {
              id: '1',
              type: 'organic',
              name: 'Consult Expert',
              nameKn: 'ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ',
              dosage: 'N/A',
              dosageKn: 'N/A',
              application: 'Please consult with an agricultural expert for treatment recommendations.',
              applicationKn: 'ಚಿಕಿತ್ಸೆಯ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
              preventionTips: ['Contact local agricultural extension office'],
              preventionTipsKn: ['ಸ್ಥಳೀಯ ಕೃಷಿ ವಿಸ್ತರಣ ಕಛೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ'],
              successRate: 0
            }
          ]
        };
        
        setDetectedDisease(genericDisease);
        toast.warning(
          t(
            `Detected: ${data.diseaseName}. Treatment information not available yet.`,
            `ಪತ್ತೆಯಾಗಿದೆ: ${data.diseaseName}. ಚಿಕಿತ್ಸಾ ಮಾಹಿತಿ ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ.`
          )
        );
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      
      let displayError = '';
      if (errorMsg.includes('Failed to fetch')) {
        displayError = t('Cannot connect to detection service. Make sure the Flask API is running on port 5000.', 'ಪತ್ತೆ ಸೇವೆಗೆ ಸಂಪರ್ಕ ಸ್ಥಾಪಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.');
      } else {
        displayError = t('An unexpected error occurred', 'ಅನಿರೀಕ್ಷಿತ ದೋಷ ಸಂಭವಿಸಿದೆ');
      }
      
      setError(displayError);
      toast.error(displayError);
      saveStats(analysisCount + 1, healthyCount, diseaseCount);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFeedback = (diseaseId: string, treatmentId: string, isUseful: boolean) => {
    const feedback: Feedback = {
      diseaseId,
      treatmentId,
      isUseful,
      timestamp: Date.now(),
    };
    
    setFeedbacks([...feedbacks, feedback]);
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('smart-leaf-feedback');
    const allFeedback = stored ? JSON.parse(stored) : [];
    localStorage.setItem('smart-leaf-feedback', JSON.stringify([...allFeedback, feedback]));
  };

  const resetAnalysis = () => {
    setCapturedImage(null);
    setDetectedDisease(null);
    setError(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-gradient-to-b from-background to-secondary'}`}>
      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-slate-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 border-r-green-600 animate-spin"></div>
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {t('Analyzing Leaf...', 'ಎಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('This may take a few seconds', 'ಇದು ಕೆಲವು ಸೆಕೆಂಡುಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಬಹುದು')}
            </p>
            <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-600 to-blue-600 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center shadow-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground dark:text-white">Smart Leaf</h1>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                {t('AI Plant Doctor', 'ಎಐ ಸಸ್ಯ ವೈದ್ಯ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 mx-auto max-w-4xl">
        {!detectedDisease ? (
          <div className="space-y-6 animate-fade-in">
            {/* Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analysisCount}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                      {t('Leaves Analyzed', 'ವಿಶ್ಲೇಷಿಸಿದ ಎಲೆಗಳು')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-700 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{healthyCount}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                      {t('Healthy Leaves', 'ಆರೋಗ್ಯಕರ ಎಲೆಗಳು')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-800 dark:to-slate-700 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">{diseaseCount}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                      {t('Diseases Detected', 'ಪತ್ತೆಹಚ್ಚಿದ ರೋಗಗಳು')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Card */}
            {error && (
              <Card className="border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950 shadow-lg animate-fade-in">
                <CardContent className="flex gap-4 pt-6">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      {t('Error', 'ದೋಷ')}
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400 mb-4">{error}</p>
                    <Button
                      onClick={() => setError(null)}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white"
                      size="sm"
                    >
                      {t('Dismiss', 'ವಜಾ ಮಾಡಿ')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hero Section */}
            <Card className="border-2 border-primary bg-gradient-to-br from-card to-secondary dark:from-slate-800 dark:to-slate-700 shadow-xl">
              <CardHeader className="text-center space-y-4 pb-8">
                <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center shadow-lg">
                  <Leaf className="h-12 w-12 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-3xl mb-3 dark:text-white">
                    {t('Welcome to Smart Leaf', 'ಸ್ಮಾರ್ಟ್ ಲೀಫ್‌ಗೆ ಸ್ವಾಗತ')}
                  </CardTitle>
                  <CardDescription className="text-base dark:text-gray-300">
                    {t(
                      'AI-powered plant disease detection and treatment advisor for farmers',
                      'ರೈತರಿಗಾಗಿ ಎಐ-ಚಾಲಿತ ಸಸ್ಯ ರೋಗ ಪತ್ತೆ ಮತ್ತು ಚಿಕಿತ್ಸಾ ಸಲಹೆಗಾರ'
                    )}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>

            {/* Instructions */}
            <Card className="dark:bg-slate-800 dark:border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="dark:text-white">{t('How it works', 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  <li className="flex gap-3 group">
                    <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-success text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                      1
                    </span>
                    <span className="text-muted-foreground dark:text-gray-300">
                      {t(
                        'Capture or upload a clear photo of the affected leaf',
                        'ಪೀಡಿತ ಎಲೆಯ ಸ್ಪಷ್ಟ ಫೋಟೋವನ್ನು ತೆಗೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ'
                      )}
                    </span>
                  </li>
                  <li className="flex gap-3 group">
                    <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-success text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                      2
                    </span>
                    <span className="text-muted-foreground dark:text-gray-300">
                      {t(
                        'Our AI will analyze the image and detect the disease',
                        'ನಮ್ಮ ಎಐ ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ ಮತ್ತು ರೋಗವನ್ನು ಪತ್ತೆಹಚ್ಚುತ್ತದೆ'
                      )}
                    </span>
                  </li>
                  <li className="flex gap-3 group">
                    <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-success text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                      3
                    </span>
                    <span className="text-muted-foreground dark:text-gray-300">
                      {t(
                        'Get treatment recommendations with voice output',
                        'ಧ್ವನಿ ಔಟ್‌ಪುಟ್‌ನೊಂದಿಗೆ ಚಿಕಿತ್ಸಾ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ'
                      )}
                    </span>
                  </li>
                  <li className="flex gap-3 group">
                    <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-success text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                      4
                    </span>
                    <span className="text-muted-foreground dark:text-gray-300">
                      {t(
                        'Provide feedback to help improve recommendations',
                        'ಶಿಫಾರಸುಗಳನ್ನು ಸುಧಾರಿಸಲು ಸಹಾಯ ಮಾಡಲು ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ'
                      )}
                    </span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Camera Capture */}
            <div className="animate-fade-in">
              <CameraCapture onImageCapture={setCapturedImage} />
            </div>

            {/* Image Preview */}
            {capturedImage && (
              <div className="rounded-xl overflow-hidden shadow-xl border-2 border-green-300 dark:border-green-800 animate-fade-in">
                <img 
                  src={capturedImage} 
                  alt="Captured leaf" 
                  className="w-full h-auto max-h-96 object-cover"
                />
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-4 border-t border-green-200 dark:border-slate-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    ✓ {t('Image ready for analysis', 'ವಿಶ್ಲೇಷಣೆಗೆ ಚಿತ್ರ ಸಿದ್ಧವಾಗಿದೆ')}
                  </p>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            {capturedImage && (
              <Button
                size="lg"
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 dark:from-green-700 dark:to-blue-700 dark:hover:from-green-800 dark:hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:opacity-75"
              >
                <Scan className="h-6 w-6 mr-2" />
                {isAnalyzing
                  ? t('Analyzing...', 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...')
                  : t('Analyze Leaf', 'ಎಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ')}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <DiseaseResult disease={detectedDisease} onFeedback={handleFeedback} />
            
            <Button
              variant="outline"
              size="lg"
              onClick={resetAnalysis}
              className="w-full h-12 text-base font-semibold hover:bg-green-50 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              {t('Analyze Another Leaf', 'ಮತ್ತೊಂದು ಎಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ')}
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-slate-700 py-8 mt-12 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 text-center text-sm text-muted-foreground dark:text-gray-400">
          <p className="font-medium">
            {t(
              '© 2024 Smart Leaf. Empowering farmers with AI technology.',
              '© 2024 ಸ್ಮಾರ್ಟ್ ಲೀಫ್. ಎಐ ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ ರೈತರಿಗೆ ಶಕ್ತಿ ನೀಡುವುದು.'
            )}
          </p>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-500">
            {t('Powered by TensorFlow & React', 'TensorFlow ಮತ್ತು React ನಿಂದ ಚಾಲಿತ')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
