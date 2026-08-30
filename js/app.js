/* ============================================================
   HUSTIN BÂTIMENT — Proposition 2 « L'Atelier » (vanilla)
   i18n 12 langues · modales · rendez-vous · effets raffinés
   ============================================================ */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  /* ---------- Cookies (pas de localStorage : bloqué en preview) ---------- */
  function getCookie(name) {
    try {
      var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }
  function setCookie(name, value) {
    try {
      document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=31536000; SameSite=Lax';
    } catch (e) { /* silencieux */ }
  }

  /* ============================================================
     I18N — fr.json = source de vérité, fallback FR propre
     ============================================================ */
  var LANGS = window.HB_LANGS || [{ code: 'fr', native: 'Français', flag: '🇫🇷', dir: 'ltr' }];
  var LANG_FONTS = window.HB_LANG_FONTS || {};
  var DICTS = {};          /* cache des dictionnaires chargés */
  var READY = window.HB_LANGS_READY || ['fr'];
  var AVAIL = {};          /* disponibilité des fichiers i18n */
  LANGS.forEach(function (l) { AVAIL[l.code] = READY.indexOf(l.code) !== -1; });
  var currentLang = 'fr';

  function langMeta(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return LANGS[0];
  }

  /* Typographie française au rendu : espaces insécables (U+00A0) et fines
     insécables (U+202F) avant la ponctuation haute, dans les guillemets,
     entre nombre et unité, dans les groupes de chiffres. Appliquée aux
     chaînes FR uniquement (dictionnaire fr + fiches démo, rédigées en FR). */
  var NBSP = '\u00A0', NNBSP = '\u202F';
  function frTypo(s) {
    if (typeof s !== 'string') return s;
    return s
      .replace(/\u00AB /g, '\u00AB' + NNBSP)
      .replace(/ \u00BB/g, NNBSP + '\u00BB')
      .replace(/ :/g, NBSP + ':')
      .replace(/ ([;!?])/g, NNBSP + '$1')
      .replace(/(\d) (?=\d{3}(?!\d))/g, '$1' + NNBSP)
      .replace(/(\d) (m²|m\b|mètres?|heures?|h\b|€|K€|k€|M\$|%|px\b|ans\b|mois\b|niveaux?\b)/g, '$1' + NBSP + '$2')
      .replace(/(\d\d) (?=\d\d(?!\d))/g, '$1' + NBSP);
  }
  function frTypoDict(json) {
    Object.keys(json).forEach(function (k) { json[k] = frTypo(json[k]); });
    return json;
  }

  function fetchDict(code) {
    if (DICTS[code]) return Promise.resolve(DICTS[code]);
    if (!AVAIL[code]) return Promise.resolve(null);
    return fetch('i18n/' + code + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (json) { if (code === 'fr') frTypoDict(json); DICTS[code] = json; return json; })
      .catch(function () { AVAIL[code] = false; return null; });
  }

  function t(key, fallback) {
    var d = DICTS[currentLang];
    if (d && d[key] != null) return d[key];
    var fr = DICTS.fr;
    if (fr && fr[key] != null) return fr[key];
    return fallback != null ? fallback : '';
  }

  function fmt(str, params) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      return params && params[k] != null ? params[k] : m;
    });
  }

  function loadLangFont(code) {
    var url = LANG_FONTS[code];
    if (!url) return;
    var id = 'hb-font-' + code;
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }

  function applyI18n() {
    var meta = langMeta(currentLang);
    docEl.setAttribute('lang', currentLang);
    docEl.setAttribute('dir', meta.dir || 'ltr');
    loadLangFont(currentLang);

    if (DICTS[currentLang] || DICTS.fr) {
      var title = t('meta.title');
      if (title) document.title = title;
      var descEl = document.querySelector('meta[name="description"]');
      var desc = t('meta.desc');
      if (descEl && desc) descEl.setAttribute('content', desc);

      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var v = t(el.getAttribute('data-i18n'));
        if (!v) return;
        if (v.indexOf('<') !== -1) el.innerHTML = v;
        else el.textContent = v;
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        var v = t(el.getAttribute('data-i18n-aria'));
        if (v) el.setAttribute('aria-label', v);
      });
      document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
        var v = t(el.getAttribute('data-i18n-alt'));
        if (v) el.setAttribute('alt', v);
      });
    }

    var codeEl = document.getElementById('langCode');
    if (codeEl) codeEl.textContent = currentLang.toUpperCase();
    var nameEl = document.getElementById('footerLangName');
    if (nameEl) nameEl.textContent = meta.native;

    renderProjets();
    buildRdvDays();
    updateWaLinks();
    updateFooterCopy();
    splitAllLines();
    renderLangGrid();
    syncThemeUI();
  }

  function setLang(code, fromHash) {
    fetchDict('fr').then(function () {
      return code === 'fr' ? DICTS.fr : fetchDict(code);
    }).then(function (dict) {
      if (!dict && code !== 'fr') return; /* langue pas encore disponible */
      currentLang = code;
      setCookie('hb-lang', code);
      if (!fromHash) {
        try { history.replaceState(null, '', '#lang=' + code); } catch (e) { /* silencieux */ }
      }
      applyI18n();
    });
  }

  function langFromHash() {
    var m = (location.hash || '').match(/lang=([a-z]{2})/i);
    return m ? m[1].toLowerCase() : null;
  }

  function initialLang() {
    var h = langFromHash();
    if (h && langMeta(h).code === h) return h;
    var c = getCookie('hb-lang');
    if (c && langMeta(c).code === c) return c;
    return 'fr';
  }

  window.addEventListener('hashchange', function () {
    var h = langFromHash();
    if (h && h !== currentLang && langMeta(h).code === h) setLang(h, true);
  });

  /* ---------- Modale de sélection de langue ---------- */
  var langGrid = document.getElementById('langGrid');

  function renderLangGrid() {
    if (!langGrid) return;
    langGrid.innerHTML = '';
    LANGS.forEach(function (l) {
      var available = AVAIL[l.code] === true;
      var active = l.code === currentLang;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-item' + (active ? ' active' : '');
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', String(active));
      btn.setAttribute('lang', l.code);
      if (!available) btn.setAttribute('aria-disabled', 'true');

      var flag = document.createElement('span');
      flag.className = 'lang-flag';
      flag.textContent = l.flag;
      flag.setAttribute('aria-hidden', 'true');
      var name = document.createElement('span');
      name.className = 'lang-native';
      name.textContent = l.native;
      btn.appendChild(flag);
      btn.appendChild(name);

      if (active) {
        var check = document.createElement('span');
        check.className = 'lang-check';
        check.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7-8"/></svg>';
        btn.appendChild(check);
      } else if (!available) {
        var badge = document.createElement('span');
        badge.className = 'lang-soon-badge';
        badge.textContent = t('lang.soon', 'Bientôt');
        btn.appendChild(badge);
      }

      btn.addEventListener('click', function () {
        if (!available || active) return;
        closeModal();
        setLang(l.code);
      });
      btn.style.animationDelay = (0.06 + LANGS.indexOf(l) * 0.035).toFixed(3) + 's';
      langGrid.appendChild(btn);
    });
  }

  /* ---------- Thème light / dark ---------- */
  function storedTheme() {
    var v = getCookie('hb-theme');
    return (v === 'light' || v === 'dark') ? v : null;
  }
  function currentTheme() {
    var attr = docEl.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return darkQuery.matches ? 'dark' : 'light';
  }

  var themeToggle = document.getElementById('themeToggle');
  var footerThemeBtn = document.getElementById('footerThemeBtn');

  function syncThemeUI() {
    var dark = currentTheme() === 'dark';
    docEl.classList.toggle('is-dark', dark);
    var label = dark ? t('a11y.themeLight', 'Passer en thème clair') : t('a11y.themeDark', 'Passer en thème sombre');
    if (themeToggle) themeToggle.setAttribute('aria-label', label);
    if (footerThemeBtn) footerThemeBtn.setAttribute('aria-label', label);
  }

  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    docEl.classList.add('theme-anim');
    docEl.setAttribute('data-theme', next);
    setCookie('hb-theme', next);
    syncThemeUI();
    window.setTimeout(function () { docEl.classList.remove('theme-anim'); }, 600);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (footerThemeBtn) footerThemeBtn.addEventListener('click', toggleTheme);

  if (darkQuery.addEventListener) {
    darkQuery.addEventListener('change', function () {
      if (!storedTheme()) syncThemeUI();
    });
  }
  syncThemeUI();

  /* ============================================================
     Réalisations — données (textes FR embarqués en secours,
     i18n/fr.json reste la source de vérité)
     ============================================================ */
  var PROJETS = [
    {
      id: 'hb2401', ref: 'HB-2401', encours: false,
      fb: {
        titre: 'Villa contemporaine 700 m²', lieu: 'Cannes', annee: '2024',
        surface: '700 m²', nature: 'Gros œuvre béton armé complet',
        desc: 'Gros œuvre complet d’une villa contemporaine de 700 m² sur les hauteurs de Cannes : fondations, voiles en béton banché, planchers de grande portée et piscine. Un chantier mené en lien étroit avec l’architecte, livré en 2024 dans les délais convenus.',
        caps: ['Vue aérienne — levage à la grue à tour', 'Sciage et finitions en toiture-terrasse', 'Les compagnons HUSTIN sur le chantier']
      },
      photos: ['img/villa-13.jpg', 'img/villa-24.jpg', 'img/villa-58.jpg']
    },
    {
      id: 'hb2602', ref: 'HB-2602', encours: true,
      fb: {
        titre: 'Villa contemporaine 700 m² — bâti conservé', lieu: 'Cannes', annee: 'En cours',
        surface: '700 m²', nature: 'Terrassement, infrastructure & superstructure',
        desc: 'Second chantier de grande ampleur à Cannes : une villa contemporaine de 700 m², avec conservation d’un bâti existant. Terrassement, reprises en sous-œuvre, infrastructure complète puis superstructure en béton armé — une grue à tour est dédiée au chantier.',
        caps: ['Vue aérienne — élévation des planchers', 'Conservation de l’existant — reprise en sous-œuvre', 'Voiles et poteaux du niveau jardin']
      },
      photos: ['img/chantier-659.jpg', 'img/chantier-1598.jpg', 'img/chantier-hero.jpg']
    },
    {
      id: 'hb2303', ref: 'HB-2303', encours: false,
      fb: {
        titre: 'Maison « californienne » 400 m²', lieu: 'Mandelieu', annee: '2023',
        surface: '400 m²', nature: 'Construction neuve — béton armé',
        desc: 'Maison moderne d’inspiration californienne de 400 m² à Mandelieu : lignes horizontales, casquettes en porte-à-faux et grandes baies. La précision du coffrage au service d’une géométrie épurée, jusqu’à la toiture végétalisée.',
        caps: ['Volumes livrés — façade sud', 'Vue aérienne — toiture végétalisée']
      },
      photos: ['img/villa-g.jpg', 'img/villa-n.jpg']
    },
    {
      id: 'hb2504', ref: 'HB-2504', encours: false,
      fb: {
        titre: 'Ouverture de 10 mètres', lieu: 'Cannes', annee: '2025',
        surface: 'Portée 10,00 m', nature: 'Reprise en sous-œuvre & sciage béton',
        desc: 'Création d’une ouverture de dix mètres de portée dans un voile porteur : étaiement, reprise en sous-œuvre, sciage béton de forte épaisseur, puis mise en place des renforts. Une intervention lourde, exécutée sans le moindre désordre sur l’existant.',
        caps: ['Vue d’ensemble du chantier', 'Travaux en façade — reprise structurelle']
      },
      photos: ['img/chantier-651.jpg', 'img/chantier-5.jpg']
    },
    {
      id: 'hb2205', ref: 'HB-2205', encours: false,
      fb: {
        titre: 'Piscine en porte-à-faux', lieu: 'Cannes', annee: '2022',
        surface: 'Villa haut de gamme', nature: 'Ouvrage béton complexe — bassin suspendu',
        desc: 'Piscine en porte-à-faux pour une villa haut de gamme à Cannes : un bassin en béton armé partiellement suspendu au-dessus d’un terrain en restanques. Calepinage du ferraillage, étaiement lourd et étanchéité structurelle du béton.',
        caps: ['Structure béton et étaiement du bassin', 'Le bassin dans son terrain en restanques']
      },
      photos: ['img/villa-s.jpg', 'img/villa-restanques.jpg']
    },
    {
      id: 'hb2506', ref: 'HB-2506', encours: false,
      fb: {
        titre: 'Réhabilitation lourde & sous-sol complet', lieu: 'Cap d’Antibes', annee: '2025',
        surface: 'Sous-sol complet', nature: 'Extension, terrassement en taupe, sous-œuvre',
        desc: 'Réhabilitation lourde d’une propriété du Cap d’Antibes : extension, création d’un sous-sol complet en terrassement en taupe et reprises en sous-œuvre des fondations existantes. Le mode opératoire des chantiers les plus techniques de la maison.',
        caps: ['Infrastructure du sous-sol — vue aérienne', 'Éric & Louis Hustin — un chantier suivi de bout en bout']
      },
      photos: ['img/chantier-2.jpg', 'img/apropos.jpg']
    }
  ];

  function pTxt(p, field) {
    return t('proj.' + p.id + '.' + field, p.fb[field]);
  }
  function pCap(p, j) {
    return t('proj.' + p.id + '.cap' + (j + 1), p.fb.caps[j]);
  }
  function pStatut(p) {
    return p.encours ? t('real.statut.encours', 'En cours') : t('real.statut.livree', 'Livrée');
  }

  /* ---------- Portfolio : mode réel / démo + filtres ---------- */
  var DEMO_PROJETS = window.HB_DEMO_PROJETS || [];

  /* Les textes de repli (fb) des fiches sont rédigés en français :
     même passe typographique que le dictionnaire fr. */
  function frTypoFb(list) {
    list.forEach(function (p) {
      if (!p.fb) return;
      Object.keys(p.fb).forEach(function (k) {
        if (k === 'caps') p.fb.caps = p.fb.caps.map(frTypo);
        else p.fb[k] = frTypo(p.fb[k]);
      });
    });
  }
  frTypoFb(PROJETS);
  frTypoFb(DEMO_PROJETS);
  var REAL_FACETS = window.HB_REAL_FACETS || {};
  PROJETS.forEach(function (p) {
    p.facets = REAL_FACETS[p.id] || { lieu: p.fb.lieu, type: '', tech: [] };
  });

  var portfolioMode = getCookie('hb-portfolio') === 'demo' ? 'demo' : 'real';
  var FACET_KEYS = ['lieu', 'type', 'tech', 'statut'];
  var fState = { lieu: [], type: [], tech: [], statut: [] };

  function dataset() {
    return portfolioMode === 'demo' ? PROJETS.concat(DEMO_PROJETS) : PROJETS.slice();
  }

  function facetValues(p, key) {
    if (key === 'statut') return [p.encours ? 'encours' : 'livree'];
    if (key === 'tech') return p.facets.tech || [];
    return p.facets[key] ? [p.facets[key]] : [];
  }

  function matchesFilters(p) {
    for (var k = 0; k < FACET_KEYS.length; k++) {
      var key = FACET_KEYS[k];
      var sel = fState[key];
      if (!sel.length) continue;
      var vals = facetValues(p, key);
      var hit = vals.some(function (v) { return sel.indexOf(v) !== -1; });
      if (!hit) return false;
    }
    return true;
  }

  function visibleProjets() {
    return dataset().filter(matchesFilters);
  }

  /* ---------- Rendu des fiches réalisations ---------- */
  var grid = document.getElementById('projetsGrid');
  var pfEmpty = document.getElementById('pfEmpty');
  var quickRender = false; /* rendu suite à un filtre/switch : fondu court, pas de reveal */

  function renderProjets() {
    if (!grid) return;
    grid.innerHTML = '';
    var list = visibleProjets();
    list.forEach(function (p, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = quickRender
        ? 'projet in pf-in'
        : 'projet reveal' + (i % 2 === 1 ? ' d1' : '');
      if (quickRender && !reduceMotion) btn.style.animationDelay = Math.min(i * 0.04, 0.4) + 's';
      btn.setAttribute('aria-haspopup', 'dialog');

      var media = document.createElement('span');
      media.className = 'p-media';
      if (p.encours) {
        var st = document.createElement('span');
        st.className = 'p-status';
        st.textContent = pStatut(p);
        media.appendChild(st);
      }
      if (p.demo) {
        var dm = document.createElement('span');
        dm.className = 'p-demo-tag';
        dm.textContent = t('demo.badge', 'Démo — image générée');
        media.appendChild(dm);
      }
      var img = document.createElement('img');
      img.src = p.photos[0];
      img.alt = pTxt(p, 'titre') + ' — ' + pTxt(p, 'lieu');
      img.loading = 'lazy';
      img.decoding = 'async';
      media.appendChild(img);

      var body = document.createElement('span');
      body.className = 'p-body';
      body.style.display = 'block';

      var head = document.createElement('span');
      head.className = 'p-head';
      var h3 = document.createElement('h3');
      h3.textContent = pTxt(p, 'titre');
      var refSpan = document.createElement('span');
      refSpan.className = 'p-ref';
      refSpan.textContent = p.ref;
      head.appendChild(h3);
      head.appendChild(refSpan);

      var metaSpan = document.createElement('span');
      metaSpan.className = 'p-meta';
      [pTxt(p, 'lieu'), pTxt(p, 'annee'), pTxt(p, 'surface')].forEach(function (v) {
        var s = document.createElement('span');
        s.textContent = v;
        metaSpan.appendChild(s);
      });

      var open = document.createElement('span');
      open.className = 'p-open';
      open.textContent = t('real.open', 'Voir la fiche');

      body.appendChild(head);
      body.appendChild(metaSpan);
      body.appendChild(open);
      btn.appendChild(media);
      btn.appendChild(body);
      btn.addEventListener('click', function () { openProjet(p); });
      grid.appendChild(btn);
    });

    if (pfEmpty) pfEmpty.hidden = list.length > 0;
    updateFilterUI(list.length);
    if (!quickRender) observeReveals();
  }

  function refreshProjets() {
    quickRender = true;
    renderProjets();
    quickRender = false;
  }

  /* ---------- Barre de filtres — rail + menus déroulants ---------- */
  var pfBar = document.getElementById('pfBar');
  var pfCountEl = document.getElementById('pfCount');
  var pfResetBtn = document.getElementById('pfReset');
  var pfScrim = document.getElementById('pfScrim');
  var pfSentinel = document.getElementById('pfSentinel');
  var pfGroupBtns = pfBar ? Array.prototype.slice.call(pfBar.querySelectorAll('.pf-group-btn')) : [];
  var pfPops = {};   /* facet → élément .pf-pop */
  var pfHomes = {};  /* facet → .pf-group d'origine (le tiroir mobile est déplacé dans body) */
  if (pfBar) {
    Array.prototype.forEach.call(pfBar.querySelectorAll('.pf-pop'), function (pop) {
      var f = pop.getAttribute('data-pop');
      pfPops[f] = pop;
      pfHomes[f] = pop.parentElement;
    });
  }
  var pfOpenFacet = null;
  var pfMobileQuery = window.matchMedia('(max-width: 720px)');

  function facetOptions(key) {
    var seen = [];
    dataset().forEach(function (p) {
      facetValues(p, key).forEach(function (v) {
        if (v && seen.indexOf(v) === -1) seen.push(v);
      });
    });
    if (key !== 'statut') seen.sort(function (a, b) { return a.localeCompare(b, 'fr'); });
    return seen;
  }

  function optionLabel(key, val) {
    return key === 'statut' ? t('real.statut.' + val, val === 'encours' ? 'En cours' : 'Livrée') : val;
  }

  /* Nombre de fiches pour une valeur, tous les autres groupes appliqués */
  function optionCount(facet, val) {
    var n = 0;
    dataset().forEach(function (p) {
      for (var k = 0; k < FACET_KEYS.length; k++) {
        var key = FACET_KEYS[k];
        if (key === facet) continue;
        var sel = fState[key];
        if (!sel.length) continue;
        var hit = facetValues(p, key).some(function (v) { return sel.indexOf(v) !== -1; });
        if (!hit) return;
      }
      if (facetValues(p, facet).indexOf(val) !== -1) n++;
    });
    return n;
  }

  function toggleFacetValue(facet, val) {
    var idx = fState[facet].indexOf(val);
    if (idx === -1) fState[facet].push(val);
    else fState[facet].splice(idx, 1);
    refreshProjets();
  }

  function buildPop(facet) {
    var pop = pfPops[facet];
    if (!pop) return;
    pop.innerHTML = '';

    var head = document.createElement('div');
    head.className = 'pf-pop-head';
    var title = document.createElement('span');
    title.className = 'pf-pop-title';
    title.textContent = t('filter.' + facet, facet);
    head.appendChild(title);

    var clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'pf-pop-clear';
    clear.textContent = t('filter.clear', 'Effacer');
    clear.addEventListener('click', function () {
      fState[facet] = [];
      refreshProjets();
    });
    head.appendChild(clear);

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'pf-pop-close';
    close.setAttribute('aria-label', t('a11y.close', 'Fermer'));
    close.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13"/></svg>';
    close.addEventListener('click', function () { setOpenFacet(null); });
    head.appendChild(close);
    pop.appendChild(head);

    var list = document.createElement('div');
    list.className = 'pf-pop-list';
    facetOptions(facet).forEach(function (val) {
      var opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'pf-opt';
      opt.setAttribute('data-val', val);
      opt.setAttribute('aria-pressed', 'false');

      var check = document.createElement('span');
      check.className = 'pf-opt-check';
      check.setAttribute('aria-hidden', 'true');
      check.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 8.5l3.5 3.5 7-8"/></svg>';
      var label = document.createElement('span');
      label.className = 'pf-opt-label';
      label.textContent = optionLabel(facet, val);
      var num = document.createElement('span');
      num.className = 'pf-opt-n';

      opt.appendChild(check);
      opt.appendChild(label);
      opt.appendChild(num);
      opt.addEventListener('click', function () { toggleFacetValue(facet, val); });
      list.appendChild(opt);
    });
    pop.appendChild(list);
    syncPop(facet);
  }

  /* Met à jour états cochés / compteurs sans reconstruire (focus conservé) */
  function syncPop(facet) {
    var pop = pfPops[facet];
    if (!pop) return;
    var title = pop.querySelector('.pf-pop-title');
    if (title) title.textContent = t('filter.' + facet, facet);
    var clear = pop.querySelector('.pf-pop-clear');
    if (clear) {
      clear.textContent = t('filter.clear', 'Effacer');
      clear.hidden = fState[facet].length === 0;
    }
    Array.prototype.forEach.call(pop.querySelectorAll('.pf-opt'), function (opt) {
      var val = opt.getAttribute('data-val');
      var on = fState[facet].indexOf(val) !== -1;
      opt.classList.toggle('on', on);
      opt.setAttribute('aria-pressed', on ? 'true' : 'false');
      var label = opt.querySelector('.pf-opt-label');
      if (label) label.textContent = optionLabel(facet, val);
      var n = optionCount(facet, val);
      var num = opt.querySelector('.pf-opt-n');
      if (num) num.textContent = String(n);
      opt.classList.toggle('zero', n === 0);
    });
  }

  function setOpenFacet(facet) {
    if (pfOpenFacet && pfOpenFacet !== facet) {
      var prev = pfPops[pfOpenFacet];
      if (prev) {
        prev.classList.remove('open', 'flip');
        if (prev.parentElement !== pfHomes[pfOpenFacet]) pfHomes[pfOpenFacet].appendChild(prev);
      }
    }
    pfOpenFacet = facet || null;
    pfGroupBtns.forEach(function (b) {
      var on = b.getAttribute('data-facet') === pfOpenFacet;
      b.classList.toggle('open', on);
      b.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    FACET_KEYS.forEach(function (f) {
      var pop = pfPops[f];
      if (!pop) return;
      if (f === pfOpenFacet) {
        buildPop(f);
        /* Sur mobile le menu devient un tiroir bas fixé : on le sort de la barre
           (backdrop-filter = nouveau bloc conteneur pour position:fixed) */
        if (pfMobileQuery.matches) document.body.appendChild(pop);
        pop.classList.add('open');
        if (!pfMobileQuery.matches) {
          pop.classList.remove('flip');
          var r = pop.getBoundingClientRect();
          if (r.right > window.innerWidth - 8 || r.left < 8) pop.classList.add('flip');
        }
      } else {
        pop.classList.remove('open', 'flip');
        if (pop.parentElement !== pfHomes[f]) pfHomes[f].appendChild(pop);
      }
    });
    if (pfScrim) pfScrim.classList.toggle('open', !!pfOpenFacet);
  }

  pfGroupBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-facet');
      setOpenFacet(pfOpenFacet === f ? null : f);
    });
  });

  if (pfScrim) pfScrim.addEventListener('click', function () { setOpenFacet(null); });

  function hasFilters() {
    return FACET_KEYS.some(function (k) { return fState[k].length > 0; });
  }

  function updateFilterUI(count) {
    if (pfCountEl) pfCountEl.textContent = fmt(t('filter.count', '{n} réalisation(s)'), { n: count });
    if (pfResetBtn) pfResetBtn.hidden = !hasFilters();
    pfGroupBtns.forEach(function (b) {
      var n = fState[b.getAttribute('data-facet')].length;
      var badge = b.querySelector('.pf-n');
      if (!badge) return;
      badge.hidden = n === 0;
      badge.textContent = n || '';
      b.classList.toggle('active', n > 0);
    });
    if (pfOpenFacet) syncPop(pfOpenFacet);
  }

  if (pfResetBtn) {
    pfResetBtn.addEventListener('click', function () {
      FACET_KEYS.forEach(function (k) { fState[k] = []; });
      refreshProjets();
    });
  }

  document.addEventListener('click', function (e) {
    if (!pfOpenFacet) return;
    var openPop = pfPops[pfOpenFacet];
    if (pfBar && !pfBar.contains(e.target) && !(openPop && openPop.contains(e.target))) setOpenFacet(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pfOpenFacet && !openModalEl) {
      var btn = pfBar ? pfBar.querySelector('.pf-group-btn[data-facet="' + pfOpenFacet + '"]') : null;
      setOpenFacet(null);
      if (btn) btn.focus();
    }
  });

  /* Ombre hairline quand la barre est collée sous le header */
  if (pfSentinel && pfBar && 'IntersectionObserver' in window) {
    var pfStuckIO = new IntersectionObserver(function (entries) {
      pfBar.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { rootMargin: '-72px 0px 0px 0px', threshold: 0 });
    pfStuckIO.observe(pfSentinel);
  }

  /* ---------- Switch réel / démo ---------- */
  var modeRealBtn = document.getElementById('modeReal');
  var modeDemoBtn = document.getElementById('modeDemo');

  function pruneSelections() {
    FACET_KEYS.forEach(function (k) {
      var opts = facetOptions(k);
      fState[k] = fState[k].filter(function (v) { return opts.indexOf(v) !== -1; });
    });
  }

  function syncModeUI() {
    if (!modeRealBtn || !modeDemoBtn) return;
    var demoOn = portfolioMode === 'demo';
    modeRealBtn.classList.toggle('on', !demoOn);
    modeRealBtn.setAttribute('aria-pressed', String(!demoOn));
    modeDemoBtn.classList.toggle('on', demoOn);
    modeDemoBtn.setAttribute('aria-pressed', String(demoOn));
  }

  function setPortfolioMode(m) {
    if (m === portfolioMode) return;
    portfolioMode = m;
    setCookie('hb-portfolio', m);
    pruneSelections();
    syncModeUI();
    if (pfOpenFacet) buildPop(pfOpenFacet); /* jeu d'options différent selon le mode */
    refreshProjets();
  }

  if (modeRealBtn) modeRealBtn.addEventListener('click', function () { setPortfolioMode('real'); });
  if (modeDemoBtn) modeDemoBtn.addEventListener('click', function () { setPortfolioMode('demo'); });
  syncModeUI();

  /* ---------- Modales (générique) ---------- */
  var openModalEl = null;
  var lastFocus = null;

  function openModal(modal) {
    if (openModalEl === modal) return;
    if (openModalEl) {
      openModalEl.classList.remove('open');
    } else {
      lastFocus = document.activeElement;
    }
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    openModalEl = modal;
    var closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!openModalEl) return;
    openModalEl.classList.remove('open');
    document.body.classList.remove('modal-open');
    openModalEl = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) {
      if (e.target === m) closeModal();
    });
    m.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', closeModal);
    });
    m.querySelectorAll('[data-close-scroll]').forEach(function (b) {
      b.addEventListener('click', function () { closeModal(); });
    });
  });

  /* Ouverture croisée : boutons data-open-modal (section contact + hub) */
  document.querySelectorAll('[data-open-modal]').forEach(function (b) {
    b.addEventListener('click', function () {
      var target = document.getElementById(b.getAttribute('data-open-modal'));
      if (!target) return;
      if (target.id === 'rdvModal') resetRdv();
      if (target.id === 'msgModal') resetMsg();
      openModal(target);
    });
  });

  /* ---------- Modale réalisation + galerie ---------- */
  var projModal = document.getElementById('projModal');
  var galFrame = document.getElementById('galFrame');
  var galCount = document.getElementById('galCount');
  var galCaption = document.getElementById('galCaption');
  var currentProjet = null;
  var currentIndex = 0;

  function openProjet(p) {
    currentProjet = p;
    currentIndex = 0;

    var demoTag = document.getElementById('projDemoBadge');
    if (demoTag) demoTag.hidden = !p.demo;

    galFrame.innerHTML = '';
    currentProjet.photos.forEach(function (src, j) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = pTxt(currentProjet, 'titre') + ' — ' + pCap(currentProjet, j);
      img.loading = 'lazy';
      img.decoding = 'async';
      if (j === 0) img.className = 'on';
      galFrame.appendChild(img);
    });

    document.getElementById('projModalTitle').textContent = pTxt(currentProjet, 'titre');
    document.getElementById('projRef').textContent = currentProjet.ref + ' — ' + pTxt(currentProjet, 'lieu');
    document.getElementById('projDesc').textContent = pTxt(currentProjet, 'desc');

    var c = document.getElementById('projCartouche');
    c.innerHTML = '';
    [
      [t('real.k.ref', 'Référence'), currentProjet.ref],
      [t('real.k.lieu', 'Lieu'), pTxt(currentProjet, 'lieu')],
      [t('real.k.annee', 'Année'), pTxt(currentProjet, 'annee')],
      [t('real.k.surface', 'Surface'), pTxt(currentProjet, 'surface')],
      [t('real.k.nature', 'Nature des travaux'), pTxt(currentProjet, 'nature')],
      [t('real.k.statut', 'Statut'), pStatut(currentProjet)]
    ].forEach(function (row) {
      var d = document.createElement('div');
      var dt = document.createElement('dt');
      dt.textContent = row[0];
      var dd = document.createElement('dd');
      dd.textContent = row[1];
      d.appendChild(dt);
      d.appendChild(dd);
      c.appendChild(d);
    });

    updateGal();
    openModal(projModal);
  }

  function updateGal() {
    var imgs = galFrame.querySelectorAll('img');
    imgs.forEach(function (img, j) {
      img.classList.toggle('on', j === currentIndex);
    });
    galCount.textContent = (currentIndex + 1) + ' / ' + imgs.length;
    galCaption.textContent = pCap(currentProjet, currentIndex);
  }

  function galStep(dir) {
    if (!currentProjet) return;
    var n = currentProjet.photos.length;
    currentIndex = (currentIndex + dir + n) % n;
    updateGal();
  }

  document.getElementById('galPrev').addEventListener('click', function () { galStep(-1); });
  document.getElementById('galNext').addEventListener('click', function () { galStep(1); });

  document.addEventListener('keydown', function (e) {
    if (!openModalEl) return;
    if (e.key === 'Escape') closeModal();
    if (openModalEl === projModal) {
      if (e.key === 'ArrowLeft') galStep(-1);
      if (e.key === 'ArrowRight') galStep(1);
    }
  });

  /* Swipe tactile sur la galerie */
  var touchX = null, touchY = null;
  galFrame.addEventListener('touchstart', function (e) {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  galFrame.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) galStep(dx < 0 ? 1 : -1);
    touchX = touchY = null;
  }, { passive: true });

  /* ---------- Modale mentions légales ---------- */
  document.getElementById('mentionsBtn').addEventListener('click', function () {
    openModal(document.getElementById('mentionsModal'));
  });

  /* ---------- Modale langues (globe header + footer) ---------- */
  function openLangModal() {
    renderLangGrid();
    openModal(document.getElementById('langModal'));
  }
  document.getElementById('langOpenBtn').addEventListener('click', openLangModal);
  document.getElementById('footerLangBtn').addEventListener('click', openLangModal);

  /* ---------- Bouton contact flottant → hub ---------- */
  document.getElementById('contactFab').addEventListener('click', function () {
    openModal(document.getElementById('hubModal'));
  });

  /* ---------- Bouton retour en haut (apparaît après ~600 px de scroll) ---------- */
  var toTopBtn = document.getElementById('toTop');
  if (toTopBtn) {
    var toTopShown = false;
    var onScrollToTop = function () {
      var show = (window.scrollY || 0) > 600;
      if (show !== toTopShown) {
        toTopShown = show;
        toTopBtn.classList.toggle('show', show);
      }
    };
    window.addEventListener('scroll', onScrollToTop, { passive: true });
    onScrollToTop();
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ============================================================
     Rendez-vous — 14 jours (hors dimanche), 6 créneaux
     ============================================================ */
  var SLOTS = ['08:30', '10:00', '11:30', '14:00', '15:30', '17:00'];
  var rdvDaysEl = document.getElementById('rdvDays');
  var rdvSlotsEl = document.getElementById('rdvSlots');
  var rdvForm = document.getElementById('rdvForm');
  var rdvBox = document.querySelector('#rdvModal .modal-box');
  var rdvMissing = document.getElementById('rdvMissing');
  var rdvDates = [];
  var selDate = null;
  var selSlot = null;

  function computeRdvDates() {
    var out = [];
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    while (out.length < 14) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) continue; /* dimanche */
      out.push(new Date(d.getTime()));
    }
    return out;
  }

  function intlLocale() {
    return currentLang === 'fr' ? 'fr-FR' : currentLang;
  }

  function buildRdvDays() {
    if (!rdvDaysEl) return;
    rdvDates = computeRdvDates();
    selDate = null;
    rdvDaysEl.innerHTML = '';
    var fmtW, fmtD, fmtM;
    try {
      fmtW = new Intl.DateTimeFormat(intlLocale(), { weekday: 'short' });
      fmtD = new Intl.DateTimeFormat(intlLocale(), { day: 'numeric' });
      fmtM = new Intl.DateTimeFormat(intlLocale(), { month: 'short' });
    } catch (e) {
      fmtW = fmtD = fmtM = { format: function (x) { return String(x.getDate()); } };
    }
    rdvDates.forEach(function (date, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'day-btn';
      btn.innerHTML =
        '<span class="dw">' + fmtW.format(date) + '</span>' +
        '<span class="dd">' + fmtD.format(date) + '</span>' +
        '<span class="dm">' + fmtM.format(date) + '</span>';
      btn.addEventListener('click', function () {
        selDate = i;
        rdvDaysEl.querySelectorAll('.day-btn').forEach(function (b, j) {
          b.classList.toggle('sel', j === i);
        });
        rdvMissing.classList.remove('show');
      });
      rdvDaysEl.appendChild(btn);
    });
    buildRdvSlots();
  }

  function buildRdvSlots() {
    if (!rdvSlotsEl) return;
    selSlot = null;
    rdvSlotsEl.innerHTML = '';
    SLOTS.forEach(function (slot, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-btn';
      btn.textContent = slot;
      btn.addEventListener('click', function () {
        selSlot = i;
        rdvSlotsEl.querySelectorAll('.slot-btn').forEach(function (b, j) {
          b.classList.toggle('sel', j === i);
        });
        rdvMissing.classList.remove('show');
      });
      rdvSlotsEl.appendChild(btn);
    });
  }

  function resetRdv() {
    if (!rdvBox) return;
    rdvBox.classList.remove('done');
    if (rdvForm) rdvForm.reset();
    rdvMissing.classList.remove('show');
    buildRdvDays();
  }

  if (rdvForm) {
    rdvForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (selDate == null || selSlot == null) {
        rdvMissing.classList.add('show');
        return;
      }
      if (!rdvForm.checkValidity()) {
        rdvForm.reportValidity();
        return;
      }
      var dateStr;
      try {
        dateStr = new Intl.DateTimeFormat(intlLocale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(rdvDates[selDate]);
      } catch (e2) {
        dateStr = rdvDates[selDate].toLocaleDateString();
      }
      document.getElementById('rdvOkText').textContent = fmt(
        t('rdv.okText', 'Rendez-vous demandé le {date} à {time}. Nous vous confirmons par téléphone sous 24 h.'),
        { date: dateStr, time: SLOTS[selSlot] }
      );
      rdvBox.classList.add('done');
    });
  }

  /* ---------- Modale message ---------- */
  var msgForm = document.getElementById('msgForm');
  var msgBox = document.querySelector('#msgModal .modal-box');

  function resetMsg() {
    if (!msgBox) return;
    msgBox.classList.remove('done');
    if (msgForm) msgForm.reset();
  }

  if (msgForm) {
    msgForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!msgForm.checkValidity()) {
        msgForm.reportValidity();
        return;
      }
      msgBox.classList.add('done');
    });
  }

  /* ---------- Liens WhatsApp pré-remplis ---------- */
  function updateWaLinks() {
    var msg = t('act.waMsg', 'Bonjour, je souhaite parler d’un projet de construction avec HUSTIN BÂTIMENT.');
    document.querySelectorAll('.wa-link').forEach(function (a) {
      a.href = 'https://wa.me/33619753961?text=' + encodeURIComponent(msg);
    });
  }

  /* ---------- Header au scroll ---------- */
  var header = document.getElementById('header');
  function onScrollHeader() {
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  function toggleMenu(force) {
    var open = typeof force === 'boolean' ? force : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? t('a11y.menuClose', 'Fermer le menu') : t('a11y.menuOpen', 'Ouvrir le menu'));
    if (open) header.classList.add('scrolled');
    else onScrollHeader();
  }
  burger.addEventListener('click', function () { toggleMenu(); });
  mobileMenu.querySelectorAll('a.mnav').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });

  /* ---------- Titres par lignes (mask) ---------- */
  function splitLines(el) {
    var html;
    var lns = el.querySelectorAll('.ln-in');
    if (lns.length) {
      /* déjà découpé : on reconstruit la version brute */
      html = Array.prototype.map.call(lns, function (s) { return s.innerHTML; }).join('<br>');
    } else {
      html = el.innerHTML;
    }
    var parts = html.split(/<br\s*\/?>/gi);
    el.innerHTML = parts.map(function (line, i) {
      return '<span class="ln"><span class="ln-in" style="transition-delay:' + (i * 0.12) + 's">' + line + '</span></span>';
    }).join('');
  }

  function splitAllLines() {
    document.querySelectorAll('.lines').forEach(splitLines);
  }

  /* ---------- Révélations au scroll ---------- */
  var io = null;
  function observeReveals() {
    var els = document.querySelectorAll('.reveal:not(.in), .reveal-img:not(.in), .sec-title:not(.in), .footer-rule:not(.in), .footer-mark:not(.in)');
    if (io && !reduceMotion) {
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('in'); });
    }
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  }

  /* ---------- Parallax léger des formes de fond ----------
     La dérive lente anime `transform` (CSS) ; le parallax pose la propriété
     `translate` : les deux se composent sans se marcher dessus. */
  var geoShapes = [];
  document.querySelectorAll('.geo-field .gf').forEach(function (el) {
    geoShapes.push({ el: el, depth: parseFloat(el.getAttribute('data-depth')) || 0.05 });
  });

  if (!reduceMotion && geoShapes.length) {
    var geoTicking = false;
    var applyGeo = function () {
      geoTicking = false;
      var y = window.scrollY || 0;
      geoShapes.forEach(function (s, i) {
        /* déplacement borné, lié au scroll : chaque forme glisse à sa vitesse
           sans jamais quitter le cadre, même sur les pages très longues */
        var amp = 24 + s.depth * 320;
        var lin = Math.max(-amp, Math.min(amp, y * s.depth * 0.6));
        var osc = Math.sin(y * 0.0011 + i * 1.7) * amp * 0.5;
        s.el.style.translate = '0 ' + (-(lin + osc)).toFixed(1) + 'px';
      });
    };
    var requestGeo = function () {
      if (!geoTicking) {
        geoTicking = true;
        requestAnimationFrame(applyGeo);
      }
    };
    window.addEventListener('scroll', requestGeo, { passive: true });
    window.addEventListener('resize', requestGeo);
    applyGeo();
  }

  /* ---------- Logos header & footer — tracé à l'entrée, boucle désintégration /
     ré-intégration au hover et au tap, clic → hub contact ---------- */
  var brand = document.querySelector('.brand');
  var bnIn = document.querySelector('.bn-in');

  if (bnIn && !bnIn.querySelector('.bl')) {
    var bnText = bnIn.textContent;
    var bnTotal = bnText.length;
    bnIn.textContent = '';
    Array.prototype.forEach.call(bnText, function (ch, i) {
      var s = document.createElement('span');
      s.className = 'bl';
      s.style.setProperty('--i', String(i));
      s.style.setProperty('--ri', String(bnTotal - 1 - i)); /* ordre inverse (désintégration) */
      s.textContent = ch;
      bnIn.appendChild(s);
    });
  }

  var LOGO_OUT_MS = 430;  /* phase de désintégration (.logo-out) */
  var LOGO_IN_MS = 1400;  /* phase de re-tracé (.logo-run, animation d'entrée) */

  /* Boucle inverse puis entrée, verrouillée : un re-hover pendant la boucle est
     ignoré (aucun empilement d'animations), la boucle en cours va à son terme. */
  function makeLogoLoop(el) {
    var busy = false;
    return function play() {
      if (busy || reduceMotion) return;
      busy = true;
      el.classList.remove('logo-run');
      void el.offsetWidth; /* force le reflow pour relancer les animations */
      el.classList.add('logo-out');
      window.setTimeout(function () {
        el.classList.remove('logo-out');
        void el.offsetWidth;
        el.classList.add('logo-run');
        window.setTimeout(function () { busy = false; }, LOGO_IN_MS);
      }, LOGO_OUT_MS);
    };
  }

  function openContactHub() {
    openModal(document.getElementById('hubModal'));
  }

  /* Hover (desktop) / tap (mobile) → boucle ; clic → retour en haut + boucle + hub contact.
     Boutons natifs : Entrée / Espace déclenchent le clic au clavier. */
  function bindLogo(el) {
    if (!el) return;
    var play = makeLogoLoop(el);
    el.addEventListener('mouseenter', play);
    el.addEventListener('click', function () {
      /* Le hub verrouille le scroll (body.modal-open) : remontée instantanée, fiable partout
         (html a scroll-behavior:smooth, on le neutralise le temps du saut). */
      var htmlStyle = document.documentElement.style;
      var previousBehavior = htmlStyle.scrollBehavior;
      htmlStyle.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      htmlStyle.scrollBehavior = previousBehavior;
      play();
      openContactHub();
    });
  }

  if (brand) {
    if (!reduceMotion) brand.classList.add('logo-run'); /* animation d'entrée au chargement */
    bindLogo(brand);
  }
  bindLogo(document.querySelector('.footer-brand'));

  /* ---------- Icônes line des cartes d'action — pathLength normalisé
     (permet le tracé au hover en CSS avec stroke-dasharray: 1) ---------- */
  document.querySelectorAll('.ac-ic svg :is(path, rect, circle)').forEach(function (el) {
    el.setAttribute('pathLength', '1');
  });

  /* ---------- Pied de page ---------- */
  function updateFooterCopy() {
    var el = document.getElementById('footerCopy');
    if (el) {
      el.textContent = fmt(t('footer.copy', '© {year} SAS HUSTIN — HUSTIN BÂTIMENT'), { year: String(new Date().getFullYear()) });
    }
  }

  /* ---------- Initialisation ---------- */
  currentLang = initialLang();
  fetchDict('fr').then(function () {
    if (currentLang === 'fr') {
      applyI18n();
    } else {
      fetchDict(currentLang).then(function (d) {
        if (!d) currentLang = 'fr';
        applyI18n();
      });
    }
  });

  /* Premier rendu immédiat (contenu FR embarqué), avant retour réseau */
  renderProjets();
  buildRdvDays();
  updateWaLinks();
  updateFooterCopy();
  splitAllLines();
  observeReveals();

})();
