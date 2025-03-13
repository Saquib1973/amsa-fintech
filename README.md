This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Running with Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed on your system
2. Clone the repository
3. Run the following command to start all services:
   ```bash
   docker-compose up -d
   ```
4. The application will be available at [http://localhost:3000](http://localhost:3000)
5. The PostgreSQL database will be available on port 5431

### Running Locally (Development)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
