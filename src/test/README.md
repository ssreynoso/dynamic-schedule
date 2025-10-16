# Testing Guide

This directory contains test setup and utilities for the Dynamic Schedule project.

## Setup

The project uses:
- **Vitest** - Fast unit test framework
- **React Testing Library** - Testing utilities for React components
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **jsdom** - DOM environment for Node.js

## Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

## Test Coverage

Current coverage (as of setup):
- **78 tests** passing
- **lib/calculations.ts**: 100% coverage
- **lib/utils.ts**: 100% coverage
- **hooks**: 3 hooks tested (useCtrlListener, useEscapeListener, useItemsByColumn)

## Writing Tests

### Unit Tests (Functions)

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myFunction';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### Hook Tests

```typescript
import { renderHook } from '@testing-library/react';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('should return expected value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current).toBeDefined();
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

## Test Structure

- Place test files next to the code they test
- Use `.test.ts` or `.test.tsx` extension
- Follow naming convention: `filename.test.ts`
- Group related tests using `describe` blocks

## Coverage Goals

Target coverage: **80%+** for:
- All utility functions
- Core business logic
- Critical user flows
- Hook implementations

## Next Steps

- [ ] Add tests for stores (Zustand)
- [ ] Add tests for complex components (Container, Content, Item)
- [ ] Add integration tests for drag & drop flows
- [ ] Add E2E tests with Playwright
