'use server';
/**
 * @fileOverview An AI flow to query payments based on natural language.
 *
 * - findPaymentsByQuery - A function that handles the payment query process.
 * - PaymentQueryInput - The input type for the findPaymentsByQuery function.
 * - PaymentQueryOutput - The return type for the findPaymentsByQuery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Member, Payment } from '@/types';

const PaymentQueryInputSchema = z.object({
  query: z.string().describe('The natural language query about payments.'),
  members: z.array(z.object({
      id: z.string(),
      name: z.string(),
      monthlyAmount: z.number(),
      isActive: z.boolean(),
      createdAt: z.string(),
  })).describe("List of all members."),
  payments: z.array(z.object({
    id: z.string(),
    memberId: z.string(),
    amount: z.number(),
    date: z.string(),
  })).describe("List of all payments."),
});
export type PaymentQueryInput = z.infer<typeof PaymentQueryInputSchema>;

const PaymentQueryOutputSchema = z.object({
  paymentIds: z.array(z.string()).describe('A list of payment IDs that match the query.'),
});
export type PaymentQueryOutput = z.infer<typeof PaymentQueryOutputSchema>;


export async function findPaymentsByQuery(input: PaymentQueryInput): Promise<PaymentQueryOutput> {
  return paymentQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'paymentQueryPrompt',
  input: { schema: PaymentQueryInputSchema },
  output: { schema: PaymentQueryOutputSchema },
  prompt: `You are an expert at searching through payment records. Your goal is to find payments that match the user's query.

You will be given a user's query, a list of members, and a list of all payments.

Analyze the user's query: "{{query}}".

Identify the member(s) the user is asking about from the provided list of members.
If a member name is mentioned, find all payments associated with that member's ID.

Return a list of payment IDs that best match the query. If no specific member is mentioned or you can't determine the member, you may need to look at other details in the query, but prioritize filtering by member name if available.

If no payments match the query, return an empty list.

Available members:
{{#each members}}
- Name: {{name}}, ID: {{id}}
{{/each}}

Available payments:
{{#each payments}}
- ID: {{id}}, Member ID: {{memberId}}, Amount: {{amount}}, Date: {{date}}
{{/each}}
`,
});

const paymentQueryFlow = ai.defineFlow(
  {
    name: 'paymentQueryFlow',
    inputSchema: PaymentQueryInputSchema,
    outputSchema: PaymentQueryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
