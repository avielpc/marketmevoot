/* ==========================================
   מכולת מבואות יריחו — קטלוג סטטי עם חיפוש
   ללא הזמנות אונליין. Light default + Dark toggle.
   ========================================== */

/* ==== Settings ==== */
const PHONE = "0586130140";
const WA_NUMBER = "972586130140"; // 0586130140 -> 972586130140
const EMAIL = "marketmevoot@gmail.com";
const WA_PREFIX = "שלום, יש לי שאלה לגבי מוצרים שראיתי באתר:";

/* ==== Raw list paste & parser ==== */
/** 
 * הדבק כאן את כל הרשימה הגולמית בדיוק כמו ששלחת — כל שורה:
 * שם מוצר[TAB]ברקוד[TAB]מחיר
 * הסקריפט מנתח אוטומטית ומדלג על שורות לא תקינות.
 */
const RAW_PRODUCTS = `
שם מוצר barcode	מחיר סופי
חלב תנובה רגיל	7290004131074	7.28
טופי חמוץ תות	8699905720636	0.50
פיתות אנג'ל שמיניה פיתה פיתה	7290018540329	17.1
חמישיית פיתות שמשון אנג'ל	7290002243601	7.90
טופי חמוץ אוכמניות	8699905720643	0.50
טופי חמוץ אש	8699905720667	0.50
שמנת תנובה גדול	72961209	2.81
פחית קוקה קולה	7290011017866	6.50
30 ביצים L שביט	7290011219055	35.22
ארטיק דובדבן שטראוס	7290004554330	3.00
חלב מלא בטעם של פעם	7290000051352	10.90
חלב תנובה שקית	7290000042015	6.26
קליק מיני צהוב	7290112494771	2.00
קוטג' תנובה 9 אחוז	7290004127336	7.50
לחם אנג'ל פרוס 900ג	7290018500361	10.05
חלה עגולה אנג'ל	7290019080800	10.90
יופלה אוןטופ פצפוצים	7290110326210	6.50
טופי חמוץ פטל	8699905720681	0.50
שישיית לחמניות אנג'ל	7290002065555	13.50
ארטיק לימון שטראוס	7290004554781	3.00
שמנת מתוקה הקצפה תנובה	7290004125738	9.90
חסה קטיף הארץ מהדרין	7290011108113	7.9
קוקה קולה 1.5 ליטר	7290110115845	11.00
שוקולד פרה חלבי	7290000170053	8.5
משקה שיבולת שועל תנובה	7290110325619	15.90
מנטוס מיני	87108910	1.5
חמאה תנובה 200ג	7290000055893	11.90
רוטב עגבניות מרוכז יכין 240ג	7290000208336	4.50
גבינה לבנה 9% תנובה	7290000048192	6.9
במבה אסם 80ג	7290000066318	5.50
פחית XL	5906485301012	5.00
שמנת עמידה לבישול תנובה	7290004125721	11.90
פתיבר אסם קלאסי 500ג	7290000074184	13.90
שישיית מים עין גדי	7290019056553	18.00
טעמי 40 גרם עלית	72917367	5
קליק קורנפלקס 65 ג	7290112494313	8.50
פחית קוקה קולה ZERO	7290011017873	6.50
שוקו יטבתה	7290000042855	4.00
בירה גולדסטאר 330 מ''ל	7290008464345	10.00
מנה חמה נודלס בטעם בקר	7290000073767	8.30
ופלים שוקולד מן 200	7290000311203	6.50
מים עין גדי 2 ל	7290019056942	5.00
אפרופו 50ג	7290000066332	5.50
קולה זירו 1.5ל	7290110115869	10.00
דנונה אורז תפוח מצופה	7290000408354	7.00
פרינגלס גדול טבעי	038000138416	13.50
ממרח נוטלה 350ג	80177173	21.90
בקבוק מים נביעות	7290110115777	5.00
מיונז תלמה 500	7290000111186	14.90
`;

function parseProducts(raw) {
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const products = [];
  // דילוג על כותרת אם יש
  const startIdx = lines[0].includes("barcode") ? 1 : 0;
  for (let i = startIdx; i < lines.length; i++) {
    const row = lines[i].split(/\t/);
    if (row.length < 3) continue;
    const name = row[0]?.trim();
    const barcode = row[1]?.trim();
    const price = parseFloat(String(row[2]).replace(",", ".").replace(/[^\d.]/g, ""));
    if (!name || !barcode || !Number.isFinite(price)) continue;
    products.push({
      id: barcode, name, barcode, price,
      category: smartCategory(name)
    });
  }
  return products;
}

function smartCategory(name) {
  const n = name.toLowerCase();
  if (/[א-ת]*חלב|קוטג|יוגורט|שמנת|גבינה|דנונה|אשל|יטבתה|טרה/.test(name)) return "חלב ומוצריו";
  if (/לחם|חלה|פיתה|לחמנ|מאפה|בייגל|לחמית/.test(name)) return "מאפים ולחמים";
  if (/במבה|ביסלי|שוקולד|ופל|קליק|קינדר|טופי|סוכריה|מרשמלו|חטיף|סקיטלס|שוגי|טורטית|אגוזי|כיף כף|טעמי/.test(name)) return "חטיפים וממתקים";
  if (/קולה|משקה|מיץ|סודה|בירה|רדבול|ספרינג|ויטמינצ|נסטלה|נביעות|עין גדי|מי עדן|פאנטה|פפסי|XL|BLU/.test(name)) return "שתייה";
  if (/חסה|פטרוזיליה|סלרי|כוסברה|פטריות|ירקות|פירות|אבטיח|ענבים|מלון|תפוחים|בננות/.test(name)) return "פירות וירקות";
  if (/אורז|פסטה|קוסקוס|קמח|מלח|סוכר|טחינה|חומוס|קטשופ|רוטב|פתיתים|קרקרים|פריכיות|קוואקר|שיבולת/.test(name)) return "מוצרי יסוד ומזווה";
  if (/גלידה|ארטיק|מגנום|טילון|קרטיב|סולרו|אייס לי|שלוקים/.test(name)) return "גלידות וקפואים";
  if (/נייר טואלט|כוסות|צלחות|מגבונים|תבניות|ניקיון|סבון|טואלט/.test(name)) return "בית וניקיון";
  return "כללי";
}

/* ==== State ==== */
let PRODUCTS = parseProducts(RAW_PRODUCTS);
let filtered = [...PRODUCTS];

/* ==== DOM helpers ==== */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

/* ==== Init ==== */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  bindHeader();
  bindMobileMenu();
  bindAnimateOnScroll();

  setupFilters();
  renderProducts();

  bindContactActions();

  $("#year").textContent = new Date().getFullYear();
});

/* ==== Theme (Light default, toggle Dark) ==== */
function initTheme(){
  const root = document.documentElement;
  const saved = localStorage.getItem("mm-theme");
  if (saved === "dark") root.classList.remove("light");
  $("#themeToggle")?.addEventListener("click", () => {
    const isLight = root.classList.contains("light");
    if (isLight) root.classList.remove("light"); else root.classList.add("light");
    localStorage.setItem("mm-theme", isLight ? "dark" : "light");
  });
}

/* ==== Navbar active links ==== */
function bindHeader(){
  const links = $$("header nav a");
  const sections = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id = "#" + e.target.id;
        links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === id));
      }
    });
  },{rootMargin:"-35% 0px -60% 0px", threshold:0.1});
  sections.forEach(sec => obs.observe(sec));
}

/* ==== Mobile menu ==== */
function bindMobileMenu(){
  const btn = $("#mobileMenuBtn");
  const menu = $("#mobileMenu");
  if(!btn || !menu) return;
  btn.addEventListener("click", ()=> menu.classList.toggle("open"));
  $$("a", menu).forEach(a => a.addEventListener("click", ()=> menu.classList.remove("open")));
}

/* ==== Animate on scroll ==== */
function bindAnimateOnScroll(){
  const els = $$("[data-animate]");
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add("in"); obs.unobserve(e.target); }
    });
  },{threshold:0.1});
  els.forEach(el=>obs.observe(el));
}

/* ==== Filters & search ==== */
function setupFilters(){
  const catSel = $("#categorySelect");
  const cats = ["כל הקטגוריות", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  catSel.innerHTML = `<option value="__all">כל הקטגוריות</option>` +
    cats.filter(c=>c!=="כל הקטגוריות").map(c=>`<option>${c}</option>`).join("");

  $("#searchInput").addEventListener("input", applyFilters);
  catSel.addEventListener("change", applyFilters);
  $("#sortSelect").addEventListener("change", applyFilters);
}

function applyFilters(){
  const q = $("#searchInput").value.trim();
  const cat = $("#categorySelect").value;
  const sort = $("#sortSelect").value;

  filtered = PRODUCTS.filter(p=>{
    const inCat = (cat === "__all") || (p.category === cat);
    if (!q) return inCat;
    const s = q.toLowerCase();
    return inCat && (
      p.name.toLowerCase().includes(s) ||
      String(p.barcode).includes(s)
    );
  });

  if (sort === "priceAsc") filtered.sort((a,b)=>a.price-b.price);
  else if (sort === "priceDesc") filtered.sort((a,b)=>b.price-a.price);
  else filtered.sort((a,b)=>a.name.localeCompare(b.name,'he'));

  renderProducts();
}

/* ==== Render ==== */
function renderProducts(){
  const grid = $("#productsGrid");
  const info = $("#countInfo");
  grid.innerHTML = "";

  info.textContent = `${filtered.length.toLocaleString("he-IL")} מוצרים`;
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="card" style="grid-column:1/-1">לא נמצאו מוצרים להתאמה.</div>`;
    return;
  }

  filtered.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card product";
    card.innerHTML = `
      <div class="top">
        <div class="title" title="${p.name}">${p.name}</div>
        <div class="price">₪${p.price.toFixed(2)}</div>
      </div>
      <div class="barcode">ברקוד: ${p.barcode}</div>
      <div class="muted">${p.category}</div>
    `;
    grid.appendChild(card);
  });
}

/* ==== Contact actions (no online orders) ==== */
function bindContactActions(){
  const aWA = $("#sendWA");
  const aMail = $("#sendMail");
  const form = $("#contactForm");

  aWA?.addEventListener("click", (e)=>{
    e.preventDefault();
    if(!form) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const text = [
      WA_PREFIX,
      "",
      `שם: ${data.name||""}`,
      `טלפון: ${data.phone||""}`,
      `הודעה: ${data.message||""}`
    ].join("\n");
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  aMail?.addEventListener("click", (e)=>{
    e.preventDefault();
    if(!form) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const subject = "פניה מאתר מכולת מבואות יריחו";
    const body = [
      WA_PREFIX,
      "",
      `שם: ${data.name||""}`,
      `טלפון: ${data.phone||""}`,
      `הודעה: ${data.message||""}`
    ].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

/* ==== TIP: עדכון נתונים בלי לגעת בקוד ==== */
/*
  אם תרצה בעתיד לשמור את הרשימה כקובץ:
  1) צור assets/products.csv עם שלושה טורים: name,barcode,price
  2) הוסף כאן פונקציה שמביאה אותו:
     fetch("assets/products.csv").then(r=>r.text()).then(t=>{ PRODUCTS = parseProducts(t); setupFilters(); applyFilters(); });

  לעכשיו אנחנו עובדים על RAW_PRODUCTS שמודבק כאן בקוד.
*/

// TODO: הדבק כאן את כל הרשימה המלאה שלך במקום ה-Raw למעלה אם תרצה להחליף/להרחיב.
