import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const languages = [
    { code: 'zh-CN', label: t('language.zhCN') },
    { code: 'en-US', label: t('language.enUS') }
  ];

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              i18n.language === lang.code
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
