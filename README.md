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
- 🏷️ Automated PR creation with labels
- 👥 Automated review assignments
- 📊 Grouped dependency updates

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

## License

[Add your license here]
