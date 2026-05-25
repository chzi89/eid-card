/* ============================================
   EID UL ADHA GREETING APP – script.js
   Features:
     - Personalised wish generation
     - Typing animation
     - Random wish generator
     - Copy to clipboard
     - Download card as image (html2canvas)
     - English / Urdu language toggle
     - Floating particle animation
   ============================================ */

// ---- Language state ----
let currentLang = 'en';

// ---- UI text translations (English & Urdu) ----
const translations = {
  en: {
    heroSub:       'عید الأضحى مبارک',
    heroTitle:     'Eid ul Adha Mubarak',
    heroDesc:      'Send a personalised blessing to your loved ones on this blessed occasion',
    formTitle:     'Create Your Eid Greeting',
    senderLabel:   'Your Name (Sender)',
    receiverLabel: "Receiver's Name",
    senderPH:      'e.g. Zaki',
    receiverPH:    'e.g. Ahmed',
    generateBtn:   '✨ Generate Wish',
    randomBtn:     'Random Wish',
    copyBtn:       'Copy Wish',
    downloadBtn:   'Download Card',
    newBtn:        'New Wish',
    footerText:    'Made with ❤️ to spread the joy of Eid ul Adha',
    copiedMsg:     '✅ Copied!',
    downloadMsg:   '⬇️ Downloading…',
    alertSender:   'Please enter your name.',
    alertReceiver: 'Please enter the receiver\'s name.',
    arabicBlessing:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
    quranQuote:    '"Indeed, the most noble of you in the sight of Allah is the most righteous of you."\n— Al-Hujurat 49:13',
  },
  ur: {
    heroSub:       'Eid ul Adha Mubarak',
    heroTitle:     'عید الأضحى مبارک',
    heroDesc:      'اس بابرکت موقع پر اپنے عزیزوں کو دلی مبارکباد بھیجیں',
    formTitle:     'اپنی عید مبارکباد بنائیں',
    senderLabel:   'آپ کا نام (بھیجنے والا)',
    receiverLabel: 'وصول کنندہ کا نام',
    senderPH:      'مثلاً: زکی',
    receiverPH:    'مثلاً: احمد',
    generateBtn:   '✨ مبارکباد بنائیں',
    randomBtn:     'بے ترتیب خواہش',
    copyBtn:       'کاپی کریں',
    downloadBtn:   'کارڈ ڈاؤن لوڈ',
    newBtn:        'نئی خواہش',
    footerText:    'عید الأضحى کی خوشیاں پھیلانے کے لیے ❤️ کے ساتھ بنایا گیا',
    copiedMsg:     '✅ کاپی ہو گیا!',
    downloadMsg:   '⬇️ ڈاؤن لوڈ ہو رہا ہے…',
    alertSender:   'براہ کرم اپنا نام درج کریں۔',
    alertReceiver: 'براہ کرم وصول کنندہ کا نام درج کریں۔',
    arabicBlessing:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
    quranQuote:    '"بیشک اللہ کے نزدیک تم میں سب سے زیادہ عزت والا وہ ہے جو سب سے زیادہ پرہیزگار ہو۔"\n— الحجرات 49:13',
  }
};

// ---- English wish templates ----
// {receiver} and {sender} are replaced dynamically
const wishTemplatesEN = [
  "Eid ul Adha Mubarak, {receiver}! 🌙 Wishing you a blessed celebration filled with the spirit of sacrifice, gratitude, and love. May Allah accept your prayers and grant you endless happiness. Warmest wishes from {sender}.",
  "Dear {receiver}, Eid ul Adha Mubarak! 🕌 On this sacred occasion, may Allah shower you and your family with His infinite blessings, peace, and prosperity. You are remembered in my prayers. With love, {sender}.",
  "Eid Mubarak to you, {receiver}! ✨ May the divine blessings of Allah bring you hope, faith, and joy — today and always. May every sacrifice you make in life be rewarded manifold. Warmly, {sender}.",
  "Assalamu Alaikum, {receiver}! Eid ul Adha Mubarak! 🌟 May this special day strengthen your faith, fill your heart with gratitude, and bless every corner of your life. Sending love and duas from {sender}.",
  "Happy Eid ul Adha, {receiver}! 🎉 May Allah accept the Qurbani and reward your devotion. Wishing you and your entire family a joyous, peaceful, and prosperous celebration. Lots of love from {sender}.",
  "Eid ul Adha Mubarak, dear {receiver}! ☪️ On this blessed day of sacrifice, may your heart be filled with the joy of giving and the peace of Allah's mercy. Remembering you in my prayers — {sender}.",
  "To {receiver} with warmth — Eid ul Adha Mubarak! 🌙✦ May the spirit of Ibrahim (AS) inspire your courage and faith. May every dua you raise to the sky be answered with kindness. From {sender}, with love.",
  "Eid ul Adha Mubarak, {receiver}! 🤲 May this blessed occasion bring you closer to Allah, strengthen your bonds with family, and fill your days with love, health, and endless blessings. — {sender}",
];

// ---- Urdu wish templates ----
const wishTemplatesUR = [
  "{receiver} کو عید الأضحى مبارک! 🌙 اللہ تعالیٰ آپ کی قربانی قبول فرمائے اور آپ کو ڈھیر ساری خوشیاں اور برکتیں عطا کرے۔ محبت کے ساتھ، {sender}",
  "عزیز {receiver}، عید مبارک! ✨ یہ خاص دن آپ کے لیے خوشیوں اور سکون کا پیغام لے کر آئے۔ اللہ آپ کے گھر کو خوشیوں سے بھر دے۔ دعاؤں کے ساتھ، {sender}",
  "{receiver} کو عید الأضحى مبارک! 🕌 اللہ تعالیٰ آپ کو صحت، خوشحالی اور ایمان کی دولت سے نوازے۔ آپ ہمارے دل اور دعاؤں میں ہیں۔ — {sender}",
  "عید مبارک، {receiver}! 🌟 حضرت ابراہیم علیہ السلام کی سنت کی یاد میں، آپ کی قربانی قبول ہو۔ اللہ آپ کو دنیا و آخرت میں کامیابی دے۔ آپ کا {sender}",
];

// ---- Floating particles ----
function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#C9A227', '#F5C842', '#1E8C55', '#FFFFFF', '#FDF3D0'];
  const shapes = ['●', '✦', '◆', '✧', '★'];

  for (let i = 0; i < 38; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -10px;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      font-size: ${6 + Math.random() * 14}px;
      --dur: ${5 + Math.random() * 9}s;
      --delay: ${Math.random() * 8}s;
      border-radius: 0;
      background: none;
    `;
    container.appendChild(el);
  }
}

// ---- Language switcher ----
function setLanguage(lang) {
  currentLang = lang;

  // Toggle active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // RTL body class
  document.body.classList.toggle('urdu-mode', lang === 'ur');

  // Apply translated text to every labeled element
  const t = translations[lang];
  setText('heroSub',         t.heroSub);
  setText('heroTitle',       t.heroTitle);
  setText('heroDesc',        t.heroDesc);
  setText('formTitle',       t.formTitle);
  setText('senderLabel',     t.senderLabel);
  setText('receiverLabel',   t.receiverLabel);
  setText('generateBtnText', t.generateBtn);
  setText('randomBtnText',   t.randomBtn);
  setText('copyBtnText',     t.copyBtn);
  setText('downloadBtnText', t.downloadBtn);
  setText('newBtnText',      t.newBtn);
  setText('footerText',      t.footerText);
  setText('arabicBlessing',  t.arabicBlessing);

  // Quran quote preserves line breaks
  const qq = document.getElementById('quranQuote');
  if (qq) qq.innerHTML = t.quranQuote.replace('\n', '<br/><em>').replace('—', '— </em>');

  // Update placeholders
  const senderInput   = document.getElementById('senderName');
  const receiverInput = document.getElementById('receiverName');
  if (senderInput)   senderInput.placeholder   = t.senderPH;
  if (receiverInput) receiverInput.placeholder  = t.receiverPH;

  document.title = lang === 'ur'
    ? 'عید الأضحى مبارک – مبارکباد کارڈ'
    : 'Eid ul Adha Mubarak – Greeting Card Generator';
}

// Helper: safely set textContent
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ---- Build personalised wish ----
function buildWish(sender, receiver, lang) {
  const templates = lang === 'ur' ? wishTemplatesUR : wishTemplatesEN;
  const template  = templates[Math.floor(Math.random() * templates.length)];
  return template
    .replace(/\{receiver\}/g, receiver)
    .replace(/\{sender\}/g, sender);
}

// ---- Typing animation ----
let typingTimer = null;

function typeText(element, text, speed = 28) {
  // Clear any ongoing animation
  if (typingTimer) clearTimeout(typingTimer);
  element.textContent = '';
  element.classList.remove('done');

  let i = 0;
  function typeChar() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      typingTimer = setTimeout(typeChar, speed);
    } else {
      // Remove blinking cursor once done
      element.classList.add('done');
    }
  }
  typeChar();
}

// ---- Generate wish (from inputs) ----
function generateWish() {
  const t        = translations[currentLang];
  const sender   = document.getElementById('senderName').value.trim();
  const receiver = document.getElementById('receiverName').value.trim();

  if (!sender) {
    showShake('senderName');
    alert(t.alertSender);
    return;
  }
  if (!receiver) {
    showShake('receiverName');
    alert(t.alertReceiver);
    return;
  }

  const wish = buildWish(sender, receiver, currentLang);
  displayWish(wish);
}

// ---- Generate random wish ----
function generateRandom() {
  const senderVal   = document.getElementById('senderName').value.trim()   || 'A Friend';
  const receiverVal = document.getElementById('receiverName').value.trim() || 'You';
  const wish = buildWish(senderVal, receiverVal, currentLang);
  displayWish(wish);
}

// ---- Show wish card ----
function displayWish(wishText) {
  const output = document.getElementById('wishOutput');
  const wishEl = document.getElementById('wishText');

  // Show card with animation
  output.style.display = 'block';
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Start typing animation
  setTimeout(() => typeText(wishEl, wishText, 22), 200);
}

// ---- Shake animation for invalid input ----
function showShake(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.style.animation = 'none';
  el.style.borderColor = '#E24B4A';
  setTimeout(() => {
    el.style.borderColor = '';
  }, 1200);
}

// ---- Copy wish to clipboard ----
function copyWish() {
  const wishEl = document.getElementById('wishText');
  const text   = wishEl.textContent;
  const t      = translations[currentLang];
  const btn    = document.getElementById('copyBtnText');

  if (!text) return;

  navigator.clipboard.writeText(text)
    .then(() => {
      btn.textContent = t.copiedMsg;
      setTimeout(() => { btn.textContent = t.copyBtn; }, 2000);
    })
    .catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = t.copiedMsg;
      setTimeout(() => { btn.textContent = t.copyBtn; }, 2000);
    });
}

// ---- Download card as image ----
function downloadCard() {
  const card = document.getElementById('greetingCard');
  const t    = translations[currentLang];
  const btn  = document.getElementById('downloadBtnText');

  if (typeof html2canvas === 'undefined') {
    alert('Download library not loaded. Please check your internet connection.');
    return;
  }

  btn.textContent = t.downloadMsg;

  html2canvas(card, {
    backgroundColor: '#0D3D2A',
    scale: 2,              // 2x resolution for sharpness
    useCORS: true,
    logging: false,
  }).then(canvas => {
    const link    = document.createElement('a');
    link.download = 'eid-greeting.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
    btn.textContent = t.downloadBtn;
  }).catch(() => {
    btn.textContent = t.downloadBtn;
    alert('Could not generate image. Please try again.');
  });
}

// ---- Reset form ----
function resetForm() {
  document.getElementById('senderName').value   = '';
  document.getElementById('receiverName').value = '';
  document.getElementById('wishOutput').style.display = 'none';
  document.getElementById('wishText').textContent     = '';
  document.getElementById('senderName').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Enter key submits form ----
document.addEventListener('DOMContentLoaded', () => {
  // Create floating particles
  createParticles();

  // Allow Enter key in inputs to trigger generation
  ['senderName', 'receiverName'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') generateWish();
    });
  });

  // Set default language text
  setLanguage('en');
});