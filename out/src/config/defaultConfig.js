"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.defaultConfig = {
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
//# sourceMappingURL=defaultConfig.js.map