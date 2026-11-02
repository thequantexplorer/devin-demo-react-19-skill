# acme-helpdesk

The support team's ticket queue: create tickets, search them, and see the urgent ones first. A small React app built with Vite.

```sh
npm install
npm test               # tests on the React version in package.json (18.3)
npm run test:react19   # the same tests on React 19, in a throwaway copy
npm run build
```

The app still uses APIs that React 19 removed:

- `ReactDOM.render` and `ReactDOM.unmountComponentAtNode` in `src/main.jsx`
- string refs (`ref="title"`, `this.refs`) in `src/components/NewTicketForm.jsx` and `src/components/SearchBox.jsx`
- `defaultProps` on function components in `src/App.jsx` and `src/components/`
- `propTypes`, which React 19 no longer checks

`npm test` passes but prints React 18.3 deprecation warnings. `npm run test:react19` fails 12 of 15 tests.

---

This repo is a starter for a Devin demo. See [DEVIN_DEMO.md](DEVIN_DEMO.md) for setup and the prompt.
