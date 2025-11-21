import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
      className="gap-2 font-semibold"
    >
      <Languages className="h-5 w-5" />
      {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
    </Button>
  );
};
