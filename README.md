# Vyapar Frontend

React + Vite frontend configured for Google Cloud Run.

## Environment

The app reads this variable:

- `VITE_BASE_API_URL`: backend service URL, for example `https://BACKEND_URL`

For local development, update `.env` if your backend is not running on `http://localhost:9090`.

For Cloud Run, set the same variable on the Cloud Run service. It is written to `/env.js` when the container starts, so you can update the backend URL without rebuilding the frontend image. The frontend automatically derives REST calls from `/api/v1` and SockJS/STOMP from `/ws`.

## Local Commands

```sh
npm install
npm run dev
npm run build
```

## Docker

```sh
docker build -t vyapar-frontend .
docker run --rm -p 8080:8080 --env-file .env vyapar-frontend
```

Open `http://localhost:8080`.

## Cloud Run Deployment

Enable the required GCP APIs once per project:

```sh
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

Replace `YOUR_BACKEND_CLOUD_RUN_URL` in `cloudbuild.yaml` or override the substitutions from the command line:

```sh
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions _REGION=asia-south1,_REPOSITORY=cloud-run,_SERVICE=vyapar-frontend,_VITE_BASE_API_URL=https://YOUR_BACKEND_CLOUD_RUN_URL
```

The Docker container listens on Cloud Run's `$PORT` and defaults to `8080`.
