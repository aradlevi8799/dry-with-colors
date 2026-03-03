# Dry With Colors

קטלוג מוצרים אונליין לסידורי פרחים יבשים וכלי גבס מעוצבים בעבודת יד.

## טכנולוגיות

- **Next.js** - פריימוורק React
- **Tailwind CSS** - עיצוב
- **Firebase** - מסד נתונים (Firestore) ואחסון תמונות (Storage)
- **TypeScript** - שפת תכנות

## התקנה והרצה

```bash
npm install
npm run dev
```

פתחו את [http://localhost:3000](http://localhost:3000) בדפדפן.

## הגדרת Firebase

צרו קובץ `.env.local` בתיקיית הפרויקט עם המשתנים הבאים:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ADMIN_PASSWORD=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

## מבנה הפרויקט

- `src/app/page.tsx` - עמוד הקטלוג הראשי
- `src/app/admin/` - ממשק ניהול מוצרים
- `src/components/catalog/` - רכיבי הקטלוג (כרטיסי מוצר, גלריה, מודל)
- `src/components/admin/` - רכיבי הניהול (טפסים, רשימות)
- `src/lib/` - חיבור ל-Firebase ופעולות מסד נתונים

## העלאה לאוויר

ניתן להעלות ל-[Vercel](https://vercel.com) ולהגדיר את משתני הסביבה שם.
