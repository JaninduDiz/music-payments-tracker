# Customizing Your App's Icon

This guide will walk you through the process of changing the application icon that appears on the home screen when added and in the web browser tab.

## Icon Requirements

To ensure your icon looks great on all devices, you'll need to create several sizes of your icon in PNG format. The recommended sizes are:

-   `icon-72x72.png`
-   `icon-96x96.png`
-   `icon-128x128.png`
-   `icon-144x144.png`
-   `icon-152x152.png`
-   `icon-192x192.png` (This is the most important one for the home screen icon on Android)
-   `icon-384x384.png`
-   `icon-512x512.png`

You will also need a `favicon.ico` file for the browser tab.

## Steps to Update the Icon

1.  **Prepare Your Icons:**
    Create your app icon in the sizes listed above. You can use an image editor like Photoshop or a free online tool to generate these different sizes from a single high-resolution image.

2.  **Replace the Icon Files:**
    Navigate to the `public/icons` directory in your project. Delete the existing placeholder icons and replace them with your newly created icon files. Make sure the filenames match exactly.

3.  **Replace the Favicon:**
    Place your `favicon.ico` file in the `public` directory, replacing the existing one.

4.  **Update the Apple Touch Icon:**
    In the `src/app/layout.tsx` file, you can find a link tag for the `apple-touch-icon`. Ensure it points to the correct icon size, typically `192x192`.

    ```tsx
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    ```

5.  **Verify the `manifest.json`:**
    The `public/manifest.json` file tells the browser which icons to use when a user adds your app to their home screen. Make sure the paths in this file correctly point to your new icons in the `public/icons` directory. The paths should look like this:

    ```json
    {
        "icons": [
            {
                "src": "/icons/icon-72x72.png",
                "sizes": "72x72",
                "type": "image/png"
            },
            {
                "src": "/icons/icon-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            ...
        ]
    }
    ```

That's it! After completing these steps, your app will display your custom icon on both the browser tab and the home screen.
