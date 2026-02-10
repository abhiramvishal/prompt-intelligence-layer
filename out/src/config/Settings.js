"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const vscode = __importStar(require("vscode"));
const defaultConfig_1 = require("./defaultConfig");
/**
 * Settings class manages prompt-intelligence configuration.
 * Reads from vscode.workspace.getConfiguration('promptIntelligence')
 * and merges with defaults.
 */
class Settings {
    constructor() {
        this.config = vscode.workspace.getConfiguration('promptIntelligence');
    }
    /**
     * Get configuration for a specific rule.
     */
    getRuleConfig(ruleName) {
        const enabled = this.isRuleEnabled(ruleName);
        const threshold = this.config.get(`rules.${ruleName}.threshold`, defaultConfig_1.defaultConfig.confidenceThreshold);
        return {
            enabled,
            threshold: Math.max(0, Math.min(1, threshold)), // Validate 0-1
        };
    }
    /**
     * Check if a specific rule is enabled.
     */
    isRuleEnabled(ruleName) {
        return this.config.get(`rules.${ruleName}.enabled`, defaultConfig_1.defaultConfig.rules[ruleName] ?? true);
    }
    /**
     * Get the performance timeout in milliseconds.
     */
    getPerformanceTimeout() {
        const timeout = this.config.get('performanceTimeout', defaultConfig_1.defaultConfig.performanceTimeout);
        // Validate: no negative numbers
        if (timeout < 0) {
            console.warn('Invalid performanceTimeout (negative), using default', defaultConfig_1.defaultConfig.performanceTimeout);
            return defaultConfig_1.defaultConfig.performanceTimeout;
        }
        return timeout;
    }
    /**
     * Get the confidence threshold for suggestions.
     */
    getConfidenceThreshold() {
        const threshold = this.config.get('confidenceThreshold', defaultConfig_1.defaultConfig.confidenceThreshold);
        // Validate: must be between 0 and 1
        if (threshold < 0 || threshold > 1) {
            console.warn('Invalid confidenceThreshold (must be 0-1), using default', defaultConfig_1.defaultConfig.confidenceThreshold);
            return defaultConfig_1.defaultConfig.confidenceThreshold;
        }
        return threshold;
    }
    /**
     * Get the maximum prompt length allowed.
     */
    getMaxPromptLength() {
        const maxLength = this.config.get('maxPromptLength', defaultConfig_1.defaultConfig.maxPromptLength);
        if (maxLength < 1) {
            console.warn('Invalid maxPromptLength (must be > 0), using default', defaultConfig_1.defaultConfig.maxPromptLength);
            return defaultConfig_1.defaultConfig.maxPromptLength;
        }
        return maxLength;
    }
    /**
     * Check if performance warnings should be shown.
     */
    shouldShowPerformanceWarnings() {
        return this.config.get('showPerformanceWarnings', defaultConfig_1.defaultConfig.showPerformanceWarnings);
    }
    /**
     * Get all enabled rules.
     */
    getEnabledRules() {
        return Object.entries(defaultConfig_1.defaultConfig.rules)
            .filter(([ruleName]) => this.isRuleEnabled(ruleName))
            .map(([ruleName]) => ruleName);
    }
}
exports.Settings = Settings;
//# sourceMappingURL=Settings.js.map