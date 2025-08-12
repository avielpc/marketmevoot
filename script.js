const PHONE_DISPLAY = "0586130140";
const PHONE_INTL = "972586130140";
const EMAIL = "marketmevoot@gmail.com";
const WA_BASE = "https://wa.me/";

// reveal on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
},{threshold:0.18});
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
});
toTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

function openWhatsApp(prefillText){
  const text = prefillText ? encodeURIComponent(prefillText) : "";
  const url = `${WA_BASE}${PHONE_INTL}${text ? `?text=${text}` : ""}`;
  window.open(url, "_blank");
}
function callPhone(){ window.location.href = `tel:${PHONE_DISPLAY}`; }
function sendEmail(subject = "מרקט מבואות — יצירת קשר", body = ""){
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  window.location.href = `mailto:${EMAIL}?subject=${s}&body=${b}`;
}

// form
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('name')?.value?.trim() || "";
  const phone = document.getElementById('phone')?.value?.trim() || "";
  const email = document.getElementById('email')?.value?.trim() || "";
  const message = document.getElementById('message')?.value?.trim() || "";

  const normalizedPhone = phone.replace(/[\s-+]/g,'').replace(/^0/, '972').replace(/^9720/, '972');
  const composed = `שם: ${name}%0aטלפון: ${normalizedPhone}%0aאימייל: ${email || '-'}%0aהודעה: ${message}`;
  openWhatsApp(composed);
});
