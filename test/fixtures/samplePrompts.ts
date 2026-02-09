// Sample prompts for testing optimization rules

export const vaguePrompt = 'Fix this bug in the code';

export const missingContextPrompt = 'Update the function to handle errors';

export const compoundQuestionPrompt = 'How do I add auth and also setup DB?';

export const goodPrompt =
  'Fix the timeout error in src/api/login.ts handleLogin() function';

export const emptyPrompt = '';

export const longPrompt =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(
    Math.ceil(5000 / 57)
  );

export const SAMPLE_PROMPTS = {
  vaguePrompt,
  missingContextPrompt,
  compoundQuestionPrompt,
  goodPrompt,
  emptyPrompt,
  longPrompt,
};
