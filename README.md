# Family Bingo

A web application for generating Bingo cards, built with Next.js. It supports random number generation via Random.org API with a local fallback.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

```bash
npm install
```

## Configuration

To enable true random generation, create a `.env.local` file in the root directory and add your Random.org API key:

```
RANDOM_ORG_API_KEY=your_api_key_here
```

If no key is provided, the application will fallback to local pseudo-random number generation.

## Running Locally

Start the development server:

```bash
npm run dev
```

Access the application at http://localhost:3000

## Building used for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## Project Structure

- src/pages: Application routes and views
- src/components: Reusable UI components
- src/lib: Internal libraries and helpers
- src/styles: Global CSS styles
- public: Static assets
