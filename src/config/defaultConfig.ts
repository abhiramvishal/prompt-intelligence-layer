export interface DefaultConfig {
  rules: {
    [ruleName: string]: boolean;
  };
  confidenceThreshold: number;
  maxPromptLength: number;
  performanceTimeout: number;
  showPerformanceWarnings: boolean;
}

export const defaultConfig: DefaultConfig = {
  rules: {
    VagueReference: true,
    MissingContext: true,
    CompoundQuestion: true,
    VerbosePhrasing: true,
    InsufficientDetail: true,
  },
  confidenceThreshold: 0.7,
  maxPromptLength: 10000,
  performanceTimeout: 200,
  showPerformanceWarnings: true,
};
