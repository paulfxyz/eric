/* ============================================================
   HUSTIN BÂTIMENT — Portfolio de démonstration
   30 réalisations plausibles (contenu et images de démonstration,
   images générées). Textes FR uniquement : le moteur i18n retombe
   proprement sur ces valeurs quand une autre langue est active.
   Facettes structurées (lieu / type / technique / statut) pour le
   menu de filtres de la section Réalisations.
   ============================================================ */
(function () {
  'use strict';

  /* Facettes des 6 réalisations réelles (js/app.js) */
  window.HB_REAL_FACETS = {
    hb2401: { lieu: 'Cannes',        type: 'Villa neuve',                tech: ['Béton banché'] },
    hb2602: { lieu: 'Cannes',        type: 'Villa neuve',                tech: ['Reprise en sous-œuvre', 'Béton banché'] },
    hb2303: { lieu: 'Mandelieu',     type: 'Villa neuve',                tech: ['Porte-à-faux', 'Béton banché'] },
    hb2504: { lieu: 'Cannes',        type: 'Ouverture & sciage',         tech: ['Sciage béton', 'Reprise en sous-œuvre'] },
    hb2205: { lieu: 'Cannes',        type: 'Piscine & ouvrage complexe', tech: ['Porte-à-faux'] },
    hb2506: { lieu: 'Cap d’Antibes', type: 'Réhabilitation lourde',      tech: ['Terrassement en taupe', 'Reprise en sous-œuvre'] }
  };

  window.HB_DEMO_PROJETS = [
    {
      id: 'hbd01', ref: 'HB-1803', encours: false, demo: true,
      facets: { lieu: 'Mougins', type: 'Villa neuve', tech: ['Béton banché', 'Chape liquide'] },
      fb: {
        titre: 'Villa de plain-pied 320 m²', lieu: 'Mougins', annee: '2018',
        surface: '320 m²', nature: 'Gros œuvre béton armé — construction neuve',
        desc: 'Villa de plain-pied de 320 m² dans un quartier résidentiel de Mougins. Voiles en béton banché, toiture-terrasse et chapes liquides sur l’ensemble des pièces de vie. Livrée en 2018.',
        caps: ['Volumes livrés — façade jardin']
      },
      photos: ['img/demo/hbd01.jpg']
    },
    {
      id: 'hbd02', ref: 'HB-1811', encours: false, demo: true,
      facets: { lieu: 'Nice', type: 'Ouverture & sciage', tech: ['Sciage béton', 'Reprise en sous-œuvre'] },
      fb: {
        titre: 'Ouverture de 6 m en rez-de-chaussée', lieu: 'Nice', annee: '2018',
        surface: 'Portée 6,00 m', nature: 'Sciage béton & reprise en sous-œuvre',
        desc: 'Création d’une ouverture de six mètres dans un voile porteur, au rez-de-chaussée d’un immeuble du centre de Nice. Étaiement, sciage béton puis renforts métalliques, sans désordre sur les niveaux supérieurs.',
        caps: ['Sciage du voile porteur — vue de l’étaiement']
      },
      photos: ['img/demo/hbd02.jpg']
    },
    {
      id: 'hbd03', ref: 'HB-1902', encours: false, demo: true,
      facets: { lieu: 'Valbonne', type: 'Villa neuve', tech: ['Béton banché', 'Porte-à-faux'] },
      fb: {
        titre: 'Villa contemporaine 280 m²', lieu: 'Valbonne', annee: '2019',
        surface: '280 m²', nature: 'Gros œuvre béton armé — construction neuve',
        desc: 'Villa contemporaine de 280 m² en lisière de pinède, à Valbonne. Casquette en porte-à-faux au-dessus de la terrasse et voiles en béton banché laissés apparents par endroits.',
        caps: ['La casquette en porte-à-faux, côté sud']
      },
      photos: ['img/demo/hbd03.jpg']
    },
    {
      id: 'hbd04', ref: 'HB-1907', encours: false, demo: true,
      facets: { lieu: 'Cannes', type: 'Piscine & ouvrage complexe', tech: ['Béton banché', 'Porte-à-faux'] },
      fb: {
        titre: 'Piscine miroir à débordement', lieu: 'Cannes', annee: '2019',
        surface: 'Bassin 14 × 4 m', nature: 'Ouvrage béton complexe — bassin à débordement',
        desc: 'Bassin de quatorze mètres à débordement périphérique, effet miroir, sur les hauteurs de Cannes. Structure en béton armé étanche dans la masse, bac tampon enterré et plage minérale d’un seul tenant.',
        caps: ['Le bassin livré, face à la baie', 'Ferraillage du bassin avant coulage']
      },
      photos: ['img/demo/hbd04.jpg', 'img/demo/hbd04-b.jpg']
    },
    {
      id: 'hbd05', ref: 'HB-1914', encours: false, demo: true,
      facets: { lieu: 'Biot', type: 'Industriel & dallage', tech: ['Dallage industriel', 'Chape liquide'] },
      fb: {
        titre: 'Atelier 900 m² — dallage quartzé', lieu: 'Biot', annee: '2019',
        surface: '900 m²', nature: 'Bâtiment d’activité — dallage industriel',
        desc: 'Atelier de 900 m² pour un artisan d’art à Biot. Dallage industriel quartzé coulé en continu, joints sciés selon le plan de calepinage et chape liquide dans la partie bureaux.',
        caps: ['Le dallage quartzé, fraîchement lissé']
      },
      photos: ['img/demo/hbd05.jpg']
    },
    {
      id: 'hbd06', ref: 'HB-2001', encours: false, demo: true,
      facets: { lieu: 'Èze', type: 'Réhabilitation lourde', tech: ['Reprise en sous-œuvre', 'Béton banché'] },
      fb: {
        titre: 'Réhabilitation d’une bastide', lieu: 'Èze', annee: '2020',
        surface: '260 m²', nature: 'Réhabilitation lourde — structure conservée',
        desc: 'Réhabilitation lourde d’une bastide accrochée à la pente, à Èze. Reprises en sous-œuvre des fondations, nouveaux planchers béton et voiles de soutènement en béton banché.',
        caps: ['La bastide en cours de reprise structurelle']
      },
      photos: ['img/demo/hbd06.jpg']
    },
    {
      id: 'hbd07', ref: 'HB-2008', encours: false, demo: true,
      facets: { lieu: 'Cap d’Antibes', type: 'Extension & sous-sol', tech: ['Terrassement en taupe', 'Reprise en sous-œuvre'] },
      fb: {
        titre: 'Sous-sol créé sous villa existante', lieu: 'Cap d’Antibes', annee: '2020',
        surface: '180 m² créés', nature: 'Terrassement en taupe & sous-œuvre',
        desc: 'Création d’un niveau complet sous une villa habitée du Cap d’Antibes. Terrassement en taupe par passes successives, reprises en sous-œuvre et radier général — la maison est restée habitée pendant toute la durée des travaux.',
        caps: ['Terrassement en taupe sous la villa', 'Le radier coulé, prêt pour les voiles']
      },
      photos: ['img/demo/hbd07.jpg', 'img/demo/hbd07-b.jpg']
    },
    {
      id: 'hbd08', ref: 'HB-2013', encours: false, demo: true,
      facets: { lieu: 'Mandelieu', type: 'Villa neuve', tech: ['Béton banché'] },
      fb: {
        titre: 'Villa familiale 240 m²', lieu: 'Mandelieu', annee: '2020',
        surface: '240 m²', nature: 'Gros œuvre béton armé — construction neuve',
        desc: 'Villa familiale de 240 m² à Mandelieu-la-Napoule, à deux pas du golf. Structure en béton banché, grandes baies au sud et garage semi-enterré.',
        caps: ['Façade sud au soleil couchant']
      },
      photos: ['img/demo/hbd08.jpg']
    },
    {
      id: 'hbd09', ref: 'HB-2104', encours: false, demo: true,
      facets: { lieu: 'Saint-Jean-Cap-Ferrat', type: 'Villa neuve', tech: ['Béton architectonique', 'Porte-à-faux'] },
      fb: {
        titre: 'Villa en surplomb de la baie', lieu: 'Saint-Jean-Cap-Ferrat', annee: '2021',
        surface: '450 m²', nature: 'Béton architectonique — étage en porte-à-faux',
        desc: 'Villa de 450 m² en surplomb de la baie de Saint-Jean-Cap-Ferrat. Étage en porte-à-faux de quatre mètres et voiles en béton architectonique coulés en place, calepinés avec l’architecte.',
        caps: ['Le porte-à-faux au-dessus de la baie', 'Banches en place pour le voile architectonique']
      },
      photos: ['img/demo/hbd09.jpg', 'img/demo/hbd09-b.jpg']
    },
    {
      id: 'hbd10', ref: 'HB-2109', encours: false, demo: true,
      facets: { lieu: 'Villefranche-sur-Mer', type: 'Réhabilitation lourde', tech: ['Reprise en sous-œuvre', 'Sciage béton'] },
      fb: {
        titre: 'Maison de rade restructurée', lieu: 'Villefranche-sur-Mer', annee: '2021',
        surface: '210 m²', nature: 'Réhabilitation lourde — refonte des trames porteuses',
        desc: 'Restructuration complète d’une maison des années 1960 face à la rade de Villefranche. Sciage des trames porteuses, reprises en sous-œuvre et nouveaux planchers pour ouvrir les volumes sur la mer.',
        caps: ['Le chantier au-dessus de la rade']
      },
      photos: ['img/demo/hbd10.jpg']
    },
    {
      id: 'hbd11', ref: 'HB-2115', encours: false, demo: true,
      facets: { lieu: 'Théoule-sur-Mer', type: 'Piscine & ouvrage complexe', tech: ['Porte-à-faux'] },
      fb: {
        titre: 'Bassin suspendu sur la roche rouge', lieu: 'Théoule-sur-Mer', annee: '2021',
        surface: 'Bassin 11 × 4 m', nature: 'Ouvrage béton complexe — bassin en console',
        desc: 'Bassin en console ancré dans la roche rouge de l’Estérel, à Théoule-sur-Mer. Micropieux, longrines et voile de rive en porte-à-faux au-dessus de la calanque.',
        caps: ['Le bassin livré, ancré dans l’Estérel', 'Étaiement du voile de rive en console']
      },
      photos: ['img/demo/hbd11.jpg', 'img/demo/hbd11-b.jpg']
    },
    {
      id: 'hbd12', ref: 'HB-2118', encours: false, demo: true,
      facets: { lieu: 'Valbonne', type: 'Industriel & dallage', tech: ['Dallage industriel'] },
      fb: {
        titre: 'Halle d’activité 1 400 m²', lieu: 'Valbonne', annee: '2021',
        surface: '1 400 m²', nature: 'Bâtiment d’activité — gros œuvre & dallage',
        desc: 'Halle d’activité de 1 400 m² à Sophia Antipolis. Poteaux préfabriqués, longrines coulées en place et dallage industriel à joints actifs dimensionné pour les charges roulantes.',
        caps: ['La halle en fin de gros œuvre']
      },
      photos: ['img/demo/hbd12.jpg']
    },
    {
      id: 'hbd13', ref: 'HB-2203', encours: false, demo: true,
      facets: { lieu: 'Mougins', type: 'Extension & sous-sol', tech: ['Terrassement en taupe', 'Chape liquide'] },
      fb: {
        titre: 'Extension enterrée d’un mas', lieu: 'Mougins', annee: '2022',
        surface: '120 m² créés', nature: 'Extension & niveau enterré',
        desc: 'Extension d’un mas mouginois par un niveau enterré ouvert sur une cour anglaise. Terrassement en taupe partiel, voiles contre terre et chape liquide sur plancher chauffant.',
        caps: ['La cour anglaise de l’extension livrée']
      },
      photos: ['img/demo/hbd13.jpg']
    },
    {
      id: 'hbd14', ref: 'HB-2207', encours: false, demo: true,
      facets: { lieu: 'Nice', type: 'Villa neuve', tech: ['Béton banché', 'Béton architectonique'] },
      fb: {
        titre: 'Villa sur les collines niçoises', lieu: 'Nice', annee: '2022',
        surface: '340 m²', nature: 'Construction neuve — béton apparent',
        desc: 'Villa de 340 m² sur les collines de Nice, entre Gairaut et Cimiez. Voiles en béton banché, escalier hélicoïdal coulé en place et murs intérieurs en béton architectonique laissé brut.',
        caps: ['Volumes livrés côté vallon', 'L’escalier hélicoïdal en béton brut']
      },
      photos: ['img/demo/hbd14.jpg', 'img/demo/hbd14-b.jpg']
    },
    {
      id: 'hbd15', ref: 'HB-2212', encours: false, demo: true,
      facets: { lieu: 'Cannes', type: 'Réhabilitation lourde', tech: ['Reprise en sous-œuvre'] },
      fb: {
        titre: 'Immeuble Belle Époque conforté', lieu: 'Cannes', annee: '2022',
        surface: '6 niveaux', nature: 'Confortement structurel en site occupé',
        desc: 'Confortement des fondations d’un immeuble Belle Époque du centre de Cannes, en site occupé. Reprises en sous-œuvre par plots alternés et longrines de répartition, sans interruption d’usage.',
        caps: ['Reprises par plots en pied de façade']
      },
      photos: ['img/demo/hbd15.jpg']
    },
    {
      id: 'hbd16', ref: 'HB-2216', encours: false, demo: true,
      facets: { lieu: 'Biot', type: 'Villa neuve', tech: ['Béton banché', 'Chape liquide'] },
      fb: {
        titre: 'Villa de village 190 m²', lieu: 'Biot', annee: '2022',
        surface: '190 m²', nature: 'Construction neuve — parcelle en pente',
        desc: 'Villa de 190 m² sur une parcelle en pente aux abords du village de Biot. Soutènements en béton banché, demi-niveaux et chapes liquides sur toute la maison.',
        caps: ['La villa livrée dans la pente']
      },
      photos: ['img/demo/hbd16.jpg']
    },
    {
      id: 'hbd17', ref: 'HB-2302', encours: false, demo: true,
      facets: { lieu: 'Èze', type: 'Piscine & ouvrage complexe', tech: ['Porte-à-faux', 'Béton banché'] },
      fb: {
        titre: 'Piscine à débordement face à la mer', lieu: 'Èze', annee: '2023',
        surface: 'Bassin 12 × 5 m', nature: 'Ouvrage béton complexe — site escarpé',
        desc: 'Piscine à débordement sur un terrain escarpé d’Èze-Bord-de-Mer. Bassin en béton banché ancré par tirants, voile de débordement en porte-à-faux et acheminement du béton par pompage sur 60 mètres.',
        caps: ['Le débordement face à la Méditerranée', 'Coffrage du bassin dans la pente']
      },
      photos: ['img/demo/hbd17.jpg', 'img/demo/hbd17-b.jpg']
    },
    {
      id: 'hbd18', ref: 'HB-2306', encours: false, demo: true,
      facets: { lieu: 'Cap d’Antibes', type: 'Villa neuve', tech: ['Béton architectonique'] },
      fb: {
        titre: 'Villa blanche 520 m²', lieu: 'Cap d’Antibes', annee: '2023',
        surface: '520 m²', nature: 'Construction neuve — béton architectonique',
        desc: 'Villa de 520 m² au Cap d’Antibes, dessinée autour d’un patio planté. Voiles en béton architectonique blanc, calepinage des trous de banche soigné et acrotères minces coulés en place.',
        caps: ['Le patio et ses voiles de béton blanc']
      },
      photos: ['img/demo/hbd18.jpg']
    },
    {
      id: 'hbd19', ref: 'HB-2309', encours: false, demo: true,
      facets: { lieu: 'Mandelieu', type: 'Ouverture & sciage', tech: ['Sciage béton'] },
      fb: {
        titre: 'Trémie d’ascenseur sciée', lieu: 'Mandelieu', annee: '2023',
        surface: '4 niveaux', nature: 'Sciage béton — création de trémies',
        desc: 'Création d’une trémie d’ascenseur dans une résidence de Mandelieu : sciage des quatre planchers au câble diamanté, renforts métalliques et reprise des chapes. Intervention menée en site occupé.',
        caps: ['Sciage au câble du plancher haut']
      },
      photos: ['img/demo/hbd19.jpg']
    },
    {
      id: 'hbd20', ref: 'HB-2314', encours: false, demo: true,
      facets: { lieu: 'Villefranche-sur-Mer', type: 'Extension & sous-sol', tech: ['Terrassement en taupe', 'Reprise en sous-œuvre'] },
      fb: {
        titre: 'Garage enterré sous jardin', lieu: 'Villefranche-sur-Mer', annee: '2023',
        surface: '90 m² créés', nature: 'Sous-sol créé — accès en site étroit',
        desc: 'Garage enterré créé sous le jardin d’une propriété de Villefranche-sur-Mer, en site très étroit. Terrassement en taupe, reprises en sous-œuvre du mur mitoyen et dalle de couverture plantée.',
        caps: ['L’excavation sous le jardin conservé']
      },
      photos: ['img/demo/hbd20.jpg']
    },
    {
      id: 'hbd21', ref: 'HB-2318', encours: false, demo: true,
      facets: { lieu: 'Valbonne', type: 'Villa neuve', tech: ['Béton banché', 'Porte-à-faux'] },
      fb: {
        titre: 'Villa atrium 300 m²', lieu: 'Valbonne', annee: '2023',
        surface: '300 m²', nature: 'Construction neuve — grandes portées',
        desc: 'Villa de 300 m² organisée autour d’un atrium vitré, à Valbonne. Planchers de grande portée sans poteau intermédiaire et auvent d’entrée en porte-à-faux de trois mètres.',
        caps: ['L’atrium livré, vu du jardin', 'Coulage du plancher de grande portée']
      },
      photos: ['img/demo/hbd21.jpg', 'img/demo/hbd21-b.jpg']
    },
    {
      id: 'hbd22', ref: 'HB-2405', encours: false, demo: true,
      facets: { lieu: 'Saint-Jean-Cap-Ferrat', type: 'Réhabilitation lourde', tech: ['Reprise en sous-œuvre', 'Béton architectonique'] },
      fb: {
        titre: 'Villa 1930 restructurée', lieu: 'Saint-Jean-Cap-Ferrat', annee: '2024',
        surface: '380 m²', nature: 'Réhabilitation lourde — façades conservées',
        desc: 'Restructuration d’une villa des années 1930 à Saint-Jean-Cap-Ferrat, façades conservées. Reprises en sous-œuvre, structure intérieure entièrement refaite et nouveaux ouvrages en béton architectonique.',
        caps: ['Façades étayées, structure neuve à l’intérieur']
      },
      photos: ['img/demo/hbd22.jpg']
    },
    {
      id: 'hbd23', ref: 'HB-2410', encours: false, demo: true,
      facets: { lieu: 'Théoule-sur-Mer', type: 'Villa neuve', tech: ['Béton banché', 'Porte-à-faux'] },
      fb: {
        titre: 'Villa belvédère 260 m²', lieu: 'Théoule-sur-Mer', annee: '2024',
        surface: '260 m²', nature: 'Construction neuve — terrain en forte pente',
        desc: 'Villa belvédère de 260 m² au-dessus de la baie de Théoule. Pilotis et voiles en béton banché épousant la pente, séjour en porte-à-faux tourné vers l’Estérel.',
        caps: ['La villa dans la pente, face à la baie', 'Les pilotis avant remblaiement']
      },
      photos: ['img/demo/hbd23.jpg', 'img/demo/hbd23-b.jpg']
    },
    {
      id: 'hbd24', ref: 'HB-2413', encours: false, demo: true,
      facets: { lieu: 'Nice', type: 'Industriel & dallage', tech: ['Dallage industriel', 'Chape liquide'] },
      fb: {
        titre: 'Showroom 600 m² — plateau libre', lieu: 'Nice', annee: '2024',
        surface: '600 m²', nature: 'Dallage & chapes — plateau commercial',
        desc: 'Plateau commercial de 600 m² dans la plaine du Var, à Nice. Dallage industriel surfacé pour rester apparent, chape liquide dans les zones d’accueil et joints réduits au strict nécessaire.',
        caps: ['Le plateau livré, dallage apparent']
      },
      photos: ['img/demo/hbd24.jpg']
    },
    {
      id: 'hbd25', ref: 'HB-2417', encours: false, demo: true,
      facets: { lieu: 'Mougins', type: 'Piscine & ouvrage complexe', tech: ['Béton banché'] },
      fb: {
        titre: 'Bassin de nage & pool house', lieu: 'Mougins', annee: '2024',
        surface: 'Bassin 20 × 3 m', nature: 'Bassin de nage & petit ouvrage',
        desc: 'Couloir de nage de vingt mètres et pool house en béton apparent dans une propriété de Mougins. Bassin banché étanche dans la masse et auvent filant coulé en place.',
        caps: ['Le couloir de nage et son auvent']
      },
      photos: ['img/demo/hbd25.jpg']
    },
    {
      id: 'hbd26', ref: 'HB-2503', encours: true, demo: true,
      facets: { lieu: 'Cannes', type: 'Extension & sous-sol', tech: ['Terrassement en taupe'] },
      fb: {
        titre: 'Deux niveaux créés sous une villa', lieu: 'Cannes', annee: 'En cours',
        surface: '220 m² créés', nature: 'Terrassement en taupe — deux niveaux',
        desc: 'Création de deux niveaux enterrés sous une villa du quartier de la Californie, à Cannes. Terrassement en taupe par passes, butonnage provisoire et radier profond — chantier en cours, livraison prévue en 2026.',
        caps: ['L’excavation butonnée sous la villa', 'Évacuation des déblais par la rampe provisoire']
      },
      photos: ['img/demo/hbd26.jpg', 'img/demo/hbd26-b.jpg']
    },
    {
      id: 'hbd27', ref: 'HB-2508', encours: true, demo: true,
      facets: { lieu: 'Biot', type: 'Réhabilitation lourde', tech: ['Reprise en sous-œuvre', 'Sciage béton'] },
      fb: {
        titre: 'Ancienne poterie réhabilitée', lieu: 'Biot', annee: 'En cours',
        surface: '480 m²', nature: 'Réhabilitation lourde — bâti ancien',
        desc: 'Réhabilitation d’une ancienne poterie biotoise en maison et atelier. Reprises en sous-œuvre des murs de pierre, sciage des planchers existants et insertion d’une structure béton neuve.',
        caps: ['Les murs anciens étayés avant reprise']
      },
      photos: ['img/demo/hbd27.jpg']
    },
    {
      id: 'hbd28', ref: 'HB-2512', encours: true, demo: true,
      facets: { lieu: 'Èze', type: 'Villa neuve', tech: ['Béton banché', 'Béton architectonique'] },
      fb: {
        titre: 'Villa 410 m² accrochée à la pente', lieu: 'Èze', annee: 'En cours',
        surface: '410 m²', nature: 'Construction neuve — superstructure en cours',
        desc: 'Villa de 410 m² sur les hauteurs d’Èze, desservie par une grue à tour dédiée. Infrastructure achevée, superstructure en béton banché en cours d’élévation, voiles architectoniques à venir.',
        caps: ['La grue à tour au-dessus des banches', 'Élévation des voiles du niveau séjour']
      },
      photos: ['img/demo/hbd28.jpg', 'img/demo/hbd28-b.jpg']
    },
    {
      id: 'hbd29', ref: 'HB-2601', encours: true, demo: true,
      facets: { lieu: 'Cap d’Antibes', type: 'Piscine & ouvrage complexe', tech: ['Porte-à-faux', 'Béton banché'] },
      fb: {
        titre: 'Bassin en console sur la mer', lieu: 'Cap d’Antibes', annee: 'En cours',
        surface: 'Bassin 15 × 5 m', nature: 'Ouvrage béton complexe — console sur la mer',
        desc: 'Bassin de quinze mètres en console au-dessus des rochers du Cap d’Antibes. Ferraillage dense, étaiement lourd repris sur micropieux et bétonnage par pompe — coulage du voile de rive en cours.',
        caps: ['Ferraillage du bassin au-dessus des rochers']
      },
      photos: ['img/demo/hbd29.jpg']
    },
    {
      id: 'hbd30', ref: 'HB-2604', encours: true, demo: true,
      facets: { lieu: 'Villefranche-sur-Mer', type: 'Extension & sous-sol', tech: ['Terrassement en taupe', 'Reprise en sous-œuvre'] },
      fb: {
        titre: 'Extension sous cour d’une maison de ville', lieu: 'Villefranche-sur-Mer', annee: 'En cours',
        surface: '75 m² créés', nature: 'Extension enterrée — site historique',
        desc: 'Extension enterrée sous la cour d’une maison de ville de Villefranche-sur-Mer, à quelques rues du port. Terrassement en taupe manuel, reprises en sous-œuvre des mitoyens anciens et dalle de cour restituée à l’identique.',
        caps: ['Le chantier dissimulé derrière la façade ancienne']
      },
      photos: ['img/demo/hbd30.jpg']
    }
  ];
})();
