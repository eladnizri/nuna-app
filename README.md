# המסע של נונה לאזרחות 🍭

אתר אינטראקטיבי בעברית (RTL) לחיילת משוחררת — שמונה תחנות על מפת מסע, עם מחשבונים אמיתיים:
מענק ופיקדון, פסיכומטרי מול מכינה, ברוטו מול נטו, פנסיה, השקעות, הטיול הגדול, תקציב חודשי והטבות.

## הרצה מקומית

```bash
npm install
npm run dev
```

## בנייה

```bash
npm run build     # פלט לתיקיית dist
npm run preview   # תצוגה מקדימה של הבילד
```

## פריסה ל-GitHub Pages

הפריסה אוטומטית: כל push ל-`main` מריץ את `.github/workflows/deploy.yml` שבונה ומעלה ל-Pages.

**הפעלה חד-פעמית:** ב-GitHub → Settings → Pages → Source → **GitHub Actions**.

האתר יעלה בכתובת `https://<username>.github.io/nuna-app/`.

> אם שם הריפו משתנה, צריך לעדכן את `base` ב-`vite.config.js` בהתאם.
> לדומיין מותאם אישית: `base: "/"` + קובץ `public/CNAME`.

## מבנה

| קובץ | תפקיד |
|---|---|
| `src/App.jsx` | כל האתר — שמונה התחנות, המחשבונים והאנימציות |
| `src/main.jsx` | נקודת כניסה של React |
| `src/index.css` | ייבוא Tailwind |
| `index.html` | תבנית HTML, מטא־תגיות, פונטים |
| `vite.config.js` | הגדרות Vite ו-base ל-Pages |

## עריכת תוכן

הטקסטים והמספרים מרוכזים בראש `src/App.jsx`:
`LOVE_NOTES` (הפתקים האישיים), `RATES` (מענק ופיקדון), `TAX_BRACKETS` (מדרגות מס),
`TRIP` (יעדי הטיול), `PERKS` (ההטבות), `EXPENSES` (סעיפי התקציב) ו-`STAGES` (התחנות על המפה).

---

בנוי עם React 19, Vite ו-Tailwind CSS v4. כל המספרים הם הערכות להמחשה — לא ייעוץ פיננסי. 💜
