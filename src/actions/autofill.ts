'use server';

import { aiAutofillForm } from '@/ai/flows/ai-autofill-form';
import { z } from 'zod';

// A helper to generate a simplified JSON schema string from a Zod schema
function getJsonSchema(schema: z.ZodType<any, any>): string {
  // This is a naive implementation. For production, you might want a more robust
  // Zod-to-JSON-Schema library.
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties = Object.keys(shape).reduce((acc, key) => {
      acc[key] = (shape[key] as any)._def.typeName.replace('Zod', '').toLowerCase();
      return acc;
    }, {} as Record<string, string>);
    return JSON.stringify(properties);
  }
  return '{}';
}

export async function autofillFormAction(
  formSchema: z.ZodType<any, any>,
  userDataJson?: string
) {
  try {
    const simplifiedSchema = getJsonSchema(formSchema);
    
    const result = await aiAutofillForm({
      formSchema: simplifiedSchema,
      userData: userDataJson,
      industry: 'logistics',
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('AI Autofill Error:', error);
    return { success: false, error: 'Failed to autofill form.' };
  }
}
