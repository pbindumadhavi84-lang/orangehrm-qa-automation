# OrangeHRM Employee Lifecycle - Playwright Automation

This repository automates login, employee creation from JSON data, profile-picture
upload, employee search, job updates, UI/API consistency checks, deletion, API
deletion verification, logout, HTML reporting, video recording, and CI execution.

## Technology

- Playwright Test with TypeScript
- Page Object Model
- OrangeHRM UI plus its authenticated REST API
- JSON-driven employee data
- Playwright HTML report, video, screenshots, and traces
- GitHub Actions

## Project structure

```text
.
|-- .github/workflows/playwright.yml   # CI pipeline and artifacts
|-- api/orangehrm.api.ts               # API validation layer
|-- assets/employee-profile.png        # 200x200 profile-picture test asset
|-- data/employee.json                 # Data-driven employee input
|-- evidence/
|   |-- playwright-report/index.html   # Submitted HTML execution report
|   `-- test-run.webm                  # Submitted test execution video
|-- models/employee.ts                 # TypeScript models
|-- pages/                             # Page Object Model classes
|-- tests/employee-lifecycle.spec.ts   # End-to-end test
|-- utils/test-data.ts                 # Reads employee values from JSON
|-- playwright.config.ts               # Test and evidence settings
|-- package.json                       # Scripts and dependencies
`-- tsconfig.json                      # TypeScript configuration
```

## Setup

Install Node.js 20 or newer and Git, then run:

```bash
git clone https://github.com/pbindumadhavi84-lang/orangehrm-playwright-automation.git
cd orangehrm-playwright-automation
npm install
npx playwright install chromium
```

The public demo credentials are defaults. To override them:

```bash
cp .env.example .env
```

## Run

```bash
npm test                 # Headless
npm run test:headed      # Visible browser
npm run test:debug       # Debugger
npm run typecheck        # Static type check
```

Only one worker is used because this test changes data in a shared demo.

## Reports and evidence

The test run records video and retains screenshots and traces when failures occur.

### Submitted execution evidence

The following execution evidence is included in this repository:

- HTML report: `evidence/playwright-report/index.html`
- Test execution video: `evidence/test-run.webm`

To view the submitted HTML report:

1. Clone or download this repository.
2. Open `evidence/playwright-report/index.html` in a browser.

To generate a new report and video:

```bash
npm test
npm run report
```

- HTML report: `playwright-report/index.html`
- Videos, traces, screenshots: `test-results/`

GitHub Actions uploads both directories as downloadable artifacts even on test
failure. Open the workflow run and use its **Artifacts** section.

## Design notes

- Selectors prefer accessible roles, labels, and stable containers.
- Assertions include business-focused failure messages.
- First name, last name, Employee ID, job title and employment status are read
  directly from `data/employee.json`.
- The profile picture is a visible 200x200 PNG stored under `assets/`, and its
  path is supplied by `data/employee.json`.
- `page.request` shares the authenticated UI browser session.
- API results are compared with UI data for employee number, name, job title,
  employment status, and deletion state.

The demo is shared and periodically reset. If an option changes, update
`jobTitle` or `employmentStatus` in `data/employee.json`.
If a previous run created the employee but failed before deletion, delete that
record manually or change `employeeId` in the same JSON file before rerunning.

## Upload to GitHub

1. Create an empty public repository named `orangehrm-playwright-automation`.
   Do not add a README or `.gitignore` online.
2. From this project folder run:

```bash
git init
git add .
git commit -m "Add OrangeHRM Playwright employee lifecycle automation"
git branch -M main
git remote add origin https://github.com/pbindumadhavi84-lang/orangehrm-playwright-automation.git
git push -u origin main
```

3. Open **Actions** and run **Playwright Tests** if it does not start.
4. Share the public repository URL. For a private repository, use
   **Settings > Collaborators > Add people** and invite the reviewer listed in
   the assignment.

Before submission, run the test, open the HTML report, and confirm the workflow
contains both downloadable artifacts.
