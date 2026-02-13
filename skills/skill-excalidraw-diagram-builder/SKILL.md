---
name: generating-excalidraw-architecture-diagrams
description: Creates and updates Excalidraw diagrams representing application architecture by analyzing codebases, identifying components, services, and their relationships. Use when users request architecture visualization, system diagrams, or need to document application structure visually.
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - Edit
  - AskUserQuestion
  - Task
---

# Generating Excalidraw Architecture Diagrams

This skill creates and updates Excalidraw diagrams that visualize application architecture. It analyzes codebases to identify components, services, data flows, and relationships.

## Workflows

This skill supports two primary workflows:
1. **Create**: Generate a new architecture diagram from codebase analysis
2. **Update**: Modify an existing Excalidraw diagram to reflect current codebase state

## Workflow Structure

The skill follows a phased approach with Stages and Steps:

```
Phase 1: Discovering and Clarifying
├── Stage 1.1: Determining User Intent
└── Stage 1.2: Defining Scope

Phase 2: Analyzing Architecture
├── Stage 2.1: Exploring Codebase
├── Stage 2.2: Identifying Components
└── Stage 2.3: Mapping Relationships

Phase 3: Generating Diagram
├── Stage 3.1: Planning Structure
├── Stage 3.2: Creating Diagram
└── Stage 3.3: Applying Styling

Phase 4: Validating and Refining
├── Stage 4.1: Validating Diagram
├── Stage 4.2: Reviewing with User
└── Stage 4.3: Iterating on Feedback
```

---

## Phase 1: Discovering and Clarifying

Establish user intent and scope through interactive questions.

**Stage 1.1**: [Determining User Intent](references/phase-1-discovery/stage-1.1-determine-intent.md)
- Ask user to choose Create or Update workflow
- For Update workflow, locate existing `.excalidraw` file

**Stage 1.2**: [Defining Scope](references/phase-1-discovery/stage-1.2-scope-definition.md)
- Define architecture scope (full system, subsystem, data flow, integration)
- Set detail level (high-level, detailed, comprehensive)
- Gather additional context about focus areas

---

## Phase 2: Analyzing Architecture

Use agent-driven exploration with tools and subagents to analyze the codebase.

**Stage 2.1**: [Exploring Codebase](references/phase-2-analysis/stage-2.1-codebase-exploration.md)
- Use `Glob`, `Grep`, and `Read` to identify project structure
- Spawn `Explore` subagents for thorough directory analysis
- Detect architecture style and technology stack

**Stage 2.2**: [Identifying Components](references/phase-2-analysis/stage-2.2-component-identification.md)
- Use subagents to find services, modules, and applications
- Search for database, cache, and storage configurations
- Identify external integrations and message systems

**Stage 2.3**: [Mapping Relationships](references/phase-2-analysis/stage-2.3-relationship-mapping.md)
- Trace dependencies through imports and configurations
- Use subagents to map service communication patterns
- Build connection inventory from discovered relationships

---

## Phase 3: Generating Diagram

Create or update the Excalidraw diagram file.

**Stage 3.1**: [Planning Structure](references/phase-3-generation/stage-3.1-structure-planning.md)
- Choose layout strategy (hierarchical, grid, grouped)
- Assign components to layers
- Plan connection routing

**Stage 3.2**: [Creating Diagram](references/phase-3-generation/stage-3.2-diagram-creation.md)
- Execute `scripts/generate-diagram.js` (Create workflow)
- Execute `scripts/update-diagram.js` (Update workflow)
- Validate generated file structure

**Stage 3.3**: [Applying Styling](references/phase-3-generation/stage-3.3-styling-application.md)
- Apply component type colors and shapes
- Style connections by communication pattern
- Format labels consistently

---

## Phase 4: Validating and Refining

Verify and iterate on the diagram with user feedback.

**Stage 4.1**: [Validating Diagram](references/phase-4-validation/stage-4.1-diagram-validation.md)
- Verify all components are represented
- Check connection completeness
- Identify visual issues

**Stage 4.2**: [Reviewing with User](references/phase-4-validation/stage-4.2-user-review.md)
- Present diagram summary
- Request user feedback using `AskUserQuestion`
- Document requested changes

**Stage 4.3**: [Iterating on Feedback](references/phase-4-validation/stage-4.3-iteration.md)
- Apply user-requested changes
- Regenerate diagram
- Return to Stage 4.2 for approval

---

## Quick Reference

### Component Types and Styles

| Type | Color | Shape |
|------|-------|-------|
| Service | Blue `#a5d8ff` | Rounded rectangle |
| Frontend | Purple `#d0bfff` | Rounded rectangle |
| Database | Green `#d3f9d8` | Ellipse |
| Cache | Red `#ffc9c9` | Diamond |
| Queue | Violet `#eebefa` | Rectangle |
| External | Yellow `#fff3bf` | Dashed rectangle |

### Connection Types

| Type | Style | Use Case |
|------|-------|----------|
| Sync | Solid arrow | HTTP, gRPC, direct calls |
| Async | Dashed arrow | Message queue, events |
| Data | Dotted arrow | ETL, data pipelines |

### Scripts

```bash
# Generate new diagram
node scripts/generate-diagram.js --config <config.json> --output <diagram.excalidraw>

# Update existing diagram
node scripts/update-diagram.js --existing <current.excalidraw> --config <config.json> --output <updated.excalidraw>
```

### Exploration Tools

Phase 2 uses agent-driven exploration rather than scripts:

| Tool | Purpose |
|------|---------|
| `Glob` | Find files by pattern (e.g., `**/*.config.js`) |
| `Grep` | Search file contents for patterns |
| `Read` | Read and analyze file contents |
| `Task` (Explore) | Spawn subagents for thorough codebase exploration |

---

## Supporting Documentation

- [REFERENCE.md](REFERENCE.md) - Excalidraw JSON schema and script API
- [EXAMPLES.md](EXAMPLES.md) - Example configurations for common architectures
