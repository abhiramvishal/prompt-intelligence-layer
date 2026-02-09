import { OptimizationRule } from './base/OptimizationRule';

// Add concrete rule instances to this array as they are implemented.
const RULES: OptimizationRule[] = [];

export function getRules(): OptimizationRule[] {
  return [...RULES];
}

export function getRuleByName(name: string): OptimizationRule | undefined {
  return RULES.find((r) => r.name === name);
}

export { RULES };
