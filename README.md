# ShipX - AI-Guided Uncertainty Map

Turn messy startup ideas into structured validation journeys. ShipX helps founders map their idea's blind spots and validate before they build.

## Features

- **Personalized Experience**: Enter your name and get a customized journey
- **Guided Input**: 3 focused questions to capture your idea
- **AI-Powered Analysis**: Extracts structure, classifies uncertainty, proposes missions
- **Uncertainty Map**: Visual representation of Demand, Feasibility, and Timing clarity
- **Validation Missions**: 7 approved mission templates with clear success/failure signals
- **Learning Timeline**: Track your validation journey over time
- **Email Waitlist**: Save your progress and get notified when the full app launches

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ShipX
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```
OPENAI_API_KEY=sk-your-api-key-here
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (GPT-4o)
- **Validation**: Ajv for JSON schema validation
- **State**: React Context + localStorage persistence

## Project Structure

```
src/
  app/                    # Next.js app router pages
    page.tsx              # Welcome screen (name capture)
    input/page.tsx        # Guided input flow
    map/page.tsx          # Uncertainty map view
    mission/page.tsx      # Mission + logging
    api/
      ai/route.ts         # OpenAI API proxy
      waitlist/route.ts   # Email waitlist signup
  lib/                    # Core data layer
    types.ts              # TypeScript types
    jsonSchemas.ts        # JSON schemas for validation
    mapModel.ts           # Map types
    mapFactory.ts         # Create default map
    mapProgress.ts        # Apply mission outcomes
    db.ts                 # Local JSON file storage
  ai/                     # AI integration
    client.ts             # OpenAI wrapper
    prompts.ts            # System/user prompts
  components/             # UI components
  context/                # State management
data/
  waitlist.json           # Stored waitlist signups
docs/
  knowledge-base.md       # AI behavior rules
  schemas.md              # Data schemas
  ai-prompts.md           # AI prompt templates
  map-ui-model.md         # Map data model
```

## Validation Missions

ShipX supports 7 approved validation mission types:

### Demand Missions
- **Problem Interview**: Validate that the problem exists and matters
- **Willingness-to-Act Test**: Test real intent to act
- **Fake Door Test**: Measure demand before building

### Feasibility Missions
- **Technical / Operational Spike**: Test hardest feasibility assumption
- **Expert Reality Check**: Validate feasibility through expertise

### Timing / Distribution Missions
- **Channel Constraint Test**: Test distribution realism
- **Substitute Analysis**: Understand replacement behavior

## License

MIT
