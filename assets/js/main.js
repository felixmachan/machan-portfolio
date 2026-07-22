// Load modular sections and wire up scroll spy once content is in place.
(function () {
  const forceTopOnFreshLoad = () => {
    // Keep deep-links working (e.g. index.html#projects),
    // but treat #hero as exact top.
    const hash = window.location.hash;
    if (hash && hash !== '#hero') return;

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    if (hash === '#hero') {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }

    const jumpTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    jumpTop();
    requestAnimationFrame(jumpTop);
    setTimeout(jumpTop, 0);
    setTimeout(jumpTop, 120);

    // Covers refresh + BFCache restores in some browsers.
    window.addEventListener('pageshow', () => {
      const currentHash = window.location.hash;
      if (!currentHash || currentHash === '#hero') {
        jumpTop();
        setTimeout(jumpTop, 0);
      }
    });
  };

  forceTopOnFreshLoad();

  const LANG_STORAGE_KEY = 'lang';
  const SUPPORTED_LANGS = ['hu', 'en'];

  const getCurrentLang = () => {
    const lang = document.documentElement.getAttribute('lang');
    return SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  };

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) {
      el.textContent = value;
    }
  };

  const setHtml = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) {
      el.innerHTML = value;
    }
  };

  const setAttr = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) {
      el.setAttribute(attr, value);
    }
  };

  const setHeadingWithIcon = (selector, text) => {
    const heading = document.querySelector(selector);
    if (!heading) return;
    const icon = heading.querySelector('svg');
    if (!icon) {
      heading.textContent = text;
      return;
    }
    heading.replaceChildren(icon, document.createTextNode(` ${text}`));
  };

  const applyIndexTranslations = (lang) => {
    const t = lang === 'hu'
      ? {
          metaDescription:
            'Machán Félix - mechatronikai mérnöki portfólió. Beágyazott rendszerek, NYÁK-tervezés, IoT, okosotthon-megoldások és full-stack mérnöki projektek.',
          title: 'Mérnöki Portfólió',
          ogTitle: 'Machán Félix - Mérnöki Portfólió',
          ogDescription: 'Ismerj meg és nézd meg projektjeimet a személyes portfólióoldalamon.',
          nav: ['Helló', 'Rólam', 'Tapasztalat', 'Tanulmányok', 'Projektek', 'Készségek', 'Kapcsolat'],
          pager: ['Előző szekció', 'Következő szekció', 'Szekció navigáció'],
          heroTitle: 'Szia, a nevem <span style="color: rgb(173, 126, 88);">Félix</span>,',
          heroLead: 'és <span style="font-style: italic;">mérnök</span> vagyok.',
          aboutTitle: 'Rólam',
          aboutP1:
            'A nevem <span style="font-weight: bold;">Machán Félix</span>, egy <span style="font-weight: bold;">23 éves mérnökhallgató</span> vagyok egy Budapest melletti kisvárosból. Gyerekkorom óta tudom, hogy elsősorban a műszaki témák érdekelnek, és szeretek <span style="font-weight: bold;">alkotni.</span> Pont ezért választottam a mérnöki pályát. Eleinte még nem volt egyértelmű, melyik ágazatra specializálódjak. Kutatás után találtam rá a <span style="font-weight: bold;">mechatronikai mérnöki</span> területre, ami tökéletesen ötvözi a gépészeti, villamos és szoftveres érdeklődésemet. Ezzel a multidiszciplináris szemlélettel széles projektkörön dolgozhatok, és összetett problémákat oldhatok meg.',
          aboutP2:
            'A tanulmányaim kezdete óta gyakorlatorientált megközelítést követek a rendszertervezésben és megvalósításban. Végponttól végpontig építek megoldásokat beágyazott rendszerektől a szoftveren át az infrastruktúráig, nagy hangsúllyal a működés mély megértésén.',
          aboutPills: ['Kíváncsiság', 'Kreativitás', 'Gyakorlatias szemlélet'],
          expTitle: 'Szakmai Tapasztalat',
          expRole1: 'DevOps és IoT mérnök gyakornok',
          expDate1: '2025.09. - Jelenleg',
          expDesc1:
            'Központi platform fejlesztése kereskedelmi és egyedi IoT eszközök integrálására, valamint DevOps és üzemeltetési feladatok támogatása.',
          expRole2: 'Mérnök gyakornok',
          expDesc2:
            'Az Engineering csapat támogatása különböző feladatokban és projektekben, amely jelentősen bővítette gyakorlati és elméleti mérnöki tudásomat.',
          eduTitle: 'Tanulmányok',
          eduBmeSubtitle: 'BSc mechatronikai mérnöki képzés, kiberfizikai rendszerek spec.',
          eduBmeBullets: ['Rendszermérnöki fókusz', 'Beágyazott és irányítástechnikai rendszerek'],
          eduDateNow: '2022 - Jelenleg',
          eduBorSubtitle: 'Két tanítási nyelvű osztály, kiemelkedő érettségi eredményekkel',
          eduBorBullets: ['Műszaki alapok', 'STEM fókuszú képzés'],
          projTitle: 'Projektek',
          projLead: 'Válogatott munkák, ahol a mérnöki mélység üzleti eredményekkel találkozik.',
          projCards: {
            pedals: ['Egyedi Sim Racing pedálszett - ME1', 'Gépészeti tervezés', 'CNC-vel gyártott pedálszett, teljes körű tervezéssel a hardvertől a vezérlő elektronikáig.'],
            buttonbox: ['Egyedi Sim Racing Button Box', 'NYÁK-tervezés', 'Teljesen egyedi Button Box sim versenyzéshez. 3D nyomtatott ház és saját tervezésű NYÁK.'],
            mptrhome: ['IoT Device Hub rendszer - MPTRhome', 'otthonautomatizálás', 'Központi hub, amely egyetlen vezérlési síkba fogja össze a kereskedelmi és egyedi IoT-eszközöket.'],
            talppont: ['Masszázsszalon weboldal - Talppont', 'UI-központú weboldal', 'Ügyfélszerzésre optimalizált, nyugodt hangulatú masszázsszalon-weboldal.'],
            network: ['Otthoni szerver', 'hálózat', 'DNS, DHCP, VPN és más alapvető szolgáltatások az otthoni szerverlaborhoz.'],
            pacerra: ['Pacerra - MI-alapú állóképességi edző', 'MI-alapú alkalmazásfejlesztés', 'Strava-szinkronra, személyre szabott heti tervekre és edzésenkénti MI-visszajelzésre épülő állóképességi edzőalkalmazás.'],
            vanoor: ['Vanoor - Apple Watch-központú futóalkalmazás', 'natív alkalmazásfejlesztés', 'Letisztult GPX-navigáció, strukturált edzések, tempótartás és HealthKit-integráció iPhone-ra és Apple Watchra.'],
            cheerlify: ['Cheerlify - Privát versenynapi támogatás', 'mobil és valós idejű platform', 'Privát élő követés bármilyen GPX-útvonalon, a futóhoz verseny közben eljutó hang- és videóbuzdításokkal.'],
          },
          skillsTitle: 'Készségek',
          skillGroups: ['Beágyazott', 'DevOps', 'CAD', 'Web', 'Grafika'],
          contactTitle: 'Kapcsolat',
          contactLead: 'Nyitott vagyok együttműködésre megbízható rendszerek és hatásos mérnöki megoldások építésében.',
          cv: 'Önéletrajz letöltése',
          openForm: 'Kapcsolati űrlap megnyitása',
          yourName: 'Neved:',
          yourEmail: 'Email címed:',
          yourMessage: 'Üzeneted:',
          submit: 'Küldés',
          footer: '© 2026 Machan Engineering. A tisztaságra és megbízhatóságra építve.',
        }
      : {
          metaDescription:
            'Felix Machan - mechatronics engineering portfolio. Embedded systems, PCB design, IoT, smart home solutions and full-stack engineering projects.',
          title: 'Engineering Portfolio',
          ogTitle: 'Felix Machan - Engineering Portfolio',
          ogDescription: 'Find me and my projects on my personal portfolio page.',
          nav: ['Hello', 'About', 'Experience', 'Education', 'Projects', 'Skills', 'Contact'],
          pager: ['Previous section', 'Next section', 'Section navigation'],
          heroTitle: 'Hi, my name is <span style="color: rgb(173, 126, 88);">Felix</span>,',
          heroLead: 'and I&apos;m an <span style="font-style: italic;">Engineer.</span>',
          aboutTitle: 'About',
          aboutP1:
            'My name is <span style="font-weight: bold;">Felix Machan</span> and I&apos;m a <span style="font-weight: bold;">23-year-old engineering student</span> coming from a small town near <span style="font-weight: bold;">Budapest, Hungary.</span> Ever since I was a child, I have known that I&apos;m mainly interested in technical subjects and I like <span style="font-weight: bold;">building things.</span> This is exactly why I chose to pursue engineering as my field of study. However, it was not clear to me at first which specific branch of engineering I wanted to specialize in. After some research, I found out about <span style="font-weight: bold;">Mechatronics Engineering</span>, which perfectly combines my interests in mechanical, electrical, and software engineering. With this multidisciplinary approach, I can work on a wide range of projects and solve complex problems that require knowledge from multiple fields.',
          aboutP2:
            'Since the beginning of my studies, I have adopted a hands-on approach to system design and implementation. I build practical, end-to-end solutions spanning embedded systems, software, and infrastructure, with a strong emphasis on understanding how things work - not just making them work.',
          aboutPills: ['Curiosity', 'Creativity', 'Practicality'],
          expTitle: 'Professional Experience',
          expRole1: 'DevOps & IoT Engineer Intern',
          expDate1: '2025.09. - Present',
          expDesc1:
            'Developing a centralized platform to integrate commercial and custom IoT devices, while supporting DevOps and operational tasks.',
          expRole2: 'Engineering Intern',
          expDesc2:
            'Supported the Engineering team with various tasks and projects, broadening my practical and theoretical knowledge of several fields of Engineering.',
          eduTitle: 'Education',
          eduBmeSubtitle: 'BSc in Mechatronics Engineering, Cyber-Physical Systems',
          eduBmeBullets: ['Systems engineering focus', 'Embedded and control systems'],
          eduDateNow: '2022 - Present',
          eduBorSubtitle: 'Bilingual class with an outstanding graduation record',
          eduBorBullets: ['Technical foundations', 'STEM-focused program'],
          projTitle: 'Projects',
          projLead: 'Representative work that blends engineering depth with business outcomes.',
          projCards: {
            pedals: ['Custom Sim Racing Pedals - ME1', 'Mechanical design', 'A CNC-machined pedal set designed and engineered end-to-end, from hardware to control electronics.'],
            buttonbox: ['Custom Sim Racing Button Box', 'PCB design', 'Fully custom made Button Box for sim racing setups. 3D printed case with in-house designed PCB.'],
            mptrhome: ['IoT Device Hub System - MPTRhome', 'home automation', 'Centralized hub that unifies commercial and custom IoT devices with a single control plane.'],
            talppont: ['Massage parlour website - Talppont', 'UI focused website', 'A massage parlour website built to attract customers.'],
            network: ['Home server', 'networking', 'DNS, DHCP, VPN and other essential services for the home server lab.'],
            pacerra: ['Pacerra - AI Endurance Coach', 'AI powered app development', 'AI-powered endurance coaching app with Strava sync, personalized weekly plans, and per-workout AI feedback.'],
            vanoor: ['Vanoor - Apple Watch-first Running', 'native app engineering', 'Clean GPX navigation, structured workouts, pacing, and HealthKit integration for iPhone and Apple Watch.'],
            cheerlify: ['Cheerlify - Private Race-day Support', 'mobile and real-time platform', 'Private live tracking for any GPX route, with voice and video cheers delivered to the runner mid-race.'],
          },
          skillsTitle: 'Skills',
          skillGroups: ['Embedded', 'DevOps', 'CAD', 'Web', 'Graphics'],
          contactTitle: 'Contact',
          contactLead: 'Ready to collaborate on resilient systems and impactful engineering.',
          cv: 'Download my CV',
          openForm: 'Open contact form',
          yourName: 'Your name:',
          yourEmail: 'Your email:',
          yourMessage: 'Your message:',
          submit: 'Submit',
          footer: '© 2026 Machan Engineering. Built for clarity and reliability.',
        };

    document.title = t.title;
    setAttr('meta[name="description"]', 'content', t.metaDescription);
    setAttr('meta[property="og:title"]', 'content', t.ogTitle);
    setAttr('meta[property="og:description"]', 'content', t.ogDescription);

    const navItems = document.querySelectorAll('.side-nav__item .side-nav__label');
    t.nav.forEach((label, i) => {
      if (navItems[i]) navItems[i].textContent = label;
    });

    setAttr('.section-pager', 'aria-label', t.pager[2]);
    setAttr('.section-pager__btn[data-dir="up"]', 'aria-label', t.pager[0]);
    setAttr('.section-pager__btn[data-dir="down"]', 'aria-label', t.pager[1]);
    setAttr('.side-nav__arrow[data-side-nav-dir="up"]', 'aria-label', t.pager[0]);
    setAttr('.side-nav__arrow[data-side-nav-dir="down"]', 'aria-label', t.pager[1]);

    setHtml('#hero .section-title .typewriter-line', t.heroTitle);
    setHtml('#hero .section-lead .typewriter-line', t.heroLead);

    setHeadingWithIcon('#about .section-title', t.aboutTitle);
    setHtml('#about .about-text p:nth-of-type(1)', t.aboutP1);
    setHtml('#about .about-text p:nth-of-type(2)', t.aboutP2);
    setText('#about .pills-container .pill:nth-child(1)', t.aboutPills[0]);
    setText('#about .pills-container .pill:nth-child(2)', t.aboutPills[1]);
    setText('#about .pills-container .pill:nth-child(3)', t.aboutPills[2]);

    setHeadingWithIcon('#experience .section-title', t.expTitle);
    setText('#experience .experience-card:nth-child(1) h3:nth-of-type(1)', t.expRole1);
    setText('#experience .experience-card:nth-child(1) h4', t.expDate1);
    setText('#experience .experience-card:nth-child(1) p', t.expDesc1);
    setText('#experience .experience-card:nth-child(2) h3:nth-of-type(1)', t.expRole2);
    setText('#experience .experience-card:nth-child(2) p', t.expDesc2);

    setHeadingWithIcon('#education .section-title', t.eduTitle);
    setText('#education .education-row:nth-child(1) .education-subtitle', t.eduBmeSubtitle);
    setText('#education .education-row:nth-child(1) .education-list li:nth-child(1)', t.eduBmeBullets[0]);
    setText('#education .education-row:nth-child(1) .education-list li:nth-child(2)', t.eduBmeBullets[1]);
    setText('#education .education-row:nth-child(1) .education-date .pill', t.eduDateNow);
    setText('#education .education-row:nth-child(2) .education-subtitle', t.eduBorSubtitle);
    setText('#education .education-row:nth-child(2) .education-list li:nth-child(1)', t.eduBorBullets[0]);
    setText('#education .education-row:nth-child(2) .education-list li:nth-child(2)', t.eduBorBullets[1]);

    setHeadingWithIcon('#projects .section-title', t.projTitle);
    setText('#projects .section-lead', t.projLead);
    const projectCards = document.querySelectorAll('#projects .project-card[data-project-id]');
    projectCards.forEach((node) => {
      const card = t.projCards[node.dataset.projectId];
      if (!card) return;
      const title = node.querySelector('h3');
      const subtitle = node.querySelector('.project-subtitle');
      const desc = node.querySelector('.project-body p:last-child');
      if (title) title.textContent = card[0];
      if (subtitle) subtitle.textContent = card[1];
      if (desc) desc.textContent = card[2];
    });

    setHeadingWithIcon('#skills .section-title', t.skillsTitle);
    const skillGroupTitles = document.querySelectorAll('#skills .skills-group__header h3');
    t.skillGroups.forEach((label, index) => {
      if (skillGroupTitles[index]) skillGroupTitles[index].textContent = label;
    });

    setHeadingWithIcon('#contact .section-title', t.contactTitle);
    setText('#contact .section-lead', t.contactLead);
    setText('#contact .contact-cv', t.cv);
    const cvLink = document.querySelector('#contact .contact-cv');
    if (cvLink) {
      const enCv = cvLink.dataset.cvEn || cvLink.getAttribute('href') || '#';
      const huCv = cvLink.dataset.cvHu || enCv;
      cvLink.setAttribute('href', lang === 'hu' ? huCv : enCv);
    }
    setText('#contact [data-contact-toggle] .contact-handle', t.openForm);
    setText('#contact .contact-form__label:nth-of-type(1) span', t.yourName);
    setText('#contact .contact-form__label:nth-of-type(2) span', t.yourEmail);
    setText('#contact .contact-form__label:nth-of-type(3) span', t.yourMessage);
    setText('#contact .contact-form__submit', t.submit);
    setText('.site-footer small', t.footer);
  };

  const localizeTextList = (selector, lang, huValues) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.forEach((node, index) => {
      if (!Object.prototype.hasOwnProperty.call(node.dataset, 'enText')) {
        node.dataset.enText = node.textContent;
      }
      if (lang === 'hu' && huValues[index]) {
        node.textContent = huValues[index];
      } else {
        node.textContent = node.dataset.enText || node.textContent;
      }
    });
  };

  const localizeHtmlList = (selector, lang, huValues) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.forEach((node, index) => {
      if (!Object.prototype.hasOwnProperty.call(node.dataset, 'enHtml')) {
        node.dataset.enHtml = node.innerHTML;
      }
      if (lang === 'hu' && huValues[index]) {
        node.innerHTML = huValues[index];
      } else {
        node.innerHTML = node.dataset.enHtml || node.innerHTML;
      }
    });
  };

  const applyIndexExtraTranslations = (lang) => {
    localizeTextList('#education .school', lang, [
      'Budapesti Műszaki és Gazdaságtudományi Egyetem',
      'VSZC Boronkay György Műszaki Technikum és Gimnázium',
    ]);

    const huSkillLabels = [
      'Arduino', 'Raspberry Pi', 'Zigbee', 'MQTT', 'KiCad', 'Adafruit (ESP32)',
      'Linux', 'Proxmox', 'Windows', 'Git', 'Python',
      'Autodesk Inventor', 'Fusion 360', 'AutoCAD', 'SolidWorks',
      'HTML5', 'CSS3', 'JavaScript', 'Node.js', 'React', 'Flask',
      'Adobe Photoshop', 'Adobe Lightroom', 'Adobe Premiere Pro',
    ];
    localizeTextList('#skills .skill-detail__title', lang, huSkillLabels);

    localizeTextList('#skills .skill-detail__body', lang, [
      'Gyors prototípus-készítés beágyazott vezérléshez, szenzorokhoz és tesztpadokhoz.',
      'Peremoldali számítás demókhoz, home lab szolgáltatásokhoz és IoT gateway feladatokhoz.',
      'Alacsony fogyasztású mesh eszközintegráció okosotthon projektekben.',
      'Üzenetközvetítő gerinc telemetriához és parancsútvonalakhoz.',
      'Egyedi NYÁK-tervek beágyazott prototípusokhoz és perifériákhoz.',
      'ESP32 használata több kisebb személyes projektben.',
      'Szerverüzembe helyezés, szolgáltatások és automatizálás labor környezetben.',
      'Virtualizációs stack az otthoni szerverlaborhoz.',
      'Asztali eszközök, driveres munka és tesztkörnyezet.',
      'Verziókezelés egyéni és csapatprojektekhez.',
      'Automatizáló szkriptek, eszközök és adat-összekötő feladatok.',
      'Mechanikai összeállítások és gyártási rajzok készítése.',
      'Gyors CAD iterációk és CAM-kompatibilis alkatrészek.',
      '2D rajzok és letisztult mechanikai dokumentáció.',
      'Részletes gépészeti tervezés és összeállítások.',
      'Szemantikus felépítés portfólió- és projektoldalakhoz.',
      'Reszponzív stílusok, animációk és UI finomhangolás.',
      'Felhasználói interakciók és komponensviselkedés.',
      'Build tooling és könnyűsúlyú szolgáltatások.',
      'SPA frontendek ügyféloldali projektekhez.',
      'Könnyűsúlyú API-k és backend szolgáltatások.',
      'Képek tisztítása, kompozitálás és grafikai elemek.',
      'Fotó grading és kötegelt szerkesztés.',
      'Rövid videóvágások és mozgóképes demók készítése.',
    ]);

    const skillTiles = Array.from(document.querySelectorAll('#skills .skill-tile'));
    skillTiles.forEach((tile, index) => {
      if (!Object.prototype.hasOwnProperty.call(tile.dataset, 'enSkill')) {
        tile.dataset.enSkill = tile.getAttribute('data-skill') || '';
      }
      const nextValue = lang === 'hu'
        ? huSkillLabels[index] || tile.dataset.enSkill
        : tile.dataset.enSkill;
      tile.setAttribute('data-skill', nextValue);
    });
  };

  const localizeDataText = (lang, huValues) => {
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      if (!Object.prototype.hasOwnProperty.call(node.dataset, 'enText')) {
        node.dataset.enText = node.textContent;
      }
      const key = node.dataset.i18n;
      node.textContent = lang === 'hu' && huValues[key]
        ? huValues[key]
        : node.dataset.enText;
    });
  };

  const localizeProjectAttributes = (lang, huValues) => {
    document.querySelectorAll('[data-i18n-alt]').forEach((node) => {
      if (!Object.prototype.hasOwnProperty.call(node.dataset, 'enAlt')) {
        node.dataset.enAlt = node.getAttribute('alt') || '';
      }
      const key = node.dataset.i18nAlt;
      node.setAttribute('alt', lang === 'hu' && huValues.alts[key]
        ? huValues.alts[key]
        : node.dataset.enAlt);
    });

    document.querySelectorAll('[data-i18n-src]').forEach((node) => {
      if (!Object.prototype.hasOwnProperty.call(node.dataset, 'enSrc')) {
        node.dataset.enSrc = node.getAttribute('src') || '';
      }
      const key = node.dataset.i18nSrc;
      node.setAttribute('src', lang === 'hu' && huValues.sources[key]
        ? huValues.sources[key]
        : node.dataset.enSrc);
    });

    const titleNode = document.querySelector('title');
    if (titleNode) {
      if (!Object.prototype.hasOwnProperty.call(titleNode.dataset, 'enText')) {
        titleNode.dataset.enText = titleNode.textContent;
      }
      titleNode.textContent = lang === 'hu' ? huValues.pageTitle : titleNode.dataset.enText;
    }

    const localizeMeta = (selector, huContent) => {
      document.querySelectorAll(selector).forEach((node) => {
        if (!Object.prototype.hasOwnProperty.call(node.dataset, 'enContent')) {
          node.dataset.enContent = node.getAttribute('content') || '';
        }
        node.setAttribute('content', lang === 'hu' ? huContent : node.dataset.enContent);
      });
    };

    localizeMeta('meta[property="og:title"]', huValues.pageTitle);
    localizeMeta('meta[name="description"], meta[property="og:description"]', huValues.description);
  };

  const applyProjectPageTranslations = (lang) => {
    const page = window.location.pathname.split('/').pop() || '';

    if (page === 'vanoor.html') {
      localizeDataText(lang, {
        title: 'Vanoor - Apple Watch-központú futóalkalmazás',
        lead: 'Letisztult, prémium futóalkalmazás, amely az Apple Workout egyszerűségét GPX-navigációval, konfigurálható futóképernyőkkel, strukturált intervallumokkal és versenytempó-tervezéssel ötvözi.',
        problemTitle: 'Probléma',
        problem: 'Az Apple Watch képességei alapján kiváló futóóra lehetne, de a GPX-útvonalkövetést, strukturált intervallumokat, személyre szabható mérőszámokat vagy versenytempó-tervezést igénylő futóknak gyakran választaniuk kell az Apple egyszerű felülete és a zsúfolt, haladó felhasználóknak szánt külső alkalmazások között. Az élmény útvonalkezelőkre, edzésszerkesztőkre, aktivitáselőzményekre és exportáló eszközökre töredezik.',
        goalTitle: 'Cél',
        goal: 'Megépíteni azt a futóalkalmazást, amelyet akár az Apple is kiadhatott volna: fókuszált, megbízható, HealthKit-natív és tudatosan közösségi funkcióktól mentes. Segítse a futót az edzés előkészítésében és pontos végrehajtásában fiókok, hírfolyamok, felesleges coachingzaj és előfizetés-központú működés nélkül.',
        approachTitle: 'Megközelítés és funkciók',
        feature1Title: 'Tervezés iPhone-on, végrehajtás az órán',
        feature1: 'Az iPhone-alkalmazás kezeli az importált GPX-útvonalakat és a strukturált edzéseket. A munka-, pihenő- és ismétlődő blokkok távolság- vagy időalapúak lehetnek, tempó-, pulzuszóna- vagy pulzustartomány-céllal, majd fókuszált végrehajtásra szinkronizálhatók az Apple Watchra.',
        feature2Title: 'Útvonalvezetés zsúfolt műszerfal nélkül',
        feature2: 'Az óra térképe az Apple Maps fölött jeleníti meg a GPX-előrehaladást, az aktuális pozíciót és a hátralévő útvonalat. A követő mód a kézi böngészés után visszaközpontosít, az offline OSM-lehetőség pedig telefon nélküli és terepfutásra készül.',
        feature3Title: 'Tempótartás, jelzések és natív aktivitáselőzmények',
        feature3: 'A szakaszmotor automatikusan lépteti a célokat, mutatja a hátralévő távolságot vagy időt, és haptikus jelzéseket ad az átmenetekhez, valamint a beállítható tempó-, pulzus- és távolsághatárokhoz. A befejezett edzések GPS-útvonallal együtt kerülnek az Apple Healthbe, natív grafikonokon elemezhetők, továbbá FIT- és GPX-formátumban exportálhatók.',
        architectureTitle: 'Architekturális döntések',
        architecture: 'A megosztott Swift tartománymodellek egységesen kezelik az útvonalakat, edzésstruktúrákat, tempólogikát, beállításokat és adatátviteli burkolókat az iPhone és az Apple Watch között. A WatchConnectivity strukturált, ellenőrzőösszeggel védett adatot továbbít; az óra csak a végrehajtási határon bontja ki az ismétlődő blokkokat. Az edzésrögzítést a HealthKit végzi, a CloudKit egy offline-központú helyi útvonaltárat egészít ki, a SwiftUI, MapKit, Swift Charts, StoreKit és a natív haptika pedig az Apple platform megbízhatósági modelljéhez közel tartja a rendszert.',
        challengesTitle: 'Mérnöki kihívások',
        challenges: 'A legnehezebb munka a rendszerhatárokon jelentkezik: az útvonal-előrehaladás megőrzése körpályákon és önkereszteződéseknél, a háttérben futó GPS helyreállítása lezárt képernyő és átmeneti hibák mellett, olvasható vezérlők kialakítása az óra kis felületén, szerkeszthető hierarchikus edzések eszközök közötti szinkronizálása, valamint offline térképcsempék kezelése szolgáltatói és tárhelykorlátok között. Az útvonal-, szakasz-, kódoló- és összeolvasztási logika tiszta egységtesztelhető rétegben él; a HealthKit- és helyfüggő működéshez továbbra is valódi hardveres ellenőrzés szükséges.',
        resultTitle: 'Eredmény és jelenlegi állapot',
        result: 'Felix a natív iPhone- és Apple Watch-terméket végponttól végpontig építi és mérnököli. A jelenlegi alkalmazás útvonalimportot és -szinkront, ismétlődő blokkokat is kezelő strukturált edzéseket, élő térképet és tempótartást, HealthKit-rögzítést és előzményeket, FIT/GPX-exportot, konfigurálható képernyőket, jelzéseket és offline-központú útvonaltárat tartalmaz. A hátralévő kiadási munka konkrét: a valódi eszközös tesztmátrix lezárása, a hosszú háttérfutások és hardverfüggő mérőszámok ellenőrzése, valamint az éles szolgáltatások konfigurációjának befejezése.',
        linkTitle: 'Nyilvános hivatkozás',
        linkIntro: 'Termékoldal:',
      });
      localizeProjectAttributes(lang, {
        pageTitle: 'Vanoor - Apple Watch-központú futóalkalmazás',
        description: 'Vanoor: letisztult, Apple Watch-központú futóalkalmazás GPX-navigációval, strukturált edzésekkel, tempótartással, HealthKittel és offline-központú útvonalkezeléssel.',
        alts: {
          heroAlt: 'A Vanoor útvonalkövető térképe élő pozícióval és teljesített útvonallal',
          workoutAlt: 'A Vanoor strukturált edzésszerkesztője iPhone-on',
          mapAlt: 'A Vanoor Apple Watch-os útvonaltérképe',
          pacerAlt: 'A Vanoor élő tempócél-képernyője Apple Watchon',
        },
        sources: {},
      });
      return;
    }

    if (page === 'cheerlify.html') {
      localizeDataText(lang, {
        title: 'Cheerlify - Privát versenynapi támogatás',
        lead: 'Privát platform bármilyen GPX-útvonalhoz, ahol a barátok élőben követik a futót, és olyan hang- vagy videóbuzdításokat küldenek, amelyek verseny közben a futó fülhallgatójában szólalnak meg.',
        problemTitle: 'Probléma',
        problem: 'A versenykövetés általában egy mozgó ponttá egyszerűsíti a futót, és gyakran hivatalos eseményhez vagy egy adott ökoszisztémához kötött. A család és a barátok láthatják, hol jár, de ezt a láthatóságot nem tudják valódi támogatássá alakítani abban a nehéz pillanatban, amikor arra a legnagyobb szükség van.',
        goalTitle: 'Cél',
        goal: 'A távol lévő támogatók is érezzék úgy, hogy jelen vannak a versenyen. A futó bármilyen GPX-útvonalat használhasson, csak a saját embereit hívja meg, és futás közben valódi hangokat halljon. A támogatóknak ne kelljen alkalmazás vagy fiók: elég legyen egy privát link, egy belépőkód és egy megjelenítendő név.',
        approachTitle: 'Megközelítés és funkciók',
        feature1Title: 'Privát esemény bármilyen útvonal köré',
        feature1: 'A futó GPX-fájlból eseményt hoz létre, majd védett versenylinket és kódot oszt meg. A mobilalkalmazás a háttérben rögzíti a helyzetét, a böngészős irányítópult pedig az útvonalra vetítve, élőben mutatja az előrehaladást a meghívott követőknek.',
        feature2Title: 'Kontextusban célba érő buzdítások',
        feature2: 'A követők a weben hang- vagy videóüzenetet rögzíthetnek. A buzdítás útvonaltávolság, idő vagy kézi indítás alapján szólalhat meg a futó fülhallgatójában, az aktív edzéshez igazított hangkezeléssel.',
        brandCaption: 'A szeretteid veled vannak, amikor nehézzé válik a verseny.',
        feature3Title: 'Emlék a célba érés után',
        feature3: 'Az esemény után a termék az útvonalból, a versenystatisztikákból és a beérkezett buzdításokból összefoglalót készíthet. Így a rendszer az emberi pillanatokra összpontosít, nem egy újabb nyilvános fitneszhírfolyam építésére.',
        architectureTitle: 'Architekturális döntések',
        architecture: 'A Cheerlify monorepóban készül: a futó alkalmazása Expo és React Native alapú, a követői élmény Vite, React és TypeScript technológiát használ, a REST backendet Django adja, a kliensek pedig közös TypeScript tartománycsomagon osztoznak. Az API mértékegységei a tartományhatáron egységesek, a követői munkamenetek pedig tudatosan névtelenek maradnak. A telepített stack Docker Compose-zal, Cloudflare mögött fut; az eseményhozzáférés privát, a fizetési képesség pedig elkülönül az ingyenes követési rétegtől.',
        challengesTitle: 'Mérnöki kihívások',
        challenges: 'A termék egyesíti a háttér-GPS-t, a valós idejű helyzetküldést, az útvonalra vetítést, a privát hozzáférést, a böngészős médiarögzítést, a feltöltéseket, az időzített lejátszást, a háttérhangot és a fizetéseket. A megbízhatóság fontosabb az újdonságnál: a későn vagy egyáltalán nem kézbesített buzdítás elveszíti érzelmi célját. A biztonsági munka konzervatív éles alapbeállításokat, titkosított integrációs tokeneket, kéréskorlátozást és egyértelmű fizetési tartalékágakat foglal magában, miközben a hosszú, valódi futások eszközös ellenőrzése továbbra is fontos kiadási feltétel.',
        resultTitle: 'Eredmény és jelenlegi állapot',
        result: 'Felix a teljes termék építője és mérnöke. A jelenlegi megvalósítás mobil-, webes és backend szolgáltatásokon át lefedi az élő követést, a hang- és videóbuzdításokat, az eseménycsomagokat és fizetéseket, a meghívók megosztását, valamint az összefoglalók alapjait. A rendszer ellenőrzött tesztelésre online elérhető; az MVP fő nyitott feladata a valódi futás közbeni háttérműködés validálása és a bevezetési üzemeltetés, ezért a portfólió aktívan épülő termékként mutatja be, ellenőrizetlen használati vagy teljesítménymutatók állítása nélkül.',
        linkTitle: 'Projektlink',
        linkIntro: 'Termékoldal:',
        accessNote: 'Az ellenőrzött tesztidőszakban Cloudflare Access védi.',
      });
      localizeProjectAttributes(lang, {
        pageTitle: 'Cheerlify - Privát versenynapi támogatás',
        description: 'Cheerlify: privát élő versenykövetés bármilyen GPX-útvonalhoz, a futóhoz verseny közben eljutó hang- és videóbuzdításokkal.',
        alts: {
          heroAlt: 'A Cheerlify helyjelölőt és hanghullámot ábrázoló logója',
          flowAlt: 'A Cheerlify versenynapi folyamata a GPX-eseménytől a privát linken és élő követésen át a buzdításokig és az összefoglalóig',
          brandAlt: 'A Cheerlify márkajele',
          recapAlt: 'A Cheerlify termékfolyamata a verseny utáni összefoglalóig',
        },
        sources: {
          flowImage: '../assets/img/cheerlify/flow-hu.svg',
        },
      });
      return;
    }

    if (page === 'custom-sim-racing-pedals.html') {
      localizeTextList('.project-hero-body h1', lang, ['Egyedi Sim Racing pedálszett - ME1']);
      localizeTextList('.project-hero-body .section-lead', lang, [
        'CNC-vel gyártott pedálszett, amely hardvert, szenzorikát és beágyazott vezérlést kombinál szimulátoros használathoz.',
      ]);
      localizeTextList('.project-hero-body .pill', lang, ['Gépészeti tervezés', 'Hardver', 'Szimulátor']);
      localizeTextList('.project-row > p', lang, [
        'A sim racing hardverek drágák, a terhelésmérő cellás pedálrendszerek pedig messze a költségkeretemen kívül estek. A kívánt pontosság és valósághű érzet miatt saját szett tervezése és megépítése mellett döntöttem.',
        'Egy költséghatékony, nagy teljesítményű pedálszett tervezése és építése valósághű visszajelzéssel, tartóssággal és hosszú távú szervizelhetőséggel.',
        'A mechanikai alkatrészek szinte teljesen elkészültek, néhány kisebb esztergált elem van még hátra. Az elektronika fejlesztése, főként a NYÁK, a végső mechanikai összeállítás után indul. A firmware és a szoftver ezután következik.',
      ]);
      localizeTextList('.project-feature__text h4', lang, [
        'Kezdeti koncepció',
        'Dugattyútámasz iteráció',
        'Forgástengely és szenzorika',
        'Állítható végállások',
        'Fék összeállítás',
        'Végső összeállítás',
      ]);
      localizeTextList('.project-feature__text p', lang, [
        'A munka kutatással és követelménymeghatározással indult. A legtöbb kereskedelmi pedál hajlított lemezre épül, de a CNC-megmunkált kivitel nagyobb merevséget, pontosságot és karakteres megjelenést ad.',
        'A szenzorválasztás meghatározta a mechanikai kialakítást. A fék terhelésmérő cellát használ erőalapú mérésre, ami valósághűbb érzetet ad a potenciométeres megoldásoknál. A gáz és a kuplung Hall-effektusos szenzorral, érintkezésmentesen méri a pozíciót.',
        'A korai iterációk egy karakteres, jól felismerhető formát és az alap csomagolást alakították ki.',
        'Egy korai koncepció villás dugattyútámaszt használt. A pedál útja közben a dugattyútengely változik, ezért forgás kellene, amit a fix villa nem tudott lekövetni. Az ebből adódó hajlítónyomaték hosszú távú kifáradási kockázatot is jelentett.',
        'A gömbcsuklós rögzítés gyárthatósági szempontból is nehéz volt. A kétoldali támaszt egy egyoldali, aszimmetrikus karral váltottam ki, és egyedi villáscsapot terveztem axiális menetes zsákfurattal. Így a csap feszesebben rögzíthető, kisebb holtjátékkal és egyenletesebb terheléselosztással.',
        'A pedálkarok forgástengelye is módosult. A csapágyak már nem a karba, hanem az oldallemezekbe kerültek. A karhoz rögzített merev tengelyt hernyócsavar fixálja szűk tűréssel. A tengelyirányú biztosítást egyik oldalon a villáscsap feje, másikon Seeger gyűrű adja.',
        'A gáz és kuplung forgását Hall-effektusos szenzor méri. A tengelyfejbe diagonálisan mágnesezett neodímium mágnes került. Az AS5600 szenzor egy kis 3D nyomtatott házban, kb. 1 mm légrésre helyezkedik el a pontos mérésért.',
        'A végállás kialakítása is fókuszterület volt. A pedálkar meghatározott kezdő és vég felületeket kapott, az oldallemezek pedig több rögzítési pontot az egyszerű állíthatóságért. A kezdő végállás két, a végső végállás öt pozícióban állítható.',
        'Kezdő és végpozíciók:',
        'Az iterációk eredményeként egy masszív, állítható mechanikai platform készült el, amely alább látható.',
      ]);
      return;
    }

    if (page === 'buttonbox.html') {
      localizeTextList('.project-hero-body h1', lang, ['Egyedi Sim Racing Button Box']);
      localizeTextList('.project-hero-body .section-lead', lang, [
        'Az első teljes körű NYÁK-tervem a kapcsolási rajztól a huzalozásig.',
      ]);
      localizeTextList('.project-hero-body .pill', lang, ['Hardver', 'NYÁK-tervezés', 'KiCad']);
      localizeTextList('.project-row > p', lang, [
        'A button boxok kulcsfontosságú perifériák a sim racing világában, gyorsabb vezérlést és nagyobb élményt adnak. A réspiac és az alacsony darabszám miatt kevés a jó, kész megoldás. Ez motivált egy saját egység tervezésére és építésére.',
        'Egy megbízható, jól konfigurálható button box megvalósítása, a saját setupomhoz igazítva.',
        'Egy kész, gyártásra előkészített button box NYÁK-terv.',
      ]);
      localizeTextList('.project-feature__text h4', lang, [
        'A point-to-point korszak',
        'Kapcsolási rajz tervezés',
        'NYÁK huzalozás',
        'Végleges terv',
      ]);
      localizeTextList('.project-feature__text p', lang, [
        'A kezdeti koncepció diszkrét gombokat és Arduino Pro Micro vezérlőt használt a natív HID támogatás miatt. A korlátozott I/O miatt azonban gombmátrix kellett, a vezetékezés pedig túl időigényes lett. Minden kapcsolót és enkódert külön kellett forrasztani, diódás leválasztással a ghosting ellen, ezért a prototípus az összeszerelés előtt megállt.',
        'Ekkor döntöttem dedikált NYÁK mellett. Egyetemi projektekből már volt alap KiCad tapasztalatom, ezért ez kézenfekvő választás volt a kapcsolási rajzhoz és layouthoz.',
        'Az első döntés az MCU volt. A Raspberry RP2040-et választottam az ökoszisztéma és a fejleszthetőség miatt. Mivel a gyártás JLCPCB-vel volt tervezve, az alkatrészválasztás és footprint ellenőrzés már az elején megtörtént, majd jött a rajztervezés.',
        'A kapcsolási rajz építése volt a legnagyobb tanulási szakasz. Az alkatrészkorlátok és helyes bekötések megértése iterációt igényelt, de végül stabil rendszer állt össze.',
        'A huzalozás a második nagy kihívás volt. Több újratervezés és best practice ellenőrzés után alakult ki a stabil layout. A gombonkénti és enkóderenkénti LED terv jelentősen növelte a komplexitást, és nem volt formális design review lehetőségem. A végső terv a validálható legjobb gyakorlatokat és korlátokat tükrözi.',
        'A végleges terv 3D renderje alább látható. A következő lépés a gyártás. A nyitott kérdés az, hogy szerelt NYÁK készüljön, vagy üres panel kézi beültetéssel.',
      ]);
      return;
    }

    if (page === 'iot-device-hub.html') {
      localizeTextList('.project-hero-body h1', lang, ['Otthoni IoT menedzsment rendszer - MPTRhome']);
      localizeTextList('.project-hero-body .section-lead', lang, [
        'Moduláris otthoni IoT menedzsment rendszer, amely különböző okoseszközöket egyetlen vezérelhető platformba fog össze.',
      ]);
      localizeTextList('.project-row > p', lang, [
        'A legtöbb otthonautomatizálási ökoszisztéma széttagolt: eltérő protokollok, zárt rendszerek, felhőfüggőség és korlátozott testreszabhatóság. A Zigbee, Wi-Fi és egyedi IoT eszközök egységes kezelése gyakran több eszközt és bonyolult konfigurációt igényel, ami nehezen fenntartható.',
        'A cél egy központosított IoT menedzsment rendszer tervezése volt, amely képes különféle eszközök felderítésére, regisztrálására, monitorozására és vezérlésére egységes felületen, skálázhatóan, protokollfüggetlenül és egyedi hardverekhez is alkalmasan.',
        'A rendszer folyamatosan frissül, új funkciók kerülnek be felhasználói visszajelzések és technológiai fejlődés alapján. Az első telepítés már élesben fut, és valós használatban ad értékes eredményeket.',
      ]);
      localizeTextList('.project-row .reveal h3', lang, [
        'Vezérlőpult',
        'Eszközök oldal',
        'Eszközbeállítások',
        'Automatizálások',
        'Rendszerbeállítások',
        'Napló',
      ]);
      localizeTextList('.project-row .reveal h4', lang, [
        'Eszközlista',
        'Új eszköz hozzáadása',
        'Hozzáadás utáni konfiguráció',
        'Eszközoldal',
        'Adatvizualizáció',
        'Haladó beállítások',
        'Kapcsolódó entitások',
        'Eszköz törlése',
        'Trigger definíció',
        'Akció definíció',
        'Kézi automatizálások',
        'Automatizálásaim',
        'Szoba beállítások, metrika tárolás és tagek',
        'Felhasználókezelés, riasztási beállítások',
        'MQTT beállítások',
        'Egyedi widgetek',
      ]);
      localizeTextList('.project-row .reveal p', lang, [
        'A fő vezérlőpult gyors áttekintést ad a teljes okosotthon hálózatról. Összefoglalja a fontos eszközállapotokat, aktív jeleneteket és legutóbbi eseményeket, központi kiindulópontot adva a monitorozáshoz és vezérléshez. A felhasználó gyorsan felmérheti az otthon állapotát, majd részletes oldalakra léphet. Láthatók a szobák és a hozzájuk rendelt eszközkártyák, valamint egyedi gyorsműveletek is elhelyezhetők.',
        'Az eszközök oldal minden csatlakoztatott hardvert listáz, protokolltól függetlenül. Innen indítható az új eszközök felderítése és hozzáadása.',
        'Ez a nézet mutatja az összes eszközt, azok állapotát és a hozzárendelt szobákat. Központi hely az összes hardver kezelésére.',
        'Új eszközök itt vehetők fel az adatbázisba. A Permit join engedi a Zigbee eszközök felderítését a Zigbee2MQTT motoron keresztül, a keresés pedig elindítja a hálózati szkennelést. A felhasználó ezután kiválaszthatja a megtalált eszközt.',
        'A hozzáadott eszköz megjelenik a konfigurációs panelen, ahol nevet és szobát kaphat. Ha a rendszer tévesen azonosította az eszköztípust, itt javítható.',
        'Minden eszköz saját oldalt kap, ahol az összes vezérelhető entitás (kapcsolók, szenzorok, lámpák) elérhető. Valós idejű interakció lehetséges, a felső sorban a legfontosabb, felhasználó által kiválasztott adatokkal.',
        'Az idősoros adatot küldő eszközöknél a rendszer automatikusan történeti grafikonokat készít. Több nézet is elérhető: valós idő, utolsó óra, év és egyedi tartományok.',
        'Minden eszközhöz külön beállítási panel tartozik finomhangoláshoz: név, terület, entitásinformációk. Az ábrázolandó adatok és riasztások kiválasztása is egyszerű, a riasztási logika testreszabható.',
        'Itt további haladó opciók érhetők el az eszköz által kínált entitások alapján.',
        'Ez a nézet az adott hardverhez tartozó összes egyedi szenzort és vezérlőt mutatja, részletes funkcionális képpel.',
        'Megerősítő lépés védi a rendszert a véletlen törléstől. A rendszer figyelmeztet a hivatkozott automatizálásokra, majd dönthető, hogy ezek is törlődjenek vagy később szerkesztve megmaradjanak.',
        'Az automatizálási motor eseményvezérelt folyamatok létrehozását teszi lehetővé. Szabályok definiálhatók eszköztrigger, időzítés vagy rendszeresemény alapján. A felület támogatja a létrehozást, szerkesztést, duplikálást és gyors elérést.',
        'Az automatizálásoknál részletesen megadhatók triggerek, feltételek és akciók. OR/AND logika is használható, trigger lehet időalapú vagy eszközesemény.',
        'A triggerhez rendelt akciók itt állíthatók be, több független akcióval.',
        'Létrehozhatók kézi indítású automatizálások is. Ezek gyorsgombra köthetők, így egy kattintással futtathatók.',
        'Itt láthatók, szerkeszthetők, ki- és bekapcsolhatók, illetve törölhetők az aktív automatizálások.',
        'A beállítások rész átfogó kontrollt ad az MPTRhome példány felett: rendszerkonfiguráció, integrációk, felhasználók és rendszerállapot egy helyen.',
        'Központi navigáció a rendszer szintű beállításokhoz: szobák kezelése, metrika naplózás és egyedi tagek létrehozása.',
        'Felhasználók hozzáadása, törlése, szerkesztése és jogosultságkezelése. A riasztási beállításoknál SMTP, app jelszó és küldési címek is konfigurálhatók.',
        'Az MQTT szerverkapcsolat itt állítható be. Beépített debug panel segíti az üzenetek valós idejű monitorozását és hibakeresését.',
        'Innen adhatók hozzá további dashboard widgetek: grafikonok, műszerek, időjárás, energia és vezérlő elemek. A widgetkínálat folyamatosan bővül.',
        'A napló minden rendszereseményt időbélyeggel rögzít. Hibakereséshez, viselkedéselemzéshez és audithoz kulcsfontosságú, szűrhető eseménylistával.',
      ]);
      return;
    }

    if (page === 'network.html') {
      localizeTextList('.project-hero-body h1', lang, ['Otthoni hálózat és szerver stack']);
      localizeTextList('.project-hero-body .section-lead', lang, [
        'Helyi, megbízható és skálázható infrastruktúra, amely stabil alapot ad az okosotthon automatizálásnak és lab projekteknek.',
      ]);
      localizeTextList('.project-hero-body .pill', lang, ['Hálózat', 'HomeLab', 'Infrastruktúra']);
      localizeTextList('.project-row > p', lang, [
        'Az otthoni eszközök külön alkalmazások és protokollok között voltak szétszórva. A felhőfüggőség, pontatlan automatizálási időzítés és gyenge megfigyelhetőség törékennyé tette a rendszert. Központosított, helyi gerinc nélkül nehéz volt stabil és bővíthető automatizálásokat építeni.',
        'A cél egy olyan otthoni stack volt, ahol a szolgáltatások izoláltan futnak, minden eszköz helyben vezérelhető, a távoli elérés pedig biztonságos. A megbízhatóság, adatkontroll és az egységes vezérlési sík alapkövetelmény volt.',
        'A rendszer alapja a Proxmox VE, amely virtualizációs réteget ad az elkülönített és könnyen visszaállítható szolgáltatásokhoz. A router kezeli a forgalmat és belső szegmenseket, a szerver pedig dedikált VM-eket és konténereket futtat.',
        'Szolgáltatások és szerepük:',
        'A Bambu Lab nyomtató, valamint a Hue, IKEA és Sonoff ökoszisztémák egyetlen vezérlési sík alatt futnak, így az állapot és automatizálási logika egységesen kezelhető.',
        'Egy stabil, jól karbantartható és jövőálló otthoni infrastruktúra jött létre, ahol a külön szolgáltatások egy rendszerként működnek. Napi szinten megbízható okosotthon működést ad, és fejlesztési-hobbi projektekhez is erős alapot biztosít.',
      ]);
      localizeHtmlList('.service-list li', lang, [
        '<strong>Proxmox VE</strong> - hypervisor, amely szétválasztja a VM-eket és snapshotokkal gyors helyreállítást tesz lehetővé.',
        '<strong>Home Assistant</strong> - az automatizálási központ Hue, IKEA, Sonoff és más eszközökhöz.',
        '<strong>Zigbee2MQTT</strong> - stabil helyi kommunikációs motor Zigbee eszközökhöz, felhőfüggőség nélkül.',
        '<strong>TrueNAS</strong> - fájlmegosztás, mentések és központi adattárolás projektekhez és médiához.',
        '<strong>Vaultwarden</strong> - hitelesítő adatok és belső titkok biztonságos tárolása.',
        '<strong>Tailscale</strong> - biztonságos távoli elérés titkosított alagutakon keresztül.',
        '<strong>Plex</strong> - saját média streamelése különböző eszközökre.',
        '<strong>RustDesk</strong> - távoli asztali elérés a hálózaton belüli gépekhez.',
        '<strong>Pi-hole</strong> - hálózatszintű reklámszűrés és DNS-szűrés.',
        '<strong>Nginx Proxy Manager</strong> - reverse proxy és SSL kezelés, valamint helyi DNS rekordok a szolgáltatások egyszerű eléréséhez a machan.hu aldomainjein.',
      ]);
      return;
    }

    if (page === 'talppont.html') {
      localizeTextList('.project-hero-body h1', lang, ['MasszĂˇzsszalon weboldal - Talppont']);
      localizeTextList('.project-hero-body .section-lead', lang, [
        'Statikus weboldal a vĂˇci Talppont szĂˇmĂˇra, nyugodt, vonzĂł megjelenĂ©sre fĂłkuszĂˇlva.',
      ]);
      localizeTextList('.project-hero-body .pill', lang, ['Webdesign', 'Statikus oldal', 'UI/UX']);
      localizeTextList('.project-row > p', lang, [
        'Egy kĂ¶zeli barĂˇtom Ă©desanyja egyszerĹ± Ă©s nyugodt hangulatĂş weboldalt szeretett volna a masszĂˇzsszalonjĂˇhoz. Tudta, hogy webfejlesztĂ©ssel foglalkozom, ezĂ©rt engem kĂ©rt fel. Ez lett a vĂ©geredmĂ©ny.',
        'Egy olyan weboldal tervezĂ©se Ă©s fejlesztĂ©se volt a cĂ©l, ahol gyorsan elĂ©rhetĹ‘k a legfontosabb informĂˇciĂłk a szalonrĂłl Ă©s szolgĂˇltatĂˇsairĂłl, pĂ©ldĂˇul a kezelĂ©stĂ­pusok Ă©s Ăˇrak.',
        'A mĂˇrka fĹ‘ szĂ­nei a kirĂˇlykĂ©k Ă©s a vilĂˇgoskĂ©k, ezĂ©rt a designt ezek kĂ¶rĂ© Ă©pĂ­tettem. Nyugodt hangulatot akartam teremteni szĂ­nekkel, tipogrĂˇfiĂˇval Ă©s kĂ©pekkel, sok whitespace hasznĂˇlatĂˇval, hogy a tartalom kĂ¶nnyen befogadhatĂł legyen.',
      ]);
      return;
    }

    if (page === 'pacerra.html') {
      localizeTextList('.project-hero-body h1', lang, ['Pacerra - MI Allokepessegi Edzo']);
      localizeTextList('.project-hero-body .section-lead', lang, [
        'MI-alapu allokepessegi coaching alkalmazas futoknak, kerekparosoknak, uszoknak es triatlonistaknak, Strava-adatokra epitve.',
      ]);
      localizeTextList('.project-hero-body .pill', lang, ['Szoftverfejlesztes', 'MI coaching', 'Strava integracio']);

      localizeTextList('.project-row:nth-of-type(1) > p', lang, [
        'Az allokepessegi sportolok gyakran kulon eszkozben kovetik az edzeseket, kulon feluleten elemzik a trendeket, es mashol terveznek. Ez a szettagoltsag megneheziti a konzisztens, kontextusalapu donteshozatalt hetrol hetre.',
      ]);
      localizeTextList('.project-row:nth-of-type(2) > p', lang, [
        'A cel egy egyseges coaching folyamat letrehozasa volt, ahol a Strava adatok, a heti tervezes es az MI-visszajelzes osszekapcsolodik, igy a nyers aktivitasokbol gyorsan egyertelmu edzesdontesek szulethetnek.',
      ]);
      localizeTextList('.project-row:nth-of-type(4) > p', lang, [
        'Az alkalmazas jelenleg elesben fut: Strava szinkron, heti tervgeneralas es edzesenkenti MI-visszajelzes elerheto. A fejlesztes fokusza a coaching minosegenek es a finomhangolasi lehetosegek tovabbi bovitese.',
      ]);
      localizeHtmlList('.project-row:nth-of-type(5) > p', lang, [
        'Nyilvanos oldal: <a href="https://pacerra.hu/" target="_blank" rel="noopener noreferrer">pacerra.hu</a>',
      ]);

      localizeTextList('.project-feature__text h4', lang, [
        'Dashboard attekintes', 'Heti terv nezet', 'Edzeslista es elozmenyek', 'Reszletes edzesoldal', 'Celbeallitasi folyamat',
        'MI reakcio kimenet', 'Coach chat interakcio', 'Strava kapcsolati allapot', 'Adatszinkron vezerlok', 'Tervpreferenciak',
        'Beallitasok es szemelyre szabas', 'Edzesattekintes bovitett nezet', 'Teljes coaching folyamat',
      ]);

      localizeTextList('.project-feature__text p', lang, [
        'A dashboard azonnali kepet ad az aktualis edzesallapotrol, igy a felhasznalo gyorsan latja, hol tart a heti ciklusban.',
        'A heti tervezes az atlathatosagra epul: kulcsedzesek, konnyebb napok es progresszio egy osszefuggo nezetben jelenik meg.',
        'Az aktivitaslista gyors attekintest ad az elmult edzesekrol, ezzel tamogatja a trendek koveteset es a folyamatossagot.',
        'Minden edzesoldal gyakorlati reszleteket es kontextust ad, igy a vegrehajtas es az utolagos ertekeles ugyanazon feluleten tortenik.',
        'A celmegadas eredmenyorientaltta teszi a tervezest, es a heti ajanlasokat konkret verseny- vagy teljesitmenycelokhoz koti.',
        'Az edzesenkenti MI-visszajelzes a kozelmult terhelesi kontextusat rovid, azonnal hasznalhato javaslatokka alakitja.',
        'A coach chat beszelgeteses reteget ad a strukturalt tervezes melle, gyors ertelmezest es kovetkezo lepes tamogatast nyujtva.',
        'Az integracios nezetek egyertelmuen mutatjak a kapcsolat es szinkron allapotat, csokkentve a bizonytalansagot az adatforrasok korul.',
        'A felhasznalo indithat es ellenorizhet frissiteseket, igy a coaching kimenetek mindig a legfrissebb aktivitasokra es streamekre tamaszkodnak.',
        'A preferenciak finomhangolasaval a rendszer jobban illeszkedik az edzesritmushoz es a tervezesi szokasokhoz.',
        'A szemelyre szabasi beallitasok rugalmasabba teszik a hasznalatot ugy, hogy kozben a napi felulet egyszeru marad.',
        'Ez a nezet melyebb trendlathatosagot ad a keszenleti allapot, konzisztencia es fejlodesi irany gyors felmeresehez.',
        'A kepernyok egyutt egy teljes lancot mutatnak: adatingesziotol a tervezesen at az MI-coaching visszajelzesig, egy osszekapcsolt rendszerben.',
      ]);
      localizeTextList('.project-row:nth-of-type(5) > h2', lang, ['Hivatkozas']);
      return;
    }
  };

  const applyProjectSharedTranslations = (lang) => {
    const isHu = lang === 'hu';
    const backLabel = isHu ? 'Vissza a projektekhez' : 'Back to Projects';
    const checkProjectLabel = isHu ? 'Projekt megnyitása' : 'Check project';
    const pairs = [
      ['Problem', 'Probléma'],
      ['Goal', 'Cél'],
      ['Approach', 'Megközelítés'],
      ['Result', 'Eredmény'],
      ['Current state', 'Jelenlegi állapot'],
      ['Final Assembly – Interactive 3D', 'Végső összeállítás - interaktív 3D'],
      ['Final Assembly - Interactive 3D', 'Végső összeállítás - interaktív 3D'],
    ];

    document.querySelectorAll('.button.secondary[href*="#projects"]').forEach((el) => {
      el.textContent = backLabel;
    });
    document.querySelectorAll('.pill-button').forEach((el) => {
      el.textContent = checkProjectLabel;
    });

    document.querySelectorAll('h2, h3, h4').forEach((el) => {
      const raw = el.textContent ? el.textContent.trim() : '';
      pairs.forEach(([en, hu]) => {
        if (raw === en || raw === hu) {
          el.textContent = isHu ? hu : en;
        }
      });
    });
  };

  const applyTranslations = (lang) => {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === '' || page === 'index.html') {
      applyIndexTranslations(lang);
      applyIndexExtraTranslations(lang);
    } else {
      applyProjectSharedTranslations(lang);
      applyProjectPageTranslations(lang);
    }
    document.dispatchEvent(new CustomEvent('portfolio:languagechange', { detail: { lang } }));
  };

  const initLanguageToggle = () => {
    const root = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    let toggle = document.querySelector('.lang-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'lang-toggle';
      toggle.setAttribute('aria-label', 'Language switch');
      toggle.innerHTML =
        '<span class="lang-toggle__opt" data-lang-option="hu">HU</span><span class="lang-toggle__sep">/</span><span class="lang-toggle__opt" data-lang-option="en">EN</span>';
      themeToggle.insertAdjacentElement('beforebegin', toggle);
    }

    const setActiveOption = (lang) => {
      toggle.querySelectorAll('.lang-toggle__opt').forEach((opt) => {
        const isActive = opt.getAttribute('data-lang-option') === lang;
        opt.classList.toggle('is-active', isActive);
      });
    };

    const applyLanguage = (lang) => {
      const nextLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
      root.setAttribute('lang', nextLang);
      root.setAttribute('data-lang', nextLang);
      localStorage.setItem(LANG_STORAGE_KEY, nextLang);
      setActiveOption(nextLang);
      toggle.setAttribute('aria-label', nextLang === 'hu' ? 'Nyelvváltás' : 'Language switch');
      applyTranslations(nextLang);
    };

    const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
    const initialLang = SUPPORTED_LANGS.includes(storedLang) ? storedLang : 'en';
    applyLanguage(initialLang);

    toggle.addEventListener('click', () => {
      const nextLang = getCurrentLang() === 'hu' ? 'en' : 'hu';
      applyLanguage(nextLang);
    });
  };

  const initThemeToggle = () => {
    const root = document.documentElement;
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const swapThemeImages = (theme) => {
      const themedImages = document.querySelectorAll('[data-light][data-dark]');
      themedImages.forEach((img) => {
        const nextSrc = theme === 'dark' ? img.dataset.dark : img.dataset.light;
        if (nextSrc) {
          img.setAttribute('src', nextSrc);
        }
      });
    };

    const applyTheme = (theme) => {
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      const lang = getCurrentLang();
      const darkLabel = lang === 'hu' ? 'Váltás sötét módra' : 'Switch to dark mode';
      const lightLabel = lang === 'hu' ? 'Váltás világos módra' : 'Switch to light mode';
      toggle.setAttribute('aria-label', theme === 'dark' ? lightLabel : darkLabel);
      swapThemeImages(theme);
    };

    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = stored || 'light';
    applyTheme(initialTheme);
    requestAnimationFrame(() => {
      root.classList.add('theme-ready');
    });

    toggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      applyTheme(nextTheme);
    });

    document.addEventListener('portfolio:languagechange', () => {
      const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(currentTheme);
    });
  };

  const initProgressBar = () => {
    // The bar should only appear on project pages, and only on mobile.
    // CSS handles the mobile-only part. JS just needs to find the element.
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight <= 0) {
        progressBar.style.width = '0%';
        return;
      }
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  };
  initProgressBar(); // Call the function

  const includeTargets = Array.from(document.querySelectorAll('[data-include]'));

  const loadSections = async () => {
    if (includeTargets.length === 0) return;
    const fetches = includeTargets.map(async (target) => {
      const path = target.getAttribute('data-include');
      if (!path) return;
      const response = await fetch(path);
      if (!response.ok) {
        target.innerHTML = `<section class="section"><div class="container"><p>Missing section: ${path}</p></div></section>`;
        return;
      }
      const html = await response.text();
      target.outerHTML = html;
    });
    await Promise.all(fetches);
  };


  const initSectionPager = () => {
    const pager = document.querySelector('.section-pager');
    if (!pager) return;

    const btnUp = pager.querySelector('.section-pager__btn[data-dir="up"]');
    const btnDown = pager.querySelector('.section-pager__btn[data-dir="down"]');
    if (!btnUp || !btnDown) return;

    const sections = Array.from(document.querySelectorAll('main > section[id]'));
    if (sections.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const getCurrentIndex = () => {
      const probeY = window.innerHeight * 0.35;
      let idx = 0;
      for (let i = 0; i < sections.length; i += 1) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= probeY) idx = i;
        else break;
      }
      return idx;
    };

    const updateDisabled = () => {
      const idx = getCurrentIndex();

      btnUp.disabled = idx <= 0;
      btnDown.disabled = idx >= sections.length - 1;

      btnUp.setAttribute('aria-disabled', btnUp.disabled ? 'true' : 'false');
      btnDown.setAttribute('aria-disabled', btnDown.disabled ? 'true' : 'false');
    };

    const scrollToIndex = (idx) => {
      const target = sections[clamp(idx, 0, sections.length - 1)];
      if (!target) return;
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    };

    pager.addEventListener('click', (e) => {
      const btn = e.target.closest('.section-pager__btn');
      if (!btn || btn.disabled) return;

      const dir = btn.dataset.dir;
      const current = getCurrentIndex();
      const next = dir === 'up' ? current - 1 : current + 1;
      scrollToIndex(next);

      // smooth scroll alatt később “érkezik meg”, ezért kis késleltetés:
      window.setTimeout(updateDisabled, prefersReduced ? 0 : 250);
    });

    window.addEventListener('scroll', updateDisabled, { passive: true });
    window.addEventListener('resize', updateDisabled);

    updateDisabled();
  };




  const initScrollSpy = () => {
    const nav = document.querySelector('.side-nav');
    if (!nav) return;

    const items = Array.from(nav.querySelectorAll('.side-nav__item'));
    const progressValue = nav.querySelector('.side-nav__expand .side-nav__progress-value');
    const navArrows = Array.from(nav.querySelectorAll('.side-nav__arrow[data-side-nav-dir]'));
    const sections = items
      .map((item) => document.querySelector(item.getAttribute('href')))
      .filter(Boolean);
    if (items.length === 0) return;

    const setActive = (item) => {
      items.forEach((el) => {
        const isActive = el === item;
        el.classList.toggle('is-active', isActive);
        if (isActive) {
          el.setAttribute('aria-current', 'true');
        } else {
          el.removeAttribute('aria-current');
        }
      });
    };

    items.forEach((item) => {
      item.addEventListener('click', (event) => {
        const targetSelector = item.getAttribute('href');
        if (!targetSelector || !targetSelector.startsWith('#')) return;
        const target = document.querySelector(targetSelector);
        if (!target) return;
        event.preventDefault();
        setActive(item);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const getCurrentIndex = () => {
      if (sections.length === 0) return 0;
      const marker = window.scrollY + window.innerHeight * 0.35;
      let activeIndex = 0;

      sections.forEach((section, index) => {
        if (marker >= section.offsetTop) activeIndex = index;
      });

      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 2) {
        activeIndex = items.length - 1;
      }
      return activeIndex;
    };

    navArrows.forEach((arrow) => {
      arrow.addEventListener('click', (event) => {
        event.preventDefault();
        if (sections.length === 0) return;
        const current = getCurrentIndex();
        const dir = arrow.dataset.sideNavDir;
        const next = dir === 'up'
          ? Math.max(0, current - 1)
          : Math.min(sections.length - 1, current + 1);
        const target = sections[next];
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const updateActiveFromScroll = () => {
      if (sections.length === 0) return;
      const activeIndex = getCurrentIndex();

      const item = items[activeIndex];
      if (item) {
        setActive(item);
      }
    };

    const updateScrollPercent = () => {
      if (!progressValue) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const percent = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      progressValue.textContent = `${percent}%`;
    };

    const handleScroll = () => {
      updateActiveFromScroll();
      updateScrollPercent();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateActiveFromScroll();
      updateScrollPercent();
    });

    requestAnimationFrame(() => {
      if (items[0]) {
        setActive(items[0]);
      }
      handleScroll();
    });

    if (sections.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length === 0) return;
          const index = sections.indexOf(visible[0].target);
          if (index >= 0 && items[index]) {
            setActive(items[index]);
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
      );

      sections.forEach((section) => observer.observe(section));
    }
  };

  const initKnowledgeChart = () => {
    const canvas = document.querySelector('#knowledge-chart');
    if (!canvas) return;

    const section = canvas.closest('section');
    const context = canvas.getContext('2d');
    if (!context) return;

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--color-chart-line').trim();
    const grid = styles.getPropertyValue('--color-chart-grid').trim();
    const axis = styles.getPropertyValue('--color-chart-axis').trim();

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (progress) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const padding = 28;
      const left = padding;
      const bottom = height - padding;
      const right = width - padding;
      const top = padding;

      context.clearRect(0, 0, width, height);
      const gridCount = 6;
      context.lineWidth = 1;
      context.strokeStyle = grid;
      context.beginPath();
      for (let i = 0; i <= gridCount; i += 1) {
        const x = left + ((right - left) / gridCount) * i;
        const y = top + ((bottom - top) / gridCount) * i;
        context.moveTo(x, top);
        context.lineTo(x, bottom);
        context.moveTo(left, y);
        context.lineTo(right, y);
      }
      context.stroke();

      context.lineWidth = 2;
      context.strokeStyle = axis;
      context.beginPath();
      context.moveTo(left, top);
      context.lineTo(left, bottom);
      context.lineTo(right, bottom);
      context.stroke();

      const arrowSize = 6;
      context.beginPath();
      context.moveTo(left, top);
      context.lineTo(left - arrowSize, top + arrowSize);
      context.moveTo(left, top);
      context.lineTo(left + arrowSize, top + arrowSize);
      context.moveTo(right, bottom);
      context.lineTo(right - arrowSize, bottom - arrowSize);
      context.moveTo(right, bottom);
      context.lineTo(right - arrowSize, bottom + arrowSize);
      context.stroke();

      context.lineWidth = 3;
      context.strokeStyle = accent || '#c88e4f';
      context.shadowColor = accent || '#c88e4f';
      context.shadowBlur = 5;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.beginPath();

      const startX = left;
      const endX = right;
      const usableWidth = endX - startX;
      const xMax = startX + usableWidth * progress;

      let first = true;
      for (let x = startX; x <= xMax; x += usableWidth / 80) {
        const t = (x - startX) / usableWidth;
        const y = bottom - (bottom - top) * (t * 0.9);
        if (first) {
          context.moveTo(left, bottom);
          if (x > left) {
            context.lineTo(x, y);
          }
          first = false;
        } else {
          context.lineTo(x, y);
        }
      }
      context.stroke();
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
    };

    let animated = false;
    const animate = () => {
      if (animated) return;
      animated = true;
      const start = performance.now();
      const duration = 1400;

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        draw(progress);
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    };

    resizeCanvas();
    draw(0);

    if (section) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(section);
    } else {
      animate();
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      draw(animated ? 1 : 0);
    });
  };

  const initSkillTiles = () => {
    const tiles = Array.from(document.querySelectorAll('.skill-tile'));
    if (tiles.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateGridReflow = (mutate) => {
      if (prefersReducedMotion) {
        mutate();
        return;
      }

      const first = new Map();
      tiles.forEach((tile) => {
        first.set(tile, tile.getBoundingClientRect());
      });

      mutate();

      tiles.forEach((tile) => {
        const from = first.get(tile);
        const to = tile.getBoundingClientRect();
        if (!from || !to) return;

        const dx = from.left - to.left;
        const dy = from.top - to.top;
        const sx = from.width / to.width;
        const sy = from.height / to.height;

        const moved = Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5;
        const resized = Math.abs(sx - 1) > 0.01 || Math.abs(sy - 1) > 0.01;
        if (!moved && !resized) return;

        tile.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
            { transform: 'translate(0, 0) scale(1, 1)' },
          ],
          {
            duration: 360,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }
        );
      });
    };

    const setExpanded = (targetTile) => {
      animateGridReflow(() => {
        tiles.forEach((tile) => {
          const isExpanded = targetTile === tile;
          tile.classList.toggle('is-expanded', isExpanded);
          tile.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
      });
    };

    const collapseAll = () => {
      const hasExpanded = tiles.some((tile) => tile.classList.contains('is-expanded'));
      if (!hasExpanded) return;
      setExpanded(null);
    };

    tiles.forEach((tile) => {
      tile.setAttribute('aria-expanded', 'false');
      const update = (event) => {
        const rect = tile.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        tile.style.setProperty('--gx', `${x.toFixed(2)}%`);
        tile.style.setProperty('--gy', `${y.toFixed(2)}%`);
      };

      tile.addEventListener('mousemove', update);
      tile.addEventListener('mouseenter', update);
      tile.addEventListener('mouseleave', () => {
        tile.style.removeProperty('--gx');
        tile.style.removeProperty('--gy');
      });

      tile.addEventListener('click', (event) => {
        event.preventDefault();
        const isExpanded = tile.classList.contains('is-expanded');
        setExpanded(isExpanded ? null : tile);
      });

      tile.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          tile.click();
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.skill-tile')) {
        collapseAll();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        collapseAll();
      }
    });
  };

  const initContactFormToggle = () => {
    const toggle = document.querySelector('[data-contact-toggle]');
    const form = document.querySelector('#contact-form');
    if (!toggle || !form) return;

    const setOpen = (isOpen) => {
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        form.removeAttribute('hidden');
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        form.setAttribute('hidden', '');
      }
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
    });
  };

  const initServiceCards = () => {
    const cards = Array.from(document.querySelectorAll('.service-card'));
    if (cards.length === 0) return;

    cards.forEach((card) => {
      const update = (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--gx', `${x.toFixed(2)}%`);
        card.style.setProperty('--gy', `${y.toFixed(2)}%`);
      };

      card.addEventListener('mousemove', update);
      card.addEventListener('mouseenter', update);
      card.addEventListener('mouseleave', () => {
        card.style.removeProperty('--gx');
        card.style.removeProperty('--gy');
      });
    });
  };

  loadSections()
    .then(() => {
      initLanguageToggle();
      initThemeToggle();
      initScrollSpy();
      initSectionPager();
      initKnowledgeChart();
      initSkillTiles();
      initServiceCards();
      initContactFormToggle();
    })
    .catch(() => {
      initLanguageToggle();
      initThemeToggle();
      initScrollSpy();
      initSectionPager();
      initKnowledgeChart();
      initSkillTiles();
      initServiceCards();
      initContactFormToggle();
    });
})();
