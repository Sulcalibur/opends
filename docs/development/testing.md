# Testing OpenDS

OpenDS uses a comprehensive testing strategy to ensure quality and reliability.

## Test Types

### Unit Tests
- Located in `*.test.ts` files alongside source code
- Use Vitest for fast execution
- Mock external dependencies

### Integration Tests
- Test API endpoints with Supertest
- Database interactions with test database
- External service mocks

### E2E Tests
- Critical user flows with Playwright
- Visual regression testing
- Cross-browser compatibility

## Running Tests

```bash
# Run all tests
pnpm test

# Run frontend tests
pnpm --filter=@opends/frontend run test

# Run backend tests
pnpm --filter=@opends/backend run test

# Run with coverage
pnpm test:coverage
```

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from './my-module'

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction(1)).toBe(2)
  })
})
```

### Integration Test Example
```typescript
import request from 'supertest'
import { app } from '../src/app'

describe('GET /api/health', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/api/health')
    expect(response.status).toBe(200)
  })
})
```

## CI/CD

Tests run automatically on:
- Pull requests
- Main branch pushes
- Scheduled runs

## Test Data

Use test factories and fixtures to create consistent test data.