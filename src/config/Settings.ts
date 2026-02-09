import * as vscode from 'vscode';
import { RuleConfig } from '../types';
import { defaultConfig, DefaultConfig } from './defaultConfig';

/**
 * Settings class manages prompt-intelligence configuration.
 * Reads from vscode.workspace.getConfiguration('promptIntelligence')
 * and merges with defaults.
 */
export class Settings {
  private config: vscode.WorkspaceConfiguration;

  constructor() {
    this.config = vscode.workspace.getConfiguration('promptIntelligence');
  }

  /**
   * Get configuration for a specific rule.
   */
  public getRuleConfig(ruleName: string): RuleConfig {
    const enabled = this.isRuleEnabled(ruleName);
    const threshold = this.config.get<number>(
      `rules.${ruleName}.threshold`,
      defaultConfig.confidenceThreshold
    );

    return {
      enabled,
      threshold: Math.max(0, Math.min(1, threshold)), // Validate 0-1
    };
  }

  /**
   * Check if a specific rule is enabled.
   */
  public isRuleEnabled(ruleName: string): boolean {
    return this.config.get<boolean>(
      `rules.${ruleName}.enabled`,
      defaultConfig.rules[ruleName] ?? true
    );
  }

  /**
   * Get the performance timeout in milliseconds.
   */
  public getPerformanceTimeout(): number {
    const timeout = this.config.get<number>(
      'performanceTimeout',
      defaultConfig.performanceTimeout
    );

    // Validate: no negative numbers
    if (timeout < 0) {
      console.warn(
        'Invalid performanceTimeout (negative), using default',
        defaultConfig.performanceTimeout
      );
      return defaultConfig.performanceTimeout;
    }

    return timeout;
  }

  /**
   * Get the confidence threshold for suggestions.
   */
  public getConfidenceThreshold(): number {
    const threshold = this.config.get<number>(
      'confidenceThreshold',
      defaultConfig.confidenceThreshold
    );

    // Validate: must be between 0 and 1
    if (threshold < 0 || threshold > 1) {
      console.warn(
        'Invalid confidenceThreshold (must be 0-1), using default',
        defaultConfig.confidenceThreshold
      );
      return defaultConfig.confidenceThreshold;
    }

    return threshold;
  }

  /**
   * Get the maximum prompt length allowed.
   */
  public getMaxPromptLength(): number {
    const maxLength = this.config.get<number>(
      'maxPromptLength',
      defaultConfig.maxPromptLength
    );

    if (maxLength < 1) {
      console.warn(
        'Invalid maxPromptLength (must be > 0), using default',
        defaultConfig.maxPromptLength
      );
      return defaultConfig.maxPromptLength;
    }

    return maxLength;
  }

  /**
   * Check if performance warnings should be shown.
   */
  public shouldShowPerformanceWarnings(): boolean {
    return this.config.get<boolean>(
      'showPerformanceWarnings',
      defaultConfig.showPerformanceWarnings
    );
  }

  /**
   * Get all enabled rules.
   */
  public getEnabledRules(): string[] {
    return Object.entries(defaultConfig.rules)
      .filter(([ruleName]) => this.isRuleEnabled(ruleName))
      .map(([ruleName]) => ruleName);
  }
}
