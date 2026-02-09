# Optimization Rules Documentation

Detailed reference for each optimization rule in the Prompt Intelligence Layer.

---

## VagueReference Rule

### Overview
Detects vague pronouns used without clear referents or context.

### Purpose
Helps users avoid ambiguous references that can confuse AI assistants. Vague pronouns force the assistant to guess what you're referring to, often leading to incorrect or generic responses.

### What It Detects

**Vague Pronouns:**
- `this` - "Fix **this** bug"
- `it` - "Update **it** to handle errors"
- `that` - "Change **that** function"
- `these` / `those` - "Use **those** values"

**Pattern:** Any occurrence of these pronouns outside code blocks without sufficient context.

### Examples

#### ❌ Detected (Vague)
```
"Fix this bug in the code"
→ Vague pronoun 'this' without clear referent

"Update the function to handle it correctly"
→ Vague pronoun 'it' without clear context

"Make that more efficient"
→ Vague pronoun 'that' without specificity
```

#### ✅ Optimized
```
"Fix the authentication timeout bug in the login function"

"Update the error handler to catch and log socket timeout errors"

"Refactor the fetchUserData function to use async/await for better readability"
```

### What It Suggests
- Replace pronouns with specific noun references
- Add context about what you're referring to
- Include file paths or function names when relevant

### Configuration

```json
{
  "promptIntelligence.rules.VagueReference.enabled": true
}
```

### Performance
- **Target:** < 20ms per analysis
- **Method:** Regex matching (excludes code blocks)
- **Complexity:** O(n) where n = prompt length

### When to Disable
- Processing highly pronoun-heavy technical specifications
- Analyzing natural language transcripts
- Testing rule interactions in isolation

### Examples from Test Suite
```typescript
// Detects
const result = rule.analyze("Fix this bug");
assert(result.detected === true);

// Ignores in code blocks
const result = rule.analyze("```javascript\nthis.value = 10\n```");
assert(result.suggestions.length <= 1);
```

---

## MissingContext Rule

### Overview
Identifies prompts that lack sufficient context for the AI to provide accurate help.

### Purpose
Prompts missing context often result in generic responses. This rule encourages including:
- File paths and line numbers
- Error messages and stack traces
- Version information
- Expected vs. actual behavior

### What It Detects

**Missing Elements:**
- No file path or function name reference
- No error message or failure description
- No version/framework information
- Incomplete problem statement
- No expected outcome defined

**Pattern:** Analyzes prompt structure and token distribution to identify information gaps.

### Examples

#### ❌ Detected (Missing Context)
```
"How do I handle errors?"
→ Missing: specific error type, context, framework

"The API isn't working"
→ Missing: error message, endpoint, request/response

"Update this code"
→ Missing: what to update, why, file location
```

#### ✅ Optimized
```
"How do I handle socket timeout errors in Node.js Express?"

"The POST /api/users endpoint returns 500 error with message 'Database connection failed'. 
Using PostgreSQL 14 with Prisma ORM. How do I debug this?"

"Update the handleLogin function in src/auth/login.ts to use bcrypt for password hashing"
```

### What It Suggests
- Include file paths when referring to code
- Add error messages and stack traces
- Mention framework/library versions
- Define expected vs. actual behavior
- Provide reproducer steps when applicable

### Configuration

```json
{
  "promptIntelligence.rules.MissingContext.enabled": true
}
```

### Performance
- **Target:** < 25ms per analysis
- **Method:** Token analysis, pattern matching
- **Complexity:** O(n) with sentiment/structure analysis

### When to Disable
- Working with intentionally abstract prompts
- Brainstorming mode (ideas, not debugging)
- Teaching scenarios where hints are part of learning

---

## CompoundQuestion Rule

### Overview
Detects prompts asking multiple distinct questions at once.

### Purpose
Asking multiple questions in one prompt often results in incomplete answers. AI assistants tend to:
- Provide shallow coverage of each question
- Skip some questions entirely
- Spend tokens on less important issues

Splitting into focused prompts yields better results.

### What It Detects

**Compound Patterns:**
- Multiple questions separated by "and"
- Multiple questions separated by "also"
- Multiple questions separated by commas
- Mix of questions and statements

### Examples

#### ❌ Detected (Compound)
```
"How do I add authentication and also setup a database?"
→ Two distinct questions

"Explain this code, fix the bug, and optimize performance"
→ Three distinct tasks

"Should I use REST or GraphQL, and how do I implement it?"
→ Two separate concerns
```

#### ✅ Optimized (Separate Prompts)
```
Prompt 1: "How do I implement JWT authentication in Express.js?"
Prompt 2: "How do I setup and connect to PostgreSQL with Node.js?"

Or combine with clear priority:
"How do I add JWT authentication to my Express.js API? (I'll ask about 
database setup separately)"
```

### What It Suggests
- Split into separate, focused prompts
- Prioritize questions if combining is necessary
- Create follow-up prompts for secondary concerns
- Use numbered lists if combining is essential

### Configuration

```json
{
  "promptIntelligence.rules.CompoundQuestion.enabled": true
}
```

### Performance
- **Target:** < 15ms per analysis
- **Method:** Sentence tokenization, question detection
- **Complexity:** O(n) single pass

### When to Disable
- Asking intentionally related questions (context-dependent)
- Teaching scenarios with related concepts
- Prompt templates that naturally combine topics

---

## VerbosePhrasing Rule

### Overview
Detects unnecessarily verbose or roundabout phrasing.

### Purpose
Verbose phrasing wastes tokens and can obscure the actual request. Direct, concise prompts:
- Cost less in terms of token usage
- Are easier for AI to parse
- Reduce ambiguity
- Get faster responses

### What It Detects

**Verbose Patterns:**
- Excessive politeness: "Could you possibly consider..."
- Hedging: "I was wondering if you could..."
- Filler words: "So basically, kind of like..."
- Over-qualification: "I have a somewhat unclear issue..."
- Unnecessary questions: "Would you mind if I asked...?"

**Pattern Library:** Maintained list of verbose phrases with concise alternatives.

### Examples

#### ❌ Detected (Verbose)
```
"I was wondering if you could possibly help me with a question about how to..."
→ Should be: "How do I..."

"So basically, kind of like, I need to figure out how to..."
→ Should be: "How do I..."

"Would you be so kind as to explain how..."
→ Should be: "Explain how..."

"I have a somewhat complex question about..."
→ Should be: "Question about..."
```

#### ✅ Optimized (Concise)
```
"How do I implement pagination with Express.js?"

"Explain the difference between var, let, and const"

"Debug: Node.js app crashes with 'EADDRINUSE' on port 3000"
```

### What It Suggests
- Remove politeness filler
- Be direct about what you need
- Use imperative mood for tasks
- Use question form for inquiries
- Skip meta-commentary

### Configuration

```json
{
  "promptIntelligence.rules.VerbosePhrasing.enabled": true
}
```

### Performance
- **Target:** < 18ms per analysis
- **Method:** Phrase dictionary matching, regex patterns
- **Complexity:** O(n) with m phrase patterns (m typically 20-50)

### When to Disable
- Maintaining conversational tone is important
- User preference for polite phrasing
- Testing interactions with other rules

---

## InsufficientDetail Rule

### Overview
Identifies prompts lacking necessary technical details for accurate assistance.

### Purpose
Insufficient detail forces AI to either:
- Ask clarifying questions (adds back-and-forth)
- Make assumptions (often wrong)
- Provide generic answers

Including sufficient detail up-front gets better answers faster.

### What It Detects

**Missing Details:**
- No error message or stack trace
- No version numbers (language, framework, library)
- No expected vs. actual behavior distinction
- No description of environment (OS, browser, runtime)
- Missing test case or reproducer
- No mention of constraints (performance, compatibility)

**Heuristics:** Entropy analysis, technical term detection, prompt structure analysis.

### Examples

#### ❌ Detected (Insufficient Detail)
```
"React component isn't rendering"
→ Missing: error message, which component, what's expected

"My code doesn't work"
→ Missing: what code, what error, what should happen

"How do I optimize this function?"
→ Missing: what does it do, performance metrics, constraints
```

#### ✅ Optimized (Sufficient Detail)
```
"My React <UserCard> component doesn't render. 
Error: 'Cannot read property name of undefined' at line 15.
Expected: Display user name from props.user object.
Actual: Blank div with error in console.
React version: 18.2, Node: 18.x"

"TypeError: Cannot read properties of undefined (reading 'map') at getUsers() in src/services/users.js:45
When calling: const users = await userService.getUsers();
Using Node.js 18, Express 4.18, MongoDB 5.x
Need it fixed by EOD but open to refactoring approach"

"How do I optimize the calculateMetrics() function?
Current: runs in 500ms for 10k items
Goal: < 100ms for same dataset
Constraint: must work in browser (4GB RAM) and server"
```

### What It Suggests
- Include error messages and stack traces
- Specify versions and environments
- Define expected vs. actual behavior
- Add test cases or reproducer steps
- Mention constraints and requirements
- Provide relevant code snippets

### Configuration

```json
{
  "promptIntelligence.rules.InsufficientDetail.enabled": true
}
```

### Performance
- **Target:** < 25ms per analysis
- **Method:** Token analysis, keyword matching, entropy calculation
- **Complexity:** O(n log n) with entropy calculation

### When to Disable
- High-level architectural questions
- Brainstorming or creative prompts
- Intentionally open-ended exploration

---

## Rule Comparison Matrix

| Rule | Detects | Suggests | Performance | Best For |
|------|---------|----------|-------------|----------|
| VagueReference | Pronouns | Context | ~18ms | Clarity |
| MissingContext | Info gaps | Details | ~25ms | Completeness |
| CompoundQuestion | Multiple Qs | Separation | ~15ms | Focus |
| VerbosePhrasing | Wordiness | Concision | ~18ms | Efficiency |
| InsufficientDetail | Tech gaps | Specifics | ~25ms | Accuracy |

---

## Configuration Best Practices

### All Rules Enabled (Default)
```json
{
  "promptIntelligence.rules.VagueReference.enabled": true,
  "promptIntelligence.rules.MissingContext.enabled": true,
  "promptIntelligence.rules.CompoundQuestion.enabled": true,
  "promptIntelligence.rules.VerbosePhrasing.enabled": true,
  "promptIntelligence.rules.InsufficientDetail.enabled": true,
  "promptIntelligence.confidenceThreshold": 0.7
}
```

### For Brainstorming (More Lenient)
```json
{
  "promptIntelligence.rules.CompoundQuestion.enabled": false,
  "promptIntelligence.rules.VerbosePhrasing.enabled": false,
  "promptIntelligence.confidenceThreshold": 0.8
}
```

### For Bug Reporting (Strict)
```json
{
  "promptIntelligence.rules.VagueReference.enabled": true,
  "promptIntelligence.rules.MissingContext.enabled": true,
  "promptIntelligence.rules.InsufficientDetail.enabled": true,
  "promptIntelligence.confidenceThreshold": 0.6
}
```

### For Code Reviews (Focused)
```json
{
  "promptIntelligence.rules.CompoundQuestion.enabled": true,
  "promptIntelligence.rules.InsufficientDetail.enabled": true,
  "promptIntelligence.confidenceThreshold": 0.75
}
```

---

## Custom Rules

Users can extend the rule system by implementing `OptimizationRule`:

```typescript
import { OptimizationRule } from 'prompt-intelligence-layer'
import { RuleResult, RuleSeverity } from 'prompt-intelligence-layer'

export class MyCustomRule extends OptimizationRule {
  constructor() {
    super({
      name: 'MyCustomRule',
      description: 'My custom analysis',
      enabled: true,
      severity: RuleSeverity.warning
    })
  }

  analyze(prompt: string): RuleResult {
    // Custom logic here
    return {
      ruleName: this.name,
      detected: false,
      suggestions: [],
      severity: this.severity
    }
  }
}
```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for submission guidelines.

---

## Troubleshooting

### Rule Not Detecting Issues
- Check if enabled in settings
- Verify confidence threshold isn't too high
- Review rule documentation for what it detects

### Too Many Suggestions
- Increase `confidenceThreshold` in settings
- Disable less relevant rules
- Check if custom phrase patterns need tuning

### Performance Warnings
- Disable less critical rules temporarily
- Increase `performanceTimeout` if needed
- Report slow rules in GitHub issues
