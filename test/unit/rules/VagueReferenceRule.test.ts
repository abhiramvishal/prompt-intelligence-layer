import { describe, it } from 'mocha';
import assert from 'assert';
import { VagueReferenceRule } from '../../src/rules/VagueReferenceRule';
import { RuleSeverity } from '../../src/types';

describe('VagueReferenceRule', () => {
  let rule: VagueReferenceRule;

  beforeEach(() => {
    rule = new VagueReferenceRule();
  });

  it('should detect "this" without referent', () => {
    const prompt = 'Fix this bug in the code';
    const result = rule.analyze(prompt);

    assert.strictEqual(result.detected, true);
    assert.ok(result.suggestions.length > 0);
    assert.ok(
      result.suggestions.some((s) =>
        s.message.toLowerCase().includes('this')
      )
    );
  });

  it('should detect "it" without context', () => {
    const prompt = 'Make it work correctly';
    const result = rule.analyze(prompt);

    assert.strictEqual(result.detected, true);
    assert.ok(result.suggestions.length > 0);
  });

  it('should ignore "this" in code blocks', () => {
    const prompt =
      'Check `this.method()` in the code. ```javascript\nthis.value = 10;\n``` This needs fixing.';
    const result = rule.analyze(prompt);

    // Should still detect "This" at the end, but not in code block
    assert.ok(result.detected);
    // The specific occurrence in the code block should not generate extra suggestions
    assert.strictEqual(result.suggestions.length <= 2, true);
  });

  it('should return correct RuleResult structure', () => {
    const prompt = 'This is a test with it';
    const result = rule.analyze(prompt);

    assert.ok('ruleName' in result);
    assert.ok('detected' in result);
    assert.ok('suggestions' in result);
    assert.ok('severity' in result);
    assert.strictEqual(result.ruleName, 'VagueReference');
    assert.strictEqual(result.severity, RuleSeverity.warning);
    assert.ok(Array.isArray(result.suggestions));
  });

  it('should perform analysis in under 20ms', () => {
    const prompt =
      'This is a complex prompt. It has multiple references. This should work. It needs testing.';
    const start = performance.now();
    const result = rule.analyze(prompt);
    const duration = performance.now() - start;

    assert.ok(duration < 20, `Analysis took ${duration}ms, expected < 20ms`);
    assert.strictEqual(result.detected, true);
  });

  it('should handle empty prompt gracefully', () => {
    const result = rule.analyze('');

    assert.strictEqual(result.detected, false);
    assert.strictEqual(result.suggestions.length, 0);
    assert.ok(result.ruleName);
  });

  it('should limit suggestions to 3 per rule', () => {
    const prompt = 'This is this. It is it. That is that. These are these.';
    const result = rule.analyze(prompt);

    assert.ok(result.suggestions.length <= 3);
  });
});
