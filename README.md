# Udyogsaarthi

Monorepo with Backend API, Frontend app, and Admin panel for Udyogsaarthi.

## Overview

- Backend: Node/Express + MongoDB API — [Backend/app.js](Backend/app.js)  
  Main routes are defined in [Backend/routes/web.js](Backend/routes/web.js). Key controllers include [`auth`](Backend/controller/auth.js), [`dataEntryOpt`](Backend/controller/dataEntryOpt.js), [`searchEngine`](Backend/controller/searchEngine.js) and [`countDashBord`](Backend/controller/countDashBord.js).
- Frontend: React app in [frontend/](frontend/) — entry [frontend/src/App.js](frontend/src/App.js).
- Admin panel: React app in [admin/](admin/) — entry [admin/src/App.js](admin/src/App.js).
- Devcontainer: [.devcontainer/Dockerfile](.devcontainer/Dockerfile)

## Repo structure (important files)

- Backend
  - [Backend/app.js](Backend/app.js)
  - [Backend/routes/web.js](Backend/routes/web.js)
  - Controllers: [`auth`](Backend/controller/auth.js), [`dataEntryOpt`](Backend/controller/dataEntryOpt.js), [`searchEngine`](Backend/controller/searchEngine.js), [`dataColumn`](Backend/controller/dataColumn.js)
  - Middleware: [`jwtFetchusers`](Backend/middleware/jwtFetchusers.js)
  - Models: [Backend/models/data.js](Backend/models/data.js), [Backend/models/superAdmin.js](Backend/models/superAdmin.js), [Backend/models/otp.js](Backend/models/otp.js), [Backend/models/columnData.js](Backend/models/columnData.js), [Backend/models/dataEntryOperator.js](Backend/models/dataEntryOperator.js)
  - File upload: [Backend/Files/multer.js](Backend/Files/multer.js)
- Frontend
  - [frontend/src/App.js](frontend/src/App.js)
  - Components: [frontend/src/Components/Auth.jsx](frontend/src/Components/Auth.jsx), [frontend/src/Components/Verify.jsx](frontend/src/Components/Verify.jsx), [frontend/src/Components/SearchEngine.jsx](frontend/src/Components/SearchEngine.jsx), [frontend/src/Components/SearchResults.jsx](frontend/src/Components/SearchResults.jsx)
  - Styles in [frontend/src/Components/CSS/](frontend/src/Components/CSS/)
- Admin
  - [admin/src/App.js](admin/src/App.js)
  - Components: [admin/src/Components/Auth.jsx](admin/src/Components/Auth.jsx), [admin/src/Components/Verify.jsx](admin/src/Components/Verify.jsx), [admin/src/Components/admin/ManageJobs.jsx](admin/src/Components/admin/ManageJobs.jsx)
  - Styles in [admin/src/Components/CSS/](admin/src/Components/CSS/)
- Static servers for production builds:
  - [frontend/server.js](frontend/server.js)
  - [admin/server.js](admin/server.js)

## Prerequisites

- Node.js (LTS)
- npm
- MongoDB instance (connection string in Backend `.env`)

## Environment variables

Place per-service env files in the folders below (examples of used keys):

- [Backend/.env](Backend/.env)
  - PORT
  - MONGODBURL
  - SECTRE_KEY
  - GMAIL, GMAIL_PASS, GMAIL_HOST, GMAIL_PORT
  - (any other keys referenced in controllers)

- [frontend/.env](frontend/.env) and [admin/.env](admin/.env)
  - REACT_APP_BACKEND_URL (e.g. `http://localhost:5000`)

Make sure values match what the apps expect (see usage of `process.env.SECTRE_KEY` in [`dataEntryOpt`](Backend/controller/dataEntryOpt.js) and JWT middleware [`jwtFetchusers`](Backend/middleware/jwtFetchusers.js)).

## Quick start (development)

1. Backend
   ```sh
   cd Backend
   npm install
   # start (adjust per package.json - e.g. `npm start` or `node app.js`)
   npm start
