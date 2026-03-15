# City Guardian Admin Dashboard

A React + Vite admin panel for the City Guardian platform. This app provides administrators with tools to manage users, view reports, and oversee rewards and analytics.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or latest LTS) 
- npm (bundled with Node)

### Install dependencies
```bash
npm install
```

### Run in development
```bash
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## 🗂 Project Structure

```
city_guardian_admin/
├── public/              # Static assets
├── src/                 # Application source
│   ├── api/             # API client + helpers
│   ├── components/      # Shared components
│   ├── pages/           # Page views (Dashboard, Users, Reports, etc.)
│   ├── App.jsx          # Root component
│   ├── main.jsx         # App entry point
│   └── theme.js         # MUI theme config
├── package.json
└── vite.config.js
```

## 🔐 Environment Configuration

This project calls a backend API under `/admin/...`. Configure your backend URL via environment variables or a proxy in `vite.config.js` as needed.

## 🧩 Notes
- The admin UI uses Material UI v7 components and icons.
- Authentication and routing are handled in `src/App.jsx` and related page components.

## ✅ Contributing
1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes and ensure the app still runs: `npm run dev`
3. Commit and create a PR.

---

If you need help running or extending the admin UI, please reach out to the team or consult the project documentation.