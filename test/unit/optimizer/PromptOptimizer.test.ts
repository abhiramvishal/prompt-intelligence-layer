import { describe, it } from 'mocha';
import assert from 'assert';
import { PromptOptimizer } from '../../src/optimizer/promptOptimizer';
import { RuleResult, RuleSeverity } from '../../src/types';
import {
  vaguePrompt,
  goodPrompt,
  emptyPrompt,
  compoundQuestionPrompt,
} from '../../test/fixtures/samplePrompts';

describe('PromptOptimizer', () => {
  let optimizer: PromptOptimizer;

  beforeEach(() => {
    optimizer = new PromptOptimizer();
  });

  it('should apply high-confidence suggestions correctly', () => {
    const rules: RuleResult[] = [
      {
        ruleName: 'TestRule',
        detected: true,
        severity: RuleSeverity.warning,
        suggestions: [
          {
            message: 'Please be more specific',
            replacement: 'Specifically describe the issue',
            confidence: 0.9, // High confidence
          },
        ],
      },
    ];

    const original = 'Please be more specific about the issue';
    const result = optimizer.optimize(original, rules);

    // Result should show change occurred
    assert.ok(result.changed || result.charactersDifference !== 0);
  });

  it('should preserve code blocks during optimization', () => {
    const prompt = `Explain this code:
\`\`\`javascript
function test() {
  this.value = 10;
  return it;
}
\`\`\``;

    const rules: RuleResult[] = [
      {
        ruleName: 'VagueRef',
        detected: true,
        severity: RuleSeverity.warning,
        suggestions: [],
      },
    ];

    const result = optimizer.optimize(prompt, rules);

    // Code block should still be present
    assert.ok(result.after.includes('```'));
    assert.ok(result.after.includes('this.value'));
  });

  it('should handle empty suggestions gracefully', () => {
    const rules: RuleResult[] = [
      {
        ruleName: 'EmptyRule',
        detected: false,
        severity: RuleSeverity.info,
        suggestions: [],
      },
    ];

    const original = 'This is a test prompt';
    const result = optimizer.optimize(original, rules);

    assert.strictEqual(result.before, original);
    assert.strictEqual(result.after, original);
    assert.strictEqual(result.changes.length, 0);
  });

  it('should track changes between original and optimized', () => {
    const original = 'This is vague';
    const optimized = 'This is more specific and detailed';

    const tracking = optimizer.trackChanges(original, optimized);

    assert.strictEqual(tracking.changed, true);
    assert.ok(tracking.charactersDifference > 0);
  });

  it('should track when no changes are made', () => {
    const prompt = 'Unchanged prompt';

    const tracking = optimizer.trackChanges(prompt, prompt);

    assert.strictEqual(tracking.changed, false);
    assert.strictEqual(tracking.charactersDifference, 0);
  });

  it('should only apply suggestions with confidence >= 0.7', () => {
    const rules: RuleResult[] = [
      {
        ruleName: 'ConfidenceRule',
        detected: true,
        severity: RuleSeverity.warning,
        suggestions: [
          {
            message: 'Low confidence',
            replacement: 'High confidence version',
            confidence: 0.5, // Below threshold
          },
          {
            message: 'High confidence',
            replacement: 'Better suggestion',
            confidence: 0.85, // Above threshold
          },
        ],
      },
    ];

    const suggestions = optimizer.getSuggestions(rules);

    // Should only include high-confidence suggestion
    assert.strictEqual(suggestions.length, 1);
    assert.ok(
      suggestions[0].message.includes('High confidence')
    );
  });

  it('should work with sample vague prompt fixture', () => {
    const rules: RuleResult[] = [
      {
        ruleName: 'VagueTest',
        detected: true,
        severity: RuleSeverity.warning,
        suggestions: [
          {
            message: 'Be specific about what needs fixing',
            confidence: 0.8,
          },
        ],
      },
    ];

    const result = optimizer.optimize(vaguePrompt, rules);

    assert.ok(result.before === vaguePrompt);
    assert.ok(result.before.length > 0);
  });

  it('should work with sample good prompt fixture', () => {
    const rules: RuleResult[] = [];

    const result = optimizer.optimize(goodPrompt, rules);

    assert.strictEqual(result.before, goodPrompt);
    assert.strictEqual(result.after, goodPrompt);
    assert.ok(goodPrompt.includes('src/'));
  });

  it('should handle empty prompt gracefully', () => {
    const rules: RuleResult[] = [
      {
        ruleName: 'EmptyPromptTest',
        detected: false,
        severity: RuleSeverity.info,
        suggestions: [],
      },
    ];

    const result = optimizer.optimize(emptyPrompt, rules);

    assert.strictEqual(result.before, '');
    assert.strictEqual(result.after, '');
  });

  it('should extract high-confidence suggestions only', () => {
    const rules: RuleResult[] = [
      {
        ruleName: 'FilterTest',
        detected: true,
        severity: RuleSeverity.warning,
        suggestions: [
          { message: 'Suggestion 1', confidence: 0.6 },
          { message: 'Suggestion 2', confidence: 0.75 },
          { message: 'Suggestion 3', confidence: 0.9 },
        ],
      },
    ];

    const suggestions = optimizer.getSuggestions(rules);

    assert.strictEqual(suggestions.length, 2); // Only 0.75 and 0.9
    assert.ok(suggestions.every((s) => s.confidence >= 0.7));
  });
});
