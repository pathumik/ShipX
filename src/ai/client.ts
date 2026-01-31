// src/ai/client.ts
// OpenAI API client wrapper

import OpenAI from "openai";

// Lazy-load OpenAI client to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export interface AICallParams {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Run an AI call with the given prompts
 * Returns the raw text response
 */
export async function runAI(params: AICallParams): Promise<string> {
  const { systemPrompt, userPrompt, temperature = 0, maxTokens = 1000 } = params;

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  return content;
}

/**
 * Run an AI call and parse the JSON response
 */
export async function runAIJSON<T>(params: AICallParams): Promise<T> {
  const raw = await runAI(params);
  return parseJSON<T>(raw);
}

/**
 * Extract and parse JSON from AI response
 * Handles cases where AI includes extra text around JSON
 */
export function parseJSON<T>(raw: string): T {
  // Try to find JSON object in the response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in response");
  }

  try {
    return JSON.parse(jsonMatch[0]) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error}`);
  }
}
