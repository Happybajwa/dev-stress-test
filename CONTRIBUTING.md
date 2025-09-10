# Contributing to Dev Stress Test

Thank you for your interest in contributing to Dev Stress Test! This document provides guidelines and information for contributors.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the [Issues](https://github.com/dev_harry/dev-stress-test/issues)
2. Create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node.js version, React version, etc.)

### Suggesting Features

1. Check existing [Issues](https://github.com/dev_harry/dev-stress-test/issues) and [Discussions](https://github.com/dev_harry/dev-stress-test/discussions)
2. Create a new discussion or issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/dev-stress-test.git
   cd dev-stress-test
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. Make your changes
2. Run tests:
   ```bash
   npm test
   ```
3. Run linting:
   ```bash
   npm run lint
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Commit your changes with a clear message
6. Push to your fork and create a pull request

### Pull Request Guidelines

- Keep changes focused and atomic
- Include tests for new features
- Update documentation as needed
- Follow the existing code style
- Write clear commit messages

### Code Style

- Use TypeScript for type safety
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Project Structure

```
src/
├── node/           # Node.js specific utilities
├── react/          # React components and hooks
├── shared/         # Shared utilities
└── types/          # TypeScript type definitions
```

## Testing

- Write unit tests for all new features
- Ensure existing tests pass
- Test both React and Node.js environments

## Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Include examples in documentation

## Questions?

Feel free to open a discussion or reach out to the maintainers if you have any questions!
