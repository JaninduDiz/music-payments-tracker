# Vercel Deployment Guide

This guide will walk you through deploying your Next.js application to Vercel.

## Prerequisites

Before you begin, ensure you have the following:

1.  **Node.js and npm:** Make sure you have a recent version of Node.js (v18+) and npm installed.
2.  **Vercel Account:** You need a Vercel account. You can sign up for free at the [Vercel website](https://vercel.com/signup).
3.  **Vercel CLI (Optional but Recommended):** Install the Vercel Command Line Interface globally.
    ```bash
    npm install -g vercel
    ```

## Deployment Methods

You can deploy your application to Vercel in two primary ways: through a connected Git repository (recommended) or via the Vercel CLI.

### Method 1: Deploying with Git (Recommended)

This is the easiest and most common method. Vercel will automatically build and deploy your app whenever you push changes to your connected Git repository.

1.  **Push your code to a Git provider:** Make sure your project is on GitHub, GitLab, or Bitbucket.
2.  **Import Project on Vercel:**
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click the "Add New..." button and select "Project".
    *   Find your Git repository and click "Import".
3.  **Configure Your Project:**
    *   Vercel will automatically detect that you are using Next.js and configure the build settings for you. You typically don't need to change anything here.
    *   Before deploying, you must configure your environment variables.

### Method 2: Deploying with the Vercel CLI

You can also deploy your project directly from your terminal.

1.  **Login to Vercel:**
    ```bash
    vercel login
    ```
2.  **Link Your Project:**
    Navigate to your project's root directory and run:
    ```bash
    vercel link
    ```
    This will guide you through connecting your local project to a new or existing Vercel project.
3.  **Deploy:**
    To deploy to a preview environment, run:
    ```bash
    vercel
    ```
    To deploy to production, run:
    ```bash
    vercel --prod
    ```

## Configuring Environment Variables

Your application requires a few environment variables to connect to Supabase and use the AI features.

1.  Go to your project's page on the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Navigate to the **Settings** tab and click on **Environment Variables**.
3.  Add the following variables:
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.
    *   `GEMINI_API_KEY`: Your Google Gemini API key.

Make sure to add these variables before your first deployment. After you've set them up, Vercel will automatically use them for all subsequent builds.

That's it! Your application is now deployed and live on Vercel.
