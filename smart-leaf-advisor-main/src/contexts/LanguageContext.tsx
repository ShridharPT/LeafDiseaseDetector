import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types/disease';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, kn: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('smart-leaf-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('smart-leaf-language', language);
  }, [language]);

  const t = (en: string, kn: string) => (language === 'en' ? en : kn);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
