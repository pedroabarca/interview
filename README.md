# Countries SPA (React + TypeScript)

A simple single-page app that lists countries and shows details.  
It’s intentionally small but “real”—covering **data fetching (3 styles)**, **custom hooks**, **React Query search with debounce + cache**, **dark/light theme via Context**, **CSS-only UI**, and a **Vitest + Testing Library** test suite.

---

## ✨ Why these design choices?

### 1) Two fetch styles on purpose
We demonstrate both patterns so you can compare trade-offs:

- **Promise chaining (`then`)** – used in `fetchCountries`  
  - **Pros:** Tiny; easy to show mapping pipelines.  
  - **Cons:** Can get noisy with error/cleanup; less linear control flow.
- **`async`/`await`** – used in `fetchCountryDetail` and `fetchCountriesByName`  
  - **Pros:** Reads like synchronous code; easy try/catch/finally; great for branching.  
  - **Cons:** Slightly more boilerplate.

> In both cases, **services map raw DTOs** to our internal types to keep the rest of the app clean and safe.

### 2) Extracting logic into **custom hooks**
Components should render; hooks should “think”.

- `useCountry` – initial fetch of the full list (async); manages loading & error.  
- `useCountryDetail` – fetches and stores one country.  
- `useCountrySearch` – debounced input + React Query cache + staleTime handling.  
- `useSort` – memoizes sorting without mutating.

This separation:
- Keeps components minimal and declarative.  
- Makes logic reusable across screens.  
- Greatly simplifies testing (you can test hooks in isolation).

### 3) Context for theme (light/dark)
We use a `ThemeProvider` with `useTheme` hook:  
- Wraps app once; all components can read/update theme.  
- Syncs with `document.body.classList` to allow global CSS changes.  
- Tested with a fake toggle button.

### 4) CSS-only UI
Minimal **CSS Modules / global classes**:
- Grid layout for list.  
- `box-shadow` for flag elevation.  
- Responsive & minimalistic.

No heavy UI kit—shows how far plain CSS can go.

### 5) Testing strategy
We use **Vitest + Testing Library**:
- **Hooks** tested via `renderHook`, mocking fetch services.  
- **Components** tested for loading, error, data states, navigation, and theme toggle.  
- **Services** tested with mocked `fetch`, including success, 404 empty, and error.

This ensures:  
- Each layer works in isolation.  
- Bugs are caught without manual clicking.

---

## 📂 Structure

```
src/
 ├─ components/       # Dumb presentational pieces (Items, ItemList, etc.)
 ├─ context/          # ThemeContext (light/dark)
 ├─ hooks/            # useCountry, useCountryDetail, useCountrySearch, useSort
 ├─ mappers/          # DTO → domain mappers
 ├─ pages/            # Home, Detail
 ├─ services/         # fetchCountries, fetchCountryDetail, fetchCountriesByName
 ├─ types/            # Country, CountryDetail, DTOs
 └─ test/             # fetch mocks, setup
```

---

## 🚀 Setup & Run

```bash
# Install deps
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

---
