## Kairos Nexus Challenge – Real-Time 1‑to‑1 Chat Web App

This repository implements the **Kairos Nexus real‑time 1‑to‑1 chat assignment** end‑to‑end:

- React 18 + TypeScript frontend with TailwindCSS and shadcn‑style UI (Button, Card, Input, ScrollArea)
- Node.js + Express + Socket.io backend
- PostgreSQL + Prisma for message persistence
- Jest + React Testing Library (frontend) and Jest + Supertest (backend)
- GitHub Actions CI running lint, tests, and builds on every push/PR

The app allows two users (for example **User A** and **User B**) to log in, send messages, and see them appear in real time in **both** tabs, backed by a persistent messages table.

---

### Tech Stack

- **Frontend**
  - React 18 with TypeScript
  - Vite bundler
  - TailwindCSS
  - shadcn‑style UI components:
    - `Button` – used for actions like **Send** and **Continue**
    - `Input` – used for username and message inputs
    - `Card`‑style layouts – used in `LoginPage` and chat layout
    - `ScrollArea` – used for the message list and auto‑scroll container
  - Socket.io client
  - Jest + React Testing Library

- **Backend**
  - Node.js + Express
  - Socket.io
  - PostgreSQL with Prisma ORM
  - Jest + Supertest

- **CI/CD**
  - GitHub Actions workflow at `.github/workflows/test.yml`
    - Installs frontend and backend dependencies
    - Runs ESLint
    - Runs Jest tests (frontend + backend)
    - Builds frontend and backend

---

### How the Assignment Is Implemented

- **Chat Interface**
  - Implemented in `src/src/pages/ChatPage.tsx` with supporting components in `src/src/components/`.
  - **Message list** shows conversation history in chronological order with the **latest messages at the bottom**.
  - **Message bubbles** display sender name, text, and timestamp, with different styling for "you" vs. other users.
  - Uses a `ScrollArea` component to keep the conversation scrollable and visually polished.

- **Socket.io Integration**
  - Socket client logic lives in `src/src/services/socket.ts`.
  - On mount, the chat hook (`src/src/hooks/useChat.ts`) connects to the Socket.io server.
  - The client:
    - Listens for `message` events from the server and appends them to the message list.
    - Emits `sendMessage` when the user sends a message.
    - Also supports user presence/typing events (used in the sidebar and typing indicators).

- **User Routing / Login**
  - `src/src/pages/LoginPage.tsx` provides a simple login experience where the user enters a username (e.g. **User A** or **User B**).
  - The username is stored in a global React context (`src/src/context/AuthContext.tsx`).
  - Once logged in, the user is routed into the `ChatPage` experience.
  - The **Sign Out** button in `ChatPage` now:
    - Clears the username from context, and
    - Refreshes the page to fully reset state.

- **Loading History**
  - `src/src/services/api.ts` implements REST calls to the backend:
    - `GET /api/messages` for history
    - `POST /api/messages` to create a new message
  - `useChat` calls `fetchMessages` on mount and populates the message list before starting real‑time subscriptions.

- **UI/UX Polish**
  - Fully responsive, mobile‑first layout driven by TailwindCSS.
  - shadcn‑style `Button`, `Card`, `Input`, and `ScrollArea` components give a consistent design system.
  - Loading states:
    - Initial "Loading Nexus..." when username is missing.
    - "Connecting nexus..." spinner while messages are loading.
  - Sidebar shows active users and status, plus typing indicators where applicable.

- **Backend Requirements**
  - Implemented inside `server/`:
    - **Routes**: `GET /api/messages`, `POST /api/messages` in `routes/messageRoutes.ts`.
    - **Controllers**: `messageController.ts` handles fetching and creating messages.
    - **Services**: `messageService.ts` uses Prisma to read/write to the `Message` table.
    - **Sockets**: `sockets/chatSocket.ts` wires up Socket.io events.
  - **Socket.io Events**:
    - `sendMessage` (client → server):
      - Validates payload (`sender`, `text`).
      - Persists message to the DB.
      - Broadcasts `message` to all connected clients.
    - `message` (server → clients):
      - Emitted with the full message object (id, sender, text, createdAt).
  - **Validation**:
    - REST requests go through validation middleware (non‑empty `sender` and `text`).
    - Invalid payloads return **400 Bad Request** with an error payload.

- **Database**
  - Prisma schema (`prisma/schema.prisma`) defines a `Message` model:
    - `id` (UUID primary key)
    - `sender` (username)
    - `text` (message body)
    - `createdAt` (timestamp)
  - Migrations are run via `npx prisma migrate dev` and Prisma client is generated via `npx prisma generate`.

- **Testing**
  - **Frontend** (`src/`):
    - Jest + React Testing Library verify that:
      - Messages render correctly.
      - The Send button triggers message sending.
      - Mocked Socket.io events update the UI (message appended to the list).
    - `src/src/__tests__/Services.test.ts` covers REST API service helpers and socket helpers. The global fetch mock uses `globalThis` to avoid TypeScript errors.
  - **Backend** (`server/`):
    - Jest + Supertest verify:
      - `GET /api/messages` (happy path).
      - `POST /api/messages` (happy path).
      - Validation errors return 400 when payload is invalid.
      - Socket broadcast behavior is tested in dedicated Socket.io tests.
  - Coverage thresholds are set to **70%+** for branches, functions, lines, and statements in both frontend and backend Jest configs.

- **CI/CD**
  - `.github/workflows/test.yml` runs on push/PR and:
    - Spins up a PostgreSQL service.
    - Installs frontend (`src/`) and backend (`server/`) dependencies.
    - Runs Prisma migrations and generates the Prisma client.
    - Runs ESLint for both frontend and backend.
    - Runs Jest tests for both frontend and backend.
    - Builds the frontend and backend to ensure production builds succeed.

---

### Prerequisites

- Node.js 18+ (recommended 20+)
- npm
- Docker (for Postgres) **or** a local PostgreSQL instance

---

### Setup Instructions

#### 1. Clone and enter the project

```bash
git clone https://github.com/joshuaoni/realtime-chat.git 
cd realtime-chat
```

#### 2. Environment variables

Copy `.env.example` to `.env` in both `src/` (frontend) and `server/` (backend) 

Ensure `DATABASE_URL` points to a running PostgreSQL instance and `VITE_API_BASE_URL` points to the same PORT you set in `server/.env`.

#### 3. Start PostgreSQL

**Option A – Docker**

```bash
docker run --name kairos-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chat_app -p 5432:5432 -d postgres:16
```

**Option B – Local Postgres**

Create a `chat_app` database and update `DATABASE_URL` in `.env` to match your credentials.

**Option C – Remote Postgres**

Use existing remote postgres URI.

#### 4. Backend – install, migrate, and run

```bash
cd server
npm install

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Start the backend in dev mode
npm run dev
```

The backend runs at `http://localhost:<PORT>`.

#### 5. Frontend – install and run

```bash
cd src
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` (Vite default).

---

### Testing

#### Frontend tests

```bash
cd src
npm test
```

These tests cover:

- Successful message rendering
- Send button triggering message send
- Mocked Socket.io message events updating the UI

#### Backend tests

```bash
cd server
npm test
```

Ensure PostgreSQL is running and Prisma migrations have been applied. Tests cover:

- `GET /api/messages`
- `POST /api/messages`
- 400 error on invalid payloads
- Socket.io broadcast path

Both test suites enforce ~70% minimum coverage on critical paths via Jest coverage thresholds.

---

### Linting

#### Frontend

```bash
cd src
npm run lint
```

#### Backend

```bash
cd server
npm run lint
```

---

### Build

#### Frontend

```bash
cd src
npm run build
```

#### Backend

```bash
cd server
npm run build
```

---

### How to Manually Test Real‑Time Chat (Two Tabs)

1. Start the **backend**:

   ```bash
   cd server
   npm run dev
   ```

2. Start the **frontend**:

   ```bash
   cd src
   npm run dev
   ```

3. Open `http://localhost:5173` in **two browser tabs**.
4. In tab 1, log in as `User A`.
5. In tab 2, log in as `User B`.
6. Send messages from both tabs:
   - Messages appear in both tabs instantly via Socket.io.
   - Refresh either tab; historical messages are loaded from PostgreSQL.
7. To sign out, click the **logout** icon; the app will clear your username and **refresh the page** to reset state.

---

### CI/CD – GitHub Actions

On every push/PR, the workflow in `.github/workflows/test.yml` runs:

- **Install dependencies** for `src/` (frontend) and `server/` (backend)
- **Run ESLint** via each package’s `npm run lint`
- **Run Jest tests** in both frontend and backend
- **Build** the frontend and backend

All steps must pass for the check to succeed, giving confidence that the assignment remains working and production‑ready.
