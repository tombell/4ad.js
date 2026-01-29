# Agents Guide

This repository is a small TypeScript role playing dice roll syntax library.
Keep guidance simple and consistent with current conventions in the codebase.

## Development Commands

### Package Management

- Use `bun` as the primary package manager

### Testing

```bash
# Run all tests
bun test

# Run single test file
bun test src/filename.test.ts

# Run tests with coverage
bun test --coverage
```

### Code Quality

```bash
# Check formatting only
bun check

# Format code
bun format

# Lint code
bun lint

# Auto-fix linting issues
bun lint:fix

# Type checking
bun typecheck
```

### Building

```bash
# Build both ESM and CommonJS outputs
bun run build
```
