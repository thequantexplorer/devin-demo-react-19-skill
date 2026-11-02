---
name: react-19-upgrade
description: Upgrade acme-helpdesk from React 18.3 to React 19 in five phases, based on the official React 19 upgrade guide (https://react.dev/blog/2024/04/25/react-19-upgrade-guide). Use when removing React 19 breaking APIs from this repo or bumping react/react-dom.
---

# React 19 upgrade for acme-helpdesk

Source: the official [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide), mapped to this repo.

The app is a Vite + React app with plain JavaScript (no TypeScript). It is on `react@18.3.1`, which logs a warning for every API that React 19 removes. Phases 1–4 remove those APIs while the app is still on React 18, so `npm test` keeps passing and the warnings disappear one group at a time. Phase 5 bumps React.

## Rules

- One phase per commit, in the order below. Do not start a phase until the previous one is committed.
- After every phase, `npm test` must pass (15 tests). `npm run test:react19` runs the same suite on React 19.2.9 in a throwaway copy, use it to see progress.
- Keep every existing test. Only change a test if the phase makes it necessary (none of the phases below should need to).
- Line numbers refer to the starting commit (`00a15ed`). Earlier phases shift lines in shared files, so re-run each phase's search command before editing.

## Pre-checks (already satisfied, nothing to change)

- **New JSX transform is required.** `vite.config.js` uses `@vitejs/plugin-react` 4.7.0, which compiles JSX with the automatic runtime (`react/jsx-runtime`). Check: no "outdated JSX transform" warning in the test output.
- **Testing library.** `@testing-library/react` 16.3.0 supports React 18 and 19. `act` is imported from `@testing-library/react` (`test/app.test.jsx:2`), not from `react-dom/test-utils`, so the `replace-act-import` codemod has nothing to do.

## Search for every removed or deprecated API in the guide

```sh
grep -rnE "ReactDOM\.render|unmountComponentAtNode|ReactDOM\.hydrate|findDOMNode|this\.refs|ref=\"|defaultProps|propTypes|prop-types|contextTypes|childContextTypes|getChildContext|createFactory|react-test-renderer|react-dom/test-utils|\.ref\b|SECRET_INTERNALS|unstable_|useFormState|javascript:" src test scripts index.html vite.config.js package.json
```

Results at `00a15ed`:

| API (guide section) | Where |
| --- | --- |
| `ReactDOM.render` (Removed: ReactDOM.render) | `src/main.jsx:2`, `src/main.jsx:7` |
| `unmountComponentAtNode` (Removed: unmountComponentAtNode) | `src/main.jsx:11` |
| String refs (Removed: string refs) | `src/components/NewTicketForm.jsx:7,12,14,15,16,24,28`; `src/components/SearchBox.jsx:6,8,15` |
| `defaultProps` on function components (Removed: propTypes and defaultProps for functions) | `src/App.jsx:32-34`, `src/components/StatusBadge.jsx:13-15`, `src/components/TicketList.jsx:20-22`, `src/components/TicketRow.jsx:24-27` |
| `defaultProps` on a class component (still supported in 19) | `src/components/SearchBox.jsx:34-36` |
| `propTypes` and `prop-types` (Removed: propTypes) | `package.json:13`; `src/App.jsx:2,28-30`; `src/components/NewTicketForm.jsx:2,42-44`; `src/components/SearchBox.jsx:2,29-32`; `src/components/StatusBadge.jsx:1,9-11`; `src/components/TicketList.jsx:1,15-18`; `src/components/TicketRow.jsx:1,16-22` |

Nothing else in the guide matches.

## Phase 1: `ReactDOM.render` and `unmountComponentAtNode` to `createRoot`

Files:

- `src/main.jsx:1-2`: replace `import React from 'react'` (unused with the automatic JSX runtime) and `import ReactDOM from 'react-dom'` with `import { createRoot } from 'react-dom/client'`.
- `src/main.jsx:7`: `ReactDOM.render(<App …/>, container)` becomes a root per container. Keep the roots in a `WeakMap` keyed by container, create the root on the first `mount`, and call `root.render(<App initialTickets={tickets} />)`.
- `src/main.jsx:11`: `ReactDOM.unmountComponentAtNode(container)` becomes `root.unmount()` on the stored root. Delete it from the map. Keep the old return value: `true` if something was unmounted, `false` if not.
- `src/main.jsx:14-15`: rename the local `root` element variable (for example `rootElement`) so it is not confused with a React root.

Keep the `mount(container, tickets)` / `unmount(container)` exports, because `test/app.test.jsx:4,49,53` uses them.

Check:

- `npm test` passes, and the output no longer has `ReactDOM.render is no longer supported` or `unmountComponentAtNode is deprecated`.
- `grep -rn "ReactDOM\|unmountComponentAtNode" src` returns nothing.
- `main entry > mounts the app into a container and unmounts it` passes. It relies on `act()` flushing the concurrent root synchronously.

## Phase 2: string refs to `createRef`

Both components are classes, so use `createRef()` class fields. `useRef` only works in function components.

- `src/components/NewTicketForm.jsx`: add `createRef` to the `react` import on line 1. Add the fields `titleRef = createRef();` and `priorityRef = createRef();`. Replace `this.refs.title` with `this.titleRef.current` (lines 7, 12, 15, 16) and `this.refs.priority` with `this.priorityRef.current` (line 14). Change `ref="title"` to `ref={this.titleRef}` (line 24) and `ref="priority"` to `ref={this.priorityRef}` (line 28).
- `src/components/SearchBox.jsx`: add `createRef` to the `react` import on line 1. Add `inputRef = createRef();`. Replace `this.refs.input` with `this.inputRef.current` (lines 6, 8). Change `ref="input"` to `ref={this.inputRef}` (line 15).

Check:

- `npm test` passes, and the output no longer has `contains the string ref`.
- `grep -rnE 'this\.refs|ref="' src` returns nothing.
- The NewTicketForm focus/clear tests and `SearchBox > reports typing and clears the field` pass.

## Phase 3: `defaultProps` on function components to default parameters

Move each default into the destructured parameter, then delete the `X.defaultProps = {…}` block.

- `src/App.jsx:8` and `32-34`: `function App({ initialTickets = [] })`.
- `src/components/StatusBadge.jsx:5` and `13-15`: `function StatusBadge({ status = 'open' })`.
- `src/components/TicketList.jsx:4` and `20-22`: `function TicketList({ tickets, emptyMessage = 'No tickets match your search.' })`.
- `src/components/TicketRow.jsx:4` and `24-27`: `function TicketRow({ id, title, priority = 'normal', status, assignee = 'Unassigned' })`.

Leave `SearchBox.defaultProps` (`src/components/SearchBox.jsx:34-36`) alone. `SearchBox` is a class component, and the guide says class components keep `defaultProps` in React 19.

Default parameters apply only when a prop is `undefined`, the same as `defaultProps`. `null` is not replaced by either.

Check:

- `npm test` passes, and the output no longer has `Support for defaultProps will be removed from function components`.
- `grep -rn "defaultProps" src` returns only `SearchBox.jsx`.
- On React 19 these tests depend on this phase: `StatusBadge > shows "Open"…`, `TicketRow > falls back to normal priority…`, `TicketList > shows the default empty message`, `App > starts empty when no tickets are passed`.

## Phase 4: remove `propTypes` and the `prop-types` package

React 19 ignores `propTypes` without a warning, so these declarations no longer check anything. Delete them. This repo has no TypeScript, so the `prop-types-typescript` codemod does not apply.

- Delete `import PropTypes from 'prop-types';` and the `X.propTypes = {…}` block in:
  - `src/App.jsx:2`, `28-30`
  - `src/components/NewTicketForm.jsx:2`, `42-44`
  - `src/components/SearchBox.jsx:2`, `29-32`
  - `src/components/StatusBadge.jsx:1`, `9-11`
  - `src/components/TicketList.jsx:1`, `15-18`
  - `src/components/TicketRow.jsx:1`, `16-22`
- `npm uninstall prop-types` removes it from `package.json:13` and `package-lock.json`.

Check:

- `grep -rn "prop-types\|PropTypes\|propTypes" src package.json` returns nothing.
- `npm ls prop-types` does not list it as a direct dependency. It may still show up as a transitive dependency.
- `npm test` passes with no React warnings in the output.
- `npm run test:react19` should now pass 15/15, because every removed API is gone.

## Phase 5: bump `react` and `react-dom` to 19

- `npm install --save-exact react@19.2.9 react-dom@19.2.9`. Use the version that `scripts/try-react-19.mjs:9` tests. This updates `package.json:14-15` and `package-lock.json`.
- No `@types/*` packages are needed (no TypeScript).
- Update `README.md`, which still says the app uses removed APIs and that `npm test` runs on 18.3.

Check:

- `npm ls react react-dom` shows 19.2.9 for both, with no peer dependency errors.
- `npm test` passes 15/15, and the stderr has no `Warning:`, `deprecated`, or `no longer supported` lines from React.
- `npm run test:react19` passes 15/15 with no React warnings.
- `npm run build` succeeds.

## Guide sections left out (not applicable here)

| Guide section | Why it does not apply |
| --- | --- |
| Codemods (`npx codemod@latest react/19/migration-recipe`) | Only a few call sites, so the changes are made by hand and reviewed per phase. The recipe's `replace-act-import`, `replace-use-form-state`, and `prop-types-typescript` have nothing to change here. |
| Errors in render are not re-thrown (`onUncaughtError` / `onCaughtError`) | No error boundaries, and no error reporting that depends on re-thrown errors. |
| Removed: Legacy Context (`contextTypes`, `getChildContext`) | Not used. |
| Removed: Module pattern factories | Not used. |
| Removed: `React.createFactory` | Not used. |
| Removed: `react-test-renderer/shallow` | Not used. The tests use `@testing-library/react`. |
| Removed: `react-dom/test-utils` | Not used. `act` comes from `@testing-library/react`. |
| Removed: `ReactDOM.hydrate` | No SSR or hydration. |
| Removed: `ReactDOM.findDOMNode` | Not used. |
| Deprecated: `element.ref` | No code reads `element.ref`. |
| Deprecated: `react-test-renderer` | Not a dependency. |
| StrictMode changes | The app does not render `<StrictMode>`. |
| Improvements to Suspense | No `Suspense` or lazy loading. |
| UMD builds removed | React is bundled by Vite, not loaded from a UMD script tag. |
| Libraries depending on React internals | The only React-adjacent libraries are `@testing-library/react` 16.3 and `@vitejs/plugin-react` 4.7, and both support React 19. Nothing uses `SECRET_INTERNALS`. |
| TypeScript changes (removed types, ref cleanups, `useRef` argument, `ReactElement`, JSX namespace, `useReducer` typings) | Plain JavaScript, no `@types/react`. The app has no ref callbacks, so implicit-return ref cleanups do not apply either. |
| Changelog: other breaking/notable changes (`javascript:` URLs, `unstable_*` APIs, `react-is`, empty `src`/`href`) | Search finds none of them. |
