import { useAuth } from '../contexts/AuthContext';
import { TRANSLATIONS } from '../data/constants';

export function useTranslation() {
  const { language } = useAuth();
  
  function t(key: string): string {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  return { t, language };
}
