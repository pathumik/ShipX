# PART A — CURSOR BUILD CHECKLIST (STRICT SEQUENCE)

## Step 0 — Repo + Setup (15–25 min)

1. Create new folder/repo: `uncertainty-map`
2. Initialize project:
    - **Next.js** (recommended) OR **Vite + React**
3. Install basics:
    - Tailwind (optional)
    - (Optional) Ajv for schema validation

✅ Deliverable: App runs locally, “Hello” page visible.

---

## Step 1 — Add the spec files (10 min)

1. Create `/docs/knowledge-base.md` (paste yours)
2. Create `/docs/ai-prompts.md` (paste your prompts)
3. Create `/docs/demo-script.md` (empty for now)

✅ Deliverable: All spec files exist in repo.

---

## Step 2 — Add the “contract” files (25–40 min)

Create these files and paste content:

1. `/src/lib/types.ts` (TS types)
2. `/src/lib/jsonSchemas.ts` (JSON schemas)
3. `/src/lib/mapModel.ts` (map types)
4. `/src/lib/mapFactory.ts` (createDefaultMap)
5. `/src/lib/mapProgress.ts` (applyMissionOutcome)

✅ Deliverable: Code compiles, no unused import errors.

> Cursor prompt (copy/paste):
> 
> 
> “Create the files listed above from the specs in /docs and ensure TypeScript compiles.”
> 

---

## Step 3 — App state model (30–45 min)

Create a single state container in one file:

- `/src/lib/sessionState.ts` (or in a page component)

Minimum state:

- nickname
- raw idea input
- structure (AI #1 output)
- classification (AI #2 output)
- mission (AI #3 output)
- map (default map)
- timeline entries

✅ Deliverable: You can console.log the state and see all fields.

---

## Step 4 — UI Screen skeleton (45–60 min)

Create 4 screens (even if they’re simple):

1. `WelcomeScreen`
2. `GuidedInputScreen`
3. `MapScreen`
4. `MissionAndLogScreen`

Routing approach:

- simplest: render based on `step` enum in state:
    - `"welcome" | "input" | "map" | "mission"`

✅ Deliverable: You can click “Next” and move between screens without AI.

---

## Step 5 — Guided Input UI (45–60 min)

Implement:

- Fullscreen question UI
- One question at a time
- 3 questions only (keep scope tight)

Suggested questions:

1. “What are you trying to make true?”
2. “What could kill this fastest?”
3. “Who is the target user / context?” (one line)

Store combined answers into `raw_idea_input` (single string).

✅ Deliverable: At end of Q3 you have `raw_idea_input`.

---

## Step 6 — Map UI (60–90 min)

Implement `MapScreen`:

- Show three region cards:
    - Demand / Feasibility / Timing
- Show clarity % + fog badge
- Highlight primary uncertainty (once available)
- List nodes as simple clickable items (no fancy map drawing needed)

✅ Deliverable: Map renders from `mapFactory` output.

> Important: Don’t attempt SVG “treasure map” yet.
> 
> 
> Cards + fog overlay is enough to win.
> 

---

## Step 7 — Mission UI + Logging Form (60–90 min)

Implement `MissionAndLogScreen`:

- show mission name, goal, 3 steps, signals
- show a “Log Result” form (fields depend on mission_name)
- on submit:
    - store mission log into state
    - generate a timeline entry placeholder

✅ Deliverable: You can complete mission log without AI and see timeline entry added.

---

## Step 8 — Timeline UI (30–45 min)

Add to MapScreen or separate panel:

- list of timeline entries
- show:
    - timestamp
    - mission
    - decision
    - learning_update.what_changed

✅ Deliverable: Demo shows “inspectable journey.”

---

## Step 9 — Polish passes (45–60 min)

- remove clutter
- ensure text is short
- ensure transitions are clean
- ensure the “wow” happens:
    - input → reveal map
    - mission → log → map updates

✅ Deliverable: A 2-minute demo flow feels smooth.

---

# PART B — AI IMPLEMENTATION CHECKLIST (STRICT, SOLO-FRIENDLY)

You are not building a “chatbot”.

You are making **4 deterministic API calls**.

## AI Step 1 — Decide your AI integration method (5 min)

Simplest for hackathon:

- Use OpenAI API from a Next.js API route `/api/ai`
- Keep API key in `.env.local`

✅ Deliverable: `.env.local` has your key.

---

## AI Step 2 — Create AI client wrapper (20–30 min)

Create:

- `/src/ai/client.ts`

It should:

- accept `systemPrompt`, `userPrompt`
- call model
- return raw string response

✅ Deliverable: One function `runAI(system, user)` returns text.

---

## AI Step 3 — Add JSON safe parsing (15–25 min)

Create:

- `/src/ai/parseJson.ts`

Implement:

- extract first JSON object from response
- JSON.parse
- throw error if invalid

✅ Deliverable: `safeParseJson(raw)` returns object.

---

## AI Step 4 — Add schema validation (optional but recommended) (20–30 min)

If you add Ajv:

- validate AI response against `IdeaStructureSchema`, etc.
- if invalid: show a friendly error + “retry” button

✅ Deliverable: Invalid AI output doesn’t crash UI.

---

## AI Step 5 — Create prompts module (10 min)

Create:

- `/src/ai/prompts.ts`

Export:

- `SYSTEM_EXTRACT`
- `USER_EXTRACT(template)`
- `SYSTEM_CLASSIFY`
- `USER_CLASSIFY(template)`
- etc.

✅ Deliverable: Prompts are not scattered in components.

---

## AI Step 6 — Wire AI into the flow (60–90 min)

### At end of Guided Input:

Call AI #1 → store `structure`

Then AI #2 → store `classification`

Then AI #3 → store `mission`

Then generate map:

- `createDefaultMap({ primary_uncertainty, risky_assumption })`

Then go to Map screen.

✅ Deliverable: input → AI outputs → map appears.

---

## AI Step 7 — Wire AI into result logging (45–75 min)

When user submits mission log:

- call AI #4 with the log JSON
- store `learning_update`
- apply map update:
    - use AI #5 OR local rule `applyMissionOutcome()`

✅ Deliverable: log → learning update → fog clears → timeline updates.

---

## AI Step 8 — Add “Retry AI” buttons (20 min)

At each AI step:

- if failure, show:
    - “Retry”
    - “Edit input”
        
        This prevents demo embarrassment.
        

✅ Deliverable: You can recover live.

---

# How to use Cursor (the winning way)

Cursor works best if you do this pattern:

### ✅ Pattern

1. Tell Cursor *which file to edit*
2. Paste only the relevant spec snippet
3. Ask for one narrow change
4. Run locally
5. Repeat

### ❌ Avoid

- “Build the whole app”
- giant multi-step prompts
- changing the spec mid-build

---

# The exact order for you right now (do this next)

1. Create repo + Next.js
2. Add `/docs` + `/src/lib` spec files
3. Build UI without AI (screens + map + log)
4. Add AI calls after UI works
5. Polish demo