# EMR API Documentation

This repository contains the official documentation for the Spakinect EMR API. The documentation is built using [Docusaurus](https://docusaurus.io/) and powered by [Redocusaurus](https://redocusaurus.dev/) for elegant and interactive API endpoint displays.

## 🚀 Getting Started

Follow these steps to set up and run the documentation site locally for development.

### Clone the Repository

```bash
git clone https://github.com/spakinect/emr-api-docs.git
```

### Install Dependencies

Navigate to the project directory and install all required packages.

```bash
cd emr-api-docs
npm install
```

### Create API Specification Directory

The API documentation is generated from an OpenAPI JSON file. Create a directory to store your specification.

```bash
mkdir api
```

### API Specification Structure

The OpenAPI spec is split into modular YAML files for maintainability:

```
api/
├── emr-openapi.yaml          # Root file - edit this to add paths/schemas
├── emr-openapi.json          # Bundled output (auto-generated, do not edit)
├── paths/                    # One file per endpoint
│   ├── appointments.yaml
│   ├── treatments.yaml
│   ├── gfes.yaml
│   ├── visits.yaml
│   ├── cancel.yaml
│   ├── in-person.yaml
│   ├── webhooks.yaml
│   └── subscriptions.yaml
└── components/
    ├── security.yaml
    ├── responses.yaml        # Shared error responses
    └── schemas/              # Schemas grouped by domain
        ├── appointment.yaml
        ├── patient.yaml
        ├── treatment.yaml
        ├── visit.yaml
        ├── in-person.yaml
        ├── webhook.yaml
        └── common.yaml
```

- **Edit** the YAML files in `api/` when updating the API spec
- **Build** runs `npm run bundle` to merge everything into `emr-openapi.json` for Docusaurus
- Run `npm run bundle` alone to regenerate the JSON without a full build

### Run the Development Server

Start the local server to view the documentation.

```bash
npm run start
```
This command will build your site and automatically open it in your browser.

## 🌐 Hosting on GitHub Pages

This guide assumes you have a GitHub repository named `emr-api-docs` under your account.

### Configure Docusaurus

Before deployment, you must update the `docusaurus.config.js` file with your GitHub repository details.

```javascript
// docusaurus.config.js
const config = {
  // ...
  url: 'https://your-username.github.io',
  baseUrl: '/emr-api-docs/',

  organizationName: 'your-username', 
  projectName: 'emr-api-docs', 
  // ...
};
```

### First-Time Deployment

The `npm run deploy` command requires a `gh-pages` branch to exist on your repository. You must perform a manual deployment once to create it.

1.  **Build the Project:** Generate the static site files.

```bash
npm run build
```

2.  **Deploy the Build:** Navigate into the build directory. Then push its contents to a new `gh-pages` branch.

```bash
cd build
git init
git add -A
git commit -m "Initial gh-pages deployment"
git push -f https://example@github.com/api.git HEAD:gh-pages
```

### Automated Deployment

After the initial setup, you can deploy any changes with a single command. The `npm run deploy` command will automatically build your site and update the `gh-pages` branch.

1.  **Set your Git user (for authentication):**

```bash
$env:GIT_USER="your-github-username"
npm run deploy
```

2.  **Alternatively, use SSH for authentication (if configured):**

```bash
npm run deploy
```

### Configure GitHub Pages

The final step is to tell GitHub to serve your site. Go to **Settings > Pages** in your repository and set the **Source** branch to `gh-pages`.