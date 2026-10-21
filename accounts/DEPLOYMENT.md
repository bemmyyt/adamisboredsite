# Accounts portal deployment

The site is built at `accounts/index.html` in the main site's repo. **Do not add `accounts/CNAME` here**: GitHub Pages serves one custom domain per Pages site, and this repository already serves `adamisbored.xyz`.

## To serve `accounts.adamisbored.xyz`

1. Create a separate public repository (for instance `bemmyyt/adamisbored-accounts`) with `accounts/index.html` copied to its root as `index.html`, plus a root `CNAME` containing `accounts.adamisbored.xyz`.
2. Enable GitHub Pages for that repository on its publishing branch and configure the custom domain `accounts.adamisbored.xyz`.
3. In Spaceship DNS add a CNAME for hostname `accounts` pointing to `bemmyyt.github.io` (without `https://` or a path). Wait for GitHub Pages to verify and enable HTTPS.
4. In Firebase Console, Authentication > Settings > Authorized domains, add `accounts.adamisbored.xyz` (needed for OAuth popup redirects). Ensure the Google provider is enabled if Google sign-in is desired.
5. Test email/password and Google authentication, password resets and existing forum profiles. This portal uses the forum's existing Firebase project and `users/{uid}` profile document, but each subdomain has its own Firebase browser session; seamless single sign-on is not implemented.

For initial preview before subdomain deployment, merge this feature branch and visit `https://adamisbored.xyz/accounts/`. To avoid a broken account link until hosting is ready, change the main site's Account navigation link to `/accounts/` or finish the subdomain deployment before merging.

No passwords are stored in GitHub or Firestore by this portal; Firebase Authentication handles credentials. Firebase web app configuration is a public identifier, not a private service-account secret.
