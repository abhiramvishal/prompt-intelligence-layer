// Type definitions for prompt optimization rules

export interface Suggestion {
  message: string;
  replacement?: string;
  confidence: number;
}

export enum RuleSeverity {
  info = 'info',
  warning = 'warning',
  error = 'error'
}

export interface RuleConfig {
  enabled: boolean;
  threshold: number;
}

export interface RuleResult {
  ruleName: string;
  detected: boolean;
  suggestions: Suggestion[];
  severity: RuleSeverity;
}

// Analysis results and metrics for the overall optimization flow
export interface AnalysisResult {
  originalPrompt: string;
  optimizedPrompt: string;
  rulesApplied: RuleResult[];
  totalChanges: number;
  processingTime: number; // in milliseconds
}

export interface AnalysisMetrics {
  ruleExecutionTimes: Record<string, number>;
  totalTime: number; // in milliseconds
  promptLength: number;
}
