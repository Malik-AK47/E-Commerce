# E-Commerce (MERN)

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node). This project includes a Vite + React frontend and an Express + MongoDB backend. It provides user auth, product listing, cart, checkout (mock), orders, profile, wishlist, and a simple admin area to manage products and orders.

## Features

- User registration and login (JWT)
- Product listing and details
- Add to cart / update quantity
- Wishlist
- Profile and order history
- Admin dashboard for product and order management
- Seed script to create an admin user

## Tech stack

- Frontend: React (Vite), Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT

## Repository structure

```
client/        # React frontend (Vite)
server/        # Express backend
  models/
  routes/
  middleware/
  server.js
README.md
```

## Quick start

Prerequisites:
- Node.js (16+ recommended)
- MongoDB (local or Atlas)

1. Clone repo (or skip if already present)

2. Install server dependencies and configure env vars

```powershell
cd server
npm install
```

Create a `.env` file in `server/` (example values):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
```

Optional: seed an admin account (uses `seedAdmin.js`):

```powershell
node seedAdmin.js
```

3. Install client dependencies

```powershell
cd ../client
npm install
```

Create a `.env` or set environment variable for the client (Vite):

```
VITE_API_URL=http://localhost:5000/api
```

4. Run both apps in dev

Open two terminals:

```powershell
# terminal 1
cd server
npm run dev   # or node server.js

# terminal 2
cd client
npm run dev
```

Frontend will run on Vite dev server (default: http://localhost:5173) and backend on http://localhost:5000.

## Scripts

Server (in `server/package.json`):
- `npm run dev` - run backend in development (nodemon)
- `npm start` - start server

Client (in `client/package.json`):
- `npm run dev` - start Vite dev server
- `npm run build` - build production assets
- `npm start` - preview built assets

## Environment variables

Server (.env):
- `PORT` - server port (default 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key

Client (.env):
- `VITE_API_URL` - URL to the API (e.g., `http://localhost:5000/api`)

## Deployment notes

- Build the client with `npm run build` and serve the `dist` with a static server or integrate into the Express app.
- Ensure environment variables are set in your hosting provider.

## Tests

No automated tests included. To test manually:
- Register and login as a user
- Seed admin and login as admin to manage products

## Contributing

If you want to contribute, fork the repository and open a pull request.

## License

This project does not include a license file. Add a license if you plan to open-source it.

---

If you'd like, I can now add a GitHub remote and push this commit for you — provide the remote URL (HTTPS or SSH) and whether you prefer the default branch be `main` or `master`. If you want me to create the GitHub repo too, you'll need to create it in GitHub or provide credentials/token (I cannot create it for you without API access).