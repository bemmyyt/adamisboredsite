# Shared Firebase sign-in setup

This uses the existing Firebase Auth project `base-c4932`. It does **not** replace Firebase Auth. A small Firebase Cloud Function verifies the ID token received from the Accounts popup and mints a short-lived custom Firebase token for the forum.

## Deploy

1. Install Node.js and the Firebase CLI: `npm install -g firebase-tools`.
2. Log in with `firebase login` and select the **base-c4932** Firebase project.
3. Firebase Functions deployment typically requires the Firebase project to be on the **Blaze billing plan**. Review billing and set a budget alert before enabling it.
4. Copy this folder's `index.js` and `package.json` into a Firebase project's `functions/` directory. Configure `firebase.json` with `{"functions":{"source":"functions"}}`.
5. Run `npm install` in `functions/`, then from the Firebase project root run `firebase deploy --only functions:exchangeAccountToken --project base-c4932`.
6. Check the function URL. The forum code expects `https://europe-west1-base-c4932.cloudfunctions.net/exchangeAccountToken`; update the constant in its `index.html` if Firebase gives a different URL.
7. Deploy the Accounts site on `accounts.adamisbored.xyz` (see `accounts/DEPLOYMENT.md`), add that domain under Firebase Authentication → Settings → Authorized domains, and enable the Google provider if desired.
8. Merge/deploy the separate forum branch after the function and Accounts site are live. Test with a real account.

## Important limitations

- This provides **shared Firebase identities and one-click login from Accounts**, not automatic background login on every subdomain. Automatic silent login requires more infrastructure and third-party storage workarounds are unreliable.
- Signing out of the forum does not automatically sign out of Accounts. Centralized global logout is not implemented.
- The function checks the Firebase ID token and origin. CORS is not an authentication mechanism; Firebase token verification is the security boundary.
- Future apps must integrate the same popup/exchange pattern and must be added to the allowed origins in both the Accounts page and Function.
- Keep Firebase Admin credentials on the server. Do not put a service-account JSON file in the repository.
