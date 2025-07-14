// src/ai/flows/command-parser-flow.ts
'use server';
/**
 * @fileOverview An AI-powered flow to parse user commands and map them to application actions.
 *
 * - parseCommand - A function that handles the command parsing process.
 * - ParseCommandInput - The input type for the parseCommand function.
 * - ParseCommandOutput - The return type for the parseCommand function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ALL_FORMS } from '@/lib/constants';

const formSlugs = ALL_FORMS.map(form => form.href.replace('/forms/', ''));

const ParseCommandInputSchema = z.object({
  command: z.string().describe('The natural language command from the user.'),
});
export type ParseCommandInput = z.infer<typeof ParseCommandInputSchema>;

const ParseCommandOutputSchema = z.object({
  action: z.enum(['navigate', 'unknown']).describe("The type of action to perform."),
  details: z.object({
    slug: z.enum([...formSlugs, ''] as [string, ...string[]]).optional().describe('The unique slug of the form to navigate to.'),
    reasoning: z.string().describe('A brief explanation of why this action was chosen.')
  })
});
export type ParseCommandOutput = z.infer<typeof ParseCommandOutputSchema>;

export async function parseCommand(
  input: ParseCommandInput
): Promise<ParseCommandOutput> {
  return commandParserFlow(input);
}

const prompt = ai.definePrompt({
  name: 'commandParserPrompt',
  input: { schema: ParseCommandInputSchema },
  output: { schema: ParseCommandOutputSchema },
  prompt: `You are an AI assistant named "Agent Lee" for a logistics application called TruckForms.
  Your job is to parse user commands and determine the appropriate action.

  The primary action is 'navigate', which opens a specific form.
  You must identify which form the user is asking for from the list of available form slugs and return the corresponding slug.

  Available form slugs for navigation:
  ${formSlugs.join('\n')}

  User command: "{{command}}"

  Analyze the command and determine the action. If the user wants to open a form, set the action to 'navigate' and provide the correct form slug.
  If you cannot determine the form or the command is unclear, set the action to 'unknown' and leave the slug empty.
  Provide your reasoning.`,
});

const commandParserFlow = ai.defineFlow(
  {
    name: 'commandParserFlow',
    inputSchema: ParseCommandInputSchema,
    outputSchema: ParseCommandOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      return {
        action: 'unknown',
        details: {
            slug: '',
            reasoning: 'AI model did not return a valid output.'
        }
      }
    }
    return output;
  }
);
