# ⚡ SHOWZ — Hardcore Gigs & Live Shows PWA

A hardcore-tailored Progressive Web App (PWA) built for underground hardcore, beatdown, metallic hardcore, and crossover gig communities (Sunami, Hatebreed, Pain of Truth, Drain, Terror, Mindforce).

Hosted on **GitHub Pages** with live cloud sync via **Firebase Cloud Firestore**.

---

## 🔥 Features

### ☠️ Hardcore Aesthetic & Discovery
- **Dark, Gritty Hardcore Visuals**: Pitch black and blood-red distressed theme, impact stencil typography, skull & crosshair iconography.
- **Hardcore Badges & Info**:
  - `STAGE DIVES ENCOURAGED` / No-Barricade indicators.
  - Set times & `DAMAGE` (door pricing / free admission).
  - Subgenre tagging: *Beatdown / Heavy HC*, *Metallic Hardcore*, *NYHC / Traditional*, *Crossover Thrash*, *Fast HC / Powerviolence*, *Death Metal / Grind*, *Post-Hardcore / Punk*.
  - Status indicators: `LOW TICKETS`, `SOLD OUT / NO DOOR`, `GIG CANCELLED`.
- **One-Tap Calendar Export**: Downloads `.ics` (Apple Calendar, Outlook) & 1-click Google Calendar sync.
- **Venue Directions**: Direct link into Google Maps.
- **Native Web Share**: Share flyers with your crew.
- **Saved / Bookmarked Gigs**: Save favorite shows locally.

### ☁️ Real-time Cloud Sync (Firebase Firestore)
- When an admin adds, edits, or uploads a flyer on their iPhone, it syncs **instantly in real-time** via **Cloud Firestore**.
- Every attendee anywhere sees the newly added gig immediately without needing to refresh.
- **Offline Resilience**: Cached locally via Service Worker & WebKit storage, so attendees can still check lineup and set times in basement venues with zero cell service.

### 🛡️ Admin Gig Management
- Passcode protected (Default demo PIN: `1234`).
- Add/Edit band lineups, supporting acts, set times, damage, and venue info.
- Upload custom flyer artwork directly from your phone camera roll or pick from live mosh presets.
- 1-click duplicate show for tour dates or recurring gigs.
- Full JSON backup export & restore.

---

## 🚀 Development & Deployment

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for GitHub Pages
npm run build
```

---

## 🔒 Firebase Security Rules Note

In your Firebase Console (**[console.firebase.google.com](https://console.firebase.google.com)**):
1. Navigate to **Firestore Database** → **Rules**.
2. Make sure read/write access is open for your `shows` collection:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /shows/{showId} {
         allow read, write: if true;
       }
     }
   }
   ```
3. (Optional) In **Firebase Storage** → **Rules**:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /flyers/{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ```
*(If Storage rules are restricted, the app automatically falls back to compressed image storage inside Firestore so uploads never fail).*
