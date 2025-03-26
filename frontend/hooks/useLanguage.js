// Custom hook for language selection
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../store/language/languageSlice';

/**
 * Custom hook for language selection
 * @returns {Object} Language state and methods
 */
const useLanguage = () => {
  const dispatch = useDispatch();
  const { language } = useSelector(state => state.language);
  const { i18n } = useTranslation();

  /**
   * Change language
   * @param {string} lang - Language code
   * @returns {Promise<void>}
   */
  const changeLanguage = useCallback(async (lang) => {
    try {
      // Change i18n language
      await i18n.changeLanguage(lang);
      
      // Update Redux state
      dispatch(setLanguage(lang));
    } catch (error) {
      console.error('Change language error:', error);
    }
  }, [dispatch, i18n]);

  /**
   * Get available languages
   * @returns {Array} Available languages
   */
  const getAvailableLanguages = useCallback(() => {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
      { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' }
    ];
  }, []);

  /**
   * Get current language
   * @returns {Object} Current language
   */
  const getCurrentLanguage = useCallback(() => {
    const languages = getAvailableLanguages();
    return languages.find(lang => lang.code === language) || languages[0];
  }, [language, getAvailableLanguages]);

  /**
   * Check if language is RTL (Right-to-Left)
   * @param {string} lang - Language code
   * @returns {boolean} Whether the language is RTL
   */
  const isRTL = useCallback((lang = language) => {
    // Add RTL languages here
    const rtlLanguages = [];
    return rtlLanguages.includes(lang);
  }, [language]);

  /**
   * Get language direction
   * @param {string} lang - Language code
   * @returns {string} Language direction ('ltr' or 'rtl')
   */
  const getLanguageDirection = useCallback((lang = language) => {
    return isRTL(lang) ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  return {
    language,
    changeLanguage,
    getAvailableLanguages,
    getCurrentLanguage,
    isRTL,
    getLanguageDirection
  };
};

export default useLanguage;
