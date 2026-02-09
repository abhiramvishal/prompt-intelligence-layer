/**
 * Base class for all optimization rules.
 * Concrete rules should extend this and implement analyze.
 */
import { RuleResult } from '../../types'

export abstract class Rule {
  /** Human-friendly name of the rule */
  abstract readonly name: string;

  /** Analyze the given text and return a RuleResult */
  abstract analyze(text: string): RuleResult;
}
