"use strict";

const PATHS = {
  config: "local/config.json",
  translations: "local/translations.json"
};

let CONFIG = null;
let TRANSLATIONS = null;

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function byId(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element with id: ${id}`);
  return el;
}

function safeSetText(el, value) {
  if (!el) return;
  el.textContent = value ?? "";
}

function getSavedLang() {
  return localStorage.getItem("mishpacha_lang");
}

function setSavedLang(lang) {
  localStorage.setItem("mishpacha_lang", lang);
}

async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed loading ${path} (${res.status})`);
  return res.json();
}

function getValueByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function applyMeta(langKey) {
  const meta = TRANSLATIONS[langKey].meta;
  document.documentElement.lang = meta.lang;
  document.documentElement.dir = meta.dir;
}

function applyTranslations(langKey) {
  applyMeta(langKey);

  qsa("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const value = getValueByPath(TRANSLATIONS[langKey], key);
    if (value === undefined) return;
    safeSetText(el, value);
  });

  const langToggle = byId("langToggle");
  safeSetText(langToggle, getValueByPath(TRANSLATIONS[langKey], "top.langToggle"));
}

function setLinks() {
  const forms = CONFIG.forms;

  byId("btnVolunteer").href = forms.volunteer;
  byId("btnDonate").href = forms.donate;
  byId("btnHelp").href = forms.help;

  const donateSecondary = document.getElementById("btnDonateSecondary");
  if (donateSecondary) donateSecondary.href = forms.donate;

  const volunteerSecondary = document.getElementById("btnVolunteerSecondary");
  if (volunteerSecondary) volunteerSecondary.href = forms.volunteer;

  const helpSecondary = document.getElementById("btnHelpSecondary");
  if (helpSecondary) helpSecondary.href = forms.help;

  const contactBtn = document.getElementById("btnContact");
  if (contactBtn) contactBtn.href = forms.contact;

  const social = CONFIG.social || {};
  const fb = document.getElementById("socialFacebook");
  const ig = document.getElementById("socialInstagram");
  const li = document.getElementById("socialLinkedin");
  const yt = document.getElementById("socialYoutube");

  if (fb && social.facebook) fb.href = social.facebook;
  if (ig && social.instagram) ig.href = social.instagram;
  if (li && social.linkedin) li.href = social.linkedin;
  if (yt && social.youtube) yt.href = social.youtube;
}

function setupAiVideo() {
  const embed = CONFIG.assets?.aiVideoYoutubeEmbed?.trim();
  const box = document.getElementById("aiVideoBox");
  const iframe = document.getElementById("aiVideoIframe");
  const note = document.getElementById("aiVideoNote");

  if (!box || !iframe || !note) return;

  if (!embed) {
    box.hidden = true;
    note.hidden = false;
    return;
  }

  iframe.src = embed;
  box.hidden = false;
  note.hidden = true;
}

function setupDonationLegalGate() {
  const enabled = !!CONFIG.donationDisclaimer?.enabled;

  const box = document.getElementById("donationLegalBox");
  const btn = document.getElementById("donateProceed");
  const chk1 = document.getElementById("donateChk1");
  const chk2 = document.getElementById("donateChk2");
  const chk3 = document.getElementById("donateChk3");

  if (!box || !btn || !chk1 || !chk2 || !chk3) return;

  if (!enabled) {
    box.hidden = true;
    return;
  }

  const update = () => {
    const ok = chk1.checked && chk2.checked && chk3.checked;
    btn.disabled = !ok;
  };

  chk1.addEventListener("change", update);
  chk2.addEventListener("change", update);
  chk3.addEventListener("change", update);

  btn.addEventListener("click", () => {
    window.open(CONFIG.forms.donate, "_blank", "noopener");
  });

  update();
}

function setupLangToggle(initialLang) {
  const toggle = byId("langToggle");

  const switchLang = () => {
    const current = document.documentElement.lang === "he" ? "he" : "en";
    const next = current === "he" ? "en" : "he";
    setSavedLang(next);
    applyTranslations(next);
  };

  toggle.addEventListener("click", switchLang);

  applyTranslations(initialLang);
}

async function init() {
  CONFIG = await loadJson(PATHS.config);
  TRANSLATIONS = await loadJson(PATHS.translations);

  const saved = getSavedLang();
  const initialLang = saved || CONFIG.defaultLang || "he";
  if (!TRANSLATIONS[initialLang]) {
    setSavedLang("he");
  }

  setLinks();
  setupAiVideo();
  setupDonationLegalGate();
  setupLangToggle(saved || CONFIG.defaultLang || "he");
}

document.addEventListener("DOMContentLoaded", () => {
  init().catch(err => {
    console.error(err);
    alert("שגיאה בטעינת האתר. פתח את ה Console לפרטים.");
  });
});
