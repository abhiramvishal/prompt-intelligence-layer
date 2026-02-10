"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULES = void 0;
exports.getRules = getRules;
exports.getRuleByName = getRuleByName;
// Add concrete rule instances to this array as they are implemented.
const RULES = [];
exports.RULES = RULES;
function getRules() {
    return [...RULES];
}
function getRuleByName(name) {
    return RULES.find((r) => r.name === name);
}
//# sourceMappingURL=index.js.map