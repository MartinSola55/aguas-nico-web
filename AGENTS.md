# Project Agent Notes

Use these conventions for future work in this repository.

## General Code Style

- Keep imports on one line per import statement.
- Keep component props defaulted in the destructured parameter list where practical.
- Keep concise one-line guards when the existing file uses that style, for example `if (!id) return;`.
- Preserve existing logic and props when a request is explicitly style-only.
- Use lowercase API route/path names in frontend API calls.
- When time really matters, format values with time information as datetime, not date-only.
- Keep user-facing Spanish copy polished, specific, and correctly punctuated.
- Generic helper functions used in more than one place belong to `src/app/Helpers.js`.
- Domain-specific helper functions belong in the screen's helper file, for example `src/screens/module/Module.helpers.js`.

## Imports And Aliases

- Always use alias imports when an available alias covers the target.
- Order imports as: `react`, installed packages, project aliases/decorators, colocated module helpers/constants/data, then style files last.
- Keep import statements contiguous with no blank lines between them, and leave exactly one blank line after the final import.
- Treat project aliases as decorators: `@app`, `@components`, `@constants`, `@hooks`, `@assets/*`, `@layout/*`, and `@screens/*`.
- Use relative imports only for truly colocated files in the same folder, such as `./Users.helpers`, `./Users.constants`, `./Button.constants`, or index/barrel files importing siblings.
- Avoid parent traversal like `../../app/Helpers` or `../../assets/logo.svg` when an alias exists.

## Folder Conventions

- `src/app`: API transport, endpoints, auth/session helpers, storage, formatters, generic helpers, validators, theme helpers, initial form states.
- `src/components`: reusable UI components.
- `src/constants`: global config, routes, messages, roles, storage keys, breakpoints, UI constants.
- `src/hooks`: shared hooks.
- `src/layout`: layout shell, routes, nav, top bar, footer, layout constants.
- `src/screens`: feature screens grouped by business area.
- Component folder names should start with lowercase, for example `button` or `datePicker`.
- Feature modules should follow this pattern: `Module.jsx`, `ModulesList.jsx`, `Modules.helpers.js`, `Modules.constants.js`.
- Reusable components should colocate shared class strings and variants in `Component.constants.js` when the classes are reused or likely to grow.

## Exports

- App modules are generally exported as namespaces, for example `Helpers`, `Formatters`, `Routes`, `Messages`.
- Components are default exports from their component file and named exports from the components barrel.
- Constants files usually define constants first, then use a grouped `export { ... }` block.
- Helper files generally use named `export const ...` declarations.

## API Pattern

- Keep API transport, response parsing, and generic error behavior in `src/app/API.js`.
- Keep endpoint definitions in a separate file, currently `src/app/APIEndpoints.js`.
- API call sites should use the endpoint callback format, for example `APIEndpoints.users.getAll(rq, { onSuccess, onEnd })`.
- Use `onEnd` for loading cleanup and `onSuccess` for successful UI updates.
- Do not use `.then`, `.catch`, or `.finally` in implementations.
- Do not add `async` / `await` handlers to every screen just to call the API.
- `/notFound` navigation belongs at the API layer for not-found API responses, not in individual screens.
- If the API server does not respond, times out, or the response contains a non-empty `response.error`, notify the user from `src/app/API.js`.

## API Data Flow In Screens

- Keep screen state local with React hooks.
- Use `loading`, `submitting`, `deleting`, and `entityToDelete` state names when they match existing screens.
- Load combo data with endpoint callbacks and convert it with `Helpers.toComboItems`.
- Normalize and validate forms in screen helper files before calling endpoints.
- On create/update success, show a specific success toast and navigate back to the list route.
- On delete success, show a specific success toast, close the confirm dialog, and refresh the list.
- Do not duplicate API error handling in screens.

## Forms

- Group form fields by category or importance using `FormSection`.
- Required fields use `<Label required>`.
- Keep form normalization in helper files, not inline in JSX.
- Keep `InitialFormStates` in `src/app/InitialFormStates.js`.
- On edit screens, initialize `loading` with `Boolean(id)`.

## Hooks

- Use a shared `useClickOutside` hook where outside-click behavior is needed.
- Use the shared `useBreakPoint` hook for breakpoint-aware behavior.

## Components

- Use Lucide React icons for UI actions when an icon exists.
- Use colocated `*.constants.js` files for reusable class strings and variant maps.
- Modals use portal rendering and close on Escape/backdrop.

## Styling And Theme

- Always consider available screen space and UI/UX when placing controls and actions.
- Align controls and actions intentionally across responsive breakpoints.
- Account for variable-height controls, especially where text can wrap to two lines.
- Transitions, contrast, and interaction states should match across light and dark themes.
- Respect theme contrast tokens for both light and dark themes.
- Use Tailwind utility classes with theme tokens from `src/index.css`.
- Prefer semantic tokens.
- Do not hardcode light-only or dark-only colors when a token exists.
- Toast messages should be specific rather than generic, with modern/pastel visual styling.

## Layout And Navigation

- Routes are declared in `src/layout/Routes.jsx` and lazy-load screen components.
- Use `Routes` constants from `@constants` for named routes.
- Private routes require `App.isLoggedIn()`.
- Admin routes require `App.isAdmin()`.
- App behavior, including mobile sidebar behavior, must respond to window resizing, not only initial viewport size.

## Constants

- Put global values in `src/constants`.
- Put screen-specific values such as entity names, filter initial state, sort options, table columns, and active/status options in `*.constants.js` beside the screen.
- Keep reusable class names in component constants files or `src/constants/UI.js`.
- Use `AppConfig.*` instead of magic numbers.
- Use `BreakpointCode` values instead of hardcoded breakpoint pixels in JavaScript.

## Routing And Auth

- Login/session data is stored through `LocalStorage` helpers using secure storage.
- Use `App.isLoggedIn`, `App.isAdmin`, and `App.getUserDisplayName` for auth/session checks.

## Tables

- The server does not paginate table data. Fetch the full dataset, then apply filters, sorting, and pagination on the client, unless API endpoints explicitly support query parameters for server-side filtering, sorting, or pagination.
- Screen helper files should keep only domain-specific filtering, custom sort selectors, validation, and normalization.
