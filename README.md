# Countries App (React + TypeScript + Vite)

#### Minimal SPA that lists countries and shows a detail view using the public REST Countries API (no API key required).
#### Styling is plain CSS/CSS. Data flow is handled with small services and custom hooks.

# Initial Setup / Configuration

## Prerequisites
Node.js 18+ (recommended 20 LTS)
npm

## Install & Run
```js
npm install

npm run dev

npm run build

npm run preview
```
## Data Fetching Styles Used

#### The project intentionally shows two ways to fetch with the native fetch API—so you can compare ergonomics and testing patterns:

 1. Promise chaining (.then)
 2. async/await

## Running Tests

```sh
# Run all tests
npm test

# Watch mode
npm run test:watch

# Single run (CI)
npm run test:run
```
If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
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