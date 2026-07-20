# Xavier International College - Project Setup

This project is a modern, high-performance web application built with a **React + Vite** frontend and an **Express + Prisma** backend. It was successfully migrated from a legacy Laravel application, which has now been fully removed.

The architecture is split into two main parts:
1. **Frontend (React)**: Handles the UI and client-side routing.
2. **Backend (Express)**: Provides REST API endpoints querying the database using Prisma, and serves legacy uploaded user media and images.

---

## 🚀 Getting Started

To run this project locally, you will need to open **two separate terminal windows** and run the following commands.

### 1. Start the Express API Backend (Terminal 1)
The modern API backend connects to the MySQL database via Prisma, serves the JSON data to the frontend, and statically serves the legacy images from the `server/storage` directory.

```bash
# Navigate to the server folder
cd server

# Install dependencies (only required the first time)
npm install

# Start the development server
npm run dev
```
*This will run on `http://localhost:5000`.*

### 2. Start the React Frontend (Terminal 2)
The frontend is built with Vite for lightning-fast hot module replacement.

```bash
# Navigate to the client folder
cd client

# Install dependencies (only required the first time)
npm install

# Start the Vite development server
npm run dev
```
*This will run on `http://localhost:5173`.*

Open `http://localhost:5173` in your browser to view the application!

---

## 📂 Project Structure

- `/client/` - The React frontend.
  - `/client/src/App.jsx` - Main router handling all page routes.
  - `/client/src/pages/` - Individual page components.
  - `/client/src/components/` - Reusable UI components (Headers, Banners, Cards).
  - `/client/public/images/` - Static assets and SVGs.
- `/server/` - The Express backend.
  - `/server/src/index.ts` - Main Express server containing all `/api/` endpoints.
  - `/server/prisma/schema.prisma` - Database schema definition for the Prisma ORM.
  - `/server/storage/` - Legacy images uploaded via the old admin panel.
- `/.env` - Environment variables (contains database credentials).

---

## 🛠️ Architecture Notes

### Routing
The application uses React Router (`BrowserRouter`) for client-side routing. All legacy Laravel routes have been successfully mapped to React components.
- **Dynamic Routes:** Pages like `/news-and-events/:slug` and `/life-at-xavier/:slug` fetch their content directly from the Express backend APIs.
- **Static Routes:** Pages like `/about-us` and courses are hardcoded for maximum performance.
- **Unified Dynamic Routes:** Related pages (like the 7 distinct skills and studies pages) share a single reusable component (`SkillAndStudiesPage.jsx`) that changes its content based on the URL parameter.

### Image Handling
Images that were uploaded via the legacy admin panel are stored in the database's polymorphic `media` table (Spatie Media Library). The Express API properly queries this table to construct the full image URL pointing directly to the Express server (e.g. `http://localhost:5000/storage/...`) for seamless backwards compatibility.
