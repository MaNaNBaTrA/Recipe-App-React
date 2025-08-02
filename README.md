# 🍽️ React Native Recipe App

A modern and responsive mobile application to browse, search, and save your favorite recipes. Built using **React Native**, **Expo**, **PostgreSQL**, and **Express**, with secure authentication powered by **Clerk**.

---

## 📱 Demo

> _A full-featured recipe app with smooth UX and customizable themes!_

---

## ✨ Highlights

- 🔐 **Authentication**
  - Signup, Login, and 6-Digit Email Verification using Clerk

- 🍳 **Recipe Discovery**
  - Browse featured recipes
  - Filter by category

- 🔍 **Search & View**
  - Search recipes by name or ingredients
  - View detailed cooking instructions

- 🎥 **Video Integration**
  - Watch recipe tutorials directly from YouTube

- ❤️ **Favorites**
  - Add recipes to your favorites and access them anytime

- 🎨 **Themes**
  - Choose from 8 built-in color themes

---

## ⚙️ Tech Stack

| Layer       | Stack                                |
|------------|---------------------------------------|
| Frontend    | React Native + Expo                  |
| Backend     | Node.js + Express                    |
| Database    | PostgreSQL (hosted on Neon)          |
| Auth        | Clerk                                |
| UI Styling  | Tailwind CSS (via NativeWind, optional) |
| API Source  | Public Recipe API                    |

---

## 🧪 Environment Setup

### 🔧 Backend (`/backend`)

```env
PORT=5001
DATABASE_URL=your_neon_db_url
NODE_ENV=development
```

### 📱 Mobile App (`/mobile`)

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

## 🚀 Run Locally

### 1️⃣ Start the Backend

```bash
cd backend
npm install
npm run dev
```

### 2️⃣ Run the Mobile App

```bash
cd mobile
npm install
npx expo start
```

---


## 💡 Future Improvements

- 🧾 Add user recipe submissions
- 🗂 Sort by nutrition, diet, cuisine
- 🔔 Push notifications for new recipes

---

## 🆓 License

This project is 100% free and uses no paid services.

---

## 🙌 Made with love by [Manan Batra](https://github.com/MaNaNBaTrA)

_If you found this project helpful, give it a ⭐ and follow for more!_
