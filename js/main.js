(() => {
  const LANG_KEY = "mishpacha_lang";
  const DEFAULT_LANG = "he";

  // ====== External links placeholders (update later) ======
  const LINKS = {
    volunteerForm: "https://docs.google.com/forms/d/e/1FAIpQLSchRPNoUJ1N-da9y4cRWtw9-BwGyEiCJXtfEWVZi1CqAWtgmw/viewform",
    helpForm: "https://docs.google.com/forms/d/1_CTLlOLWDoH1-cZPbiUSurmshkH4EMYeh2i6CpaNB7g/viewform?pli=1&pli=1&pli=1&edit_requested=true",
contactWhatsApp: "https://wa.me/message/IMUVXWXVPB64M1",
contactEmail: "mishporg@gmail.com",
    donatePlatform: "",
    // Social links (placeholders; replace when ready)
    social: {
      facebook: "https://www.facebook.com/mishpahaorg?locale=he_IL",
      instagram: "https://www.instagram.com/org_mishpacha/",
      whatsapp: "https://wa.me/message/IMUVXWXVPB64M1",
      linkedin: "",
      youtube: "https://www.youtube.com/@organizationmishpacha7482",
      x: ""
    }
  };
    // ====== Images mapping ======
  const IMAGES = {
    logo: "assets/img/logo.png",
    hero: "assets/img/logo.png",
    about: "assets/img/about.png",
    story: "assets/img/story.jpg",
    help: "assets/img/vision2.png",
    volunteer : "assets/img/volunteer.png"

  };


  let dictionary = {};
  let currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  async function loadJson(lang) {
    const res = await fetch(`lang/${lang}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load JSON for lang=${lang}`);
    return res.json();
  }

  function setDocDirection(lang) {
    const html = document.documentElement;
    if (lang === "en") {
      html.lang = "en";
      html.dir = "ltr";
    } else {
      html.lang = "he";
      html.dir = "rtl";
    }
  }


function togglePanel(btn, panel) {
  if (!btn || !panel) return;

  const isOpen = !panel.hasAttribute("hidden");
  if (isOpen) {
    panel.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", "false");
  } else {
    panel.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "true");
  }
}




  function getByKey(obj, dottedKey) {
    return dottedKey
      .split(".")
      .reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
  }

  function applyText() {
    document.title = dictionary?.meta?.title || "Mishpacha";
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getByKey(dictionary, key);
      if (typeof value === "string") el.textContent = value;
    });
  }

  function setSafeInnerText(el, text) {
    el.textContent = typeof text === "string" ? text : "";
  }

function getIconSvg(name) {
  // Thin-line inline SVG icons (RTL/LTR safe)
  // All icons use: stroke="currentColor", fill="none", rounded caps/joins
  const wrap = (paths) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      ${paths}
    </svg>`;

  const icons = {
    // ===== About pillars (your JSON ids) =====
    // personal: mentoring / personal guidance
    personal: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 11a3 3 0 1 0-6 0"/>
      <path d="M20 20a6 6 0 0 0-12 0"/>
      <path d="M6.5 10.5a2.5 2.5 0 1 0-5 0"/>
      <path d="M1 20a5 5 0 0 1 6-4.5"/>
      <path d="M18.5 3.5l.7 1.6 1.7.2-1.3 1.1.4 1.7-1.5-.9-1.5.9.4-1.7-1.3-1.1 1.7-.2.7-1.6z"/>
    </svg>`,

    digital: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="6" width="16" height="10" rx="2"/>
      <path d="M8 20h8"/>
      <path d="M12 16v4"/>
      <circle cx="8" cy="9" r="1"/>
      <circle cx="12" cy="11" r="1"/>
      <circle cx="16" cy="9" r="1"/>
      <path d="M9 9.5l2 1.2"/>
      <path d="M15 9.5l-2 1.2"/>
    </svg>`,

    tools: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v2"/>
      <path d="M12 15v2"/>
      <path d="M7 12h2"/>
      <path d="M15 12h2"/>
      <path d="M10 14l2-6 2 6-2-1-2 1z"/>
    </svg>`,

    // ===== Existing generic icons (improved where needed) =====
    // donate / compassion (outline heart)
    heart: wrap(`
      <path d="M12 21s-7-4.6-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.4-7 11-7 11z"/>
    `),

    // hands / help (cleaner + clearer)
    hands: wrap(`
      <path d="M7 12v-2a2 2 0 0 1 4 0v2"/>
      <path d="M11 12V8a2 2 0 0 1 4 0v4"/>
      <path d="M15 12v-1a2 2 0 1 1 4 0v4c0 3-2 5-5 5H9c-3 0-5-2-5-5v-3a2 2 0 0 1 3-1.7"/>
    `),

    // spark / highlight
    spark: wrap(`
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z"/>
    `),

    // book / knowledge
    book: wrap(`
      <path d="M4 19.5V6.5A2.5 2.5 0 0 1 6.5 4H20v16H6.5A2.5 2.5 0 0 0 4 22"/>
      <path d="M8 7h8"/>
      <path d="M8 11h8"/>
    `),

    // users / community
    users: wrap(`
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.9"/>
      <path d="M16 3.1a4 4 0 0 1 0 7.8"/>
    `),

    // mail
    mail: wrap(`
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <path d="m4 7 8 6 8-6"/>
    `),

    // phone
    phone: wrap(`
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2c-9.5-1-17-8.5-18-18A2 2 0 0 1 3.9 1.7h3a2 2 0 0 1 2 1.7c.2 1.2.6 2.4 1.2 3.5a2 2 0 0 1-.5 2.3L8.5 10.3a16 16 0 0 0 5.2 5.2l1.1-1.1a2 2 0 0 1 2.3-.5c1.1.6 2.3 1 3.5 1.2a2 2 0 0 1 1.7 1.8Z"/>
    `),

    // ===== Social (simple outline versions that fit your style) =====
    facebook: wrap(`
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1Z"/>
    `),

    instagram: wrap(`
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <path d="M17.5 6.5h.01"/>
    `),

    whatsapp: wrap(`
      <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.4A8 8 0 1 1 20 12Z"/>
      <path d="M8.5 9.5c.4-1 1.2-1 1.6-.9.3 0 .6.7.8 1.1.2.4.1.7-.1 1l-.4.4c-.2.2-.3.4-.1.7.4.8 1.3 1.7 2.1 2.1.3.2.5.1.7-.1l.4-.4c.3-.3.6-.3 1-.1.4.2 1.1.5 1.1.8.1.4.1 1.2-.9 1.6"/>
    `),

    linkedin: wrap(`
      <rect x="4" y="4" width="4" height="4" rx="1"/>
      <path d="M4 10h4v10H4z"/>
      <path d="M10 10h4v2a4 4 0 0 1 8 2v6h-4v-5a2 2 0 0 0-4 0v5h-4z"/>
    `),

    youtube: wrap(`
      <path d="M22 12s0-4-1-5-4-1-9-1-8 0-9 1-1 5-1 5 0 4 1 5 4 1 9 1 8 0 9-1 1-5 1-5Z"/>
      <path d="M10 15V9l6 3-6 3Z"/>
    `),

    // X (Twitter/X) – corrected: real "X"
    x: wrap(`
      <path d="M5 5l14 14"/>
      <path d="M19 5 5 19"/>
    `),

    // link
    link: wrap(`
      <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"/>
      <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"/>
    `),

    // ===== Services (mock-aligned) =====
    // money / financial
    money: wrap(`
      <path d="M3 7h18v10H3z"/>
      <path d="M7 7v10"/>
      <path d="M17 7v10"/>
      <path d="M12 10.2a1.8 1.8 0 1 0 0 3.6a1.8 1.8 0 1 0 0-3.6Z"/>
      <path d="M10.2 9.6c.4-.6 1.1-1 1.8-1c1.1 0 2 .7 2 1.6"/>
      <path d="M9.8 14.4c.4.6 1.1 1 2.2 1c1.1 0 2-.6 2-1.6"/>
    `),

    // diaper (mock-style)
    diaper: wrap(`
      <path d="M6 6h12l-2 6H8L6 6Z"/>
      <path d="M8 12l-2 6h12l-2-6"/>
      <path d="M9 12c0 2-1 3-3 3"/>
      <path d="M15 12c0 2 1 3 3 3"/>
      <path d="M10 9h4"/>
    `),

    // mentor / fairy-ish (person + halo + wand star)
    mentorStar: wrap(`
      <path d="M12 12a3 3 0 1 0-6 0"/>
      <path d="M20 20a6 6 0 0 0-12 0"/>
      <path d="M18 7.2c0-1.4-1.3-2.6-3-2.6s-3 1.2-3 2.6"/>
      <path d="M18.6 9.2l.5 1.2 1.3.2-1 .8.3 1.3-1.1-.7-1.1.7.3-1.3-1-.8 1.3-.2.5-1.2z"/>
      <path d="M18.2 12.2l-2 2"/>
    `),

    // house + key
    houseKey: wrap(`
      <path d="M4 11l8-7 8 7"/>
      <path d="M6 10v10h12V10"/>
      <path d="M14.5 14.5a2 2 0 1 0 0 4"/>
      <path d="M16.5 16.5h3"/>
      <path d="M18.5 16.5v1.5"/>
    `),

    // community + chat
    groupChat: wrap(`
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
      <path d="M22 12a4 4 0 0 1-4 4h-2l-2 2v-4a4 4 0 0 1 4-4h4Z"/>
    `)
  };

  // ===== Aliases (context-friendly names) =====
  // No JSON changes needed: map existing IDs -> mock icons
  const aliases = {
    // existing convenience aliases
    mentor: "personal",
    guidance: "personal",
    network: "digital",
    knowledge: "digital",
    compass: "tools",
    independence: "tools",

    // SERVICES ids -> desired icons (mock-aligned)
    financialEducation: "money",
    emotionalSupport: "heart",
    mentoring: "mentorStar",
    rights: "diaper",
    community: "groupChat",
    housing: "houseKey"
  };

  const key = aliases[name] || name;
  const svg = icons[key] || icons.link;

  // Normalize SVG style: thin outline, uses currentColor
  return svg.replace(
    "<svg ",
    `<svg stroke="currentColor" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" `
  );
}

function normalizeSocialKey(label) {
  const raw = (label || "").toString().trim().toLowerCase();
  if (raw.includes("facebook") || raw.includes("פייסבוק")) return "facebook";
  if (raw.includes("instagram") || raw.includes("אינסטגרם")) return "instagram";
  if (raw.includes("whatsapp") || raw.includes("וואטסאפ")) return "whatsapp";
  if (raw.includes("linkedin") || raw.includes("לינקד")) return "linkedin";
  if (raw.includes("youtube") || raw.includes("יוטיוב")) return "youtube";
  if (raw === "x" || raw.includes("twitter") || raw.includes("טוויט")) return "x";
  return "link";
}
//   function setSafeInnerText(el, text) {
//   el.textContent = typeof text === "string" ? text : "";
// }

function createCardWithMedia(imgKey, title, text) {
  const card = document.createElement("div");
  card.className = "card";

  const media = document.createElement("div");
  media.className = "card__media";
  media.setAttribute("data-img", imgKey);

  const body = document.createElement("div");
  body.className = "card__body";

  const t = document.createElement("div");
  t.className = "card__title";
  t.textContent = title;

  const x = document.createElement("div");
  x.className = "card__text";
  x.textContent = text;

  body.appendChild(t);
  body.appendChild(x);

  card.appendChild(media);
  card.appendChild(body);

  return card;
}

    function renderImages() {
    $$("[data-img]").forEach((el) => {
      const key = el.getAttribute("data-img");
      const src = IMAGES[key];
      if (!src) return;

      el.innerHTML = "";

      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      img.style.width = "100%";
      img.style.height = "100%";
// Default
img.style.objectFit = "cover";

// Special case: volunteer image should be fully visible
if (key === "volunteer") {
  img.style.objectFit = "contain";
}

      el.appendChild(img);
    });
  }

  

  function renderNav() {
    const nav = $("#navLinks");
    if (!nav) return;
    nav.innerHTML = "";

    const order = [
      "about",
      "services",
      "story",
      "help",
      "volunteer",
      "donate",
      "knowledge",
      "statistics",
      "rights",
      "orphanWeek",
      "documents",
      "contact"
      // "transparency" has no label in nav by default; add it in JSON if you want it in the menu.
    ];

    order.forEach((id) => {
      const label = dictionary?.nav?.[id];
      if (!label) return;

      const a = document.createElement("a");
      a.href = `#${id}`;
      a.textContent = label;
      nav.appendChild(a);
    });
  }

  function renderHeroCtas() {
    const holder = $("#heroCtas");
    if (!holder) return;
    holder.innerHTML = "";

    const ctas = dictionary?.hero?.primaryCtas || [];
    ctas.forEach((cta, idx) => {
      const a = document.createElement("a");
      a.className = idx === 0 ? "btn btn--primary" : "btn btn--outline";
      a.textContent = cta?.label || "";

      // map CTA id -> action
      const id = cta?.id;
      if (id === "volunteer") {
        a.href = LINKS.volunteerForm;
        a.target = "_blank";
        a.rel = "noopener";
      } else if (id === "help") {
        a.href = LINKS.helpForm;
        a.target = "_blank";
        a.rel = "noopener";
      } else if (id === "donate") {
        a.href = "#donate";
      } else {
        a.href = `#${id || "top"}`;
      }

      holder.appendChild(a);
    });
  }

  function renderAbout() {
    const intro = $("#aboutIntro");
    const pillars = $("#aboutPillars");

    if (intro) {
      intro.innerHTML = "";
      (dictionary?.about?.intro || []).forEach((p) => {
        const el = document.createElement("p");
        el.className = "muted";
        setSafeInnerText(el, p);
        intro.appendChild(el);
      });
    }

    if (pillars) {
      pillars.innerHTML = "";
      (dictionary?.about?.pillars || []).forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";

        const icon = document.createElement("div");
        icon.className = "card__icon";
        // simple deterministic icon rotation for pillars
        // const pillarIcons = ["heart","hands","book","spark"];
icon.innerHTML = getIconSvg(item.id);

        const t = document.createElement("div");
        t.className = "card__title";
        setSafeInnerText(t, item?.title);

        const x = document.createElement("div");
        x.className = "card__text";
        setSafeInnerText(x, item?.text);

        card.appendChild(icon);
        card.appendChild(t);
        card.appendChild(x);
        pillars.appendChild(card);
      });
    }
  }

  function renderServices() {
    const holder = $("#servicesItems");
    if (!holder) return;
    holder.innerHTML = "";

    (dictionary?.services?.items || []).forEach((s) => {
      const wrap = document.createElement("div");
      wrap.className = "service";

      const icon = document.createElement("div");
      icon.className = "service__icon";
      icon.setAttribute("aria-hidden", "true");

icon.innerHTML = getIconSvg(s.icon || "spark");

      const t = document.createElement("div");
      t.className = "service__title";
      setSafeInnerText(t, s?.title);

      const x = document.createElement("div");
      x.className = "service__text";
      setSafeInnerText(x, s?.text);

      wrap.appendChild(icon);
      wrap.appendChild(t);
      wrap.appendChild(x);
      holder.appendChild(wrap);
    });
  }

function renderStory() {
  const holder = document.querySelector("#storyContent");
  if (!holder) return;

  holder.innerHTML = "";
  const parts = dictionary?.story?.content;

  if (!Array.isArray(parts)) return;

  parts.forEach((text) => {
    const p = document.createElement("p");
    p.className = "muted";
    p.style.margin = "10px 0";
    p.textContent = text || "";
    holder.appendChild(p);
  });
}




  function renderHelp() {
    const holder = $("#helpSteps");
    if (!holder) return;
    holder.innerHTML = "";

    (dictionary?.help?.steps || []).forEach((step) => {
      const row = document.createElement("div");
      row.style.margin = "6px 0";

      const strong = document.createElement("strong");
      strong.textContent = `${step?.order || ""}. ${step?.title || ""}`;

      const span = document.createElement("span");
      span.textContent = step?.text ? ` — ${step.text}` : "";

      row.appendChild(strong);
      row.appendChild(span);
      holder.appendChild(row);
    });
  }

  function renderVolunteer() {
    const roles = $("#volunteerRoles");
    if (roles) {
      roles.innerHTML = "";
      (dictionary?.volunteer?.roles || []).forEach((r) => {
        const card = document.createElement("div");
        card.className = "service";

        const icon = document.createElement("div");
        icon.className = "service__icon";
        icon.setAttribute("aria-hidden", "true");

        icon.innerHTML = getIconSvg("users");

        const t = document.createElement("div");
        t.className = "service__title";
        setSafeInnerText(t, r?.title);

        const x = document.createElement("div");
        x.className = "service__text";
        setSafeInnerText(x, r?.text);

        card.appendChild(icon);
        card.appendChild(t);
        card.appendChild(x);
        roles.appendChild(card);
      });
    }

    const proc = $("#volunteerProcess");
    if (proc) {
      proc.innerHTML = "";
      (dictionary?.volunteer?.processSteps || []).forEach((s) => {
        const row = document.createElement("div");
        row.style.margin = "6px 0";

        const strong = document.createElement("strong");
        strong.textContent = `${s?.order || ""}. ${s?.title || ""}`;

        const span = document.createElement("span");
        span.textContent = s?.text ? ` — ${s.text}` : "";

        row.appendChild(strong);
        row.appendChild(span);
        proc.appendChild(row);
      });
    }
  }

  function renderDonate() {
    const alloc = $("#donateAllocation");
    if (alloc) {
      alloc.innerHTML = "";
      (dictionary?.donate?.allocation || []).forEach((a) => {
        const card = document.createElement("div");
        card.className = "card";

        const t = document.createElement("div");
        t.className = "card__title";
        setSafeInnerText(t, `${a?.label || ""} — ${a?.percent ?? ""}%`);

        const x = document.createElement("div");
        x.className = "card__text";
        setSafeInnerText(x, a?.description);

        card.appendChild(t);
        card.appendChild(x);
        alloc.appendChild(card);
      });
    }

    const ways = $("#donateWays");
    if (ways) {
      ways.innerHTML = "";
      (dictionary?.donate?.waysToGive || []).forEach((w) => {
        const card = document.createElement("div");
        card.className = "card";

        const t = document.createElement("div");
        t.className = "card__title";
        setSafeInnerText(t, w?.title);

        const x = document.createElement("div");
        x.className = "card__text";
        setSafeInnerText(x, w?.text);

        card.appendChild(t);
        card.appendChild(x);
        ways.appendChild(card);
      });
    }

    // wire donate button (depends on language alert text)
    const btn = $("#donateNowBtn");
    const checkbox = $("#donateLegalCheck");
    if (btn && checkbox) {
      btn.onclick = () => {
        if (!checkbox.checked) {
          alert(dictionary?.donate?.legalAlert || "You must accept the terms.");
          return;
        }
        window.open(LINKS.donatePlatform, "_blank", "noopener");
      };
    }
  }

  function renderKnowledge() {
    const holder = $("#knowledgeSections");
    if (!holder) return;
    holder.innerHTML = "";

    (dictionary?.knowledge?.sections || []).forEach((s) => {
      const card = document.createElement("div");
      card.className = "card";

      const t = document.createElement("div");
      t.className = "card__title";
      setSafeInnerText(t, s?.title);

      const x = document.createElement("div");
      x.className = "card__text";
      setSafeInnerText(x, s?.text);

      card.appendChild(t);
      card.appendChild(x);
      holder.appendChild(card);
    });
  }

function renderStatistics() {
  const data = dictionary?.statistics;
  if (!data) return;

  /* ---- Metrics ---- */
  const metrics = $("#statisticsMetrics");
  if (metrics) {
    metrics.innerHTML = "";
    (data.metrics || []).forEach((m) => {
      const card = document.createElement("div");
      card.className = "card";

      const t = document.createElement("div");
      t.className = "card__title";
      setSafeInnerText(t, m?.label);

      const x = document.createElement("div");
      x.className = "card__text metric__value";
      setSafeInnerText(x, m?.value);

      card.appendChild(t);
      card.appendChild(x);
      metrics.appendChild(card);
    });
  }

  /* ---- Meaning ---- */
  const meaning = $("#statisticsMeaning");
  if (meaning) {
    meaning.innerHTML = "";
    (data.meaning || []).forEach((text) => {
      const li = document.createElement("li");
      setSafeInnerText(li, text);
      meaning.appendChild(li);
    });
  }

  /* ---- Age groups ---- */
  const ageGroups = $("#statisticsAgeGroups");
  if (ageGroups) {
    ageGroups.innerHTML = "";
    (data.ageGroups || []).forEach((text) => {
      const li = document.createElement("li");
      setSafeInnerText(li, text);
      ageGroups.appendChild(li);
    });
  }
}

  function renderRights() {
    const holder = $("#rightsItems");
    if (!holder) return;
    holder.innerHTML = "";

    (dictionary?.rights?.items || []).forEach((r) => {
      const card = document.createElement("div");
      card.className = "card";

      const t = document.createElement("div");
      t.className = "card__title";
      setSafeInnerText(t, r?.title || r?.label);

      const x = document.createElement("div");
      x.className = "card__text";
      setSafeInnerText(x, r?.text || r?.description);

      card.appendChild(t);
      card.appendChild(x);
      holder.appendChild(card);
    });
  }

  function renderTransparency() {
    const holder = $("#transparencyAllocation");
    if (!holder) return;
    holder.innerHTML = "";

    (dictionary?.transparency?.allocation || []).forEach((a) => {
      const card = document.createElement("div");
      card.className = "card";

      const t = document.createElement("div");
      t.className = "card__title";
      setSafeInnerText(t, `${a?.label || ""} — ${a?.percent ?? ""}%`);

      const x = document.createElement("div");
      x.className = "card__text";
      setSafeInnerText(x, a?.description);

      card.appendChild(t);
      card.appendChild(x);
      holder.appendChild(card);
    });
  }





function renderOrphanWeek() {
  const holder = $("#orphanWeekDays");
  if (!holder) return;

  holder.innerHTML = "";

  const days = dictionary?.orphanWeek?.days;
  if (!Array.isArray(days) || days.length === 0) return;

  days.forEach((d, idx) => {
    const item = document.createElement("div");
    item.className = "acc__item"; // אם אין לך CSS לזה עדיין, לא נורא. זה רק class.

    const btn = document.createElement("button");
    btn.className = "acc__btn";
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");

    const panelId = `ow-day-${idx}`;
    btn.setAttribute("data-target", panelId);

    // headline text: label + title (כמו שהיה לך בכרטיס)
    const headline = document.createElement("span");
    headline.className = "acc__headline";

    const label = d?.label ? `${d.label}: ` : "";
    headline.textContent = `${label}${d?.title || ""}`;

    const chev = document.createElement("span");
    chev.className = "acc__chev";
    chev.setAttribute("aria-hidden", "true");
    chev.textContent = "⌄";

    btn.appendChild(headline);
    btn.appendChild(chev);

    const panel = document.createElement("div");
    panel.className = "acc__panel";
    panel.id = panelId;
    panel.setAttribute("hidden", "");

    // main text
    if (d?.text) {
      const p = document.createElement("div");
      p.className = "muted";
      p.textContent = d.text;
      panel.appendChild(p);
    }

    // optional practical block (לא חובה שיהיה ב-JSON)
    if (d?.practical) {
      const box = document.createElement("div");
      box.className = "acc__practical";

      if (d?.practicalTitle) {
        const st = document.createElement("strong");
        st.textContent = d.practicalTitle;
        box.appendChild(st);
      }

      const body = document.createElement("div");
      body.textContent = d.practical;
      box.appendChild(body);

      panel.appendChild(box);
    }

    btn.addEventListener("click", () => togglePanel(btn, panel));

    item.appendChild(btn);
    item.appendChild(panel);
    holder.appendChild(item);
  });
}


function bindAccordionButtons(scope = document) {
  scope.querySelectorAll('.acc__btn[data-target]').forEach((btn) => {
    // prevent double-binding
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    btn.addEventListener("click", () => {
      const panelId = btn.dataset.target;
      const panel = document.getElementById(panelId);
      if (!panel) return;

      const isOpen = !panel.hasAttribute("hidden");
      if (isOpen) {
        panel.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
      } else {
        panel.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}







  function renderDocuments() {
    const holder = $("#documentsItems");
    if (!holder) return;
    holder.innerHTML = "";

    (dictionary?.documents?.items || []).forEach((d) => {
      const card = document.createElement("div");
      card.className = "card";

      const t = document.createElement("div");
      t.className = "card__title";
      setSafeInnerText(t, d?.title);

      const x = document.createElement("div");
      x.className = "card__text";
      setSafeInnerText(x, d?.text);

      card.appendChild(t);
      card.appendChild(x);
      holder.appendChild(card);
    });
  }

function renderContact() {
  // ===== wire contact CTA links (2 buttons) =====
  const waBtn = $("#contactWhatsAppBtn");
  const emailBtn = $("#contactEmailBtn");

  const emailValue =
    (dictionary?.contact?.methods || []).find(m => m?.type === "email")?.value || "";

  // WhatsApp: uses LINKS.contactForm as the base (your current wa.me link)
  if (waBtn) {
    const text = dictionary?.contact?.whatsAppText || "";
    const base = LINKS.contactForm || "#"; // currently your WhatsApp link
    const sep = base.includes("?") ? "&" : "?";
    waBtn.href = text ? `${base}${sep}text=${encodeURIComponent(text)}` : base;
    waBtn.target = "_blank";
    waBtn.rel = "noopener";
  }

  // Email: mailto with subject/body from JSON
  if (emailBtn) {
    const subject = dictionary?.contact?.emailSubject || "";
    const body = dictionary?.contact?.emailBody || "";

    const qs = new URLSearchParams();
    if (subject) qs.set("subject", subject);
    if (body) qs.set("body", body);

    const mail = emailValue || "mishporg@gmail.com"; // fallback
    emailBtn.href = `mailto:${mail}${qs.toString() ? "?" + qs.toString() : ""}`;
  }

  // keep your other CTAs
  const helpBtn = $("#helpFormBtn");
  if (helpBtn) {
    helpBtn.href = LINKS.helpForm;
    helpBtn.target = "_blank";
    helpBtn.rel = "noopener";
  }

  const volunteerBtn = $("#volunteerBtn");
  if (volunteerBtn) {
    volunteerBtn.href = LINKS.volunteerForm;
    volunteerBtn.target = "_blank";
    volunteerBtn.rel = "noopener";
  }

  // ===== contact methods =====
  const methods = $("#contactMethods");
  if (methods) {
    methods.innerHTML = "";
    (dictionary?.contact?.methods || []).forEach((m) => {
      // If your container is UL (recommended), create LI.
      // If it is DIV, LI still renders fine in most browsers but better to match HTML.
      const row = document.createElement(methods.tagName === "UL" ? "li" : "div");

      row.style.display = "flex";
      row.style.gap = "10px";
      row.style.alignItems = "baseline";
      row.style.margin = "6px 0";

      const label = document.createElement("strong");
      const icon =
        m?.type === "phone" ? "💬" :
        m?.type === "email" ? "✉️" :
        (m?.label || "");
      label.textContent = `${icon}`;

      let val;
      if (m?.type === "email") {
        const subject = dictionary?.contact?.emailSubject || "";
        const body = dictionary?.contact?.emailBody || "";

        const qs = new URLSearchParams();
        if (subject) qs.set("subject", subject);
        if (body) qs.set("body", body);

        val = document.createElement("a");
        val.href = `mailto:${m.value}${qs.toString() ? "?" + qs.toString() : ""}`;
        val.textContent = m.value || "";
      } else if (m?.type === "phone") {
        const num = (m.value || "").toString().replace(/\s+/g, "");
        val = document.createElement("a");
        val.href = `tel:${num}`;
        val.textContent = m.value || "";
      } else {
        val = document.createElement("span");
        val.textContent = m?.value || "";
      }

      row.appendChild(label);
      row.appendChild(val);
      methods.appendChild(row);
    });
  }

  // ===== social =====
  const social = $("#contactSocial");
  if (social) {
    social.innerHTML = "";
    (dictionary?.contact?.social || []).forEach((label) => {
      const key = normalizeSocialKey(label);
      const href = (LINKS.social && LINKS.social[key]) ? LINKS.social[key] : "#";

      const a = document.createElement("a");
      a.className = "socialBtn";
      a.href = href || "#";
      a.setAttribute("aria-label", label || key);
      if (href && href !== "#") {
        a.target = "_blank";
        a.rel = "noopener";
      }

      a.innerHTML = getIconSvg(key);
      social.appendChild(a);
    });
  }
}

function renderAllDynamic() {
  renderNav();
  renderHeroCtas();
  renderAbout();
  renderServices();
  renderStory();       // <-- להוסיף את זה
  renderHelp();
  renderVolunteer();
  renderDonate();
  renderKnowledge();
  renderStatistics();
  renderRights();
  renderTransparency();
  renderOrphanWeek();
  renderDocuments();
  renderContact();
  bindAccordionButtons();
}

  async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);

    setDocDirection(lang);
    dictionary = await loadJson(lang);

    applyText();
    renderAllDynamic();
    renderImages();

    document.querySelector(".topbar")?.classList.remove("is-menu-open");
    document.querySelector("#menuToggle")?.setAttribute("aria-expanded", "false");


  }

  function wireLangToggle() {
    $("#langToggle")?.addEventListener("click", async () => {
      const next = currentLang === "he" ? "en" : "he";
      await setLanguage(next);
    });
  }
function setupMenuToggle() {
  const topbar = document.querySelector(".topbar");
  const btn = document.querySelector("#menuToggle");
  const nav = document.querySelector("#navLinks");
  if (!topbar || !btn || !nav) return;

  const close = () => {
    topbar.classList.remove("is-menu-open");
    btn.setAttribute("aria-expanded", "false");
  };

  const toggle = () => {
    const open = topbar.classList.toggle("is-menu-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener("click", (e) => {
    if (!topbar.classList.contains("is-menu-open")) return;
    if (topbar.contains(e.target)) return;
    close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) close();
  });
}

function setupBackToTop() {
  const btn = document.querySelector("#backToTopBtn");
  if (!btn) return;

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    btn.classList.toggle("is-visible", y > 400);
  };

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

async function init() {
  wireLangToggle();
  try {
    await setLanguage(currentLang);
  } catch (err) {
    console.error(err);
    alert("Failed to load language JSON. Check console.");
  }
  setupMenuToggle();
  setupBackToTop();
}

  document.addEventListener("DOMContentLoaded", init);
})();
