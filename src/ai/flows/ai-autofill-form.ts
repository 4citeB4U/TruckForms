// src/ai/flows/ai-autofill-form.ts
'use server';

/**
 * @fileOverview An AI-powered tool that assists in automatically filling in forms.
 *
 * - aiAutofillForm - A function that handles the form autofill process.
 * - AiAutofillFormInput - The input type for the aiAutofillForm function.
 * - AiAutofillFormOutput - The return type for the aiAutofillForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAutofillFormInputSchema = z.object({
  formSchema: z
    .string()
    .describe("The schema of the form to be filled, represented as a JSON string."),
  userData: z
    .string()
    .optional()
    .describe("Optional user data or context, represented as a JSON string, to assist in the autofill process."),
  industry: z
    .string()
    .optional()
    .describe("Optional industry to tailor the autofill. e.g. 'logistics', 'healthcare', etc."),
});
export type AiAutofillFormInput = z.infer<typeof AiAutofillFormInputSchema>;

const AiAutofillFormOutputSchema = z.record(z.any()).describe("The form filled with AI-generated values, as a JSON string.");

export type AiAutofillFormOutput = z.infer<typeof AiAutofillFormOutputSchema>;

export async function aiAutofillForm(input: AiAutofillFormInput): Promise<AiAutofillFormOutput> {
  return aiAutofillFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAutofillFormPrompt',
  input: {schema: AiAutofillFormInputSchema},
  output: {schema: AiAutofillFormOutputSchema},
  prompt: `You are an AI assistant specialized in automatically filling out forms based on their schema and available user data.

  Instructions:
  1.  Analyze the provided form schema and identify the fields that need to be filled.
  2.  If user data is provided, use it to pre-populate the form fields accordingly.
  3.  Consider the industry when filling out the form to provide relevant and accurate information. Use industry best practices and common standards.
  4.  Return the filled form as a JSON object.
  5.  If a field cannot be filled with certainty, leave it blank.

  Form Schema:
  {{formSchema}}

  User Data (optional):
  {{#if userData}}{{userData}}{{else}}No user data provided.{{/if}}

  Industry (optional):
  {{#if industry}}{{industry}}{{else}}No industry specified.{{/if}}

  Output the filled form as a JSON object:
  `, // MUST be valid JSON (no comments, trailing commas, etc.)
});

const aiAutofillFormFlow = ai.defineFlow(
  {
    name: 'aiAutofillFormFlow',
    inputSchema: AiAutofillFormInputSchema,
    outputSchema: AiAutofillFormOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);

      if (!output) {
        console.warn('No output from aiAutofillFormPrompt, returning empty object');
        return {};
      }
      return output;
    } catch (error) {
      console.error('Error during aiAutofillFormFlow:', error);
      return {};
    }
  }
);
