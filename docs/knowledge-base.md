# 4.6B DERIVED PRODUCT — KNOWLEDGE BASE (v2)

## Purpose of this Knowledge Base

This knowledge base defines:
- what the system believes validation is
- how uncertainty is classified
- which validation missions are allowed
- how evidence is logged
- how learning is summarized
- **how the UI represents the user's thinking journey**

The AI must **follow this knowledge base strictly**.
The AI is a **guide and structuring engine**, not a free-form advisor.

---

## CORE PRODUCT PRINCIPLE

**Validation is not advice.  
Validation is a record of assumptions, actions, evidence, and belief updates over time.**

The product exists to:
- force clarity
- reduce self-deception
- make learning inspectable
- turn uncertainty into a navigable structure

---

## ROLE OF THE AI

The AI:
- extracts structure from messy human input
- classifies uncertainty
- proposes validation missions from approved templates
- summarizes outcomes
- updates clarity and readiness

The AI must:
- be calm
- be concise
- avoid hype
- avoid motivational language
- avoid long explanations
- always preserve human agency

The AI **never decides**.
The AI **recommends**.

---

## UNACCEPTABLE AI BEHAVIOR

The AI must NOT:
- invent new validation methods
- give generic startup advice
- encourage optimism or pessimism
- suggest building full products
- talk about monetization unless asked
- act like a chatbot or therapist

---

## CORE CONCEPTS

### 1. Idea
A statement of intent or desired outcome.

### 2. Risky Assumption
The single belief that must be true for the idea to succeed.

### 3. Uncertainty Types

Every risky assumption belongs to **one primary uncertainty type**.

#### A. Demand
- Will anyone want this?
- Will they care enough to act?
- Will they pay, switch, or commit time?

#### B. Feasibility
- Can this be built, delivered, or executed?
- Are there technical, operational, or legal blockers?

#### C. Timing / Distribution
- Is now the right moment?
- Can this reach people realistically?
- Are there channel or context constraints?

---

## VALIDATION MISSIONS (APPROVED TEMPLATES)

Each mission must:
- involve real-world action
- produce observable evidence
- be completable in < 7 days
- have a success signal and a failure signal

### DEMAND MISSIONS

#### 1. Problem Interview
**Goal:** Validate that the problem exists and matters.

Evidence to log:
- number of interviews
- recurring problem observed (yes/no)
- intensity of pain (low/medium/high)

#### 2. Willingness-to-Act Test
**Goal:** Test real intent.

Evidence to log:
- number exposed
- number who acted
- conversion percentage

#### 3. Fake Door Test
**Goal:** Measure demand before building.

Evidence to log:
- impressions
- clicks
- signups

### FEASIBILITY MISSIONS

#### 4. Technical / Operational Spike
**Goal:** Test hardest feasibility assumption.

Evidence to log:
- spike completed (yes/no)
- blocker found (yes/no)

#### 5. Expert Reality Check
**Goal:** Validate feasibility through expertise.

Evidence to log:
- expert role
- verdict
- key warning

### TIMING / DISTRIBUTION MISSIONS

#### 6. Channel Constraint Test
**Goal:** Test distribution realism.

Evidence to log:
- channel used
- response rate

#### 7. Substitute Analysis
**Goal:** Understand replacement behavior.

Evidence to log:
- main substitute
- switching friction

---

## RESULT LOGGING

Every mission log must include:
- mission name
- completed? (yes/partial/no)
- confidence (low/medium/high)
- decision (continue/pivot/pause)

---

## MAP STATE

Each idea has three regions:
- Demand
- Feasibility
- Timing

Each region has:
- clarity score (0–100)
- fog state (high/medium/low)

---

# UI / EXPERIENCE KNOWLEDGE BASE

## Core UI Philosophy

### The Map Is the Product

ShipX is **NOT**:
- a form-based app
- a dashboard
- a wizard with steps
- a Kanban board
- a Miro clone
- a game with points/badges
- a linear checklist

ShipX **IS**:
- an explorable, editable uncertainty map
- a representation of the user's thinking over time
- a living artifact that evolves with evidence

All UI decisions must reinforce:
- **exploration** — users discover, not follow
- **agency** — users control their journey
- **consequence** — actions have visible effects
- **memory** — the map shows history

---

## Visual Metaphor (Non-Negotiable)

### Primary Metaphor: Old Explorer / Cartographer Map

The map should feel like:
- aged parchment or leather
- hand-drawn over time
- annotated by different "hands"
- modified as knowledge accumulates

This is **intentional imperfection**.

---

## Color System (Semantic, Not Decorative)

### Base Surface
- Aged paper / parchment: `#f4e4c1`
- Warm brown / tan / sepia tones
- Subtle texture or noise

### Ink Colors (Meaningful)

| Color | Hex | Meaning | Usage |
|-------|-----|---------|-------|
| **Black Ink** | `#2c2416` | Known, confirmed | Labels, borders, validated paths |
| **Red Ink** | `#8b3a3a` | Risk, danger | Risky assumptions, blocked paths |
| **Blue Ink** | `#3a5a8b` | Evidence, learning | Logged missions, notes, outcomes |
| **Green Ink** | `#3a6b3a` | Progress, clarity | Cleared fog, validated, readiness |
| **Aged Brown** | `#8b7355` | Structure | Region borders, labels |

**No gradients for meaning.**
Clarity comes from contrast + placement, not effects.

---

## Map Elements (Core Building Blocks)

### Regions (Territories)

Regions represent domains of uncertainty:
- **Demand** — Will people want this?
- **Feasibility** — Can this be built?
- **Timing** — Is now the right moment?

Regions should feel like:
- territories on a map
- separated by rough, hand-drawn borders
- partially obscured by fog

**Regions are NOT tabs.**

### Fog of Uncertainty

Fog is a **first-class UI element**.

Rules:
- Fog obscures detail, not the entire region
- Fog clears gradually, not instantly
- Fog visually retreats when clarity increases
- Fog opacity: high (70%), medium (40%), low (10%)

Fog communicates: *"You haven't been here yet."*

### Nodes (Symbols on the Map)

Nodes are **interactive symbols**, not cards.

Symbol types:
- 🚩 Flag — Risky assumptions
- ❌ Cross — Blocked/invalidated
- ● Dot — Checkpoints
- ◆ Diamond — Completed missions
- ··· Dotted lines — Unexplored paths

Each node:
- is clickable
- opens a contextual side panel
- represents one thinking unit
- can be user-created or system-generated

**Nodes must feel placed, not auto-generated.**

---

## Interaction Model

### Click = Focus, Not Navigation

Clicking a map element:
- does **NOT** navigate away
- does **NOT** reload the page
- **opens a contextual side panel**

The map **remains visible at all times**.

### Editable World

Users must be able to:
- add a node (new assumption, checkpoint, idea)
- delete a node
- rename a node
- mark a node as irrelevant
- connect nodes manually (draw a path)
- drag nodes to reposition

**This is their map, not the system's.**

The system suggests. The user decides.

### Multiple Paths Are Allowed

The map must support:
- branching paths
- abandoned routes
- parallel explorations

**Dead ends are not errors — they are learning.**

---

## Panels & Overlays

### Side Panel (Primary)

Used for:
- node details
- mission description
- logs and evidence
- editing

Rules:
- slides in from the side
- map remains visible and interactive
- closing panel never loses state

### Modals (Use Sparingly)

Only for:
- destructive actions (delete)
- saving/exporting
- critical confirmations

**No modal should be used for reading.**

---

## Text & Typography

### Tone
- calm
- neutral
- factual
- exploratory

**No hype. No "startup speak". No emojis in core UI.**

### Typography Rules
- Serif or humanist typeface (fits map metaphor)
- Clear hierarchy
- Short labels
- Handwritten-style font for annotations only

---

## System vs User Content

### Visual Differentiation

**System-generated:**
- default nodes
- suggested missions
- initial structure
- solid lines, standard opacity

**User-generated:**
- annotations
- custom nodes
- edited paths
- slightly different ink color or line style

---

## Evolution Over Time

The map should **visibly age**:
- more ink marks
- fewer fog areas
- more crossings and notes
- accumulated annotations

The UI must communicate: *"This map has history."*

---

## What This UI Must NOT Become

❌ A dashboard with charts
❌ A productivity tool aesthetic
❌ A generic SaaS interface
❌ A game with gamification badges
❌ Something that looks AI-generated

**This is cartography, not productivity tooling.**

---

## Success Criteria (UX)

A successful UI means:
- users explore without instructions
- users feel ownership
- users remember where they've been
- users understand why something is unclear

**If the map feels like a living artifact, the UI succeeded.**

---

## FINAL RULE

**The map is not a visualization of data.
It is a representation of thinking.**

**The system must always prioritize learning over being right.**

Design accordingly.
