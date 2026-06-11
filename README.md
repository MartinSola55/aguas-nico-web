# Template Web

React 19 + Vite + Tailwind template for business applications backed by .NET microservices.

## Stack

- React 19
- Vite 7
- Tailwind CSS 4 through `@tailwindcss/vite`
- React Router 7
- React Toastify
- React Select
- React Secure Storage
- Lucide icons

## API

The default API target is:

```env
VITE_API_URL=https://localhost:5000/api
```

This matches the HTTP profile in `C:\Users\marti\Repos\template-api`.

Authentication and base endpoints are defined in [src/app/API.js](src/app/API.js):

- `auth/login`
- `auth/logout`
- `user/getAll`
- `user/getOne`
- `user/getComboRoles`
- `user/getComboUsers`
- `user/create`
- `user/update`
- `user/delete`
- `user/updatePassword`
- `genericItem/getAll`
- `genericItem/getOne`
- `genericItem/getCombo`
- `genericItem/create`
- `genericItem/update`
- `genericItem/delete`
- `genericItem/activate`

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`:

```powershell
npm.cmd run dev
npm.cmd run build
```

## Folder Standards

```text
src/
  app/              API, auth/session, storage, formatters, helpers
  assets/           Logo and favicon
  components/       Reusable UI components
  constants/        Global constants and reusable class names
  layout/           Routes, top bar, side navigation, footer
  screens/          Feature screens grouped by business area
```

Feature folders follow this pattern:

```text
screens/example/
  Example.jsx
  ExamplesList.jsx
  Examples.helpers.js
  Examples.constants.js
```

Reusable components keep classes/default values in colocated constants files when they are shared or likely to grow:

```text
components/button/
  Button.jsx
  Button.constants.js
```

## Auth And Roles

Routes are protected in [src/layout/Routes.jsx](src/layout/Routes.jsx).

- Private routes require a valid secure-storage session.
- Admin routes require `Roles.Admin`.
- `GenericItem` list is readable by authenticated users.
- `GenericItem` create/edit/delete screens and actions are admin-only, matching the API policies.
- User management is admin-only.

## Theme

Light, dark, and system themes are supported through CSS variables in [src/index.css](src/index.css) and the theme helper in [src/app/Theme.js](src/app/Theme.js).

The theme toggle cycles:

```text
Claro -> Oscuro -> Sistema
```

## Adding A New Business Module

1. Create a folder under `src/screens`.
2. Add `ModuleList.jsx`, `Module.jsx`, `Module.helpers.js`, and `Module.constants.js`.
3. Add endpoint wrappers to `src/app/API.js`.
4. Add routes in `src/layout/Routes.jsx`.
5. Add a navigation item in `src/layout/NavBar.constants.js`.
6. Reuse `PageHeader`, `Card`, `Table`, `Input`, `Select`, `Modal`, and `ConfirmDialog`.

Keep domain-specific labels, table column definitions, sort options, default filters, and initial UI constants outside the component body.

## Build Verification

The project compiles with:

```bash
npm.cmd run build
```
