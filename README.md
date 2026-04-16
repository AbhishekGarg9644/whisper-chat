# Whisper 💬

A real-time cross-platform chat application built for both **Android** and **Web**. Whisper lets users sign up, find other users, and chat instantly with live typing indicators and online presence.

---

## 🚀 Features

- 🔐 **JWT-based Authentication** — Secure signup/login with hashed passwords and token-based sessions
- 💬 **Real-time Messaging** — Instant message delivery powered by Socket.IO
- 🟢 **Online Presence** — See who's online in real time
- ✍️ **Typing Indicators** — Know when the other person is typing
- 📱 **Cross-Platform** — Works on Android (React Native) and Web (React.js)
- 🌙 **Dark UI** — Clean, modern dark-themed interface on both platforms

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native, Expo |
| Web | React.js, Vite, TailwindCSS, DaisyUI |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Real-time | Socket.IO |
| Auth | JWT (jsonwebtoken), bcryptjs |
| State | Zustand |

---

## 📁 Project Structure

```
whisper/
├── backend/      # Express.js REST API + Socket.IO server
├── mobile/       # React Native (Expo) Android app
└── web/          # React.js + Vite web app
```

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

### Mobile — `mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://<your-local-ip>:3000
```

> **Note:** When testing on a physical Android device, replace `<your-local-ip>` with your computer's local network IP (e.g. `192.168.1.10`). You can find it by running `ipconfig` on Windows.

### Web — `web/.env`

```env
VITE_API_URL=http://localhost:3000
```

---

## 🏃 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/AbhishekGarg9644/whisper-chat.git
cd whisper-chat
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
```

> Server will start on `http://localhost:3000`

### 3. Start the Web App

```bash
cd web
npm install
npm run dev
```

> Web app will open at `http://localhost:5173`

### 4. Start the Mobile App

```bash
cd mobile
npm install
npx expo start
```

> Scan the QR code with the **Expo Go** app on your Android device, or press `a` to open on an emulator.

---

## 📸 Screenshots

> Coming soon

---

## 👨‍💻 Author

**Abhishek Garg**
- GitHub: [@AbhishekGarg9644](https://github.com/AbhishekGarg9644)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
