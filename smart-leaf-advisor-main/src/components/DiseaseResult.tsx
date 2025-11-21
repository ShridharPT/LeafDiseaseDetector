import { useState } from 'react';
import { AlertCircle, Volume2, VolumeX, ThumbsUp, ThumbsDown, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Disease, Treatment } from '@/types/disease';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpeech } from '@/hooks/useSpeech';
import { toast } from 'sonner';

interface DiseaseResultProps {
  disease: Disease;
  onFeedback: (diseaseId: string, treatmentId: string, isUseful: boolean) => void;
}

export const DiseaseResult = ({ disease, onFeedback }: DiseaseResultProps) => {
  const { language, t } = useLanguage();
  const { speak, stopSpeaking, isSpeaking } = useSpeech();
  const [currentTreatmentIndex, setCurrentTreatmentIndex] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState<{ [key: string]: boolean }>({});

  const currentTreatment = disease.treatments[currentTreatmentIndex];
  const diseaseName = language === 'en' ? disease.name : disease.nameKn;
  const description = language === 'en' ? disease.description : disease.descriptionKn;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const treatmentName = language === 'en' ? currentTreatment.name : currentTreatment.nameKn;
    const treatmentDosage = language === 'en' ? currentTreatment.dosage : currentTreatment.dosageKn;
    const treatmentApp = language === 'en' ? currentTreatment.application : currentTreatment.applicationKn;

    const text = `${diseaseName}. ${description}. ${t('Treatment', 'ಚಿಕಿತ್ಸೆ')}: ${treatmentName}. ${t('Dosage', 'ಪ್ರಮಾಣ')}: ${treatmentDosage}. ${t('Application', 'ಅನ್ವಯ')}: ${treatmentApp}`;
    
    speak(text);
  };

  const handleFeedback = (isUseful: boolean) => {
    onFeedback(disease.id, currentTreatment.id, isUseful);
    setFeedbackGiven({ ...feedbackGiven, [currentTreatment.id]: true });

    if (!isUseful && currentTreatmentIndex < disease.treatments.length - 1) {
      toast.info(t('Showing alternative treatment', 'ಪರ್ಯಾಯ ಚಿಕಿತ್ಸೆಯನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ'));
      setTimeout(() => {
        setCurrentTreatmentIndex(currentTreatmentIndex + 1);
      }, 1000);
    } else if (isUseful) {
      toast.success(t('Thank you for your feedback!', 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗಾಗಿ ಧನ್ಯವಾದಗಳು!'));
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-5 w-5 text-primary" />
                <Badge variant={getSeverityColor(disease.severity)}>
                  {t('Severity', 'ತೀವ್ರತೆ')}: {disease.severity}
                </Badge>
              </div>
              <CardTitle className="text-2xl mb-2">{diseaseName}</CardTitle>
              <CardDescription className="text-base">{disease.scientificName}</CardDescription>
            </div>
            <Button
              size="lg"
              variant={isSpeaking ? 'destructive' : 'default'}
              onClick={handleSpeak}
            >
              {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-lg">{t('Description', 'ವಿವರಣೆ')}</h4>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-lg">{t('Symptoms', 'ಲಕ್ಷಣಗಳು')}</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {(language === 'en' ? disease.symptoms : disease.symptomsKn).map((symptom, idx) => (
                <li key={idx}>{symptom}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-success">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {t('Recommended Treatment', 'ಶಿಫಾರಸು ಚಿಕಿತ್ಸೆ')}
              </CardTitle>
              <CardDescription>
                <Badge variant={currentTreatment.type === 'organic' ? 'success' : 'secondary'} className="mt-2">
                  {currentTreatment.type === 'organic' ? t('Organic', 'ಸಾವಯವ') : t('Chemical', 'ರಾಸಾಯನಿಕ')}
                </Badge>
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-base px-4 py-2">
              {currentTreatment.successRate}% {t('Success', 'ಯಶಸ್ಸು')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">{t('Treatment Name', 'ಚಿಕಿತ್ಸೆಯ ಹೆಸರು')}</h4>
            <p className="text-lg">{language === 'en' ? currentTreatment.name : currentTreatment.nameKn}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">{t('Dosage', 'ಪ್ರಮಾಣ')}</h4>
            <p className="text-muted-foreground">
              {language === 'en' ? currentTreatment.dosage : currentTreatment.dosageKn}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">{t('Application Method', 'ಅನ್ವಯ ವಿಧಾನ')}</h4>
            <p className="text-muted-foreground">
              {language === 'en' ? currentTreatment.application : currentTreatment.applicationKn}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">{t('Prevention Tips', 'ತಡೆಗಟ್ಟುವ ಸಲಹೆಗಳು')}</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {(language === 'en' ? currentTreatment.preventionTips : currentTreatment.preventionTipsKn).map(
                (tip, idx) => (
                  <li key={idx}>{tip}</li>
                )
              )}
            </ul>
          </div>

          {!feedbackGiven[currentTreatment.id] && (
            <div className="pt-4 border-t">
              <p className="text-center font-semibold mb-3">
                {t('Was this treatment helpful?', 'ಈ ಚಿಕಿತ್ಸೆ ಸಹಾಯಕವಾಗಿದೆಯೇ?')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  variant="default"
                  onClick={() => handleFeedback(true)}
                  className="h-auto py-4 flex-col gap-2"
                >
                  <ThumbsUp className="h-6 w-6" />
                  <span className="text-base">{t('Useful', 'ಉಪಯುಕ್ತ')} 👍</span>
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => handleFeedback(false)}
                  className="h-auto py-4 flex-col gap-2"
                >
                  <ThumbsDown className="h-6 w-6" />
                  <span className="text-base">{t('Not Useful', 'ಉಪಯುಕ್ತವಲ್ಲ')} 👎</span>
                </Button>
              </div>
            </div>
          )}

          {disease.treatments.length > 1 && currentTreatmentIndex < disease.treatments.length - 1 && (
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCurrentTreatmentIndex(currentTreatmentIndex + 1)}
              >
                {t('Show Alternative Treatment', 'ಪರ್ಯಾಯ ಚಿಕಿತ್ಸೆಯನ್ನು ತೋರಿಸಿ')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-warning/10 border-warning">
        <CardContent className="flex gap-3 pt-6">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1">
              {t('Weather Alert', 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ')}
            </p>
            <p className="text-muted-foreground">
              {t(
                'High humidity this week – higher chance of fungal disease. Monitor plants closely.',
                'ಈ ವಾರ ಹೆಚ್ಚಿನ ತೇವಾಂಶ - ಶಿಲೀಂಧ್ರ ರೋಗದ ಹೆಚ್ಚಿನ ಸಾಧ್ಯತೆ. ಸಸ್ಯಗಳನ್ನು ನಿಕಟವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
