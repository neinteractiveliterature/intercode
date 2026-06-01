# Intercode Development Guide for AI Assistants

This document provides essential context about the Intercode codebase for AI assistants working on the project. See the `agent-docs/` directory for detailed topic guides.

## Project Overview

Intercode is a convention management system built with:

- **Backend**: Ruby on Rails with GraphQL API
- **Frontend**: React with TypeScript
- **Routing**: React Router v7
- **Data Fetching**: Apollo Client for GraphQL
- **Styling**: Bootstrap 5
- **Build Tool**: Vite

## Topic Guides

- [Apollo Client Usage Patterns](agent-docs/apollo-client.md) — How to access the Apollo Client in loaders, actions, and components; common mistakes and errors
- [Frontend Patterns](agent-docs/frontend-patterns.md) — File organization, React Router, GraphQL, forms, modals, i18n, auth, utilities
- [Litform Component Library](agent-docs/litform.md) — Available UI components, form inputs, modal hooks, and usage examples; points to full reference on GitHub
- [Testing](agent-docs/testing.md) — Minitest considerations, Playwright end-to-end tests
- [Development](agent-docs/development.md) — Build commands, PR labels, tips

## Pre-Commit Checks

- **TypeScript**: Run `yarn run tsc --noEmit` after making changes
- **Ruby**: Run the relevant test suite before committing

## Deployment Model

Intercode is shipped as a Docker container with the frontend assets **pre-built at image build time**. Environment variables (including `ASSETS_HOST`, `SENTRY_FRONTEND_DSN`, `ROLLBAR_CLIENT_ACCESS_TOKEN`, etc.) are injected at **container runtime**, not at build time. This means:

- Do not use Vite `define`, `import.meta.env`, or any other build-time constant substitution for runtime env vars.
- Runtime configuration must be delivered to the browser via a server-rendered response (e.g. the `GET /client_configuration` endpoint) or a server-rendered HTML attribute, never baked into the JS bundle.

## Testing Requirements

Whenever changing signup-related functionality (signup services, ranked choice, waitlists, etc.), always add or update tests in the relevant test file under `test/services/` or `test/models/`.
