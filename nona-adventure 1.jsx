import React, { useState, useEffect, useMemo } from "react";

/* ============================================================
   ⚠️ אלעד — תחליף את הטקסטים כאן במילים שלך.
   כל תחנה מציגה פתק מקופל "💌 מאלעד" שנפתח בלחיצה.
   ============================================================ */
const LOVE_NOTES = {
  1: "רצית לחתום קבע והצבא אמר לא תודה. אז הוא שלח לך צ׳ק במקום. בגדול יצאת מורווחת",
  2: "בפסיכומטרי אין מבדקי ריצה. רק לשבת על כיסא שלוש שעות ולחשוב. זה בדיוק המקצוע שלך",
  3: "יום אחד תפתחי תלוש ותביני כל שורה בו. ועל הלוגו למעלה יהיה כתוב משרד הביטחון",
  4: "את זו שרצתה לחתום לעשרים שנה קדימה אז תכנון ארוך טווח זה לא משהו שצריך למכור לך",
  5: "לא צריך להיות עשירה כדי להתחיל. צריך רק להתחיל. את יודעת את זה יותר טוב מכולם",
  6: "שמתי לך את המזרח כברירת מחדל. זה לא ניחוש. כבר בדקתי מחירי טיסות",
  7: "שים לב שאין פה עדיין שורה של גן ילדים. עוד נגיע לזה. לאט לאט. נשימה",
  8: "זה כסף שמחכה שמישהי תרים טלפון ותבקש. תתאמני על זה כי בקרוב את בצד השני של השולחן",
};

/* ============================================================
   נתונים שקל לעדכן
   ============================================================ */
const RATES = {
  fighter: { label: "לוחמת", emoji: "🎖️", grant: 560, deposit: 810 },
  support: { label: "תומכת לחימה", emoji: "🛠️", grant: 420, deposit: 610 },
  rear: { label: "ג'ובניקית", emoji: "☕", grant: 280, deposit: 405 },
};

const TAX_BRACKETS = [
  [7010, 0.1], [10060, 0.14], [16150, 0.2],
  [22440, 0.31], [46690, 0.35], [60130, 0.47], [Infinity, 0.5],
];
const CREDIT_BASE = 2.75;
const CREDIT_VALUE = 242;
const NI_STEP = 7522;

const TRIP = {
  east: {
    label: "המזרח", emoji: "🛕", flight: 3800,
    countries: "תאילנד · וייטנאם · לאוס · הודו · נפאל",
    styles: {
      saver: { label: "חסכנית", emoji: "🎒", perMonth: 3800 },
      normal: { label: "ממוצעת", emoji: "😎", perMonth: 5500 },
      lux: { label: "מפנקת", emoji: "🍹", perMonth: 8000 },
    },
  },
  south: {
    label: "דרום אמריקה", emoji: "🏔️", flight: 6000,
    countries: "פרו · בוליביה · ארגנטינה · ברזיל · קולומביה",
    styles: {
      saver: { label: "חסכנית", emoji: "🎒", perMonth: 5000 },
      normal: { label: "ממוצעת", emoji: "😎", perMonth: 7500 },
      lux: { label: "מפנקת", emoji: "🍹", perMonth: 10500 },
    },
  },
};
const TRIP_GEAR = 4000;

const PERKS = [
  {
    emoji: "🚫💰", title: "המענק והפיקדון פטורים ממס",
    body: "כל שקל שהצבא נותן לך נכנס נקי. לא צריך לדווח, לא צריך לשלם. פשוט שלך.",
    color: "mint",
  },
  {
    emoji: "🎖️", title: "נקודות זיכוי של משוחררת",
    body: "עד 2 נקודות זיכוי נוספות במס הכנסה, ל-36 חודשים מהשחרור. שווה מאות שקלים בחודש. ודאי עם המעסיק שהוא הזין את זה בתלוש!",
    color: "pink",
  },
  {
    emoji: "🎓", title: "מימון שכר לימוד",
    body: "לוחמות, תומכות לחימה ומשרתות באזורי עדיפות עשויות להיות זכאיות למימון שנת לימודים ראשונה. שווה לבדוק זכאות באגף והקרן.",
    color: "grape",
  },
  {
    emoji: "🏠", title: "הנחה בארנונה כסטודנטית",
    body: "הרבה רשויות מקומיות נותנות הנחה בארנונה לסטודנטים. משתנה מעיר לעיר — תתקשרי לעירייה ותשאלי.",
    color: "sky",
  },
  {
    emoji: "💼", title: "ייעוץ והכוונה — חינם",
    body: "לאגף והקרן לחיילים משוחררים יש מרכזי הכוונה: ייעוץ לימודים, תעסוקה וסדנאות. לא עולה כלום ואף אחד לא מספר לך על זה.",
    color: "lemon",
  },
  {
    emoji: "🏦", title: "חשבון בנק לחייל משוחרר",
    body: "הבנקים מציעים הטבות למשוחררים — פטור מעמלות לתקופה, הלוואות בתנאים מיוחדים. תשוו בין שניים-שלושה לפני שחותמים.",
    color: "coral",
  },
];

const C = {
  ink: "#4A2F49", inkSoft: "#9C7A9B",
  pink: "#FF8FB1", pinkDeep: "#E45C87",
  mint: "#6FD3C7", mintDeep: "#33A99B",
  lemon: "#FFD166", lemonDeep: "#E0A72E",
  grape: "#A98BEA", grapeDeep: "#7C5BD1",
  sky: "#6FB5F0", skyDeep: "#3A87CB",
  coral: "#FF9770", coralDeep: "#E06A44",
  white: "#FFFFFF", panel: "#FFF6FA",
};

const shekel = (n) =>
  "₪" + Math.round(n).toLocaleString("he-IL", { maximumFractionDigits: 0 });

/* ---------- חישובים ---------- */
function incomeTax(gross, creditPoints) {
  let remaining = gross, prev = 0, tax = 0;
  for (const [ceil, rate] of TAX_BRACKETS) {
    const slice = Math.max(0, Math.min(remaining, ceil - prev));
    tax += slice * rate;
    remaining -= slice;
    prev = ceil;
    if (remaining <= 0) break;
  }
  return Math.max(0, tax - creditPoints * CREDIT_VALUE);
}
function payslip(gross, creditPoints) {
  const tax = incomeTax(gross, creditPoints);
  const low = Math.min(gross, NI_STEP);
  const high = Math.max(0, gross - NI_STEP);
  const ni = low * 0.004 + high * 0.07;
  const health = low * 0.031 + high * 0.05;
  return { tax, ni, health, net: gross - tax - ni - health };
}
function futureValue(monthly, years, annualRate, lump = 0) {
  const r = annualRate / 12, n = years * 12;
  const fromLump = lump * Math.pow(1 + r, n);
  const fromMonthly = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r);
  return fromLump + fromMonthly;
}

/* ---------- רכיבי בסיס ---------- */
function Slider({ value, min, max, step, onChange, color }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="nona-slider w-full"
      style={{ background: `linear-gradient(to left, ${color} 0%, ${color} ${pct}%, #F1E4EE ${pct}%, #F1E4EE 100%)` }}
    />
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-5">
      <div className="mb-2 text-sm font-black" style={{ color: C.inkSoft }}>{label}</div>
      {children}
    </div>
  );
}

function Choice({ options, value, onChange, color, deep }) {
  return (
    <div className="flex gap-2">
      {options.map((o) => {
        const on = value === o.key;
        return (
          <button key={o.key} onClick={() => onChange(o.key)}
            className="flex-1 rounded-2xl px-2 py-3 text-sm font-black transition"
            style={{
              background: on ? color : "#FBF0F6",
              color: on ? "#fff" : C.inkSoft,
              boxShadow: on ? `0 5px 0 ${deep}` : "0 3px 0 rgba(0,0,0,0.05)",
              transform: on ? "translateY(-1px)" : "none",
            }}>
            <div className="text-lg">{o.emoji}</div>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Bubble({ children, color, sub }) {
  return (
    <div className="flex-1 rounded-3xl px-3 py-4 text-center"
      style={{ background: color, boxShadow: "0 8px 0 rgba(0,0,0,0.08), 0 12px 22px rgba(0,0,0,0.10)" }}>
      <div className="text-xs font-black text-white opacity-90">{sub}</div>
      <div className="mt-1 text-2xl font-black text-white">{children}</div>
    </div>
  );
}

function Big({ sub, children, from, to }) {
  return (
    <div key={String(children)} className="nona-pop mt-3 rounded-3xl px-4 py-5 text-center"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: "0 10px 0 rgba(0,0,0,0.08), 0 16px 30px rgba(0,0,0,0.12)" }}>
      <div className="text-sm font-black text-white opacity-95">{sub}</div>
      <div className="text-4xl font-black text-white">{children}</div>
    </div>
  );
}

function Note({ children }) {
  return <p className="mt-4 text-xs leading-relaxed" style={{ color: C.inkSoft }}>{children}</p>;
}

/* פתק אישי מאלעד */
function LoveNote({ id, color, deep }) {
  const [open, setOpen] = useState(false);
  const text = LOVE_NOTES[id];
  if (!text) return null;
  return (
    <div className="mt-6">
      <button onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition"
        style={{
          background: open ? "#fff" : "#FFF0F6",
          color: deep,
          boxShadow: open ? `inset 0 0 0 2px ${color}` : `0 4px 0 rgba(0,0,0,0.05)`,
        }}>
        <span>💌 פתק קטן מאלעד</span>
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
      </button>
      {open && (
        <div className="nona-pop mt-2 rounded-2xl px-4 py-4 text-sm leading-relaxed"
          style={{
            background: `linear-gradient(135deg, ${color}22, ${color}0D)`,
            color: C.ink,
            boxShadow: `inset 0 0 0 2px ${color}55`,
            fontStyle: "italic",
          }}>
          "{text}"
          <div className="mt-2 text-left text-xs font-black" style={{ color: deep }}>— אלעד ❤️</div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   1 — מענק ופיקדון
   ============================================================ */
function StageGrant() {
  const [role, setRole] = useState("fighter");
  const [months, setMonths] = useState(24);
  const r = RATES[role];
  const grant = r.grant * months;
  const deposit = r.deposit * months;

  return (
    <div>
      <p className="mb-5 leading-relaxed" style={{ color: C.ink }}>
        נונה, הצבא נפרד ממך עם שתי מעטפות. <b>מענק שחרור</b> — כסף חופשי שנוחת
        בבנק, את עושה איתו מה שבא לך. <b>פיקדון אישי</b> — כסף שמחכה בצד ומיועד
        ללימודים, הכשרה מקצועית או דיור. שניהם גדלים ככל ששירתת יותר.
      </p>
      <Field label="איפה שירתת?">
        <Choice value={role} onChange={setRole} color={C.pink} deep={C.pinkDeep}
          options={Object.entries(RATES).map(([key, v]) => ({ key, label: v.label, emoji: v.emoji }))} />
      </Field>
      <Field label={`חודשי שירות: ${months}`}>
        <Slider value={months} min={12} max={36} step={1} onChange={setMonths} color={C.pink} />
      </Field>
      <div className="mt-6 flex gap-3">
        <Bubble color={C.mint} sub="מענק שחרור">{shekel(grant)}</Bubble>
        <Bubble color={C.grape} sub="פיקדון אישי">{shekel(deposit)}</Bubble>
      </div>
      <Big sub="סך הכל מחכה לך 🎉" from={C.lemon} to={C.pink}>{shekel(grant + deposit)}</Big>
      <Note>
        הערכה בלבד — התעריפים מתעדכנים לפי המדד. הסכום המדויק שלך מופיע באזור האישי ובמחשבון של{" "}
        <a href="https://www.hachvana.mod.gov.il/GrantAndDeposit/Pages/default.aspx" target="_blank" rel="noreferrer"
          className="font-black underline" style={{ color: C.grapeDeep }}>האגף והקרן לחיילים משוחררים</a>.
      </Note>
    </div>
  );
}

/* ============================================================
   2 — פסיכומטרי / מכינה + מכללה מול אוניברסיטה
   ============================================================ */
const QUIZ = [
  {
    q: "האנגלית שלך — איפה היא בערך?",
    a: [
      { t: "מדברת, קוראת, נטפליקס בלי כתוביות", emoji: "🇬🇧", score: 2 },
      { t: "מסתדרת, אבל דקדוק זה סיוט", emoji: "😅", score: 1 },
      { t: "Hello. My name is... זהו", emoji: "🫠", score: 0 },
    ],
  },
  {
    q: "איך את אוהבת להתמודד עם אתגר?",
    a: [
      { t: "לתת בראש בבחינה אחת ולגמור עם זה", emoji: "⚡", score: 2 },
      { t: "לפרוס לאורך זמן, בקצב שלי", emoji: "🐢", score: 0 },
      { t: "תלוי כמה קפה יש בבית", emoji: "☕", score: 1 },
    ],
  },
];
const VERDICTS = [
  { min: 3, emoji: "🧠", title: "פסיכומטרי קטן עלייך, נונה!", color: C.grape,
    text: 'יש לך בסיס ואופי של ספרינטרית. קורס פסיכומטרי, אמיר"ם לפטור באנגלית, וקדימה לתואר. בונוס: אפשר לממן את הקורס מהפיקדון.' },
  { min: 2, emoji: "⚖️", title: "את בדיוק על הגדר", color: C.sky,
    text: "שני המסלולים פתוחים. תעשי סימולציה של פסיכומטרי בבית — אם התוצאה קרובה ליעד, לכי על זה. אם לא, מכינה תיתן לך רשת ביטחון." },
  { min: 0, emoji: "🌿", title: "לכי למכינה ותהני מהדרך", color: C.mint,
    text: "מכינה קדם-אקדמית מקבלת אותך בלי פסיכומטרי, בונה את הבסיס לאט ובסוף פותחת דלת לתואר. פחות לחץ, אותו יעד." },
];
const COMPARE = [
  { k: "הקבלה", uni: "בדרך כלל סף גבוה יותר", col: "לרוב סף נגיש יותר" },
  { k: "המחיר", uni: "שכר לימוד מסובסד", col: "לרוב יקר יותר (פרטית)" },
  { k: "האווירה", uni: "מחקרי, תיאורטי, גדול", col: "יישומי, כיתות קטנות" },
  { k: "התואר", uni: "B.A/B.Sc מוכר", col: 'מוכר ע"י המל"ג — בדקי!' },
  { k: "המשך", uni: "מסלול ישיר לתואר שני", col: "תואר שני אפשרי, לפעמים בתנאים" },
];

function StageQuiz() {
  const [picked, setPicked] = useState([null, null]);
  const [tab, setTab] = useState(null);
  const done = picked.every((p) => p !== null);
  const score = done ? picked.reduce((s, idx, qi) => s + QUIZ[qi].a[idx].score, 0) : 0;
  const verdict = done ? VERDICTS.find((v) => score >= v.min) : null;

  return (
    <div>
      <p className="mb-5 leading-relaxed" style={{ color: C.ink }}>
        נונה, יש שני כרטיסי כניסה לתואר. <b>פסיכומטרי</b> — מבחן אחד שנותן ציון לקבלה.{" "}
        <b>מכינה קדם-אקדמית</b> — שנה של לימודים שמחליפה אותו. ובנפרד יש <b>אמיר"ם/אמיר</b>,
        מבחן קצר באנגלית בלבד שקובע אם תצטרכי קורסי אנגלית באקדמיה או שתקבלי פטור.
      </p>

      {QUIZ.map((item, qi) => (
        <div key={qi} className="mb-5">
          <div className="mb-2 font-black" style={{ color: C.ink }}>{item.q}</div>
          <div className="flex flex-col gap-2">
            {item.a.map((opt, ai) => {
              const on = picked[qi] === ai;
              return (
                <button key={ai}
                  onClick={() => setPicked((p) => { const n = [...p]; n[qi] = ai; return n; })}
                  className="rounded-2xl px-4 py-3 text-right text-sm font-black transition"
                  style={{
                    background: on ? C.lemon : "#FBF0F6",
                    color: on ? "#fff" : C.ink,
                    boxShadow: on ? `0 4px 0 ${C.lemonDeep}` : "0 3px 0 rgba(0,0,0,0.05)",
                  }}>
                  <span className="ml-2">{opt.emoji}</span>{opt.t}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {verdict && (
        <div className="nona-pop mb-6 rounded-3xl p-5 text-center"
          style={{ background: verdict.color, boxShadow: "0 10px 0 rgba(0,0,0,0.08), 0 16px 30px rgba(0,0,0,0.12)" }}>
          <div className="text-4xl">{verdict.emoji}</div>
          <div className="mt-1 text-xl font-black text-white">{verdict.title}</div>
          <p className="mt-2 text-sm leading-relaxed text-white opacity-95">{verdict.text}</p>
        </div>
      )}

      <div className="rounded-3xl p-4" style={{ background: C.panel, boxShadow: "inset 0 0 0 2px #F6E2EE" }}>
        <div className="mb-1 text-lg font-black" style={{ color: C.grapeDeep }}>ורגע — מכללה או אוניברסיטה? 🎓</div>
        <p className="mb-4 text-sm leading-relaxed" style={{ color: C.ink }}>
          שתיהן נותנות תואר אמיתי. אוניברסיטה נוטה למחקרי, תיאורטי וסלקטיבי; מכללה נוטה
          ליישומי, אישי ונגיש יותר בקבלה. השאלה היחידה שחשובה: מה מתאים לך, ומה המעסיקים
          בתחום שלך מחפשים.
        </p>
        <div className="mb-3 flex gap-2">
          <button onClick={() => setTab(tab === "uni" ? null : "uni")}
            className="flex-1 rounded-2xl py-3 text-sm font-black transition"
            style={{ background: tab === "uni" ? C.sky : "#FBF0F6", color: tab === "uni" ? "#fff" : C.inkSoft,
              boxShadow: tab === "uni" ? `0 5px 0 ${C.skyDeep}` : "0 3px 0 rgba(0,0,0,0.05)" }}>
            🏛️ אוניברסיטה
          </button>
          <button onClick={() => setTab(tab === "col" ? null : "col")}
            className="flex-1 rounded-2xl py-3 text-sm font-black transition"
            style={{ background: tab === "col" ? C.coral : "#FBF0F6", color: tab === "col" ? "#fff" : C.inkSoft,
              boxShadow: tab === "col" ? `0 5px 0 ${C.coralDeep}` : "0 3px 0 rgba(0,0,0,0.05)" }}>
            🏫 מכללה
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {COMPARE.map((row) => (
            <div key={row.k} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2"
              style={{ boxShadow: "0 3px 0 rgba(0,0,0,0.04)" }}>
              <div className="w-14 shrink-0 text-xs font-black" style={{ color: C.inkSoft }}>{row.k}</div>
              <div className="flex-1 text-xs font-bold transition"
                style={{ color: tab === "col" ? "#CFC0D5" : C.skyDeep, opacity: tab === "col" ? 0.5 : 1 }}>
                🏛️ {row.uni}
              </div>
              <div className="flex-1 text-xs font-bold transition"
                style={{ color: tab === "uni" ? "#CFC0D5" : C.coralDeep, opacity: tab === "uni" ? 0.5 : 1 }}>
                🏫 {row.col}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Note>גם מכינה וגם קורס פסיכומטרי ניתנים למימון מכספי הפיקדון האישי. 💜</Note>
    </div>
  );
}

/* ============================================================
   3 — ברוטו ונטו + מדרגות מס + הטבת משוחררת
   ============================================================ */
const LADDER = [
  { upto: "עד 7,010", rate: "10%", c: C.mint, top: 7010 },
  { upto: "7,011–10,060", rate: "14%", c: C.sky, top: 10060 },
  { upto: "10,061–16,150", rate: "20%", c: C.grape, top: 16150 },
  { upto: "16,151–22,440", rate: "31%", c: C.pink, top: 22440 },
  { upto: "22,441–46,690", rate: "35%", c: C.coral, top: 46690 },
  { upto: "מעל 46,690", rate: "47%+", c: C.lemonDeep, top: Infinity },
];

function StageNet() {
  const [gross, setGross] = useState(12000);
  const [vet, setVet] = useState(true);
  const credits = CREDIT_BASE + (vet ? 2 : 0);
  const { tax, ni, health, net } = payslip(gross, credits);
  const saved = net - payslip(gross, CREDIT_BASE).net;

  const coins = useMemo(() => {
    const parts = [
      { n: Math.round((net / gross) * 28), e: "💵" },
      { n: Math.round((tax / gross) * 28), e: "🏛️" },
      { n: Math.round((ni / gross) * 28), e: "🛡️" },
      { n: Math.round((health / gross) * 28), e: "🩺" },
    ];
    const arr = [];
    parts.forEach((p, i) => { for (let k = 0; k < p.n; k++) arr.push({ e: p.e, key: `${i}-${k}` }); });
    return arr;
  }, [gross, net, tax, ni, health]);

  const active = LADDER.findIndex((s) => gross <= s.top);

  return (
    <div>
      <p className="mb-5 leading-relaxed" style={{ color: C.ink }}>
        נונה, <b>ברוטו</b> זה המספר שמבטיחים לך בראיון. <b>נטו</b> זה מה שבאמת נוחת בבנק.
        בדרך המדינה לוקחת נתח: מס הכנסה, ביטוח לאומי וביטוח בריאות. תגררי ותראי לאן הכסף עף.
      </p>
      <Field label={`שכר ברוטו: ${shekel(gross)}`}>
        <Slider value={gross} min={6000} max={30000} step={250} onChange={setGross} color={C.sky} />
      </Field>
      <div className="rounded-3xl p-4" style={{ background: C.panel }}>
        <div className="flex flex-wrap justify-center gap-1 text-2xl">
          {coins.map((c, i) => (
            <span key={c.key} className="nona-coin" style={{ animationDelay: `${i * 18}ms` }}>{c.e}</span>
          ))}
        </div>
      </div>
      <div className="mt-4"><Bubble color={C.mint} sub="נטו לחשבון 💵">{shekel(net)}</Bubble></div>
      <div className="mt-2 flex gap-2">
        <Bubble color={C.pink} sub="מס הכנסה 🏛️">{shekel(tax)}</Bubble>
        <Bubble color={C.grape} sub="ב״ל 🛡️">{shekel(ni)}</Bubble>
        <Bubble color={C.lemon} sub="בריאות 🩺">{shekel(health)}</Bubble>
      </div>

      <div className="mt-6 rounded-3xl p-4" style={{ background: C.panel }}>
        <div className="mb-1 text-lg font-black" style={{ color: C.grapeDeep }}>מה זה "מדרגות מס"? 🪜</div>
        <p className="mb-4 text-sm leading-relaxed" style={{ color: C.ink }}>
          זה לא שאם עברת סכום מסוים <b>כל</b> המשכורת מחויבת יותר. המס עולה <b>רק על החלק</b>{" "}
          שנכנס למדרגה הבאה. השקל הראשון תמיד ב-10%.
        </p>
        <div className="flex items-end justify-center gap-1">
          {LADDER.map((s, i) => (
            <div key={i} className="flex flex-1 flex-col items-center">
              <div className="mb-1 text-xs font-black" style={{ color: i <= active ? C.ink : "#D8C6D6" }}>{s.rate}</div>
              <div className="nona-step w-full rounded-t-xl"
                style={{ height: 14 + i * 12, background: i <= active ? s.c : "#EFE0EA",
                  boxShadow: i <= active ? "0 3px 0 rgba(0,0,0,0.10)" : "none", animationDelay: `${i * 60}ms` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-xs font-black" style={{ color: C.inkSoft }}>
          את במדרגה: {LADDER[active]?.upto} ({LADDER[active]?.rate})
        </div>
      </div>

      <div className="mt-4 rounded-3xl p-4" style={{ background: C.panel }}>
        <div className="mb-1 text-lg font-black" style={{ color: C.pinkDeep }}>ומה מגיע לך כמשוחררת? 🎖️</div>
        <p className="mb-3 text-sm leading-relaxed" style={{ color: C.ink }}>
          <b>נקודות זיכוי</b> הן הנחה קבועה במס. כל תושבת מקבלת 2.25, אישה עוד 0.25 —
          ומשוחררת מקבלת עוד <b>עד 2 נקודות</b> ב-36 החודשים הראשונים. תלחצי ותראי.
        </p>
        <button onClick={() => setVet((v) => !v)}
          className="w-full rounded-2xl py-3 text-sm font-black transition"
          style={{ background: vet ? C.pink : "#FBF0F6", color: vet ? "#fff" : C.inkSoft,
            boxShadow: vet ? `0 5px 0 ${C.pinkDeep}` : "0 3px 0 rgba(0,0,0,0.05)" }}>
          {vet ? "✓ נקודות הזיכוי של משוחררת פעילות" : "הפעילי נקודות זיכוי של משוחררת"}
        </button>
        {vet && saved > 0 && (
          <div key={Math.round(saved)} className="nona-pop mt-3 rounded-2xl py-3 text-center text-sm font-black text-white"
            style={{ background: C.mintDeep }}>
            חסכת {shekel(saved)} מס בחודש — {shekel(saved * 12)} בשנה 🎉
          </div>
        )}
      </div>
      <Note>חישוב מקורב לשכירה. השיעורים מתעדכנים כל שנה — התלוש האמיתי הוא המקור המחייב.</Note>
    </div>
  );
}

/* ============================================================
   4 — פנסיה
   ============================================================ */
function StagePension() {
  const [salary, setSalary] = useState(10000);
  const [years, setYears] = useState(45);
  const rate = 0.05;
  const monthly = salary * 0.2083;
  const fv = futureValue(monthly, years, rate);
  const deposited = monthly * years * 12;

  const bars = useMemo(() => {
    const out = [];
    const step = Math.max(1, Math.round(years / 30));
    for (let y = 0; y <= years; y += step) out.push(futureValue(monthly, y, rate));
    return out;
  }, [monthly, years]);
  const maxV = Math.max(...bars, 1);

  return (
    <div>
      <p className="mb-5 leading-relaxed" style={{ color: C.ink }}>
        נונה, פנסיה זה לא "כסף לסבתא" — זו משכורת עתידית שאת בונה מהיום. את מפרישה כ-6%
        מהשכר, המעסיק מוסיף כ-14.5%. הכל יושב בקרן פנסיה <b>שאת בוחרת</b> (כן, את! שווה
        להשוות דמי ניהול) וצומח לבד.
      </p>
      <Field label={`שכר חודשי: ${shekel(salary)}`}>
        <Slider value={salary} min={5000} max={30000} step={250} onChange={setSalary} color={C.mint} />
      </Field>
      <Field label={`שנים עד הפרישה: ${years}`}>
        <Slider value={years} min={5} max={47} step={1} onChange={setYears} color={C.grape} />
      </Field>
      <div className="rounded-3xl p-4" style={{ background: C.panel }}>
        <div className="flex h-40 items-end gap-1">
          {bars.map((v, i) => (
            <div key={i} className="nona-bar flex-1 rounded-t-lg"
              style={{ height: `${(v / maxV) * 100}%`,
                background: `linear-gradient(180deg, ${C.mint}, ${C.grape})`, animationDelay: `${i * 20}ms` }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs font-black" style={{ color: C.inkSoft }}>
          <span>היום</span><span>עוד {years} שנה</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Bubble color={C.sky} sub="הפקדת מהכיס">{shekel(deposited)}</Bubble>
        <Bubble color={C.lemon} sub="הריבית עשתה לבד ✨">{shekel(fv - deposited)}</Bubble>
      </div>
      <Big sub="הצבירה שלך בגיל פרישה" from={C.grape} to={C.mint}>{shekel(fv)}</Big>
      <Note>בהנחת תשואה ממוצעת של 5% בשנה. השוק עולה ויורד — זו הערכה, לא הבטחה.</Note>
    </div>
  );
}

/* ============================================================
   5 — השקעות
   ============================================================ */
function StageInvest() {
  const [lump, setLump] = useState(20000);
  const [monthly, setMonthly] = useState(500);
  const rate = 0.08, W = 320, H = 150, maxY = 20;
  const maxV = futureValue(monthly, maxY, rate, lump) || 1;

  const d = useMemo(() => {
    const out = [];
    for (let i = 0; i <= 80; i++) {
      const y = (i / 80) * maxY;
      const v = futureValue(monthly, y, rate, lump);
      out.push(`${i ? "L" : "M"}${((i / 80) * W).toFixed(1)},${(H - (v / maxV) * H).toFixed(1)}`);
    }
    return out.join(" ");
  }, [monthly, lump, maxV]);

  const milestones = [5, 10, 20].map((y) => {
    const v = futureValue(monthly, y, rate, lump);
    return { y, v, put: lump + monthly * y * 12, x: (y / maxY) * W, py: H - (v / maxV) * H };
  });

  return (
    <div>
      <p className="mb-5 leading-relaxed" style={{ color: C.ink }}>
        נונה, <b>מניה</b> זו חתיכה קטנטנה מחברה. <b>מדד</b> כמו S&P 500 זה סל של 500 חברות
        ביחד — קונה אחת, מפזרת סיכון. בפועל: פותחים חשבון מסחר בבנק או בבית השקעות, קונים
        קרן שעוקבת אחרי המדד, ומפקידים כל חודש. זהו.
      </p>
      <Field label={`כמה כסף יש לך עכשיו: ${shekel(lump)}`}>
        <Slider value={lump} min={0} max={100000} step={1000} onChange={setLump} color={C.grape} />
      </Field>
      <Field label={`הפקדה חודשית: ${shekel(monthly)}`}>
        <Slider value={monthly} min={0} max={3000} step={50} onChange={setMonthly} color={C.lemon} />
      </Field>
      <div className="rounded-3xl p-3" style={{ background: C.panel }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ direction: "ltr" }}>
          <defs>
            <linearGradient id="g5" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.pink} stopOpacity="0.6" />
              <stop offset="100%" stopColor={C.lemon} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#g5)" />
          <path d={d} fill="none" stroke={C.pinkDeep} strokeWidth="3.5" strokeLinecap="round" />
          {milestones.map((m) => (
            <g key={m.y}>
              <line x1={m.x} y1={m.py} x2={m.x} y2={H} stroke={C.inkSoft} strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
              <circle cx={m.x} cy={m.py} r="6" fill="#fff" stroke={C.pinkDeep} strokeWidth="3" />
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {milestones.map((m) => (
          <div key={m.y} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
            style={{ boxShadow: "0 4px 0 rgba(0,0,0,0.05), 0 8px 18px rgba(0,0,0,0.06)" }}>
            <div className="text-sm font-black" style={{ color: C.grapeDeep }}>עוד {m.y} שנה</div>
            <div className="text-left">
              <div className="text-lg font-black" style={{ color: C.ink }}>{shekel(m.v)}</div>
              <div className="text-xs font-black" style={{ color: C.inkSoft }}>מתוכם {shekel(m.put)} מהכיס</div>
            </div>
          </div>
        ))}
      </div>
      <Note>בהנחת תשואה שנתית ממוצעת של 8% (ממוצע היסטורי, לפני מס ועמלות). זו לא המלצת השקעה — המחשה של כוח הזמן.</Note>
    </div>
  );
}

/* ============================================================
   6 — הטיול הגדול
   ============================================================ */
function StageTrip() {
  const [dest, setDest] = useState("east");
  const [style, setStyle] = useState("normal");
  const [months, setMonths] = useState(4);
  const d = TRIP[dest], s = d.styles[style];
  const living = s.perMonth * months;
  const total = living + d.flight + TRIP_GEAR;

  return (
    <div>
      <p className="mb-5 leading-relaxed" style={{ color: C.ink }}>
        נונה, זה הרגע שכולם מדברים עליו. שתי שאלות מכריעות את התקציב: <b>לאן</b> ו<b>לכמה
        זמן</b>. המזרח זול יותר, דרום אמריקה יקרה יותר אבל פראית יותר.
      </p>
      <Field label="לאן טסים?">
        <Choice value={dest} onChange={setDest} color={C.coral} deep={C.coralDeep}
          options={[{ key: "east", label: TRIP.east.label, emoji: TRIP.east.emoji },
                    { key: "south", label: TRIP.south.label, emoji: TRIP.south.emoji }]} />
        <div className="mt-2 text-center text-xs font-black" style={{ color: C.inkSoft }}>{d.countries}</div>
      </Field>
      <Field label="סגנון מטיילת">
        <Choice value={style} onChange={setStyle} color={C.grape} deep={C.grapeDeep}
          options={Object.entries(d.styles).map(([key, v]) => ({ key, label: v.label, emoji: v.emoji }))} />
      </Field>
      <Field label={`כמה חודשים: ${months}`}>
        <Slider value={months} min={1} max={12} step={1} onChange={setMonths} color={C.coral} />
      </Field>
      <div className="rounded-3xl p-4" style={{ background: C.panel }}>
        <div className="flex flex-wrap justify-center gap-1 text-2xl">
          {Array.from({ length: months }).map((_, i) => (
            <span key={i} className="nona-coin" style={{ animationDelay: `${i * 60}ms` }}>{d.emoji}</span>
          ))}
        </div>
        <div className="mt-2 text-center text-xs font-black" style={{ color: C.inkSoft }}>
          {shekel(s.perMonth)} לחודש × {months} = {shekel(living)}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Bubble color={C.sky} sub="טיסות ✈️">{shekel(d.flight)}</Bubble>
        <Bubble color={C.mint} sub="ציוד וביטוח 🎒">{shekel(TRIP_GEAR)}</Bubble>
      </div>
      <Big sub={`התקציב לטיול ב${d.label}`} from={C.coral} to={C.pink}>{shekel(total)}</Big>
      <div className="mt-3 rounded-2xl px-4 py-3 text-center text-sm font-black text-white" style={{ background: C.grapeDeep }}>
        💡 המענק והפיקדון לבד יכולים לכסות חלק גדול מזה, נונה.
      </div>
      <Note>הערכות לפי מדריכי מטיילים 2026 (מזרח ~4,000–6,000 ₪ לחודש, דרום אמריקה ~6,000–8,000 ₪ לחודש). משתנה לפי מדינה, עונה ושער מטבע.</Note>
    </div>
  );
}

/* ============================================================
   7 — כמה עולה לחיות?
   ============================================================ */
const EXPENSES = [
  { key: "rent", label: "שכר דירה", emoji: "🏠", min: 0, max: 7000, step: 100, def: 3000, color: C.pink },
  { key: "food", label: "אוכל וסופר", emoji: "🛒", min: 0, max: 4000, step: 100, def: 1600, color: C.mint },
  { key: "transport", label: "ניידות", emoji: "🚌", min: 0, max: 3000, step: 100, def: 500, color: C.sky },
  { key: "bills", label: "חשבונות וביטוחים", emoji: "🧾", min: 0, max: 2500, step: 50, def: 800, color: C.grape },
  { key: "fun", label: "בילויים וכיף", emoji: "🍸", min: 0, max: 4000, step: 100, def: 1000, color: C.coral },
];

function StageBudget() {
  const [income, setIncome] = useState(9000);
  const [exp, setExp] = useState(() =>
    EXPENSES.reduce((o, e) => ({ ...o, [e.key]: e.def }), {})
  );
  const spent = EXPENSES.reduce((s, e) => s + exp[e.key], 0);
  const left = income - spent;
  const ok = left >= 0;

  return (
    <div>
      <p className="mb-5 leading-relaxed" style={{ color: C.ink }}>
        נונה, זה החלק שאף אחד לא מספר לך: הנטו זה לא "כסף פנוי". קודם החיים לוקחים את
        שלהם. תבני תקציב חודשי ותראי מה באמת נשאר לך בסוף — זה המספר שקובע הכל.
      </p>

      <Field label={`הנטו שלך: ${shekel(income)}`}>
        <Slider value={income} min={4000} max={25000} step={250} onChange={setIncome} color={C.lemon} />
      </Field>

      <div className="rounded-3xl p-4" style={{ background: C.panel }}>
        {EXPENSES.map((e) => (
          <div key={e.key} className="mb-4 last:mb-0">
            <div className="mb-1 flex items-center justify-between text-sm font-black" style={{ color: C.ink }}>
              <span>{e.emoji} {e.label}</span>
              <span style={{ color: e.color }}>{shekel(exp[e.key])}</span>
            </div>
            <Slider value={exp[e.key]} min={e.min} max={e.max} step={e.step} color={e.color}
              onChange={(v) => setExp((o) => ({ ...o, [e.key]: v }))} />
          </div>
        ))}
      </div>

      {/* פס ויזואלי */}
      <div className="mt-5 flex h-8 w-full overflow-hidden rounded-full" style={{ background: "#F1E4EE" }}>
        {EXPENSES.map((e) => (
          <div key={e.key} className="h-full transition-all"
            style={{ width: `${Math.min(100, (exp[e.key] / income) * 100)}%`, background: e.color }} title={e.label} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs font-black" style={{ color: C.inkSoft }}>
        <span>הוצאות: {shekel(spent)}</span>
        <span>הכנסה: {shekel(income)}</span>
      </div>

      <Big sub={ok ? "נשאר לך בסוף החודש 🎉" : "חסר לך בסוף החודש 😬"}
        from={ok ? C.mint : C.coral} to={ok ? C.sky : C.pinkDeep}>
        {shekel(Math.abs(left))}
      </Big>

      {ok && left > 0 && (
        <div className="mt-3 rounded-2xl px-4 py-3 text-center text-sm font-black text-white" style={{ background: C.grapeDeep }}>
          💡 אם תפקידי את זה כל חודש למדד — בעוד 10 שנים זה{" "}
          {shekel(futureValue(left, 10, 0.08))}. (תחזרי לתחנה 5 ותשחקי עם זה.)
        </div>
      )}
      {!ok && (
        <div className="mt-3 rounded-2xl px-4 py-3 text-center text-sm font-black text-white" style={{ background: C.coralDeep }}>
          זה בסדר, זה רק סימולטור. תזיזי סליידר אחד ותראי כמה מהר זה מתאזן.
        </div>
      )}
      <Note>המספרים ההתחלתיים הם ממוצעים גסים לצעירה בעיר. המציאות שלך היא המספר האמיתי.</Note>
    </div>
  );
}

/* ============================================================
   8 — הטבות שלא סיפרו לך עליהן
   ============================================================ */
function StagePerks() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <p className="mb-5 leading-relaxed" style={{ color: C.ink }}>
        נונה, יש ערמה של כסף והטבות שמחכים לך — אבל אף אחד לא ישלח לך אותם הביתה. צריך
        לדעת שהם קיימים ולבקש. תלחצי על כל קלף ותגלי.
      </p>
      <div className="flex flex-col gap-3">
        {PERKS.map((p, i) => {
          const on = open === i;
          const col = C[p.color], deep = C[p.color + "Deep"];
          return (
            <button key={i} onClick={() => setOpen(on ? null : i)}
              className="rounded-3xl p-4 text-right transition"
              style={{
                background: on ? col : "#fff",
                boxShadow: on ? `0 8px 0 ${deep}` : "0 5px 0 rgba(0,0,0,0.06), 0 10px 20px rgba(0,0,0,0.05)",
                transform: on ? "translateY(-2px)" : "none",
              }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.emoji}</span>
                <span className="flex-1 text-sm font-black" style={{ color: on ? "#fff" : C.ink }}>{p.title}</span>
                <span className="text-xs font-black" style={{ color: on ? "#fff" : deep }}>{on ? "▴" : "▾"}</span>
              </div>
              {on && (
                <p className="nona-pop mt-3 text-sm leading-relaxed text-white opacity-95">{p.body}</p>
              )}
            </button>
          );
        })}
      </div>
      <Note>
        זכאויות משתנות לפי סוג שירות, אזור מגורים ושנה. תמיד תבדקי באזור האישי באתר{" "}
        <a href="https://www.hachvana.mod.gov.il/GrantAndDeposit/Pages/default.aspx" target="_blank" rel="noreferrer"
          className="font-black underline" style={{ color: C.grapeDeep }}>האגף והקרן לחיילים משוחררים</a>{" "}
        — שם המידע המחייב.
      </Note>
    </div>
  );
}

/* ============================================================
   מפת השלבים
   ============================================================ */
const STAGES = [
  { id: 1, title: "יוצאים לאזרחות!", sub: "מענק ופיקדון", emoji: "🪖", color: C.pink, deep: C.pinkDeep, x: 90, y: 70, Comp: StageGrant, burst: ["🎉", "🎖️", "💌", "✨", "🎊"] },
  { id: 2, title: "פסיכומטרי או מכינה?", sub: "והדרך לתואר", emoji: "📚", color: C.grape, deep: C.grapeDeep, x: 300, y: 215, Comp: StageQuiz, burst: ["📚", "✏️", "🎓", "🧠", "📐"] },
  { id: 3, title: "המשחק של הגדולים", sub: "ברוטו מול נטו", emoji: "💸", color: C.sky, deep: C.skyDeep, x: 100, y: 370, Comp: StageNet, burst: ["💵", "💸", "🪙", "💰", "🧾"] },
  { id: 4, title: "פנסיה", sub: "הכסף שומר עלייך", emoji: "🌱", color: C.mint, deep: C.mintDeep, x: 300, y: 520, Comp: StagePension, burst: ["🌱", "🌳", "⏳", "💚", "🪴"] },
  { id: 5, title: "מתחילים להשקיע!", sub: "מדדים ומניות", emoji: "🚀", color: C.lemon, deep: C.lemonDeep, x: 110, y: 675, Comp: StageInvest, burst: ["📈", "📊", "🚀", "💹", "🐂"] },
  { id: 6, title: "הטיול הגדול", sub: "מזרח או דרום אמריקה", emoji: "🌍", color: C.coral, deep: C.coralDeep, x: 300, y: 825, Comp: StageTrip, burst: ["✈️", "🎒", "🏔️", "🛕", "🗺️"] },
  { id: 7, title: "כמה עולה לחיות?", sub: "התקציב החודשי שלך", emoji: "🏠", color: C.grape, deep: C.grapeDeep, x: 100, y: 975, Comp: StageBudget, burst: ["🏠", "🛒", "🧾", "🚌", "🍸"] },
  { id: 8, title: "כסף שמחכה לך", sub: "הטבות שלא סיפרו לך", emoji: "🎁", color: C.mint, deep: C.mintDeep, x: 250, y: 1125, Comp: StagePerks, burst: ["🎁", "🎫", "💎", "🔑", "✨"] },
];

const TRAIL =
  "M90,70 C90,140 300,140 300,215 C300,290 100,295 100,370 C100,445 300,445 300,520 " +
  "C300,600 110,595 110,675 C110,750 300,750 300,825 C300,900 100,900 100,975 " +
  "C100,1050 250,1050 250,1125";

const CONFETTI = ["🎉", "🎊", "💜", "💖", "⭐", "🍭", "🎈", "✨"];

export default function App() {
  const [open, setOpen] = useState(null);
  const [visited, setVisited] = useState([]);
  const [finished, setFinished] = useState(false);
  const [seenFinish, setSeenFinish] = useState(false);
  const stage = STAGES.find((s) => s.id === open);
  const allDone = visited.length === STAGES.length;

  useEffect(() => {
    document.body.style.overflow = open || finished ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, finished]);

  useEffect(() => {
    if (allDone && !seenFinish && !open) {
      const t = setTimeout(() => { setFinished(true); setSeenFinish(true); }, 400);
      return () => clearTimeout(t);
    }
  }, [allDone, seenFinish, open]);

  const openStage = (id) => {
    setOpen(id);
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  };

  const burstItems = useMemo(() => {
    if (!stage) return [];
    return Array.from({ length: 22 }).map((_, i) => ({
      e: stage.burst[i % stage.burst.length],
      left: Math.random() * 96,
      delay: Math.random() * 0.5,
      dur: 1.4 + Math.random() * 1.1,
      size: 18 + Math.random() * 22,
      drift: (Math.random() - 0.5) * 70,
    }));
  }, [stage]);

  const confetti = useMemo(() => {
    if (!finished) return [];
    return Array.from({ length: 60 }).map((_, i) => ({
      e: CONFETTI[i % CONFETTI.length],
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      dur: 2.6 + Math.random() * 2.4,
      size: 14 + Math.random() * 20,
      rot: (Math.random() - 0.5) * 720,
    }));
  }, [finished]);

  return (
    <div dir="rtl" className="relative min-h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(1000px 500px at 80% -5%, #FFD9E8 0%, rgba(255,217,232,0) 60%)," +
          "radial-gradient(800px 500px at 0% 30%, #FFE3F0 0%, rgba(255,227,240,0) 55%)," +
          "linear-gradient(175deg, #FFEAF3 0%, #FDDDEC 45%, #F3E4FB 78%, #E8F1FF 100%)",
        fontFamily: "'Varela Round', 'Heebo', system-ui, sans-serif",
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Varela+Round&family=Heebo:wght@400;700;900&display=swap');
        .nona-slider { -webkit-appearance:none; appearance:none; height:14px; border-radius:99px; outline:none; }
        .nona-slider::-webkit-slider-thumb { -webkit-appearance:none; width:30px; height:30px; border-radius:50%; background:#fff; border:4px solid ${C.pinkDeep}; box-shadow:0 4px 10px rgba(0,0,0,.2); cursor:pointer; }
        .nona-slider::-moz-range-thumb { width:26px; height:26px; border-radius:50%; background:#fff; border:4px solid ${C.pinkDeep}; box-shadow:0 4px 10px rgba(0,0,0,.2); cursor:pointer; }
        .nona-slider:focus-visible { box-shadow:0 0 0 4px rgba(228,92,135,.35); }
        button:focus-visible { outline:3px solid ${C.grapeDeep}; outline-offset:2px; }

        @keyframes nonaPop { 0%{transform:scale(.9);opacity:.4} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
        .nona-pop { animation: nonaPop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes coinIn { from{transform:translateY(-10px) scale(.4) rotate(-25deg);opacity:0} to{transform:none;opacity:1} }
        .nona-coin { animation: coinIn .35s backwards cubic-bezier(.34,1.56,.64,1); }
        @keyframes barUp { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        .nona-bar { transform-origin:bottom; animation: barUp .5s ease backwards; }
        @keyframes stepUp { from{transform:scaleY(0);opacity:0} to{transform:scaleY(1);opacity:1} }
        .nona-step { transform-origin:bottom; animation: stepUp .45s backwards cubic-bezier(.34,1.56,.64,1); }
        @keyframes bob { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-6px) rotate(1deg)} }
        .nona-bob { animation: bob 3.2s ease-in-out infinite; }
        @keyframes sheetUp { from{transform:translateY(30px);opacity:0} to{transform:none;opacity:1} }
        .nona-sheet { animation: sheetUp .32s cubic-bezier(.2,.9,.3,1); }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .nona-fade { animation: fadeIn .25s ease; }

        @keyframes burst {
          0%{transform:translate(0,110%) scale(.4) rotate(0deg);opacity:0}
          15%{opacity:1}
          100%{transform:translate(var(--dx),-140px) scale(1.1) rotate(var(--rot));opacity:0}
        }
        .nona-burst { position:absolute; bottom:0; animation-name:burst; animation-timing-function:cubic-bezier(.2,.7,.3,1); animation-fill-mode:both; will-change:transform,opacity; }

        @keyframes fall {
          0%{transform:translateY(-15vh) rotate(0deg);opacity:0}
          10%{opacity:1}
          100%{transform:translateY(105vh) rotate(var(--rot));opacity:.9}
        }
        .nona-confetti { position:absolute; top:0; animation-name:fall; animation-timing-function:linear; animation-iteration-count:infinite; will-change:transform; }

        @keyframes floaty { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(8deg)} }
        .nona-floaty { animation: floaty 7s ease-in-out infinite; }
        @keyframes twinkle { 0%,100%{opacity:.25; transform:scale(.9)} 50%{opacity:.8; transform:scale(1.15)} }
        .nona-twinkle { animation: twinkle 3.5s ease-in-out infinite; }
        @keyframes glow { 0%,100%{box-shadow:0 0 0 0 rgba(228,92,135,.45)} 50%{box-shadow:0 0 0 14px rgba(228,92,135,0)} }
        .nona-glow { animation: glow 2s ease-out infinite; }

        @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation:none !important; transition:none !important; } }
      `}</style>

      {/* רקע */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[
          { e: "🍬", top: "5%", left: "6%", s: 34, d: "0s" },
          { e: "🍭", top: "14%", left: "86%", s: 30, d: "1.2s" },
          { e: "☁️", top: "26%", left: "3%", s: 40, d: "2.4s" },
          { e: "🍩", top: "38%", left: "90%", s: 28, d: "0.6s" },
          { e: "☁️", top: "52%", left: "6%", s: 36, d: "3s" },
          { e: "🍬", top: "64%", left: "89%", s: 32, d: "1.8s" },
          { e: "🧁", top: "76%", left: "5%", s: 30, d: "2.2s" },
          { e: "🍫", top: "88%", left: "88%", s: 30, d: "0.9s" },
        ].map((b, i) => (
          <span key={i} className="nona-floaty absolute"
            style={{ top: b.top, left: b.left, fontSize: b.s, opacity: 0.35, animationDelay: b.d }}>{b.e}</span>
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={"s" + i} className="nona-twinkle absolute rounded-full"
            style={{ top: `${(i * 37) % 97}%`, left: `${(i * 61) % 95}%`,
              width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3,
              background: i % 2 ? "#fff" : "#FFC2DA", animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      {/* כותרת */}
      <header className="relative px-6 pb-2 pt-10 text-center">
        <div className="nona-bob text-5xl">🍭</div>
        <h1 className="mt-1 text-3xl font-black leading-tight" style={{ color: C.pinkDeep }}>
          המסע של נונה לאזרחות
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm font-bold" style={{ color: C.inkSoft }}>
          שמונה תחנות, אפס הרצאות. תלחצי על מה שבא לך, בסדר שבא לך.
        </p>
        <div className="mx-auto mt-3 inline-block rounded-full px-4 py-1 text-xs font-black"
          style={{ background: C.white, color: C.pinkDeep, boxShadow: "0 4px 12px rgba(228,92,135,.2)" }}>
          {visited.length} / {STAGES.length} תחנות נפתחו
        </div>
        {allDone && seenFinish && (
          <div>
            <button onClick={() => setFinished(true)}
              className="mt-3 rounded-full px-5 py-2 text-xs font-black text-white"
              style={{ background: C.grapeDeep, boxShadow: `0 5px 0 #5F42A8` }}>
              🏆 לצפייה בתעודה שלך
            </button>
          </div>
        )}
      </header>

      {/* מפה */}
      <div className="relative mx-auto w-full px-4 pb-16" style={{ maxWidth: 420 }}>
        <div className="relative w-full" style={{ paddingBottom: "312.5%" }}>
          <svg viewBox="0 0 400 1250" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
            <path d={TRAIL} fill="none" stroke="#FFFFFF" strokeWidth="28" strokeLinecap="round" opacity="0.9" />
            <path d={TRAIL} fill="none" stroke={C.pink} strokeWidth="6" strokeLinecap="round" strokeDasharray="2 22" opacity="0.5" />
          </svg>

          {STAGES.map((s, i) => {
            const done = visited.includes(s.id);
            return (
              <button key={s.id} onClick={() => openStage(s.id)}
                className="absolute flex flex-col items-center"
                style={{ left: `${(s.x / 400) * 100}%`, top: `${(s.y / 1250) * 100}%`, transform: "translate(50%, -50%)" }}>
                <div className={`nona-bob flex items-center justify-center rounded-full text-3xl ${done ? "" : "nona-glow"}`}
                  style={{ width: 78, height: 78, background: s.color, border: "5px solid #fff",
                    boxShadow: `0 8px 0 ${s.deep}, 0 14px 26px rgba(0,0,0,0.16)`, animationDelay: `${i * 0.3}s` }}>
                  {s.emoji}
                </div>
                <div className="mt-2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-black"
                  style={{ background: C.white, color: C.ink, boxShadow: "0 3px 8px rgba(0,0,0,0.10)" }}>
                  {s.title}
                </div>
                {done && (
                  <div className="absolute rounded-full px-2 text-xs font-black text-white"
                    style={{ top: -4, insetInlineStart: -2, background: C.mintDeep }}>✓</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* מודאל תחנה */}
      {stage && (
        <div className="nona-fade fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          style={{ background: "rgba(74,47,73,0.45)", backdropFilter: "blur(3px)" }}
          onClick={() => setOpen(null)}>
          <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
            {burstItems.map((b, i) => (
              <span key={i} className="nona-burst"
                style={{ left: `${b.left}%`, fontSize: b.size, animationDuration: `${b.dur}s`,
                  animationDelay: `${b.delay}s`, "--dx": `${b.drift}px`, "--rot": `${b.drift}deg` }}>
                {b.e}
              </span>
            ))}
          </div>

          <div dir="rtl" onClick={(e) => e.stopPropagation()}
            className="nona-sheet relative z-20 w-full overflow-y-auto"
            style={{ maxWidth: 460, maxHeight: "92vh", background: "#FFFCFE",
              borderRadius: "32px 32px 0 0", boxShadow: "0 -10px 40px rgba(0,0,0,0.22)" }}>
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
              style={{ background: stage.color, boxShadow: `0 5px 0 ${stage.deep}` }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{stage.emoji}</span>
                <div>
                  <div className="text-lg font-black leading-tight text-white">{stage.title}</div>
                  <div className="text-xs font-black text-white opacity-90">{stage.sub}</div>
                </div>
              </div>
              <button onClick={() => setOpen(null)} aria-label="סגירה"
                className="flex items-center justify-center rounded-full text-lg font-black"
                style={{ width: 36, height: 36, background: "rgba(255,255,255,0.92)", color: stage.deep }}>✕</button>
            </div>

            <div className="px-5 pb-8 pt-5">
              <stage.Comp />
              <LoveNote id={stage.id} color={stage.color} deep={stage.deep} />
              <button onClick={() => setOpen(null)}
                className="mt-4 w-full rounded-2xl py-4 text-base font-black text-white"
                style={{ background: stage.color, boxShadow: `0 6px 0 ${stage.deep}` }}>
                חזרה למפה 🗺️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* מסך סיום */}
      {finished && (
        <div className="nona-fade fixed inset-0 z-[60] flex items-center justify-center px-5"
          style={{ background: "rgba(74,47,73,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setFinished(false)}>
          <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
            {confetti.map((c, i) => (
              <span key={i} className="nona-confetti"
                style={{ left: `${c.left}%`, fontSize: c.size, animationDuration: `${c.dur}s`,
                  animationDelay: `${c.delay}s`, "--rot": `${c.rot}deg` }}>
                {c.e}
              </span>
            ))}
          </div>

          <div dir="rtl" onClick={(e) => e.stopPropagation()}
            className="nona-pop relative w-full overflow-hidden rounded-3xl p-1 text-center"
            style={{ maxWidth: 400, background: `linear-gradient(135deg, ${C.pink}, ${C.grape}, ${C.lemon})`,
              boxShadow: "0 20px 50px rgba(0,0,0,.35)" }}>
            <div className="rounded-3xl px-6 py-8" style={{ background: "#FFFCFE" }}>
              <div className="nona-bob text-6xl">🏆</div>
              <div className="mt-3 text-xs font-black tracking-widest" style={{ color: C.inkSoft }}>
                תעודת סיום
              </div>
              <h2 className="mt-1 text-3xl font-black" style={{ color: C.pinkDeep }}>נונה</h2>
              <div className="mx-auto my-4 h-1 w-24 rounded-full" style={{ background: C.lemon }} />
              <p className="text-sm leading-relaxed" style={{ color: C.ink }}>
                עברת את כל שמונה התחנות בלי מבדקי ריצה ובלי ועדת קצינים. את יודעת מה מגיע
                לך מהצבא איך קוראים תלוש מה עושה הזמן לכסף וכמה עולה לחיות.
                <br />
                <b>את מוכנה לאזרחות נונה</b>
              </p>
              <div className="mt-5 rounded-2xl px-4 py-4 text-sm leading-relaxed"
                style={{ background: "#FFF0F6", color: C.ink, fontStyle: "italic" }}>
                "רצית לחתום קבע כדי לשרת את המדינה. בסוף היא זו שמשרתת אותך. לא הרבה מצליחים לסובב את זה ככה. אני גאה בך נונה"
                <div className="mt-2 text-left text-xs font-black not-italic" style={{ color: C.pinkDeep }}>
                  — אלעד ❤️
                </div>
              </div>
              <button onClick={() => setFinished(false)}
                className="mt-6 w-full rounded-2xl py-4 text-base font-black text-white"
                style={{ background: C.pink, boxShadow: `0 6px 0 ${C.pinkDeep}` }}>
                תודה 💜
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative px-6 pb-10 text-center text-xs font-bold" style={{ color: C.inkSoft }}>
        נבנה באהבה. כל המספרים הם הערכות להמחשה — לא ייעוץ פיננסי. 💜
      </footer>
    </div>
  );
}
