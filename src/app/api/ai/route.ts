// src/app/api/ai/route.ts
// API route for AI calls

import { NextRequest, NextResponse } from "next/server";
import { runAIJSON } from "@/ai/client";
import {
  SYSTEM_EXTRACT,
  USER_EXTRACT,
  SYSTEM_CLASSIFY,
  USER_CLASSIFY,
  SYSTEM_MISSION,
  USER_MISSION,
  SYSTEM_LEARNING,
  USER_LEARNING,
} from "@/ai/prompts";
import type {
  IdeaStructure,
  UncertaintyClassification,
  MissionProposal,
  LearningUpdate,
} from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { call } = body as { call: string };

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    switch (call) {
      case "structure": {
        const { raw_idea } = body as { raw_idea: string };
        if (!raw_idea) {
          return NextResponse.json(
            { error: "raw_idea is required" },
            { status: 400 }
          );
        }

        const result = await runAIJSON<IdeaStructure>({
          systemPrompt: SYSTEM_EXTRACT,
          userPrompt: USER_EXTRACT(raw_idea),
        });

        return NextResponse.json({ success: true, result });
      }

      case "classify": {
        const { idea_statement, risky_assumption } = body as {
          idea_statement: string;
          risky_assumption: string;
        };
        if (!idea_statement || !risky_assumption) {
          return NextResponse.json(
            { error: "idea_statement and risky_assumption are required" },
            { status: 400 }
          );
        }

        const result = await runAIJSON<UncertaintyClassification>({
          systemPrompt: SYSTEM_CLASSIFY,
          userPrompt: USER_CLASSIFY(idea_statement, risky_assumption),
        });

        return NextResponse.json({ success: true, result });
      }

      case "mission": {
        const { risky_assumption, primary_uncertainty } = body as {
          risky_assumption: string;
          primary_uncertainty: string;
        };
        if (!risky_assumption || !primary_uncertainty) {
          return NextResponse.json(
            { error: "risky_assumption and primary_uncertainty are required" },
            { status: 400 }
          );
        }

        const result = await runAIJSON<MissionProposal>({
          systemPrompt: SYSTEM_MISSION,
          userPrompt: USER_MISSION(risky_assumption, primary_uncertainty),
        });

        return NextResponse.json({ success: true, result });
      }

      case "learning": {
        const { risky_assumption, mission_name, mission_log } = body as {
          risky_assumption: string;
          mission_name: string;
          mission_log: object;
        };
        if (!risky_assumption || !mission_name || !mission_log) {
          return NextResponse.json(
            { error: "risky_assumption, mission_name, and mission_log are required" },
            { status: 400 }
          );
        }

        const result = await runAIJSON<LearningUpdate>({
          systemPrompt: SYSTEM_LEARNING,
          userPrompt: USER_LEARNING(risky_assumption, mission_name, mission_log),
        });

        return NextResponse.json({ success: true, result });
      }

      default:
        return NextResponse.json(
          { error: `Unknown call type: ${call}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI call failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "ShipX AI API",
    endpoints: {
      POST: {
        structure: "Extract idea structure from raw input",
        classify: "Classify primary uncertainty",
        mission: "Propose validation mission",
        learning: "Interpret mission results",
      },
    },
  });
}
