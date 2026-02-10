"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffGenerator = void 0;
class DiffGenerator {
    /**
     * Generate a minimal, line-by-line diff between original and optimized strings.
     */
    generateDiff(original, optimized) {
        const origLines = original.split('\n');
        const newLines = optimized.split('\n');
        const changes = [];
        const max = Math.max(origLines.length, newLines.length);
        for (let i = 0; i < max; i++) {
            const o = origLines[i];
            const n = newLines[i];
            const lineNo = i + 1;
            if (o === undefined) {
                // added line
                changes.push({ type: 'added', lineNumber: lineNo, original: '', suggested: n ?? '' });
            }
            else if (n === undefined) {
                // removed line
                changes.push({ type: 'removed', lineNumber: lineNo, original: o, suggested: '' });
            }
            else if (o !== n) {
                changes.push({ type: 'modified', lineNumber: lineNo, original: o, suggested: n });
            }
        }
        return changes;
    }
}
exports.DiffGenerator = DiffGenerator;
//# sourceMappingURL=diffGenerator.js.map