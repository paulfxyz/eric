/* ============================================================
   HUSTIN BÂTIMENT — Manifeste des langues
   Un fichier i18n/{code}.json par langue, mêmes clés que fr.json.
   La disponibilité réelle est vérifiée dynamiquement (probe) :
   ajouter un fichier JSON suffit à activer la langue.
   ============================================================ */
window.HB_LANGS = [
  { code: 'fr', native: 'Français',   flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', native: 'English',    flag: '🇬🇧', dir: 'ltr' },
  { code: 'de', native: 'Deutsch',    flag: '🇩🇪', dir: 'ltr' },
  { code: 'es', native: 'Español',    flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', native: 'Italiano',   flag: '🇮🇹', dir: 'ltr' },
  { code: 'nl', native: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { code: 'pt', native: 'Português',  flag: '🇵🇹', dir: 'ltr' },
  { code: 'ru', native: 'Русский',    flag: '🇷🇺', dir: 'ltr' },
  { code: 'zh', native: '中文',        flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', native: '日本語',      flag: '🇯🇵', dir: 'ltr' },
  { code: 'ar', native: 'العربية',    flag: '🇸🇦', dir: 'rtl' },
  { code: 'he', native: 'עברית',      flag: '🇮🇱', dir: 'rtl' }
];

/* Dictionnaires effectivement présents dans i18n/ — ajouter le code ici
   après avoir déposé le fichier JSON correspondant */
window.HB_LANGS_READY = ['fr', 'en', 'de', 'es', 'it', 'nl', 'pt', 'ru', 'zh', 'ja', 'ar', 'he'];

/* Polices spécifiques, chargées uniquement quand la langue est active */
window.HB_LANG_FONTS = {
  ar: 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600&display=swap',
  he: 'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600&display=swap',
  zh: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&display=swap',
  ja: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600&display=swap'
};
