# Aguas Nico Web

React 19 + Vite + Tailwind frontend for **Aguas Nico**, a water-delivery management system. It is the UI for the [aguas-nico-api](../aguas-nico-api) backend.

## Stack

- React 19
- Vite 8
- Tailwind CSS 4 through `@tailwindcss/vite`
- React Router 7
- React Secure Storage (session/token storage)
- React Select
- React Toastify
- ApexCharts (`react-apexcharts`) for statistics charts
- date-fns
- Lucide icons

## API

The API base URL and secure-storage keys are configured via env (`.env`):

```env
VITE_API_URL=https://localhost:5000/api
VITE_SECURE_LOCAL_STORAGE_HASH_KEY=aguas-nico-web-local-dev-hash
VITE_SECURE_LOCAL_STORAGE_PREFIX=aguas-nico-web
```

`VITE_API_URL` targets the [aguas-nico-api](../aguas-nico-api) backend. Endpoint wrappers are grouped by module in [src/app/API.js](src/app/API.js):

- `auth` — login, logout
- `home` — dashboard
- `catalog` — enum/combo data
- `clients` — CRUD, products/abonos, invoice data, history, unassigned
- `products` — CRUD, stats, clients-with-product
- `abonos` — CRUD, renewals, clients-with-abono
- `routes` — planillas (static templates and dynamic instances), dispatched products, dispenser price, search
- `carts` — bajadas: confirm, states, returns, edit, delete
- `dealers` — list, details, sheets, sold products
- `expenses` — CRUD, search by date
- `transfers` — CRUD, by date
- `invoices` — preview and CSV export
- `stats` — annual/monthly profits, products sold, balance, years
- `terceros` — third parties
- `caja` — daily cash-close download

## Scripts

```bash
npm install
npm run dev      # dev server on http://localhost:3000
npm run build
npm run preview
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`:

```powershell
npm.cmd run dev
npm.cmd run build
```

## Folder Structure

```text
src/
  app/              API, auth/session (App, LocalStorage), formatters, helpers, catalog hook
  components/       Reusable UI components
  constants/        Global constants (roles, states, product types, days, messages)
  layout/           Routes, top bar, side navigation, footer, default layout
  screens/          Feature screens grouped by business area
```

Business screen folders:

```text
screens/
  main/         Home (dashboard)
  clients/      ClientsList, ClientForm, ClientDetails, ClientsUnassigned
  products/     ProductsList, ProductStats
  abonos/       AbonosList
  routes/       RoutesList, RouteDetails, RouteEdit, ManualCart, CartEdit, CartEditor
  dealers/      DealersList, DealerDetails, DealerSheets
  expenses/     ExpensesList
  transfers/    TransfersList, TransferFormModal
  invoices/     Invoices
  stats/        Stats
  terceros/     TercerosList
  public/       Login, NotFound, NotAllowed
```

Feature folders colocate a `Xxx.helpers.js` for request builders and per-screen helpers (e.g. `clients/Clients.helpers.js`). Keep domain-specific labels, column definitions, and request mappers out of the component body.

## Auth And Roles

Routes are protected in [src/layout/Routes.jsx](src/layout/Routes.jsx):

- `PrivateRoute` requires a valid secure-storage session (`App.isLoggedIn()`).
- `AdminRoute` requires the `Admin` role (`App.isAdmin()`).
- Dealers can reach Inicio, Planillas (their routes/deliveries), and "Agregar cliente".
- Admin-only sections: Clientes, Productos, Abonos, Repartidores, Gastos, Transferencias, Facturas, Estadísticas, Terceros.

Session and user data (token, role, id, name, truck number) are stored via `react-secure-storage` in [src/app/LocalStorage.js](src/app/LocalStorage.js). Role helpers live in [src/app/App.js](src/app/App.js). The navigation menu is defined in [src/layout/NavBar.jsx](src/layout/NavBar.jsx).

## Reusable Components

Common building blocks live in `src/components`: `PageHeader`, `Card`, `DataTable`, `StatCard`, `Input`, `Select`, `CheckBox`, `Modal`, `ConfirmButton`, `Button`, `Badge`, `Field`, `Loader`, `EmptyState`.

## Adding A New Business Module

1. Create a folder under `src/screens`.
2. Add the screens (`XxxList.jsx`, detail/form screens) and a `Xxx.helpers.js`.
3. Add endpoint wrappers to [src/app/API.js](src/app/API.js).
4. Add routes in [src/layout/Routes.jsx](src/layout/Routes.jsx) (under `PrivateRoute` or `AdminRoute`).
5. Add a navigation item in [src/layout/NavBar.jsx](src/layout/NavBar.jsx).
6. Reuse the components above instead of building new ones.

## Deployment

The app is a Vercel SPA — [vercel.json](vercel.json) rewrites all routes to `/` for client-side routing. Set `VITE_API_URL` (and the secure-storage env vars) in the Vercel project settings.

## Build Verification

```bash
npm.cmd run build
```
