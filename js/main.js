(() => {
  const LANG_KEY = "mishpacha_lang";
  const DEFAULT_LANG = "he";

  // ====== External links placeholders (update later) ======
  const LINKS = {
    volunteerForm: "https://example.com/volunteer-form",
    helpForm: "https://example.com/help-form",
    contactForm: "https://example.com/contact-form",
    donatePlatform: "https://example.com/donate"
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

        const t = document.createElement("div");
        t.className = "card__title";
        setSafeInnerText(t, item?.title);

        const x = document.createElement("div");
        x.className = "card__text";
        setSafeInnerText(x, item?.text);

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
    const metrics = $("#statisticsMetrics");
    if (metrics) {
      metrics.innerHTML = "";
      (dictionary?.statistics?.metrics || []).forEach((m) => {
        const card = document.createElement("div");
        card.className = "card";

        const t = document.createElement("div");
        t.className = "card__title";
        setSafeInnerText(t, m?.label);

        const x = document.createElement("div");
        x.className = "card__text";
        setSafeInnerText(x, m?.value);

        card.appendChild(t);
        card.appendChild(x);
        metrics.appendChild(card);
      });
    }

    const ages = $("#statisticsAgeGroups");
    if (ages) {
      ages.innerHTML = "";
      (dictionary?.statistics?.ageGroups || []).forEach((a) => {
        const li = document.createElement("li");
        li.textContent = a;
        ages.appendChild(li);
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

    (dictionary?.orphanWeek?.days || []).forEach((d) => {
      const card = document.createElement("div");
      card.className = "card";

      const t = document.createElement("div");
      t.className = "card__title";
      const label = d?.label ? `${d.label}: ` : "";
      setSafeInnerText(t, `${label}${d?.title || ""}`);

      const x = document.createElement("div");
      x.className = "card__text";
      setSafeInnerText(x, d?.text);

      card.appendChild(t);
      card.appendChild(x);
      holder.appendChild(card);
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
    // wire contact CTA link
    const contactBtn = $("#contactFormBtn");
    if (contactBtn) contactBtn.href = LINKS.contactForm;

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

    const methods = $("#contactMethods");
    if (methods) {
      methods.innerHTML = "";
      (dictionary?.contact?.methods || []).forEach((m) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "10px";
        row.style.alignItems = "baseline";
        row.style.margin = "6px 0";

        const label = document.createElement("strong");
        label.textContent = `${m?.label || ""}:`;

        let val;
        if (m?.type === "email") {
          val = document.createElement("a");
          val.href = `mailto:${m.value}`;
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

    const social = $("#contactSocial");
    if (social) {
      social.innerHTML = "";
      (dictionary?.contact?.social || []).forEach((s) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = s;
        social.appendChild(chip);
      });
    }
  }

  function renderAllDynamic() {
    renderNav();
    renderHeroCtas();
    renderAbout();
    renderServices();
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
  }

  async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);

    setDocDirection(lang);
    dictionary = await loadJson(lang);

    applyText();
    renderAllDynamic();
  }

  function wireLangToggle() {
    $("#langToggle")?.addEventListener("click", async () => {
      const next = currentLang === "he" ? "en" : "he";
      await setLanguage(next);
    });
  }

  function init() {
    wireLangToggle();
    setLanguage(currentLang).catch((err) => {
      console.error(err);
      alert("Failed to load language JSON. Check console.");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();