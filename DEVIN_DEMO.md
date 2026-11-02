# Devin demo: Upgrade React 18 to 19 with a phased skill

**What it shows:** Devin turns the official React 19 upgrade guide into a repo skill that maps each step to this codebase. Then it follows that skill to upgrade the app one phase at a time, with the tests green after every phase.

**Needs:** GitHub only

More demos: [devin-advanced-demos](https://github.com/thequantexplorer/devin-advanced-demos)

## The problem

The app runs on React 18.3 and uses four APIs that React 19 removed or stopped supporting: `ReactDOM.render`, string refs, `defaultProps` on function components, and `propTypes`. The tests pass on React 18 but fail on React 19:

```text
$ npm run test:react19
 FAIL  test/components.test.jsx > NewTicketForm > focuses the title field on mount
Error: Expected ref to be a function, an object returned by React.createRef(), or undefined/null.
 FAIL  test/app.test.jsx > main entry > mounts the app into a container and unmounts it
TypeError: default.render is not a function
 FAIL  test/components.test.jsx > TicketRow > falls back to normal priority and Unassigned
AssertionError: expected 'ticket priority-undefined' to be 'ticket priority-normal'
 ...
      Tests  12 failed | 3 passed (15)
```

You can also see this in your copy on GitHub: the **Tests on React 19** job in the **Actions** tab fails.

## Set it up

1. Click **Use this template → Create a new repository**, choose your GitHub account or org as the owner, and keep the name `devin-demo-react-19-skill`. The prompt below assumes that name. Use the template rather than a fork: pull requests on a fork go to the original repo by default.
2. In Devin, open [**Settings → Connections → GitHub**](https://app.devin.ai/settings/connections/github) and make sure Devin can access the new repository.

## Prompt

Start a new Devin session and paste this. Replace `<you>` with your GitHub user or org.

```text
Upgrade https://github.com/<you>/devin-demo-react-19-skill from React 18 to React 19.

First, write a repo skill. Read the official React 19 upgrade guide (https://react.dev/blog/2024/04/25/react-19-upgrade-guide) and turn it into .agents/skills/react-19-upgrade/SKILL.md, mapped to this codebase. Search the code for every removed or deprecated API the guide lists. For each phase, list the exact files and lines it touches, the change to make, and how to check it. Order the phases so each one can be done while the app is still on React 18: ReactDOM.render and unmountComponentAtNode to createRoot, string refs to createRef or useRef, defaultProps on function components to default parameters, then remove propTypes and the prop-types package, and only then bump react and react-dom to 19. Leave out guide sections that don't apply here, and say which ones you left out.

Before changing any code, run npm test and npm run test:react19 and show me the output. Then follow the skill one phase at a time, with one commit per phase. After each phase, npm test must pass. Keep every existing test and only change a test if the phase makes it necessary. At the end, npm test and npm run test:react19 must both pass with no React deprecation warnings in the output, and npm run build must succeed.

Open one PR with the skill and the upgrade. In the description, add a table with one row per phase: the files changed, the commit, and the test result.
```
