# Excalidraw Architecture Diagram Skill

A Claude Skill for generating and updating Excalidraw diagrams that visualize application architecture. This skill analyzes codebases to identify components, services, data flows, and relationships, then generates structured architecture diagrams.

## Features

- **Create Workflow**: Generate new architecture diagrams from codebase analysis
- **Update Workflow**: Modify existing Excalidraw diagrams to reflect current codebase state
- **Interactive Discovery**: Uses `AskUserQuestion` to clarify requirements and scope
- **Automatic Detection**: Identifies services, databases, caches, queues, and external integrations
- **Multiple Architecture Patterns**: Supports microservices, monolith, serverless, and event-driven architectures

## Directory Structure

```
.
├── SKILL.md              # Main skill definition (lean, references stages)
├── REFERENCE.md          # Technical reference for Excalidraw JSON schema
├── EXAMPLES.md           # Example configurations for common architectures
├── references/           # Detailed stage and step instructions
│   ├── phase-1-discovery/
│   │   ├── stage-1.1-determine-intent.md
│   │   └── stage-1.2-scope-definition.md
│   ├── phase-2-analysis/
│   │   ├── stage-2.1-codebase-exploration.md
│   │   ├── stage-2.2-component-identification.md
│   │   └── stage-2.3-relationship-mapping.md
│   ├── phase-3-generation/
│   │   ├── stage-3.1-structure-planning.md
│   │   ├── stage-3.2-diagram-creation.md
│   │   └── stage-3.3-styling-application.md
│   └── phase-4-validation/
│       ├── stage-4.1-diagram-validation.md
│       ├── stage-4.2-user-review.md
│       └── stage-4.3-iteration.md
├── scripts/
│   ├── generate-diagram.js    # Generate new diagrams from config
│   ├── update-diagram.js      # Update existing diagrams
│   └── parse-architecture.js  # Analyze codebase to generate config
└── templates/
    └── base-architecture.excalidraw  # Template diagram file
```

## Usage

### Installation

Copy this skill directory to your Claude skills location:
- **Claude Desktop**: `~/.claude/skills/`
- **Claude Code**: Project's `.claude/skills/` directory

### Invoking the Skill

The skill is automatically invoked when users request architecture diagrams:

```
"Create an architecture diagram for this project"
"Update my architecture diagram to reflect recent changes"
"Generate an Excalidraw diagram showing our microservices"
```

### Workflow Overview

#### Phase 1: Discovery and Clarification
- Determine whether to create or update a diagram
- Define scope (full system, subsystem, data flow, integration)
- Set detail level (high-level, detailed, comprehensive)

#### Phase 2: Architecture Analysis
- Explore codebase structure
- Identify components, services, and modules
- Map data stores, queues, and external services
- Trace dependencies and data flows

#### Phase 3: Diagram Generation
- Plan component layout
- Create or update Excalidraw elements
- Apply consistent styling by component type

#### Phase 4: Validation and Refinement
- Verify diagram completeness
- Present to user for review
- Iterate based on feedback

## Scripts

### generate-diagram.js

Generates a new Excalidraw diagram from configuration:

```bash
node scripts/generate-diagram.js \
  --config architecture-config.json \
  --output architecture.excalidraw
```

### update-diagram.js

Updates an existing diagram with new components:

```bash
node scripts/update-diagram.js \
  --existing current.excalidraw \
  --config updated-config.json \
  --output updated.excalidraw \
  --merge-strategy update-existing
```

Merge strategies:
- `add-only`: Only add new components
- `full-sync`: Match diagram exactly to config
- `update-existing`: Update existing, add new, but don't remove

### parse-architecture.js

Analyzes a codebase to generate architecture configuration:

```bash
node scripts/parse-architecture.js \
  --root /path/to/project \
  --output architecture-config.json \
  --depth medium
```

Depth options:
- `shallow`: Basic project structure only
- `medium`: Include data stores and queues
- `deep`: Include external service integrations

## Configuration Format

```json
{
  "metadata": {
    "title": "System Architecture",
    "description": "Overview of the application"
  },
  "layout": {
    "type": "hierarchical",
    "direction": "top-down",
    "spacing": { "horizontal": 250, "vertical": 150 }
  },
  "components": [
    {
      "id": "api",
      "type": "service",
      "name": "API Server",
      "layer": 0,
      "position": 0
    }
  ],
  "connections": [
    {
      "from": "frontend",
      "to": "api",
      "type": "sync",
      "label": "HTTP"
    }
  ]
}
```

## Component Types

| Type | Shape | Description |
|------|-------|-------------|
| `service` | Rectangle (rounded) | Backend services, APIs |
| `frontend` | Rectangle (rounded) | Client applications |
| `database` | Ellipse | Data storage |
| `cache` | Diamond | Caching layers |
| `queue` | Rectangle | Message queues |
| `external` | Rectangle (dashed) | Third-party services |
| `gateway` | Rectangle (rounded) | API gateways, load balancers |
| `storage` | Rectangle | File/blob storage |

## Connection Types

| Type | Style | Description |
|------|-------|-------------|
| `sync` | Solid arrow | Synchronous calls |
| `async` | Dashed arrow | Asynchronous messages |
| `data` | Dotted arrow | Data flow |
| `event` | Dashed with triangle | Event-driven |

## License

MIT
