import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
}

export const CameraCapture = ({ onImageCapture }: CameraCaptureProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { t } = useLanguage();

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to access camera';
      setCameraError(errorMsg);
      toast.error(t('Camera access denied. Please check permissions.', 'ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಅನುಮತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const imageData = canvasRef.current.toDataURL('image/jpeg', 0.95);
    setPreview(imageData);
    onImageCapture(imageData);
    stopCamera();
    toast.success(t('Photo captured successfully!', 'ಫೋಟೋ ಯಶಸ್ವಿಯಾಗಿ ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ!'));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('Please select an image file', 'ದಯವಿಟ್ಟು ಚಿತ್ರ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageCapture(result);
      toast.success(t('Image uploaded successfully!', 'ಚಿತ್ರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ!'));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {!preview ? (
        <div className="space-y-4">
          {!isCameraActive ? (
            <>
              <div className="text-center space-y-2">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">
                  {t('Capture or Upload Leaf Image', 'ಎಲೆಯ ಚಿತ್ರವನ್ನು ತೆಗೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(
                    'Take a clear photo of the affected leaf for accurate diagnosis',
                    'ನಿಖರವಾದ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ಪೀಡಿತ ಎಲೆಯ ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  variant="default"
                  onClick={startCamera}
                  className="h-auto py-6 flex-col gap-2"
                >
                  <Camera className="h-8 w-8" />
                  <span className="text-base font-semibold">
                    {t('Take Photo', 'ಫೋಟೋ ತೆಗೆಯಿರಿ')}
                  </span>
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-auto py-6 flex-col gap-2"
                >
                  <Upload className="h-8 w-8" />
                  <span className="text-base font-semibold">
                    {t('Upload Image', 'ಚಿತ್ರ ಅಪ್‌ಲೋಡ್')}
                  </span>
                </Button>
              </div>

              {cameraError && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {cameraError}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  playsInline
                />
                <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none" />
              </div>

              <div className="flex gap-2">
                <Button
                  size="lg"
                  variant="default"
                  onClick={capturePhoto}
                  className="flex-1 h-12"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  {t('Capture', 'ತೆಗೆಯಿರಿ')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={stopCamera}
                  className="flex-1 h-12"
                >
                  <StopCircle className="h-5 w-5 mr-2" />
                  {t('Cancel', 'ರದ್ದುಮಾಡಿ')}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="Leaf preview"
              className="w-full h-auto rounded-lg"
            />
            <Button
              size="icon"
              variant="destructive"
              onClick={clearImage}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            {t(
              'Image captured successfully. Click Analyze to detect disease.',
              'ಚಿತ್ರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ. ರೋಗವನ್ನು ಪತ್ತೆಹಚ್ಚಲು ವಿಶ್ಲೇಷಿಸಿ ಕ್ಲಿಕ್ ಮಾಡಿ.'
            )}
          </p>
        </div>
      )}
    </Card>
  );
};
