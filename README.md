git clone <your-repo-url>
# Authentication Demo (Email/Password + Google Sign-In)

This repository now focuses on demonstrating a complete client-side authentication flow using:

- Email + Password login (mock API)
- Google Sign-In (OAuth) integration via `@react-oauth/google` (credential exchange mocked)
- Access token (in-memory) and refresh token (localStorage) handling
- An API client that attaches `Authorization: Bearer <accessToken>` and automatically refreshes tokens on 401

## What's Included

- `src/store/authStore.ts`: Zustand store managing `user`, access token (in-memory), loading and error state, plus helpers to set/remove refresh token in `localStorage`.
- `src/services/apiClient.ts`: Axios instance that attaches access tokens, intercepts 401 responses, triggers refresh, queues pending requests, and avoids concurrent refresh storms.
- `src/services/mockAuthApi.ts`: Mock backend with `login`, `googleLogin`, and `refreshToken` endpoints for demo purposes.
- `src/pages/Login.tsx`: Login page with email/password form and Google Sign-In button.
- `src/pages/Dashboard.tsx`: Minimal protected dashboard that shows authenticated user info and logout.
- `src/components/PrivateRoute.tsx`: Protects routes and redirects unauthenticated users to `/login`.

## Key Features

- Attach Authorization: `Bearer <accessToken>` to outgoing API requests.
- Intercept `401` responses → trigger `refreshToken` flow.
- Avoid refresh storms by ensuring only one refresh request runs at once.
- Queue pending requests while refresh is in progress and replay them after success.

## Why store the refresh token in `localStorage`?

Short answer: persistence across page reloads for a smoother demo experience. Longer rationale:

- Access tokens are kept in-memory to reduce exposure to XSS; they are short-lived and used for authorizing API calls.
- Refresh tokens are stored in `localStorage` so the demo can persist sessions across browser reloads and reliably demonstrate automatic token refresh on first API call after a reload.

Trade-offs:

- Pros: better developer/demo UX, persists sessions across browser restarts, easy to inspect while learning.
- Cons: `localStorage` is accessible to JavaScript and therefore vulnerable to XSS attacks. For production, prefer HttpOnly cookies for refresh tokens.

Mitigations for production:

- Use HttpOnly, Secure cookies for refresh tokens and same-site settings to mitigate CSRF.
- Implement refresh token rotation and revocation on the server.
- Harden the app against XSS (CSP, input sanitization, output encoding).

## How to run (dev)

```bash
npm install
npm run dev

# Visit http://localhost:5173 and go to /login
```

## Demo credentials

- Email: `demo@example.com`
- Password: `password123`

## Notes

This project is intentionally scoped to authentication flows and the API-client/token management patterns. Email dashboard UI and mock email data were removed per scope change.
### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# VITE_GOOGLE_CLIENT_ID=your-client-id
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Add environment variables in Netlify dashboard
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## 📝 API Client Features

- **Automatic Token Attachment**: Access token added to all requests
- **401 Handling**: Automatic token refresh on unauthorized responses
- **Request Queuing**: Pending requests wait for token refresh
- **Concurrency Control**: Only one refresh request at a time
- **Error Handling**: Graceful logout on refresh failure

## 🧪 Testing the Application

1. **Login Flow**:
   - Try email/password with demo credentials
   - Try invalid credentials to see error handling
   - Try Google Sign-In (mock implementation)

2. **Token Refresh**:
   - Mock tokens are set to expire (simulated)
   - API interceptor automatically refreshes tokens
   - Check browser DevTools → Network to see refresh calls

3. **Dashboard Interaction**:
   - Navigate between folders
   - Click emails to read
   - Star/unstar emails
   - View attachments

4. **Logout**:
   - Click logout button
   - Verify tokens are cleared
   - Attempt to access /inbox → redirects to /login

## 🔒 Security Considerations

1. **XSS Protection**: Sanitize all user inputs and outputs
2. **CSRF Protection**: Use CSRF tokens for state-changing operations
3. **HTTPS Only**: Always use HTTPS in production
4. **Content Security Policy**: Implement strict CSP headers
5. **Token Rotation**: Implement refresh token rotation
6. **Rate Limiting**: Protect authentication endpoints
7. **Audit Logging**: Log authentication events

## 📚 Learning Objectives Achieved

- ✅ Implemented complete authentication flow (login, token handling, refresh, logout)
- ✅ Integrated Google OAuth with proper credential exchange
- ✅ Created API client with automatic token refresh and request queuing
- ✅ Built protected routes with authentication checks
- ✅ Designed and implemented a functional 3-column email dashboard
- ✅ Understood access vs refresh tokens and their storage strategies
- ✅ Implemented form validation and error handling

## 🐛 Known Limitations (Mock Implementation)

- Google Sign-In uses mock token exchange (not real Google verification)
- Backend is mocked client-side (no real API server)
- Tokens don't actually expire (simulated expiration)
- Email data is static (no real CRUD operations)
- No email sending functionality

## 🔮 Future Enhancements

- [ ] Connect to real backend API
- [ ] Implement email sending and composition
- [ ] Add email search and filters
- [ ] Implement pagination for email list
- [ ] Add dark mode support
- [ ] Implement email threading
- [ ] Add file upload for attachments
- [ ] Integrate with real email providers (Gmail API)

## 📄 License

MIT License - Feel free to use this project for learning and reference.

## 👨‍💻 Author

Built as a demonstration of modern React authentication patterns and UI design.

---

**Note**: This is a demonstration project with mock authentication. For production use, implement proper backend authentication, use HttpOnly cookies for tokens, and follow security best practices.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
