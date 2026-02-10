"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationRule = void 0;
const types_1 = require("../../types");
class OptimizationRule {
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.enabled = options.enabled ?? true;
        this.severity = options.severity ?? types_1.RuleSeverity.warning;
    }
    /**
     * Whether this rule should run. Defaults to checking the `enabled` flag.
     */
    shouldRun() {
        return this.enabled === true;
    }
}
exports.OptimizationRule = OptimizationRule;
//# sourceMappingURL=OptimizationRule.js.map