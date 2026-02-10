"use strict";
// Sample prompts for testing optimization rules
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAMPLE_PROMPTS = exports.longPrompt = exports.emptyPrompt = exports.goodPrompt = exports.compoundQuestionPrompt = exports.missingContextPrompt = exports.vaguePrompt = void 0;
exports.vaguePrompt = 'Fix this bug in the code';
exports.missingContextPrompt = 'Update the function to handle errors';
exports.compoundQuestionPrompt = 'How do I add auth and also setup DB?';
exports.goodPrompt = 'Fix the timeout error in src/api/login.ts handleLogin() function';
exports.emptyPrompt = '';
exports.longPrompt = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(Math.ceil(5000 / 57));
exports.SAMPLE_PROMPTS = {
    vaguePrompt: exports.vaguePrompt,
    missingContextPrompt: exports.missingContextPrompt,
    compoundQuestionPrompt: exports.compoundQuestionPrompt,
    goodPrompt: exports.goodPrompt,
    emptyPrompt: exports.emptyPrompt,
    longPrompt: exports.longPrompt,
};
//# sourceMappingURL=samplePrompts.js.map