"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LackSpecificityRule = void 0;
/**
 * LackSpecificityRule detects vague verbs and adjectives.
 * It suggests adding concrete details for actions like fix, improve, update, change,
 * and adjectives like better/good/bad/broken.
 * Returns RuleResult with concrete suggestions when possible.
 * Performance target: <20ms on typical inputs.
 */
const types_1 = require("../../types");
const base_1 = require("./base");
class LackSpecificityRule extends base_1.Rule {
    constructor() {
        super(...arguments);
        this.name = 'LackSpecificity';
    }
    analyze(text) {
        const codeFree = this.stripCode(text);
        const verbs = ['fix', 'improve', 'update', 'change'];
        const adjectives = ['better', 'good', 'bad', 'broken'];
        const suggestions = [];
        let detected = false;
        // Check for vague verbs
        const verbRegex = /\b("?)(fix|improve|update|change)\1\b/gi;
        let m;
        while ((m = verbRegex.exec(codeFree)) !== null) {
            detected = true;
            const verb = m[2];
            // Look ahead for a noun phrase within next 6 words
            const after = codeFree.slice(m.index + m[0].length);
            const replaced = this.findFollowingNoun(after);
            const replacement = replaced ? `${verb} the ${replaced}` : undefined;
            suggestions.push({
                message: replacement
                    ? `Replace vague verb '${verb}' with '${replacement}'`
                    : `Consider providing details for '${verb}'`,
                replacement,
                confidence: replacement ? 0.75 : 0.6
            });
        }
        // Check for vague adjectives
        for (const adj of adjectives) {
            const adjRegex = new RegExp(`\\b${adj}\\b`, 'gi');
            while (adjRegex.exec(codeFree) !== null) {
                detected = true;
                suggestions.push({
                    message: `Replace vague adjective '${adj}' with a concrete descriptor`,
                    replacement: undefined,
                    confidence: 0.6
                });
            }
        }
        return {
            ruleName: this.name,
            detected,
            suggestions,
            severity: types_1.RuleSeverity.warning
        };
    }
    /** Strip code blocks to avoid false positives */
    stripCode(input) {
        let s = input;
        s = s.replace(/```[\s\S]*?```/g, '');
        s = s.replace(/`[^`]*`/g, '');
        return s;
    }
    /** Attempt to find a short noun phrase after a position (up to 6 words) */
    findFollowingNoun(after) {
        const words = after.trim().split(/\s+/).filter(w => w.length > 0);
        const stopwords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'with', 'for', 'to', 'of', 'is', 'are', 'was', 'were', 'this', 'that', 'these', 'those']);
        for (let i = 0; i < Math.min(words.length, 6); i++) {
            const w = words[i].replace(/[^A-Za-z0-9_]/g, '');
            if (!w)
                continue;
            const lw = w.toLowerCase();
            if (stopwords.has(lw))
                continue;
            // return first plausible noun-like word as a candidate
            return w;
        }
        return undefined;
    }
}
exports.LackSpecificityRule = LackSpecificityRule;
//# sourceMappingURL=lackSpecificity.js.map