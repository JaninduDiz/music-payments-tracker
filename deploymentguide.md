# Deployment Guide

This guide will walk you through the process of deploying your Next.js application to Firebase App Hosting.

## Prerequisites

Before you begin, ensure you have the following installed and set up:

1.  **Node.js and npm:** Make sure you have a recent version of Node.js (v18+) and npm installed.
2.  **Firebase Account:** You need a Firebase account. You can create one for free at the [Firebase website](https://firebase.google.com/).
3.  **Firebase CLI:** Install the Firebase Command Line Interface globally on your machine.
    ```bash
    npm install -g firebase-tools
    ```
4.  **Login to Firebase:** Authenticate with your Firebase account.
    ```bash
    firebase login
    ```

## Deployment Steps

### 1. Initialize Firebase App Hosting

If you haven't already initialized Firebase in your project, navigate to your project's root directory and run:

```bash
firebase init apphosting
```

This command will guide you through:
- Selecting an existing Firebase project or creating a new one.
- Configuring the backend source.

The `apphosting.yaml` file in your project root configures your App Hosting backend. You can customize settings like the number of instances there.

### 2. Build Your Application

Before deploying, you need to create a production build of your Next.js app.

```bash
npm run build
```

This command compiles your application and optimizes it for production. The output will be in the `.next` directory.

### 3. Deploy to Firebase

Once the build is complete, you can deploy your application to Firebase App Hosting.

```bash
firebase deploy --only apphosting
```

The CLI will upload your project files and deploy them. After a few moments, it will provide you with a URL where your live application can be accessed.

That's it! Your application is now deployed and live on Firebase App Hosting.
