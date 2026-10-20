# Firebase Auth shared login — deployment

The Accounts page is deployed from `bemmyyt/adamisboredaccounts/main`. The forum and website changes are ONLY on `chatgpt/cross-subdomain-sso`.

## Before testing

- In Firebase project **base-c4932**, go to Authentication → Settings → Authorized domains and add `accounts.adamisbored.xyz`. Confirm Email/Password and/or Google providers are enabled.
- The Accounts page must be served over HTTPS at `https://accounts.adamisbored.xyz/`.
- Deploy the Firebase function below **before** deploying the forum SSO branch.

## Deploy the token exchange

The backend is in the website's `chatgpt/cross-subdomain-sso` branch, not in the live Accounts repository.

1. Install Node.js 22 and Firebase CLI: `npm install -g firebase-tools`.
2. `git clone -b chatgpt/cross-subdomain-sso https://github.com/bemmyyt/adamisboredsite.git`
3. `cd adamisboredsite`
4. `firebase login`
5. In Firebase Console, select **base-c4932**, and enable **Blaze** billing if needed for Cloud Functions. Billing can incur charges; configure budget alerts.
6. `cd firebase-functions && npm install && cd ..`
7. `firebase deploy --only functions:exchangeAccountToken --project base-c4932`
8. Verify the deployment URL is `https://europe-west1-base-c4932.cloudfunctions.net/exchangeAccountToken`. If Firebase gives a different URL, update `SSO_EXCHANGE_URL` in the forum SSO branch.

The function uses Firebase Admin SDK's runtime identity; **do not upload service account keys to GitHub**. It verifies Firebase ID tokens (including revocation checks) before minting a custom token. Only the allowed origins are accepted. Keep the function publicly invokable at the platform level so browser requests reach the Firebase token verifier; the endpoint itself requires a valid Firebase ID token.

## Test

1. Sign in at `https://accounts.adamisbored.xyz`.
2. Open the **forum SSO branch preview** (or deploy it when ready); open Account → Sign in with adamisbored Accounts.
3. The popup should detect your existing Accounts session and sign you into the forum using the same Firebase UID.
4. Test with a signed-out Accounts browser and a different user too.
5. Only merge/deploy the forum branch after the exchange function works.

## Scope and limitations

This implements a **central login popup**, not silent automatic sign-in across all subdomains. Each new app must explicitly implement the flow and be added to the allowlists in the Accounts page and function. Logging out of one subdomain does not log out of the others. The existing forum email/password login remains available.

If the function returns 401, check the account token; 403 indicates a disallowed origin; a network error often means deployment or CORS is missing.
