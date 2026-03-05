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
- [Testing](agent-docs/testing.md) — Minitest considerations, Playwright end-to-end tests
- [Development](agent-docs/development.md) — Build commands, PR labels, tips

## Pre-Commit Checks

- **TypeScript**: Run `yarn run tsc --noEmit` after making changes
- **Ruby**: Run the relevant test suite before committing
