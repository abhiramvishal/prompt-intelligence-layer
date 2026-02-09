import { RuleResult, RuleSeverity } from '../../types';

export interface OptimizationRuleOptions {
  name: string;
  description?: string;
  enabled?: boolean;
  severity?: RuleSeverity;
}

export abstract class OptimizationRule {
  public readonly name: string;
  public readonly description?: string;
  public enabled: boolean;
  public severity: RuleSeverity;

  constructor(options: OptimizationRuleOptions) {
    this.name = options.name;
    this.description = options.description;
    this.enabled = options.enabled ?? true;
    this.severity = options.severity ?? RuleSeverity.warning;
  }

  /**
   * Analyze the given prompt and return a RuleResult describing
   * whether the rule detected an issue and any suggestions.
   */
  public abstract analyze(prompt: string): RuleResult;

  /**
   * Whether this rule should run. Defaults to checking the `enabled` flag.
   */
  public shouldRun(): boolean {
    return this.enabled === true;
  }
}
