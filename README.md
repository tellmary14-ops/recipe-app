<h1 align="center">🍽️ React Native Recipe App 🍽️</h1>

![Demo App](/mobile/assets/images//screenshot-for-readme.png)

Highlights:

- 🔐 Signup, Login, and 6-Digit Email Verification with **Clerk**
- 🍳 Browse Featured Recipes & Filter by Categories
- 🔍 Search Recipes and View Detailed Cooking Instructions
- 🎥 Recipe Pages Include YouTube Video Tutorials
- ❤️ Add Recipes to Favorites and Access Them from Favorites Tab
- ⚡ Tech Stack: React Native + Express + MySQL (XAMPP) + Expo
- 🌈 Includes 8 Color Themes
- 🆓 100% Free Tools — No Paid Services Required

---

## 🧪 .env Setup

### Backend (`/backend`) - MySQL (XAMPP) setup

```bash
PORT=5001
# Optional: keep DATABASE_URL if you prefer a single connection string
DATABASE_URL=mysql://root:@127.0.0.1:3306/recipe_app
NODE_ENV=development
# Alternatively set individual MySQL vars for XAMPP:
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=recipe_app
DB_PORT=3306
```

### Mobile App (`/mobile`)

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

## 🔧 Run the Backend

```bash
cd backend
npm install
npm run dev
```

## 📱 Run the Mobile App

```bash
cd mobile
npm install
npx expo start
```
