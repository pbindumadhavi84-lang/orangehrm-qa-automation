# OrangeHRM Employee Lifecycle — Playwright Automation

## Candidate

**Bindu Madhavi**

## Overview

This repository contains an automated employee-lifecycle test suite for the OrangeHRM public demo application.

The solution covers:

- Login and dashboard validation
- Employee creation using JSON test data
- Profile-picture upload
- Employee search
- Job-title and employment-status updates
- UI validation
- Authenticated API validation
- Employee deletion
- UI and API deletion verification
- Logout and session validation
- HTML reporting
- Test execution video recording
- GitHub Actions CI execution
- k6 performance smoke testing

## Technology

- Playwright Test
- TypeScript
- Page Object Model
- JSON-driven test data
- OrangeHRM REST API
- k6 performance testing
- Playwright HTML reporter
- Screenshots, traces and videos
- GitHub Actions

## Project structure

```text
.
|-- .github/
|   `-- workflows/
|       `-- playwright.yml              # GitHub Actions workflow
|-- api/
|   `-- orangehrm.api.ts                # API validation methods
|-- assets/
|   `-- employee-profile.png            # 200x200 profile-picture asset
|-- data/
|   `-- employee.json                   # Employee test data
|-- evidence/
|   |-- playwright-report/
|   |   `-- index.html                  # Submitted HTML report
|   `-- test-run.webm                   # Submitted execution video
|-- models/
|   `-- employee.ts                     # TypeScript data models
|-- pages/
|   |-- employee.page.ts                # Employee Page Object
|   `-- login.page.ts                   # Login Page Object
|-- performance/
|   |-- orangehrm-smoke-test.js         # k6 performance smoke test
|   `-- results/
|       |-- k6-console.txt              # k6 console output
|       `-- k6-summary.json             # k6 execution summary
|-- tests/
|   `-- employee-lifecycle.spec.ts      # End-to-end lifecycle test
|-- utils/
|   `-- test-data.ts                    # JSON test-data reader
|-- .env.example                        # Environment-variable example
|-- .gitignore                          # Git exclusion rules
|-- package.json                        # Scripts and dependencies
|-- package-lock.json                   # Locked dependency versions
|-- playwright.config.ts                # Playwright configuration
|-- README.md                           # Project documentation
`-- tsconfig.json                       # TypeScript configuration
```

## Prerequisites

Install the following software:

- Node.js 20 or newer
- npm
- Git
- k6
- Visual Studio Code, recommended

Check the installations:

```bash
node --version
npm --version
git --version
k6 version
```

## Setup instructions

Clone the repository:

```bash
git clone https://github.com/pbindumadhavi84-lang/orangehrm-qa-automation.git
cd orangehrm-qa-automation
```

Install the project dependencies:

```bash
npm install
```

Install the Playwright Chromium browser:

```bash
npx playwright install chromium
```

The public OrangeHRM demo credentials are configured as defaults.

To override the default URL or credentials, create a local `.env` file:

```bash
Copy-Item .env.example .env
```

Do not commit the `.env` file because it may contain credentials.

## Dependencies

The Node.js dependencies are managed through `package.json`.

Main dependencies:

- `@playwright/test` — test runner and browser automation
- `typescript` — TypeScript compilation
- `@types/node` — Node.js TypeScript definitions
- `dotenv` — environment-variable loading

k6 is installed separately because it is not an npm package used by the Playwright runtime.

## Running Playwright tests

Run the complete test in headless mode:

```bash
npm test
```

Run with a visible browser:

```bash
npm run test:headed
```

Run in Playwright debug mode:

```bash
npm run test:debug
```

Open Playwright UI mode:

```bash
npm run test:ui
```

Perform a TypeScript check without executing tests:

```bash
npm run typecheck
```

The suite uses one worker because it creates and deletes data in a shared public demonstration environment.

## Test flow

The end-to-end test performs the following operations:

1. Opens the OrangeHRM login page.
2. Logs in using administrator credentials.
3. Verifies the Dashboard.
4. Opens the PIM module.
5. Creates an employee using values from `data/employee.json`.
6. Uploads the profile picture from `assets/employee-profile.png`.
7. Captures the generated employee number.
8. Searches for the employee by Employee ID.
9. Opens the employee record.
10. Updates the job title and employment status.
11. Verifies the saved job information in the UI.
12. Validates the employee through the authenticated OrangeHRM API.
13. Deletes the employee.
14. Verifies that the employee is absent from the UI.
15. Verifies the deletion through the API.
16. Logs out.
17. Confirms that a protected page cannot be accessed after logout.

## Test data

Employee details are read from:

```text
data/employee.json
```

The JSON file contains:

- First name
- Last name
- Employee ID
- Job title
- Employment status
- Profile-picture path

If a previous execution created the employee but failed before deletion, either delete the record manually or change the Employee ID in `data/employee.json` before running the test again.

## Page Object Model

The framework uses Page Object Model for maintainability.

```text
pages/login.page.ts
pages/employee.page.ts
```

Page objects contain:

- Page locators
- Navigation methods
- Reusable business actions
- UI validations
- Success-notification handling

The test specification contains the business flow, while page-specific implementation is maintained separately.

## API validation

Authenticated API validation is implemented in:

```text
api/orangehrm.api.ts
```

The API request context shares the authenticated browser session.

API validations cover:

- Employee existence
- Employee number
- First name
- Last name
- Job title
- Employment status
- Employee deletion

## Performance testing

A low-volume performance smoke test is implemented using k6.

The performance test validates:

- HTTP status code
- OrangeHRM response content
- Request failure rate
- 95th-percentile response time
- Performance thresholds

The workload is intentionally limited to one virtual user and five iterations because OrangeHRM is a shared public demonstration environment.

### Install k6 on Windows

```bash
winget install k6 --source winget
```

Close and reopen the terminal, then verify the installation:

```bash
k6 version
```

### Run the performance test

```bash
k6 run .\performance\orangehrm-smoke-test.js
```

### Run and save the results

```bash
k6 run --summary-export=.\performance\results\k6-summary.json .\performance\orangehrm-smoke-test.js |
    Tee-Object -FilePath .\performance\results\k6-console.txt
```

Saved results are available in:

```text
performance/results/k6-summary.json
performance/results/k6-console.txt
```

The configured performance thresholds verify:

- Request failure rate is below 1%.
- 95% of requests complete within five seconds.
- All response checks pass.

A heavy load or stress test is intentionally not executed against the public OrangeHRM demo without authorization.

## Reports and execution evidence

The Playwright configuration generates:

- HTML report
- Test execution video
- Screenshot on failure
- Trace on failure

Open the latest locally generated HTML report:

```bash
npm run report
```

Generated files are stored in:

```text
playwright-report/
test-results/
```

## Submitted evidence

A copy of the successful execution evidence is included in the repository:

```text
evidence/playwright-report/index.html
evidence/test-run.webm
```

To view the submitted report:

1. Clone or download the repository.
2. Open `evidence/playwright-report/index.html` in a browser.

The video can be opened using a browser or a media player that supports the WebM format.

## GitHub Actions

The workflow is defined in:

```text
.github/workflows/playwright.yml
```

The pipeline performs the following operations:

1. Checks out the repository.
2. Configures Node.js.
3. Installs dependencies using `npm ci`.
4. Installs Chromium and required Linux dependencies.
5. Runs the TypeScript check.
6. Executes the Playwright test.
7. Uploads the HTML report.
8. Uploads videos, screenshots and traces.

The workflow runs on:

- Pushes to the `main` branch
- Pull requests targeting `main`
- Manual workflow execution

To view the workflow:

1. Open the GitHub repository.
2. Select **Actions**.
3. Open **Playwright Tests**.
4. Select the latest workflow run.

Downloadable execution files are available in the **Artifacts** section of the workflow summary.

## Design notes

- Accessible roles, labels and stable containers are preferred for locators.
- Playwright web-first assertions are used instead of fixed delays.
- Assertions contain meaningful business-focused failure messages.
- Page Object Model separates test flow from page implementation.
- Employee data is read directly from JSON.
- The profile-picture path is provided through the JSON data.
- API validation reuses the authenticated UI session.
- Test execution uses one worker because the public demo has shared data.
- Screenshots and traces are retained for failed executions.
- Video recording is enabled for every execution.
- Performance workload is deliberately limited to protect the shared demo.

## AI tool usage

AI tools were used as required by the assessment for:

- Framework guidance
- Debugging support
- Code review
- Synchronization improvements
- Documentation assistance
- Performance-test guidance

The implementation was reviewed, executed and validated by the candidate. The candidate understands the submitted solution and can explain its design and execution.

## Repository

Public repository:

```text
https://github.com/pbindumadhavi84-lang/orangehrm-qa-automation
```

## Submission

Recommended ZIP filename:

```text
Bindu_Madhavi_OrangeHRM_QA_Assignment.zip
```

Before submission:

1. Confirm the Playwright test passes locally.
2. Confirm the k6 performance test passes.
3. Confirm the latest GitHub Actions workflow is green.
4. Confirm the HTML report and video exist under `evidence/`.
5. Confirm the k6 results exist under `performance/results/`.
6. Open the repository in an Incognito window to confirm it is public.
7. Share the public repository link with the reviewer.
