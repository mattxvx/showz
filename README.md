# 🎸 GigPulse — Local Shows & Live Music PWA

A Progressive Web App (PWA) designed for local music communities. It allows **admins** to curate, add, and manage live shows, while giving **fans and attendees** a fast, offline-ready experience to discover local concerts, save favorites, get directions, and export set times directly to their calendars.

Engineered specifically for seamless deployment on **GitHub Pages**.

---

## ✨ Features

### 🎧 For Attendees & Fans
- **Offline-Ready PWA**: Fully installable on iOS, Android, and Desktop via Web App Manifest and Service Worker caching.
- **Smart Filters & Discovery**:
  - Filter by date: **Tonight** (with live pulse badge), **This Weekend**, **Upcoming**, or All Dates.
  - Filter by genre: Indie Rock, Electronic, Jazz & Blues, Punk / Metal, Hip-Hop, Folk, Synthwave, etc.
  - Instant search across headliners, support acts, venues, cities, and tags.
- **Interactive Event Cards**:
  - View door time, showtime, cover price / free admission badge, age restriction (All Ages, 18+, 21+), and venue details.
- **One-Tap Calendar Export**:
  - Downloads RFC-5545 `.ics` file (Apple Calendar, iOS, Outlook).
  - One-click **Google Calendar** integration.
- **Venue Directions**: Direct link to Google Maps / navigation with pre-filled address and venue.
- **Native Web Share**: Share shows with friends via the native device share sheet or clipboard.
- **Saved / Bookmarked Shows**: Save favorite gigs locally to keep track of your weekend.

### 🛡️ For Admins & Venue Curators
- **Quick Admin Access**:
  - Discreet Admin Portal toggle in the navbar.
  - Passcode protected (Default demo PIN: `1234`, with a 1-click quick-unlock button for fast testing).
- **Comprehensive Show Creator & Editor**:
  - Headliner & supporting acts (multi-act tags).
  - Venue name, street address, and city.
  - Event date, doors open, showtime, and curfew.
  - Genre categorization & age restrictions.
  - Ticket links and admission pricing (or 1-click **Free Entry** toggle).
  - Status management: `Active`, `Selling Fast`, `Sold Out`, or `Cancelled`.
  - **Featured Gig** spotlight toggle for the homepage hero showcase.
- **Flyer Art Management**:
  - Pick from built-in high-resolution concert atmosphere presets.
  - Paste any external flyer image URL.
  - Upload local flyer image files directly from device (stored as Data URLs).
- **Fast Event Operations**:
  - 1-click **Duplicate Show** (perfect for recurring residencies or club nights).
  - Inline status selector in the admin dashboard table.
  - Edit and delete actions.
- **Zero-Backend Portability & Backup**:
  - **Export JSON**: Download a complete backup of your shows.
  - **Import JSON**: Restore or transfer your show database to any device.
  - **Reset to Defaults**: 1-click restore to fresh sample gig data.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start Vite local development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🌐 Deploying to GitHub Pages

This project is pre-configured with **relative asset paths (`base: './'`)** and an automated GitHub Actions deployment workflow.

### Option 1: Automated Deployment via GitHub Actions (Recommended)

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of GigPulse PWA"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. On GitHub, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build the PWA and publish it to `https://<your-username>.github.io/<your-repo-name>/`.

### Option 2: Deploying the Pre-Built `dist/` Folder

A production build has already been generated in the `dist/` directory. You can also:
1. Build at any time with:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder directly to GitHub Pages (e.g. using the `gh-pages` branch or pointing Pages to `/dist` if configured).

---

## 📱 PWA & Service Worker Configuration

- **Web App Manifest**: [public/manifest.webmanifest](file:///c:/Users/mattx/Downloads/app-giuggym/public/manifest.webmanifest)
  - Configured with `start_url: "./"` and `scope: "./"` to prevent root-domain 404s when hosted on GitHub Pages subpaths.
- **Service Worker**: [public/sw.js](file:///c:/Users/mattx/Downloads/app-giuggym/public/sw.js)
  - Pre-caches core app shell and assets.
  - Offline fallback enables attendees to look up gig details and set times even inside basements or venues with zero cell reception.
- **Single Page App Routing on GitHub Pages**:
  - [public/404.html](file:///c:/Users/mattx/Downloads/app-giuggym/public/404.html) handles client-side redirects cleanly on GitHub Pages.

---

## 🔑 Admin Credentials (Default)

- **Default Passcode**: `1234`
- You can change the passcode at any time via the Admin Authentication modal.
- Includes a **1-Click Instant Unlock** button in demo mode for quick testing.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **PWA**: Web App Manifest + Service Worker + Native Web Share & `.ics` generator
