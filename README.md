# Sensex Pulse

## CI/CD Workflows

This project uses GitHub Actions for continuous integration and deployment. Here's an overview of our workflows:

### Continuous Integration

Our CI workflow (`ci.yml`) runs on every push to main/master and pull requests:

- 🔍 Type checking with TypeScript
- 📝 Linting with ESLint
- 🏗️ Building the application
- 💾 Dependency caching for faster builds

### Deployment

Our deployment workflow (`deploy.yml`) automatically deploys to production when changes are pushed to main/master:

- 🚀 Automated production deployments
- 🔐 Secure environment variable handling
- 📊 Deployment status tracking
- 📧 Automated notifications

### Dependency Management

We use Dependabot (`dependabot.yml`) to keep dependencies up-to-date:

- 📦 Weekly updates for npm packages
- 🔄 Weekly updates for GitHub Actions
- 🛡️ Security patches prioritization
- 🎯 Controlled version updates:
  - Allows minor and patch updates by default
  - Major version updates are carefully managed
  - Dependencies are grouped for easier review

#### Version Update Strategy

To maintain stability:
- Minor and patch updates are automatically proposed
- Major version updates for critical packages (e.g., Node.js types, ESLint) are manually reviewed
- Dependencies are grouped by development and production for better management

### Label Management

The repository uses automated label management (`sync-labels.yml`) to maintain consistent issue and PR labeling:

- 🏷️ Automated label creation and updates
- 📊 Standardized label colors and descriptions
- 🤖 Integration with Dependabot workflows

Available labels:
- `dependencies`: Pull requests that update a dependency file
- `security`: Security vulnerability fixes
- `ci`: Changes to CI/CD configuration
- `documentation`: Documentation changes
- `enhancement`: New features or enhancements
- `bug`: Bug fixes

## Development

To run the development server:

```bash
npm run dev
```

To build the application:

```bash
npm run build
```

To run linting:

```bash
npm run lint
```

## Environment Variables

The following environment variables are required for deployment:

- `NEXT_PUBLIC_API_URL`: The URL for the API endpoint

Add additional environment variables in the deployment workflow as needed.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Create a pull request
4. Wait for CI checks to pass
5. Request review

The CI workflow will automatically check your changes for type errors, linting issues, and build success.

## Dependabot Configuration

To work with Dependabot:

1. Pull requests are automatically created for updates
2. Updates are grouped by development and production dependencies
3. Version updates are controlled to minimize breaking changes
4. Security updates are prioritized
5. Reviews can be requested from repository collaborators

To manually trigger a Dependabot update:
```bash
@dependabot rebase
```

## License

[Add your license here]
