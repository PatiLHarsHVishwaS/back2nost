# 🕰️ BACKTO NOSTALGIA
> *"Step into your childhood again."*

A social time-machine web platform where users travel through eras (90s, 2000s, 2010s, 2020s) and rediscover the cartoons, toys, candies, games, movies, gadgets, clothes, music, and memories they grew up with.

---

## 🌟 Features & Highlights

1. **Interactive Spline 3D Time Machine Hero**:
   - 3D time-warp portal with interactive mouse tilt parallax.
   - Orbiting nostalgic relics: PS2 controller, Sony Walkman cassette, Nokia 1100, Beyblade, Mango Bite candy, CRT TV, and Maruti 800.
   - Era selector buttons (`[ 90s ] [ 2000s ] [ 2010s ] [ 2020s ]`) that calibrate the portal and warp into that era.
   - Ambient space-time canvas particle starfield.

2. **Explore Page & Time Traveler Engine**:
   - Deep nostalgic filters by Era (90s, 2000s, 2010s, 2020s, All) and Category (Cartoons, Games, Snacks, Toys, Movies, Music, Clothes, School, Gadgets, Cars, Comics).
   - Dynamic sorting: **Trending**, **Latest**, and **Most Loved**.
   - Instant search across memory titles and stories.

3. **Reddit-Like Social Feed**:
   - Upvoting / Liking with optimistic UI updates.
   - Comment threads.
   - Direct Time Capsule bookmarks.
   - One-click link sharing.
   - Rich badges for Era and Category.

4. **Discord-Like Real-Time Community Chat (`Socket.IO`)**:
   - Multi-channel navigation (`#general`, `#doraemon`, `#shinchan`, `#pokemon`, `#memes`, `#memories`).
   - Instant live message broadcast across connected devices without page refresh.
   - Live online presence sidebar showing only active authenticated connected users.
   - Real-time typing indicators.

5. **My Time Capsule (Personal Scrapbook)**:
   - Personal vault displaying preserved nostalgic memories.
   - Era breakdown meter (e.g. 90s count, 2000s count, 2010s count).
   - Polaroid-style cards with instant removal option.

6. **Communities Discovery & Dedicated Guild Hubs**:
   - `r/IndianCartoons`
   - `r/ChildhoodSnacks`
   - `r/RetroGaming`
   - `r/OldToys`
   - `r/2000sKids`
   - `r/SchoolMemories`
   - `r/OldGadgets`
   - `r/2000sFashion`
   - Join/leave community memberships.

7. **User Profile & Customization**:
   - Era traveler badges.
   - Real-time stats: Posts count, Total likes received, Saved count, Joined guilds.
   - Bio editor.
   - Tabbed views: My Posts, Saved, Comments, Communities.

8. **CRT Retro TV Scanline Filter**:
   - Interactive bottom toggle to turn CRT scanlines ON/OFF.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Lucide React, Framer Motion, Spline 3D Runtime.
- **Backend**: Node.js (ES Modules), Express.js, MongoDB, Mongoose, Socket.IO, JWT, bcryptjs, Multer.
- **Real-Time Engine**: Socket.IO WebSockets with rooms and presence tracking.
- **Storage**: Cloudinary support with automatic local storage fallback (`/uploads/`).
- **Database**: MongoDB with auto-fallback to embedded in-memory MongoDB runner.

---

## 📁 Project Structure

```
Back2Nostalgia/
├── package.json               # Root scripts (dev, seed, test, install:all, build)
├── README.md                  # Complete documentation and setup guide
├── client/                    # Frontend React + Vite + Tailwind application
│   ├── package.json
│   ├── vite.config.js         # API & Socket.IO proxy configuration
│   ├── tailwind.config.js     # Retro amber/cyan glowing theme
│   ├── postcss.config.js
│   ├── index.html             # Google Fonts (Space Grotesk, Plus Jakarta Sans, VT323)
│   └── src/
│       ├── main.jsx           # App entrypoint and Context wrappers
│       ├── App.jsx            # Route definitions
│       ├── index.css          # Glassmorphism, CRT overlay & custom scrollbars
│       ├── api/
│       │   └── client.js      # Fetch client with auto JWT Authorization header
│       ├── context/
│       │   ├── AuthContext.jsx    # Auth state, login, register, 1-click demo accounts
│       │   ├── SocketContext.jsx  # Real-time Socket.IO connection & event handlers
│       │   └── ToastContext.jsx   # Retro styled floating notifications
│       ├── components/
│       │   ├── Navbar.jsx         # Sticky glassmorphic desktop navigation
│       │   ├── MobileNav.jsx      # Mobile bottom navigation bar
│       │   ├── SplineHero.jsx     # Spline 3D integration
│       │   ├── TimeMachinePortal.jsx # 3D glowing portal with floating nostalgic relics
│       │   ├── PostCard.jsx       # Reddit/social style nostalgia card with optimistic UI
│       │   ├── CommunityCard.jsx  # Guild card with join/leave and channel stats
│       │   ├── DiscordChat.jsx    # Real-time multi-channel Discord chat
│       │   ├── ParticleStarfield.jsx # Interactive space-time particle field
│       │   └── CrtOverlay.jsx     # CRT scanline retro screen filter toggle
│       └── pages/
│           ├── LandingPage.jsx    # Hero, era selector, time machine portal
│           ├── ExplorePage.jsx    # Era filters, category pills, search, sort tabs
│           ├── CommunityListPage.jsx # Community discovery
│           ├── CommunityDetailPage.jsx # Community feed, live chat tab, about
│           ├── ChatPage.jsx       # Full standalone Discord-style chatroom
│           ├── PostDetailPage.jsx # Memory detail view with comment thread
│           ├── CreatePostPage.jsx # Share nostalgia memory with image upload
│           ├── ProfilePage.jsx    # User profile, bio, stats, tabs
│           ├── TimeCapsulePage.jsx # Personal nostalgic scrapbook
│           ├── SearchPage.jsx     # Global search (posts, communities, users)
│           ├── LoginPage.jsx      # Auth + 1-click demo logins (Rohan, Sneha)
│           └── RegisterPage.jsx   # Register new time traveler
└── server/                    # Backend Node.js + Express + Socket.IO API
    ├── package.json
    ├── .env.example
    ├── .env
    ├── test-e2e.js            # Automated E2E & Socket.IO test suite
    └── src/
        ├── server.js          # Express app, HTTP & Socket.IO server entry
        ├── config/
        │   └── db.js          # MongoDB connection with auto in-memory fallback
        ├── models/
        │   ├── User.js        # User schema (auth, joinedCommunities, savedPosts)
        │   ├── Post.js        # Memory post schema (era, category, likes, comments)
        │   ├── Community.js   # Community guild with channels
        │   ├── Comment.js     # Comment model
        │   └── Message.js     # Chat channel message model
        ├── middleware/
        │   ├── auth.js        # JWT verify and optional auth
        │   └── upload.js      # Multer file upload (Cloudinary + local disk fallback)
        ├── routes/
        │   ├── auth.js        # /api/auth (register, login, me, profile)
        │   ├── posts.js       # /api/posts (CRUD, like, save, comment)
        │   ├── communities.js # /api/communities (discovery, join/leave, posts)
        │   ├── messages.js    # /api/messages (channel message history)
        │   ├── users.js       # /api/users (profile stats, search)
        │   ├── capsule.js     # /api/capsule (saved memories & era metrics)
        │   └── upload.js      # /api/upload (image uploads)
        ├── socket/
        │   └── chatHandler.js # Socket.IO events (join, send, online users, typing)
        └── seed/
            └── seedData.js    # 10 demo users, 25 posts, 8 communities, 49 comments, messages
```

---

## ⚙️ Environment Variables

Create `server/.env` (a pre-configured one is already provided):

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/backtonostalgia
JWT_SECRET=super_secret_nostalgia_jwt_key_2026_retro
CLIENT_URL=http://localhost:5173

# Optional Cloudinary (if omitted, high-res static images & local uploads work automatically)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
From the root directory:
```bash
npm run install:all
```
*(Or `npm install` inside root, `server/`, and `client/` respectively)*

### 2. Seed MongoDB Demo Data
Populate the database with 10 demo users, 25 nostalgic memories, 8 communities, 49 comments, and channel messages:
```bash
npm run seed
```

### 3. Run Application
Run both backend API and frontend Vite server concurrently with a single command:
```bash
npm run dev
```

Or run them individually in separate terminals:
- **Backend**: `cd server && npm run dev` (Runs on `http://localhost:5001`)
- **Frontend**: `cd client && npm run dev` (Runs on `http://localhost:5173`)

Open **`http://localhost:5173`** in your browser!

---

## 🧪 Testing Real-Time Chat Across Two Users

1. Open `http://localhost:5173/login` in your main browser window.
2. Click **"👦 Rohan (2000s)"** (or log in with `Rohan` / `password123`).
3. Open an Incognito window or another browser (Safari/Chrome) and visit `http://localhost:5173/login`.
4. Click **"👧 Sneha (2000s)"** (or register a new real user account).
5. On both windows, click **"Chat"** in the navbar or visit `http://localhost:5173/chat/r/IndianCartoons`.
6. Select the `#general` or `#doraemon` channel.
7. Notice:
   - Both **Rohan** and **Sneha** instantly appear in the **"Online Travelers (2)"** sidebar on the right!
   - Type a message as Rohan: Sneha's screen instantly shows `Rohan is typing...` and the message appears immediately upon sending without refreshing the page!

### Automated E2E Test Suite
You can also run the automated end-to-end integration and Socket.IO WebSocket test suite anytime:
```bash
npm run test
```

---

## 🌐 Production Deployment

### Frontend (Vercel / Netlify / Cloudflare Pages)
Build the frontend:
```bash
npm run build
```
The output will be generated in `client/dist`. Configure the `VITE_API_URL` to point to your backend.

### Backend (Render / Railway / AWS / DigitalOcean)
1. Set environment variables on your platform:
   - `PORT`: `5001` (or platform default)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key
   - `CLIENT_URL`: Your deployed frontend URL
2. Start command:
   ```bash
   node src/server.js
   ```
3. Run the seed command once during deployment:
   ```bash
   node src/seed/seedData.js
   ```
