"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptEnhancer = void 0;
/** Conservative enhancer that makes minimal, safe improvements */
class PromptEnhancer {
    enhance(prompt, _analysis) {
        let p = prompt.trim();
        // Simple safety: ensure ending punctuation
        if (p.length > 0 && !/[.!?]$/.test(p)) {
            p = p + '.';
        }
        return p;
    }
}
exports.PromptEnhancer = PromptEnhancer;
//# sourceMappingURL=enhancer.js.map