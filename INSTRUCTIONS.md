# How to Deploy Your Own Consumet API on Vercel

This guide provides step-by-step instructions for deploying your own instance of the `consumet` API to Vercel. Self-hosting is recommended for better stability and to avoid public rate limits.

### Why Host Your Own API?

1.  **Reliability**: The public API (`api.consumet.org`) can sometimes be slow or experience downtime. Your own instance is isolated from public traffic.
2.  **No Rate Limits**: You won't be subject to public rate limits, which can be hit if many people are using the API at once.
3.  **Control**: You control when to update the API by pulling the latest changes from the official `consumet` repository.

---

### Step-by-Step Deployment Guide (The Easy Way)

#### **Prerequisites:**

*   A [GitHub](https://github.com/) account.
*   A [Vercel](https://vercel.com/) account (you can sign up with your GitHub account).

#### **Step 1: Fork the Consumet API Repository**

This is the repository for the web server application, which is exactly what we want to deploy.

1.  Navigate to the official `api.consumet.org` repository on GitHub:
    [https://github.com/consumet/api.consumet.org](https://github.com/consumet/api.consumet.org)
2.  Click the **"Fork"** button in the top-right corner of the page. This will create a complete copy of the repository under your own GitHub account.

#### **Step 2: Deploy to Vercel**

This repository is already configured for Vercel, so this step is incredibly simple.

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** and select **"Project"**.
3.  On the **"Import Git Repository"** screen, find your forked `api.consumet.org` repository in the list and click the **"Import"** button next to it.
4.  You can leave all the build settings as they are. Vercel will automatically detect the project type and use the existing `vercel.json` file.
5.  Click **"Deploy"**. Vercel will now begin the build and deployment process. This may take a few minutes to complete.

#### **Step 3: Update Your Manga Reader App's API URL**

Once the deployment is finished, Vercel will congratulate you and provide you with a URL for your new API (e.g., `https://your-project-name.vercel.app`).

1.  Copy this URL.
2.  Open the `constants.ts` file in this manga reader project.
3.  Replace the placeholder URL in `API_BASE_URL` with your new Vercel deployment URL.

---

### How to Verify It's Working

1.  **Direct API Test**: After your Vercel deployment is finished, take your new URL and add a test endpoint to it, like `/manga/mangahere/one piece`. The full URL would look like this:
    `https://your-project-name.vercel.app/manga/mangahere/one piece`

    Paste this URL into your browser's address bar. If you see a page full of JSON data showing search results for "One Piece", your API is deployed and working correctly!

2.  **App Functionality Test**: After updating the `constants.ts` file with your new URL, run this manga reader application. If the "Featured Manga" on the homepage load correctly and you can successfully search for a manga, then your app is properly connected to your new, self-hosted API.