# Prompt Intelligence Layer

An intelligent VS Code extension that analyzes and optimizes your prompts for better AI assistant responses.

## Features

- **Smart Analysis**: Detects vague references, missing context, compound questions, and more
- **Real-time Suggestions**: Get actionable suggestions to improve your prompts
- **Code-Safe**: Preserves code blocks and technical content during optimization
- **High Performance**: Completes analysis in under 200ms
- **Privacy First**: All processing happens locally—no data sent to external services
- **Configurable**: Enable/disable rules and adjust thresholds to your preference

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Prompt Intelligence Layer"
4. Click Install

Or install directly from the [VS Code Marketplace](https://marketplace.visualstudio.com)

## Quick Start

### Optimize a Prompt

1. Open any text file or write a prompt in an editor
2. Press **Ctrl+Shift+O** (Windows/Linux) or **Cmd+Shift+O** (Mac)
3. Or use the Command Palette: `Prompt Intelligence Layer: Optimize Prompt`
4. Review suggestions and apply changes

### Example

**Before:**
```
Fix this bug in the code
```

**Suggestions:**
- Vague pronoun "this" without clear referent
- Missing context about which bug or which code

**After:**
```
Fix the authentication timeout bug in src/api/login.ts
```

## Configuration

Configure the extension via `settings.json`:

```json
{
  "promptIntelligence.rules.VagueReference.enabled": true,
  "promptIntelligence.rules.MissingContext.enabled": true,
  "promptIntelligence.rules.CompoundQuestion.enabled": true,
  "promptIntelligence.rules.VerbosePhrasing.enabled": true,
  "promptIntelligence.rules.InsufficientDetail.enabled": true,
  "promptIntelligence.confidenceThreshold": 0.7,
  "promptIntelligence.maxPromptLength": 10000,
  "promptIntelligence.performanceTimeout": 200,
  "promptIntelligence.showPerformanceWarnings": true
}
```

### Configuration Options

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `promptIntelligence.rules.*.enabled` | boolean | `true` | Enable/disable individual rules |
| `confidenceThreshold` | number | `0.7` | Confidence level (0-1) for accepting suggestions |
| `maxPromptLength` | number | `10000` | Maximum prompt length in characters |
| `performanceTimeout` | number | `200` | Timeout for analysis in milliseconds |
| `showPerformanceWarnings` | boolean | `true` | Show warnings when analysis is slow |

## Optimization Rules

### VagueReference Rule
Detects vague pronouns (this, it, that, these, those) without clear context.

**Detects:**
- "Fix this bug" → vague pronoun "this"
- "Update it to handle errors" → vague pronoun "it"

**Suggests:**
- Replace with specific references and context

### MissingContext Rule
Identifies prompts lacking necessary context for understanding.

**Detects:**
- Prompts without file paths or function names
- Incomplete error descriptions

### CompoundQuestion Rule
Finds prompts asking multiple questions at once.

**Detects:**
- "How do I add auth and also setup DB?"

**Suggests:**
- Split into separate focused prompts

### VerbosePhrasing Rule
Detects unnecessarily verbose expressions.

**Detects:**
- "Could you possibly consider helping me with..."
- "I was wondering if you could..."

**Suggests:**
- Simpler, more direct phrasing

### InsufficientDetail Rule
Identifies prompts lacking important technical details.

**Detects:**
- Missing error messages, stack traces, or version info
- Incomplete problem descriptions

## Privacy Guarantee

✅ **All processing is local.** No prompts, code, or data are sent to external servers. Your prompts stay on your machine.

## Performance

- **Analysis speed**: < 20ms per rule
- **Total optimization**: < 200ms (default timeout)
- **Memory overhead**: < 10MB

## Keybindings

| Command | Windows/Linux | Mac |
|---------|---------------|-----|
| Optimize Prompt | Ctrl+Shift+O | Cmd+Shift+O |

## Development

### Prerequisites

- Node.js 18.x or later
- VS Code 1.85.0 or later

### Setup

```bash
git clone https://github.com/your-org/prompt-intelligence-layer
cd prompt-intelligence-layer
npm install
```

### Build

```bash
npm run compile        # Compile TypeScript
npm run watch         # Watch mode
npm run esbuild-base  # Bundle with esbuild
```

### Test

```bash
npm run test:unit     # Run unit tests
npm run test          # Run integration tests
```

### Lint

```bash
npm run lint          # Check code style
```

## Architecture

The extension is organized into core components:

```
src/
├── extension.ts          # Entry point
├── types.ts              # Shared type definitions
├── config/               # Configuration management
├── rules/                # Optimization rules
│   ├── base/             # Abstract base class
│   └── *.ts              # Concrete rule implementations
├── optimizer/            # Prompt optimization logic
├── analyzers/            # Analysis engines
├── ui/                   # VS Code UI integration
└── utils/                # Helper utilities
```

### Data Flow

```
User Prompt
    ↓
Analyzer (validates, extracts context)
    ↓
Rules Engine (applies all enabled rules)
    ↓
Suggestions (aggregated results)
    ↓
Optimizer (applies high-confidence changes)
    ↓
Preview/Result
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Report a Bug](https://github.com/your-org/prompt-intelligence-layer/issues)
- 💬 [Discussions](https://github.com/your-org/prompt-intelligence-layer/discussions)

## License

MIT License - see [LICENSE](LICENSE) for details

## Changelog

### v0.0.1 (Current)
- Initial release
- 5 core optimization rules
- Local processing
- VS Code integration
