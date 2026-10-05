(() => {
  const LANG_KEY = "mishpacha_lang";
  const DEFAULT_LANG = "he";

  // ====== External links (single place to update) ======
  const LINKS = {
    volunteerForm: "https://forms.fillout.com/t/mNTHrX2xwEus",
    helpForm: "https://forms.fillout.com/t/jGF6Z1n5jRus",
    contactWhatsApp: "https://wa.me/message/IMUVXWXVPB64M1",
    contactEmail: "mishporg@gmail.com",

    // Donations: a dedicated donation page can replace this one URL later without touching any markup.
    donatePlatform: "https://donate.meritspread.com/he/charities/mishpaha",

    // Mishpacha ecosystem: each destination appears inside its own homepage section.
    projects: "https://kinetic-kind-impact.base44.app/",
    people: "https://thepeoplebehindtheproject.vercel.app/",
    systems: "https://yatom-netknowledge.vercel.app/",
    knowledgeHub: "https://ncbos-knowledge-hub-c826ef5e.base44.app/PublicHome",
    // (event links live with each event in lang/*.json -> events.items)

    // Social links (leave empty to render the icon without a destination)
    social: {
      facebook: "https://www.facebook.com/mishpahaorg?locale=he_IL",
      instagram: "https://www.instagram.com/org_mishpacha/",
      whatsapp: "https://wa.me/message/IMUVXWXVPB64M1",
      linkedin: "https://www.linkedin.com/company/mishpacha-ngo/?viewAsMember=true",
      youtube: "https://www.youtube.com/@organizationmishpacha7482",
      x: ""
    }
  };

  // ====== Images mapping (data-img="key") ======
  const IMAGES = {
    logo: "assets/img/logo.png",
    about: "assets/img/about.webp",
    volunteer: "assets/img/volunteer.webp"
  };

  let dictionary = {};
  let currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  let contactTopicId = "general";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // Tiny element factory: h("div", "card", "text")
  function h(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function setSafeInnerText(el, text) {
    el.textContent = typeof text === "string" ? text : "";
  }

  function iconEl(name, className) {
    const span = h("span", className || "icon");
    span.setAttribute("aria-hidden", "true");
    span.innerHTML = getIconSvg(name);
    return span;
  }

  function openExternal(a, href) {
    a.href = href || "#";
    a.target = "_blank";
    a.rel = "noopener";
  }

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

    const backTop = $("#backToTopBtn");
    const backLabel = dictionary?.ui?.backTop;
    if (backTop && backLabel) {
      backTop.setAttribute("aria-label", backLabel);
      backTop.title = backLabel;
    }
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

      // ===== Generic icons =====
      heart: wrap(`
        <path d="M12 21s-7-4.6-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.4-7 11-7 11z"/>
      `),

      hands: wrap(`
        <path d="M7 12v-2a2 2 0 0 1 4 0v2"/>
        <path d="M11 12V8a2 2 0 0 1 4 0v4"/>
        <path d="M15 12v-1a2 2 0 1 1 4 0v4c0 3-2 5-5 5H9c-3 0-5-2-5-5v-3a2 2 0 0 1 3-1.7"/>
      `),

      spark: wrap(`
        <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z"/>
      `),

      book: wrap(`
        <path d="M4 19.5V6.5A2.5 2.5 0 0 1 6.5 4H20v16H6.5A2.5 2.5 0 0 0 4 22"/>
        <path d="M8 7h8"/>
        <path d="M8 11h8"/>
      `),

      // calendar / events
      calendar: wrap(`
        <rect x="3" y="5" width="18" height="16" rx="2"/>
        <path d="M16 3v4"/>
        <path d="M8 3v4"/>
        <path d="M3 10h18"/>
        <path d="M8 14h.01"/>
        <path d="M12 14h.01"/>
        <path d="M16 14h.01"/>
      `),

      // location pin
      pin: wrap(`
        <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"/>
        <circle cx="12" cy="11" r="2.2"/>
      `),

      // clock
      clock: wrap(`
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 7v5l3 2"/>
      `),

      // check mark
      check: wrap(`
        <path d="M5 12.5l4.5 4.5L19 7.5"/>
      `),

      users: wrap(`
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.9"/>
        <path d="M16 3.1a4 4 0 0 1 0 7.8"/>
      `),

      mail: wrap(`
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="m4 7 8 6 8-6"/>
      `),

      phone: wrap(`
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2c-9.5-1-17-8.5-18-18A2 2 0 0 1 3.9 1.7h3a2 2 0 0 1 2 1.7c.2 1.2.6 2.4 1.2 3.5a2 2 0 0 1-.5 2.3L8.5 10.3a16 16 0 0 0 5.2 5.2l1.1-1.1a2 2 0 0 1 2.3-.5c1.1.6 2.3 1 3.5 1.2a2 2 0 0 1 1.7 1.8Z"/>
      `),

      // ===== Social =====
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

      x: wrap(`
        <path d="M5 5l14 14"/>
        <path d="M19 5 5 19"/>
      `),

      link: wrap(`
        <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"/>
        <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"/>
      `),

      // ===== Services =====
      money: wrap(`
        <path d="M3 7h18v10H3z"/>
        <path d="M7 7v10"/>
        <path d="M17 7v10"/>
        <path d="M12 10.2a1.8 1.8 0 1 0 0 3.6a1.8 1.8 0 1 0 0-3.6Z"/>
        <path d="M10.2 9.6c.4-.6 1.1-1 1.8-1c1.1 0 2 .7 2 1.6"/>
        <path d="M9.8 14.4c.4.6 1.1 1 2.2 1c1.1 0 2-.6 2-1.6"/>
      `),

      diaper: wrap(`
        <path d="M6 6h12l-2 6H8L6 6Z"/>
        <path d="M8 12l-2 6h12l-2-6"/>
        <path d="M9 12c0 2-1 3-3 3"/>
        <path d="M15 12c0 2 1 3 3 3"/>
        <path d="M10 9h4"/>
      `),

      mentorStar: wrap(`
        <path d="M12 12a3 3 0 1 0-6 0"/>
        <path d="M20 20a6 6 0 0 0-12 0"/>
        <path d="M18 7.2c0-1.4-1.3-2.6-3-2.6s-3 1.2-3 2.6"/>
        <path d="M18.6 9.2l.5 1.2 1.3.2-1 .8.3 1.3-1.1-.7-1.1.7.3-1.3-1-.8 1.3-.2.5-1.2z"/>
        <path d="M18.2 12.2l-2 2"/>
      `),

      houseKey: wrap(`
        <path d="M4 11l8-7 8 7"/>
        <path d="M6 10v10h12V10"/>
        <path d="M14.5 14.5a2 2 0 1 0 0 4"/>
        <path d="M16.5 16.5h3"/>
        <path d="M18.5 16.5v1.5"/>
      `),

      groupChat: wrap(`
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
        <path d="M22 12a4 4 0 0 1-4 4h-2l-2 2v-4a4 4 0 0 1 4-4h4Z"/>
      `)
    };

    // ===== Aliases (context-friendly names) =====
    // No JSON changes needed: map existing IDs -> icons
    const aliases = {
      mentor: "personal",
      guidance: "personal",
      network: "digital",
      knowledge: "digital",
      compass: "tools",
      independence: "tools",

      // SERVICES ids
      financialEducation: "money",
      emotionalSupport: "heart",
      mentoring: "mentorStar",
      rights: "diaper",
      community: "groupChat",
      housing: "houseKey",

      // KNOWLEDGE section ids
      hub: "digital",
      library: "book",
      bilingual: "link",
      vision: "spark",

      // EVENTS convenience alias
      event: "calendar"
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

  function renderImages() {
    $$("[data-img]").forEach((el) => {
      const key = el.getAttribute("data-img");
      const src = IMAGES[key];
      if (!src) return;

      el.innerHTML = "";

      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.decoding = "async";
      img.loading = key === "logo" ? "eager" : "lazy";
      el.appendChild(img);
    });
  }

  // ===============================
  // Navigation
  // ===============================
  function renderNav() {
    const nav = $("#navLinks");
    if (!nav) return;
    nav.innerHTML = "";

    // Order of the in-page links (ids are section ids; labels come from dictionary.nav).
    // Hidden sections (orphanWeek, rights, documents, transparency) are intentionally not listed.
    const order = ["about", "services", "knowledge", "events", "people", "contact"];

    order.forEach((id) => {
      const label = dictionary?.nav?.[id];
      if (!label) return;

      const a = h("a", "nav__link", label);
      a.href = `#${id}`;
      nav.appendChild(a);
    });

    // Primary action of the whole site
    const involved = dictionary?.nav?.involved;
    if (involved) {
      const cta = h("a", "btn btn--primary btn--sm nav__cta", involved);
      cta.href = "#involved";
      nav.appendChild(cta);
    }
  }

  // ===============================
  // Hero
  // ===============================
  function renderHeroCtas() {
    const holder = $("#heroCtas");
    if (!holder) return;
    holder.innerHTML = "";

    (dictionary?.hero?.primaryCtas || []).forEach((cta, idx) => {
      const a = h("a", idx === 0 ? "btn btn--primary btn--arrow" : "btn btn--secondary", cta?.label || "");

      // map CTA id -> action (external forms) or in-page section
      const id = cta?.id;
      if (id === "volunteer") openExternal(a, LINKS.volunteerForm);
      else if (id === "help") openExternal(a, LINKS.helpForm);
      else a.href = `#${id || "top"}`;

      holder.appendChild(a);
    });
  }

  // ===============================
  // Events (shared helpers)
  // ===============================
  function eventTimestamp(ev) {
    return ev?.date ? new Date(ev.date).getTime() : NaN;
  }

  // An event stays "upcoming" until the end of its day.
  function isEventPast(ev) {
    const t = eventTimestamp(ev);
    return !isNaN(t) && t + 86400000 <= Date.now();
  }

  // Upcoming first (soonest first, undated last), then past events (most recent first).
  function getSortedEvents() {
    const items = Array.isArray(dictionary?.events?.items) ? dictionary.events.items.slice() : [];
    const upcoming = items.filter((ev) => !isEventPast(ev));
    const past = items.filter((ev) => isEventPast(ev));

    upcoming.sort((a, b) => {
      const da = eventTimestamp(a);
      const db = eventTimestamp(b);
      if (isNaN(da) && isNaN(db)) return 0;
      if (isNaN(da)) return 1;
      if (isNaN(db)) return -1;
      return da - db;
    });
    past.sort((a, b) => eventTimestamp(b) - eventTimestamp(a));

    return upcoming.concat(past);
  }

  function renderNextEvent() {
    const holder = $("#nextEvent");
    if (!holder) return;
    holder.innerHTML = "";

    const next = getSortedEvents().find((ev) => !isEventPast(ev));
    if (!next) {
      holder.hidden = true;
      return;
    }

    holder.hidden = false;
    holder.appendChild(iconEl("calendar", "nextEvent__icon"));

    const text = h("div", "nextEvent__text");
    text.appendChild(h("span", "nextEvent__label", dictionary?.hero?.nextEvent?.label || ""));

    const title = h("a", "nextEvent__title", next.title || "");
    title.href = "#events";
    text.appendChild(title);

    const meta = [next.dateLabel, next.location].filter(Boolean).join(" · ");
    if (meta) text.appendChild(h("span", "nextEvent__meta", meta));
    holder.appendChild(text);

    if (next.primaryCtaLink) {
      const cta = h("a", "btn btn--primary btn--sm", dictionary?.hero?.nextEvent?.cta || next.primaryCtaLabel || "");
      openExternal(cta, next.primaryCtaLink);
      holder.appendChild(cta);
    }
  }

  // ===============================
  // About
  // ===============================
  function renderAbout() {
    const intro = $("#aboutIntro");
    const statements = $("#aboutStatements");
    const pillars = $("#aboutPillars");

    if (intro) {
      intro.innerHTML = "";
      (dictionary?.about?.intro || []).forEach((p, i) => {
        intro.appendChild(h("p", i === 0 ? "lead" : "", typeof p === "string" ? p : ""));
      });
    }

    if (statements) {
      statements.innerHTML = "";
      (dictionary?.about?.statements || []).forEach((s) => {
        const card = h("div", `statement statement--${s?.id || "x"}`);
        card.appendChild(h("span", "statement__label", s?.label || ""));
        card.appendChild(h("p", "statement__text", s?.text || ""));
        statements.appendChild(card);
      });
    }

    if (pillars) {
      pillars.innerHTML = "";
      (dictionary?.about?.pillars || []).forEach((item) => {
        const card = h("div", "card pillar");
        card.appendChild(iconEl(item?.id, "card__icon"));
        card.appendChild(h("div", "card__title", item?.title || ""));
        card.appendChild(h("div", "card__text", item?.text || ""));
        pillars.appendChild(card);
      });
    }
  }

  // ===============================
  // Services / what we do
  // ===============================
  function renderServices() {
    const layers = $("#servicesLayers");
    if (layers) {
      layers.innerHTML = "";
      (dictionary?.services?.layers || []).forEach((l, i) => {
        const li = h("li", "layer");
        li.appendChild(h("span", "layer__num", String(i + 1)));
        li.appendChild(h("div", "layer__title", l?.title || ""));
        li.appendChild(h("div", "layer__text", l?.text || ""));
        layers.appendChild(li);
      });
    }

    const holder = $("#servicesItems");
    if (holder) {
      holder.innerHTML = "";
      (dictionary?.services?.items || []).forEach((s) => {
        const wrap = h("div", "service");
        wrap.appendChild(iconEl(s?.icon || "spark", "service__icon"));
        wrap.appendChild(h("div", "service__title", s?.title || ""));
        wrap.appendChild(h("div", "service__text", s?.text || ""));
        holder.appendChild(wrap);
      });
    }

    renderChecklist("#partnershipPoints", dictionary?.services?.partnership?.points);
  }

  function renderChecklist(selector, points) {
    const ul = $(selector);
    if (!ul) return;
    ul.innerHTML = "";
    (points || []).forEach((text) => {
      const li = h("li");
      li.appendChild(iconEl("check", "checklist__icon"));
      li.appendChild(h("span", "", typeof text === "string" ? text : ""));
      ul.appendChild(li);
    });
  }

  // ===============================
  // Knowledge center + Yatom-Net
  // ===============================
  function renderKnowledge() {
    const holder = $("#knowledgeSections");
    if (!holder) return;
    holder.innerHTML = "";

    (dictionary?.knowledge?.sections || []).forEach((s) => {
      const card = h("div", "card knowledge__card");
      card.appendChild(iconEl(s?.id || "book", "card__icon"));
      card.appendChild(h("div", "card__title", s?.title || ""));
      card.appendChild(h("div", "card__text", s?.text || ""));
      holder.appendChild(card);
    });
  }

  function renderYatomNet() {
    const flow = $("#yatomFlow");
    if (!flow) return;
    flow.innerHTML = "";

    (dictionary?.yatomNet?.flow || []).forEach((step, i) => {
      const li = h("li", "flow__step");
      li.appendChild(h("span", "flow__num", String(i + 1)));
      const body = h("div", "flow__body");
      body.appendChild(h("strong", "", step?.title || ""));
      body.appendChild(h("span", "", step?.text || ""));
      li.appendChild(body);
      flow.appendChild(li);
    });
  }

  // ===============================
  // Events
  // ===============================
  function renderEvents() {
    const holder = $("#eventsItems");
    const empty = $("#eventsEmpty");
    if (!holder) return;

    holder.innerHTML = "";

    const data = dictionary?.events;
    const items = getSortedEvents();

    if (empty) empty.hidden = items.length > 0;

    const locale = currentLang === "he" ? "he-IL" : "en-US";

    items.forEach((ev) => {
      const isPast = isEventPast(ev);
      const t = eventTimestamp(ev);
      const card = h("article", isPast ? "event event--past" : "event");

      // Date block (day / month / year) computed from the ISO date
      if (!isNaN(t)) {
        const d = new Date(t);
        const dateBlock = h("div", "event__date");
        dateBlock.setAttribute("aria-hidden", "true");
        dateBlock.appendChild(h("span", "event__day", String(d.getUTCDate())));
        dateBlock.appendChild(
          h("span", "event__month", new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(d))
        );
        dateBlock.appendChild(h("span", "event__year", String(d.getUTCFullYear())));
        card.appendChild(dateBlock);
      } else {
        card.appendChild(iconEl(ev?.icon || "calendar", "event__icon"));
      }

      // Main column: tag/badge, title, theme, context, note
      const main = h("div", "event__main");
      const meta = h("div", "event__meta");
      if (ev?.tag) meta.appendChild(h("span", "chip", ev.tag));
      if (!isNaN(t)) {
        const badge = h(
          "span",
          isPast ? "badge badge--past" : "badge badge--upcoming",
          (isPast ? data?.pastBadge : data?.upcomingBadge) || ""
        );
        meta.appendChild(badge);
      }
      main.appendChild(meta);

      main.appendChild(h("h3", "event__title", ev?.title || ""));
      if (ev?.theme) main.appendChild(h("p", "event__theme", ev.theme));
      if (ev?.text) main.appendChild(h("p", "event__text", ev.text));
      if (ev?.note) main.appendChild(h("p", "event__note", ev.note));
      card.appendChild(main);

      // Side column: key facts + CTAs
      const side = h("div", "event__side");
      const facts = h("ul", "event__facts");
      const addFact = (iconName, value, isTime) => {
        if (!value) return;
        const li = h("li");
        li.appendChild(iconEl(iconName, "fact__icon"));
        const span = h("span", "fact__text", value);
        if (isTime) span.dir = "ltr"; // keep digits/dash in order inside RTL text
        li.appendChild(span);
        facts.appendChild(li);
      };
      addFact("calendar", ev?.dateLabel);
      addFact("clock", ev?.time, true);
      addFact("pin", ev?.location);
      if (facts.children.length) side.appendChild(facts);

      if (ev?.primaryCtaLink || ev?.secondaryCtaLink) {
        const ctas = h("div", "event__ctas");

        // Registration is the primary, most prominent action; "learn more" is secondary.
        if (ev?.primaryCtaLink) {
          const a = h("a", "btn btn--primary btn--arrow", ev?.primaryCtaLabel || "");
          openExternal(a, ev.primaryCtaLink);
          ctas.appendChild(a);
        }
        if (ev?.secondaryCtaLink) {
          const a = h("a", "btn btn--secondary", ev?.secondaryCtaLabel || "");
          openExternal(a, ev.secondaryCtaLink);
          ctas.appendChild(a);
        }
        side.appendChild(ctas);
      }

      card.appendChild(side);
      holder.appendChild(card);
    });
  }

  // ===============================
  // People
  // ===============================
  function renderPeople() {
    const holder = $("#peopleItems");
    if (!holder) return;
    holder.innerHTML = "";

    (dictionary?.people?.items || []).forEach((p) => {
      const card = h("article", "person");

      const photo = h("div", "person__photo");
      if (p?.image) {
        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p?.name || "";
        img.width = 640;
        img.height = 800;
        img.loading = "lazy";
        img.decoding = "async";
        photo.appendChild(img);
      }
      card.appendChild(photo);

      const body = h("div", "person__body");
      body.appendChild(h("h3", "person__name", p?.name || ""));
      body.appendChild(h("p", "person__role", p?.role || ""));
      body.appendChild(h("p", "person__teaser", p?.teaser || ""));
      card.appendChild(body);

      holder.appendChild(card);
    });
  }

  // ===============================
  // Support after loss
  // ===============================
  function renderSteps(selector, steps) {
    const holder = $(selector);
    if (!holder) return;
    holder.innerHTML = "";

    (steps || []).forEach((step, i) => {
      const li = h("li", "step");
      li.appendChild(h("span", "step__num", String(step?.order || i + 1)));
      const body = h("div", "step__body");
      body.appendChild(h("strong", "", step?.title || ""));
      body.appendChild(h("span", "", step?.text || ""));
      li.appendChild(body);
      holder.appendChild(li);
    });
  }

  function renderHelp() {
    renderSteps("#helpSteps", dictionary?.help?.steps);
  }

  // ===============================
  // Get involved: volunteer / donate / partner
  // ===============================
  function renderVolunteer() {
    const roles = $("#volunteerRoles");
    if (roles) {
      roles.innerHTML = "";
      (dictionary?.volunteer?.roles || []).forEach((r) => {
        const li = h("li", "role");
        const roleIcons = { personalMentor: "mentorStar", professionalVolunteer: "digital", logistics: "hands" };
        li.appendChild(iconEl(roleIcons[r?.id] || "users", "role__icon"));
        const body = h("div", "role__body");
        body.appendChild(h("strong", "", r?.title || ""));
        body.appendChild(h("span", "", r?.text || ""));
        li.appendChild(body);
        roles.appendChild(li);
      });
    }

    renderSteps("#volunteerProcess", dictionary?.volunteer?.processSteps);
  }

  function renderDonate() {
    const enables = $("#donateEnables");
    if (enables) {
      enables.innerHTML = "";
      (dictionary?.donate?.enables || []).forEach((e) => {
        const li = h("li", "enable");
        li.appendChild(iconEl(e?.icon || "spark", "enable__icon"));
        const body = h("div", "enable__body");
        body.appendChild(h("strong", "", e?.title || ""));
        body.appendChild(h("span", "", e?.text || ""));
        li.appendChild(body);
        enables.appendChild(li);
      });
    }

    const ways = $("#donateWays");
    if (ways) {
      ways.innerHTML = "";
      (dictionary?.donate?.waysToGive || []).forEach((w) => {
        ways.appendChild(h("li", "chip", w?.title || ""));
      });
    }
  }

  function renderPartner() {
    renderChecklist("#partnerPoints", dictionary?.partner?.points);
  }

  // ===============================
  // Statistics / impact
  // ===============================
  function renderStatistics() {
    const data = dictionary?.statistics;
    if (!data) return;

    /* ---- Metrics ---- */
    const metrics = $("#statisticsMetrics");
    if (metrics) {
      metrics.innerHTML = "";
      (data.metrics || []).forEach((m, i) => {
        const card = h("div", i === 0 ? "stat stat--lead" : "stat");
        const value = h("div", "stat__value", m?.value || "");
        value.setAttribute("data-count", m?.value || "");
        card.appendChild(value);
        card.appendChild(h("div", "stat__label", m?.label || ""));
        metrics.appendChild(card);
      });
    }

    /* ---- Meaning / age groups ---- */
    const fillList = (selector, list, className) => {
      const ul = $(selector);
      if (!ul) return;
      ul.innerHTML = "";
      (list || []).forEach((text) => ul.appendChild(h("li", className, typeof text === "string" ? text : "")));
    };
    fillList("#statisticsMeaning", data.meaning);
    fillList("#statisticsAgeGroups", data.ageGroups, "chip");

    /* ---- What has been built ---- */
    const built = $("#statisticsBuilt");
    if (built) {
      built.innerHTML = "";
      (data.built || []).forEach((b) => {
        const card = h("div", "card built__card");
        card.appendChild(iconEl("check", "built__icon"));
        card.appendChild(h("div", "card__title", b?.title || ""));
        card.appendChild(h("div", "card__text", b?.text || ""));
        built.appendChild(card);
      });
    }

    /* ---- Pathways to action ---- */
    const ctas = $("#statisticsCtas");
    if (ctas) {
      ctas.innerHTML = "";
      (data.ctas || []).forEach((c, i) => {
        const a = h("a", i === 0 ? "btn btn--primary btn--arrow" : "btn btn--secondary", c?.label || "");
        a.href = `#${c?.target || "involved"}`;
        ctas.appendChild(a);
      });
    }
  }

  // Count the figures up the first time they scroll into view (final text is always the exact original string).
  function setupCountUp() {
    const els = $$("[data-count]");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!els.length || reduce || !("IntersectionObserver" in window)) return;

    const animate = (el) => {
      const finalText = el.getAttribute("data-count") || "";
      const target = parseInt(finalText.replace(/\D/g, ""), 10);
      if (!isFinite(target)) return;

      const start = performance.now();
      const duration = 1100;
      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = p < 1 ? Math.round(target * eased).toLocaleString("en-US") : finalText;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          animate(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    els.forEach((el) => io.observe(el));
  }

  // ===============================
  // Hidden / legacy sections (kept intact for future restore)
  // ===============================
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

  function renderOrphanWeekAbout() {
    const holder = $("#orphanWeekAboutText");
    if (!holder) return;

    holder.innerHTML = "";
    const parts = dictionary?.orphanWeek?.aboutText;
    if (!Array.isArray(parts)) return;

    parts.forEach((text) => {
      const p = document.createElement("p");
      p.className = "muted";
      p.style.margin = "0 0 10px";
      setSafeInnerText(p, text);
      holder.appendChild(p);
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
      item.className = "acc__item";

      const btn = document.createElement("button");
      btn.className = "acc__btn";
      btn.type = "button";
      btn.setAttribute("aria-expanded", "false");

      const panelId = `ow-day-${idx}`;
      btn.setAttribute("data-target", panelId);

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

      if (d?.text) {
        const p = document.createElement("div");
        p.className = "muted";
        p.textContent = d.text;
        panel.appendChild(p);
      }

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

      // Click handled by bindAccordionButtons() (prevents double-toggle)

      item.appendChild(btn);
      item.appendChild(panel);
      holder.appendChild(item);
    });
  }

  function bindAccordionButtons(scope = document) {
    scope.querySelectorAll(".acc__btn[data-target]").forEach((btn) => {
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

  // ===============================
  // Contact (topic-aware)
  // ===============================
  function getContactTopic() {
    const topics = dictionary?.contact?.topics || [];
    return topics.find((t) => t.id === contactTopicId) || topics.find((t) => t.id === "general") || topics[0] || null;
  }

  function updateContactLinks() {
    const topic = getContactTopic();
    const label = topic?.label || "";

    // WhatsApp: default text + chosen topic
    const waBtn = $("#contactWhatsAppBtn");
    if (waBtn) {
      const text = [dictionary?.contact?.whatsAppText, label].filter(Boolean).join(" ");
      const base = LINKS.contactWhatsApp || "#";
      const sep = base.includes("?") ? "&" : "?";
      openExternal(waBtn, text ? `${base}${sep}text=${encodeURIComponent(text)}` : base);
    }

    // Email (Gmail compose - works even if mailto handler is not set)
    const emailBtn = $("#contactEmailBtn");
    if (emailBtn) {
      const emailValue =
        (dictionary?.contact?.methods || []).find((m) => m?.type === "email")?.value || "";
      const to = LINKS.contactEmail || emailValue || "mishporg@gmail.com";
      const baseSubject = dictionary?.contact?.emailSubject || "פנייה מאתר משפאחה";
      const subject = label ? `${baseSubject} – ${label}` : baseSubject;
      const body =
        dictionary?.contact?.emailBody ||
        "שלום,\n\nאני פונה דרך אתר משפאחה בנושא:\n\nשם:\nטלפון:\nהודעה:\n\nתודה,";

      emailBtn.href =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      emailBtn.target = "_blank";
      emailBtn.rel = "noopener";
    }

    // Selected state + support hint
    $$("#contactTopics [role='radio']").forEach((btn) => {
      const on = btn.dataset.topic === topic?.id;
      btn.setAttribute("aria-checked", on ? "true" : "false");
      btn.tabIndex = on ? 0 : -1;
      btn.classList.toggle("is-selected", on);
    });

    const hint = $("#contactHint");
    if (hint) hint.hidden = topic?.id !== "support";
  }

  function setContactTopic(id) {
    contactTopicId = id || "general";
    updateContactLinks();
  }

  function renderContact() {
    // ===== topics =====
    const topicsHolder = $("#contactTopics");
    if (topicsHolder) {
      topicsHolder.innerHTML = "";
      (dictionary?.contact?.topics || []).forEach((t) => {
        const btn = h("button", "topic", t?.label || "");
        btn.type = "button";
        btn.setAttribute("role", "radio");
        btn.dataset.topic = t?.id || "";
        btn.addEventListener("click", () => setContactTopic(t?.id));
        btn.addEventListener("keydown", (e) => {
          if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
          e.preventDefault();
          const all = $$("#contactTopics [role='radio']");
          const i = all.indexOf(btn);
          const forward = e.key === "ArrowRight" || e.key === "ArrowDown";
          const rtl = document.documentElement.dir === "rtl";
          const step = (e.key === "ArrowRight" || e.key === "ArrowLeft") && rtl ? (forward ? -1 : 1) : (forward ? 1 : -1);
          const next = all[(i + step + all.length) % all.length];
          next.focus();
          setContactTopic(next.dataset.topic);
        });
        topicsHolder.appendChild(btn);
      });
    }

    updateContactLinks();

    // ===== contact methods =====
    const methods = $("#contactMethods");
    if (methods) {
      methods.innerHTML = "";
      (dictionary?.contact?.methods || []).forEach((m) => {
        const row = h("li", "contact__method");
        row.appendChild(iconEl(m?.type === "email" ? "mail" : "phone", "contact__methodIcon"));

        let val;
        if (m?.type === "email") {
          const subject = dictionary?.contact?.emailSubject || "";
          const body = dictionary?.contact?.emailBody || "";
          const qs = new URLSearchParams({ subject, body }).toString();

          val = h("a", "", m.value || "");
          val.href = `mailto:${m.value}?${qs}`;
        } else if (m?.type === "phone") {
          const num = (m.value || "").toString().replace(/\s+/g, "");
          val = h("a", "", m.value || "");
          val.href = `tel:${num}`;
          val.dir = "ltr";
        } else {
          val = h("span", "", m?.value || "");
        }

        const wrap = h("span", "contact__methodText");
        if (m?.label) wrap.appendChild(h("small", "", m.label));
        wrap.appendChild(val);
        row.appendChild(wrap);
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

        const a = h("a", "socialBtn");
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

  // Wire every static CTA to its destination (all URLs live in LINKS or in the JSON).
  function wireLinks() {
    const set = (selector, href) => {
      const a = $(selector);
      if (a) openExternal(a, href);
    };

    set("#projectsCta", LINKS.projects);
    set("#systemsCta", LINKS.systems);
    set("#yatomCta", LINKS.systems);
    set("#knowledgeHubLink", LINKS.knowledgeHub);
    set("#peopleCta", LINKS.people);
    set("#partnerLink", LINKS.projects);
    set("#helpFormBtn", LINKS.helpForm);
    set("#helpWhatsAppBtn", LINKS.contactWhatsApp);
    set("#contactHintLink", LINKS.helpForm);
    set("#volunteerBtn", LINKS.volunteerForm);
    set("#donateNowBtn", LINKS.donatePlatform);
  }

  function renderAllDynamic() {
    renderNav();
    renderHeroCtas();
    renderNextEvent();
    renderAbout();
    renderServices();
    renderKnowledge();
    renderYatomNet();
    renderEvents();
    renderPeople();
    renderHelp();
    renderVolunteer();
    renderDonate();
    renderPartner();
    renderStatistics();
    renderContact();
    wireLinks();

    // Hidden / legacy sections (no-ops while their markup is hidden or removed)
    renderStory();
    renderRights();
    renderTransparency();
    renderOrphanWeekAbout();
    renderOrphanWeek();
    renderDocuments();
    bindAccordionButtons();
  }

  async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);

    setDocDirection(lang);
    dictionary = await loadJson(lang);

    exposeDictionary();
    applyText();
    renderAllDynamic();
    renderImages();
    setupCountUp();

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

  function setupHeaderScroll() {
    const topbar = document.querySelector(".topbar");
    if (!topbar) return;
    const onScroll = () => topbar.classList.toggle("is-scrolled", (window.scrollY || 0) > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function setupFloatingWhatsApp() {
    const btn = $("#floatingWhatsAppBtn");
    if (!btn) return;

    const icon = btn.querySelector(".floatingWhatsApp__icon");
    if (icon && !icon.dataset.bound) {
      icon.innerHTML = getIconSvg("whatsapp");
      icon.dataset.bound = "1";
    }

    openExternal(btn, LINKS.contactWhatsApp);
  }

  function setupBackToTop() {
    const btn = document.querySelector("#backToTopBtn");
    if (!btn) return;

    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      btn.classList.toggle("is-visible", y > 600);
    };

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Any element with data-contact-topic preselects that topic in the contact section before scrolling there.
  function setupContactTopicLinks() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-contact-topic]");
      if (trigger) setContactTopic(trigger.getAttribute("data-contact-topic"));
    });
  }

  // ===============================
  // Legal modal (Accessibility / Privacy) — footer buttons
  // ===============================
  // Expose dictionary for any code that needs it outside the IIFE (or for debugging).
  function exposeDictionary() {
    window.dictionary = dictionary;
  }

  function setupLegalModal() {
    const modal = document.querySelector("#legalModal");
    if (!modal) return;

    const titleEl = modal.querySelector("#legalTitle");
    const bodyEl = modal.querySelector("#legalBody");

    // HTML uses data-close="true" on both backdrop and X button
    const closeEls = Array.from(modal.querySelectorAll('[data-close="true"]'));

    let lastFocused = null;

    const isOpen = () => !modal.hasAttribute("hidden") && modal.hidden !== true;

    function open(type) {
      const data = window.dictionary?.legal?.[type];
      if (!data) return;

      lastFocused = document.activeElement;

      if (titleEl) titleEl.textContent = data.title || "";
      if (bodyEl) bodyEl.innerHTML = data.html || "";

      modal.hidden = false;
      modal.removeAttribute("hidden");
      modal.setAttribute("aria-hidden", "false");

      // Focus the close button if possible; otherwise first focusable inside dialog
      const focusTarget =
        modal.querySelector(".modal__close") ||
        modal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");

      if (focusTarget && typeof focusTarget.focus === "function") focusTarget.focus();
    }

    function close() {
      modal.hidden = true;
      modal.setAttribute("hidden", "");
      modal.setAttribute("aria-hidden", "true");

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    // Prevent double binding
    if (modal.dataset.bound === "1") return;
    modal.dataset.bound = "1";

    // Open: footer buttons are <button data-legal="accessibility|privacy">
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-legal]");
      if (!trigger) return;

      const type = trigger.getAttribute("data-legal");
      if (type !== "accessibility" && type !== "privacy") return;

      e.preventDefault();
      open(type);
    });

    // Close via backdrop / X
    closeEls.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        close();
      });
    });

    // ESC closes only when open
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) close();
    });
  }

  async function init() {
    wireLangToggle();
    try {
      await setLanguage(currentLang);

      setupLegalModal();
    } catch (err) {
      console.error(err);
      alert("Failed to load language JSON. Check console.");
    }
    setupMenuToggle();
    setupHeaderScroll();
    setupBackToTop();
    setupFloatingWhatsApp();
    setupContactTopicLinks();

    // Content is rendered after load, so re-align to a deep link such as /#events.
    if (location.hash.length > 1) {
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
