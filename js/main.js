(() => {
  const LANG_KEY = "mishpacha_lang";
  const DEFAULT_LANG = "he";

  // ====== External links placeholders (update later) ======
  const LINKS = {
    volunteerForm: "https://example.com/volunteer-form",
    helpForm: "https://example.com/help-form",
    contactForm: "https://example.com/contact-form",
    donatePlatform: "https://example.com/donate",
    // If you upload an AI video to YouTube, put the videoId here:
    youtubeVideoId: "" // e.g. "dQw4w9WgXcQ"
  };

  let dictionary = {};
  let currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  async function loadJson(lang) {
    const res = await fetch(`local/${lang}.json`, { cache: "no-cache" });
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

  function applyText() {
    // title
    document.title = dictionary?.meta?.title || "Mishpacha";

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getByKey(dictionary, key);
      if (typeof value === "string") el.textContent = value;
    });
  }

  function getByKey(obj, dottedKey) {
    return dottedKey.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
  }

  function wireLinks() {
    // CTA buttons
    $("#ctaVolunteer").href = LINKS.volunteerForm;
    $("#ctaHelp").href = LINKS.helpForm;

    // Contact / help / volunteer
    $("#helpFormBtn").href = LINKS.helpForm;
    $("#volunteerBtn").href = LINKS.volunteerForm;
    $("#contactFormBtn").href = LINKS.contactForm;

    // Contact info (you can set these later in JSON if you want)
    const email = dictionary?.contact?.emailValue || "mishporg@gmail.com";
    const phone = dictionary?.contact?.phoneValue || "+972-00-000-0000";

    $("#contactEmail").textContent = email;
    $("#contactEmail").href = `mailto:${email}`;

    $("#contactPhone").textContent = phone;
    $("#contactPhone").href = `tel:${phone.replace(/\s+/g, "")}`;
  }

  function wireYoutube() {
    const holder = $("#youtubeFrame");
    holder.innerHTML = "";

    if (!LINKS.youtubeVideoId) {
      // fallback placeholder
      const div = document.createElement("div");
      div.style.height = "360px";
      div.style.display = "grid";
      div.style.placeItems = "center";
      div.style.color = "rgba(30,22,51,.65)";
      div.style.fontWeight = "900";
      div.textContent = dictionary?.video?.placeholder || "YouTube video placeholder";
      holder.appendChild(div);
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.src = `https://www.youtube.com/embed/${LINKS.youtubeVideoId}`;
    holder.appendChild(iframe);
  }

  function wireDonateButton() {
    const btn = $("#donateNowBtn");
    const checkbox = $("#donateLegalCheck");

    btn.addEventListener("click", () => {
      if (!checkbox.checked) {
        alert(dictionary?.donate?.legalAlert || "חובה לאשר את התנאים לפני מעבר לתשלום.");
        return;
      }

      // IMPORTANT: you said it yourself — payment platform must be done with proven professionals.
      // So here we only redirect to the donation platform URL you will define later.
      window.open(LINKS.donatePlatform, "_blank", "noopener");
    });
  }

  async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);

    setDocDirection(lang);
    dictionary = await loadJson(lang);

    applyText();
    wireLinks();
    wireYoutube();

    // update lang toggle label (show other language)
    const toggleLabel = $("#langToggle span");
    toggleLabel.textContent = lang === "he" ? "EN" : "עברית";
  }

  function wireLangToggle() {
    $("#langToggle").addEventListener("click", async () => {
      const next = currentLang === "he" ? "en" : "he";
      await setLanguage(next);
    });
  }

  async function init() {
    wireLangToggle();
    await setLanguage(currentLang);
    wireDonateButton();
  }

  init().catch((e) => {
    console.error(e);
    alert("בעיה בטעינת האתר. בדוק את קבצי ה־JSON והנתיבים.");
  });
})();
