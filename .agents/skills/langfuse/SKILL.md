```markdown
# langfuse Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `langfuse` repository, a TypeScript codebase with a focus on consistency and maintainability. You'll learn about file naming, import/export styles, commit message conventions, and testing patterns. This guide also provides step-by-step workflows and helpful commands to streamline your development process.

## Coding Conventions

### File Naming
- **Style:** kebab-case
- **Example:**  
  ```
  user-service.ts
  api-client.test.ts
  ```

### Import Style
- **Style:** Use aliases for imports.
- **Example:**
  ```typescript
  import { fetchData } from '@utils/network';
  ```

### Export Style
- **Style:** Named exports are preferred.
- **Example:**
  ```typescript
  // Good
  export function processUser() { ... }
  export const API_URL = '...';

  // Avoid
  export default function processUser() { ... }
  ```

### Commit Messages
- **Type:** Conventional commits
- **Prefix:** `fix`
- **Example:**
  ```
  fix(api): handle null response from server
  ```

## Workflows

### Fix a Bug
**Trigger:** When you need to resolve a bug in the codebase  
**Command:** `/fix-bug`

1. Identify the bug and create a new branch.
2. Apply the fix using TypeScript and follow coding conventions.
3. Write or update tests in a `*.test.ts` file.
4. Commit your changes with a message starting with `fix`.
   ```
   fix(component): correct off-by-one error in pagination
   ```
5. Open a pull request for review.

### Add a New Feature
**Trigger:** When implementing a new feature  
**Command:** `/add-feature`

1. Create a new branch for the feature.
2. Implement the feature using kebab-case file naming and alias imports.
3. Export new functions or constants using named exports.
4. Add or update tests in corresponding `*.test.ts` files.
5. Commit with a descriptive message (e.g., `feat(feature): add user profile page`).
6. Open a pull request.

### Write or Update Tests
**Trigger:** When adding or modifying tests  
**Command:** `/test`

1. Create or update a test file matching the pattern `*.test.ts`.
2. Write tests for the relevant functions or components.
3. Run the tests using the project's test runner.
4. Ensure all tests pass before committing.

## Testing Patterns

- **File Pattern:** Test files are named using the `*.test.ts` convention.
  ```typescript
  // user-service.test.ts
  import { getUser } from '@services/user-service';

  describe('getUser', () => {
    it('returns user data', () => {
      // test implementation
    });
  });
  ```
- **Framework:** Not explicitly detected; use the project's configured test runner.

## Commands
| Command      | Purpose                                  |
|--------------|------------------------------------------|
| /fix-bug     | Start the bug fixing workflow            |
| /add-feature | Begin the new feature implementation     |
| /test        | Write or update tests for your changes   |
```