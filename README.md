# MyTaskHelper

A Jira-like task management app with Kanban boards, built with **Next.js** (frontend) and **NestJS** (backend).

## Features

- **Kanban Board** — 4 columns: To Do, Pending, In Progress, Done
- **Drag & Drop** — Move tasks between columns with smooth DnD
- **Task Tickets** — Title, description, status, timestamps
- **Google OAuth** — One-click sign-in with Google
- **Email Auth** — Register with email + password + email verification
- **Daily Reset** — Done column clears at midnight; tasks move to history
- **History Page** — Browse all completed tasks with completion timestamps
- **Reopen Tickets** — Bring any archived task back as a new todo
- **User Profile** — Name, avatar, provider info

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, @dnd-kit |
| Backend | NestJS, TypeScript, TypeORM, Passport.js |
| Database | PostgreSQL 16 |
| Auth | JWT + Google OAuth2 + Email verification |
| Email | Nodemailer (SMTP) |
| Jobs | @nestjs/schedule cron |
| Dev | Docker Compose |
| CI/CD | GitHub Actions |
| Infra | Terraform → AWS (EC2 t2.micro + RDS t3.micro) |

## Quick Start (Development)

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- A Google OAuth app (for Google sign-in)
- An SMTP account (e.g. Gmail with App Password)

### 1. Clone & configure

```bash
git clone https://github.com/your-org/mytaskhelper.git
cd mytaskhelper

# Backend env
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env with your values

# Frontend env
cp apps/frontend/.env.local.example apps/frontend/.env.local
# Edit NEXT_PUBLIC_API_URL if needed
```

### 2. Key variables to set in `apps/backend/.env`

```env
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
MAIL_USER=your-gmail@gmail.com
MAIL_PASS=your-gmail-app-password
JWT_SECRET=a-long-random-string
JWT_REFRESH_SECRET=another-long-random-string
```

### 3. Start with Docker

```bash
docker compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api |
| PostgreSQL | localhost:5432 |

### 4. Without Docker (local dev)

```bash
# Terminal 1 — backend
cd apps/backend && npm install && npm run start:dev

# Terminal 2 — frontend
cd apps/frontend && npm install && npm run dev
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
4. Copy Client ID and Secret into `apps/backend/.env`

## API Reference

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register with email/password |
| GET | `/api/auth/verify-email?token=` | Verify email |
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/google` | Start Google OAuth flow |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |

### Todos (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/todos` | List all user todos |
| POST | `/api/todos` | Create todo |
| PUT | `/api/todos/:id` | Update todo (title/description/status) |
| DELETE | `/api/todos/:id` | Delete todo |

### History (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/history` | List archived todos |
| POST | `/api/history/:id/reopen` | Reopen archived todo |

## Deployment with Terraform (AWS)

The cheapest AWS setup (~$0/mo free tier, ~$12/mo after):
- **EC2 t2.micro** — runs Docker Compose with Nginx, frontend, backend
- **RDS db.t3.micro** — PostgreSQL (free tier: 750 hrs/mo)
- **ECR** — container registry

```bash
cd infrastructure/terraform

# Create terraform.tfvars (never commit this!)
cat > terraform.tfvars <<EOF
db_user        = "taskuser"
db_password    = "strong-password-here"
ssh_public_key = "$(cat ~/.ssh/id_rsa.pub)"
EOF

terraform init
terraform plan
terraform apply
```

After `apply`, copy the outputs and configure GitHub Secrets:

| Secret | Value |
|--------|-------|
| `AWS_ACCOUNT_ID` | Your AWS account ID |
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret |
| `EC2_HOST` | Elastic IP from Terraform output |
| `EC2_SSH_KEY` | Private SSH key content |
| `NEXT_PUBLIC_API_URL` | `https://yourdomain.com/api` |

## CI/CD Flow

```
git push main
    │
    ├── ci.yml
    │   ├── Backend: tsc + tests
    │   └── Frontend: tsc + lint + build
    │
    └── deploy.yml (on main only)
        ├── Build Docker images
        ├── Push to ECR
        └── SSH into EC2 → docker compose pull & up
```

## Project Structure

```
mytaskhelper/
├── apps/
│   ├── backend/                # NestJS API
│   │   └── src/
│   │       ├── auth/           # JWT, Google OAuth, local strategies
│   │       ├── users/          # User entity & service
│   │       ├── todos/          # Todo CRUD
│   │       ├── history/        # Archived todos
│   │       ├── mail/           # Email service (Nodemailer)
│   │       └── scheduler/      # Daily midnight cron
│   └── frontend/               # Next.js app
│       └── src/
│           ├── app/            # Pages (App Router)
│           ├── components/     # UI components
│           ├── hooks/          # useAuth, useTodos, useHistory
│           ├── lib/            # API client, auth helpers
│           └── types/          # Shared TypeScript types
├── infrastructure/
│   └── terraform/              # AWS infrastructure as code
├── .github/workflows/          # CI and deploy pipelines
├── docker-compose.yml          # Development
├── docker-compose.prod.yml     # Production
└── nginx.conf                  # Reverse proxy config
```
