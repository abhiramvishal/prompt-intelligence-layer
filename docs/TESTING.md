# Test Documentation

## Test Suites

### Unit Tests ✅ **WORKING**

Run with:
```bash
npm run test:unit
```

**Status:** All 17 tests passing consistently
- VagueReferenceRule: 7 tests
- PromptOptimizer: 10 tests
- Performance: All rules < 20ms

### Integration Tests ⚠️ **PATH ISSUE**

The VS Code integration tests require the workspace path to **not contain spaces**.

**Current Issue:** Workspace is at `C:\Abhiram Set\Projects\prompt-intelligence-layer` which contains spaces.

**Solutions:**

#### Option 1: Rename workspace (Recommended)
Move project to a path without spaces:
```powershell
# Example: Move to C:\Projects\prompt-intelligence-layer
Move-Item "C:\Abhiram Set\Projects\prompt-intelligence-layer" "C:\Projects\prompt-intelligence-layer"
```

#### Option 2: Run tests on Linux/Mac
VS Code integration tests work better on Linux/Mac. If you have WSL2 or Mac available, clone the repo there:
```bash
wsl
git clone <repo> ~/projects/prompt-intelligence-layer
cd ~/projects/prompt-intelligence-layer
npm install
npm test
```

#### Option 3: Manual Testing
Instead of automated integration tests, manually test the extension:
1. Press `F5` to launch the extension (uses `.vscode/launch.json`)
2. Interact with the extension in the launched VS Code window
3. Verify the "Optimize Prompt" command works

## Running Tests

### Unit Tests (Recommended for CI/CD)
```bash
npm run test:unit
```

### Compile TypeScript
```bash
npm run compile
```

### Watch Mode
```bash
npm run watch
```

### Full Compile + Lint + Test
```bash
npm run compile && npm run lint && npm run test:unit
```

## CI/CD Integration

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs:
1. ✅ Build - `npm run compile`
2. ✅ Lint - `npm run lint`  
3. ✅ Unit Tests - `npm run test:unit`
4. ⚠️ Integration Tests - `npm test` (will fail on Windows with spaces in path)

**For successful CI/CD:** Configure your GitHub runner with a workspace path that has no spaces.

## Test Coverage

### VagueReferenceRule Tests
- ✅ Detects vague pronouns ("this", "it", etc.)
- ✅ Ignores pronouns in code blocks
- ✅ Returns correct RuleResult structure
- ✅ Performs under 20ms
- ✅ Handles empty prompts
- ✅ Limits suggestions to 3 per rule

### PromptOptimizer Tests
- ✅ Applies high-confidence suggestions
- ✅ Preserves code blocks
- ✅ Handles empty suggestions
- ✅ Returns OptimizedPrompt structure
- ✅ Filters low-confidence suggestions (< 0.7)
- ✅ Works with sample prompts
- ✅ Handles edge cases

## Debugging Tests

### Debug Unit Tests
```bash
node --inspect-brk ./node_modules/.bin/mocha --require ts-node/register test/unit/**/*.test.ts
```

Then attach VS Code debugger to `localhost:9229`

### Debug Extension
Press `F5` to launch with debugger attached to the extension process.

## Adding New Tests

1. Create test file: `test/unit/path/NewFeature.test.ts`
2. Follow mocha TDD pattern:
```typescript
import { describe, it } from 'mocha';
import assert from 'assert';

describe('MyFeature', () => {
  it('should do something', () => {
    // test code
    assert.ok(true);
  });
});
```
3. Run: `npm run test:unit`

## Performance Benchmarks

Current test suite performance (as of Feb 9, 2026):

| Component | Target | Actual | Status |
|-----------|--------|--------|--------|
| VagueReferenceRule | < 20ms | ~5-10ms | ✅ PASS |
| PromptOptimizer | < 20ms | ~2-5ms | ✅ PASS |
| Full unit suite | - | ~13ms | ✅ PASS |

## Troubleshooting

### "Cannot find module" errors
- Run `npm install` to ensure dependencies are installed
- Run `npm run compile` to compile TypeScript

### Integration test failures
- Ensure workspace path has no spaces
- Run unit tests instead: `npm run test:unit`
- Check that VS Code is not running on the workspace

### TypeScript compilation errors
- Check syntax with: `npx tsc --noEmit`
- Review `tsconfig.json` for correct include/exclude patterns
