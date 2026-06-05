# ResumeIQ Frontend

Modern React + Vite + Tailwind frontend for the FastAPI resume analyzer backend.

## Setup

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8000`, so keep the backend running on port `8000`.

## API Mapping

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/resume/upload`
- `GET /api/resume/my-resumes`
- `GET /api/resume/resumes/:id`
- `DELETE /api/resume/resumes/:id`
