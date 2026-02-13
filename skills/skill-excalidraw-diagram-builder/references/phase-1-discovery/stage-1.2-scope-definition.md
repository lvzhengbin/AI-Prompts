# Defining Scope Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Defining Architecture Scope](#01--defining-architecture-scope)
  - [02 / Setting Detail Level](#02--setting-detail-level)
  - [03 / Gathering Additional Context](#03--gathering-additional-context)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference defines the boundaries and detail level of the architecture diagram. It ensures the generated diagram matches the user's expectations by clarifying scope, granularity, and any specific areas of focus or exclusion.

## Input Validation Criteria

This step requires validated output from [Stage 1.1: Determining User Intent](./stage-1.1-determine-intent.md).

You **MUST** verify the following inputs before proceeding:

| Input | Required | Validation |
|-------|----------|------------|
| `workflow_type` | Yes | Must be either `"create"` or `"update"` |
| `existing_diagram_path` | Conditional | Required if `workflow_type` is `"update"`. File must exist and be valid Excalidraw JSON. |

If input validation fails, you **MUST** return to Stage 1.1 to collect the missing or invalid information.

## Step Instructions

### 01 / Defining Architecture Scope

You **MUST** use the `AskUserQuestion` tool to determine what part of the architecture to diagram.

**Question Set 1: Scope Selection**
- **Question 1: Architecture Scope**
  - Header: "Scope"
  - Question: "What scope should the architecture diagram cover?"
  - Options:
    - "Full System" - "Complete architecture with all components, services, databases, and integrations"
    - "Subsystem" - "Specific module, feature area, or bounded context"
    - "Data Flow" - "Focus on how data moves through the system"
    - "Integration" - "External services, APIs, and third-party connections"
  - MultiSelect: false

**Conditional Follow-up for Subsystem**:

If the user selects "Subsystem", you **MUST** ask a follow-up question:

**Question Set 2: Subsystem Details**
- **Question 1: Subsystem Specification**
  - Header: "Subsystem"
  - Question: "Which subsystem or module would you like to focus on?"
  - Options: Options **SHOULD** be intelligently generated based on detected directories in the codebase (e.g., `services/`, `packages/`, `modules/`). If unable to detect, allow free-form input.
  - MultiSelect: false

### 02 / Setting Detail Level

You **MUST** use the `AskUserQuestion` tool to determine diagram granularity.

**Question Set 3: Detail Level**
- **Question 1: Diagram Detail**
  - Header: "Detail"
  - Question: "How detailed should the diagram be?"
  - Options:
    - "High-Level" - "Major components and primary connections only. Best for executive presentations."
    - "Detailed" - "Include internal structure, data models, and secondary connections. Best for technical documentation."
    - "Comprehensive" - "Full system with all relationships, annotations, and configuration details. Best for onboarding."
  - MultiSelect: false

### 03 / Gathering Additional Context

You **SHOULD** ask clarifying questions to refine the diagram scope.

**Question Set 4: Focus Areas**
- **Question 1: Entry Points**
  - Header: "Focus"
  - Question: "Are there specific directories or files I should focus on?"
  - Options:
    - "Auto-detect" - "Analyze the codebase structure automatically"
    - "Specify paths" - "I'll provide specific directories to analyze"
  - MultiSelect: false

**Conditional Follow-up for Specify Paths**:

If the user selects "Specify paths", you **MUST** request the specific paths via free-form input or follow-up questions.

**Question Set 5: Exclusions (Optional)**
- **Question 1: Exclusion Patterns**
  - Header: "Exclude"
  - Question: "Are there any directories or patterns to exclude from analysis?"
  - Options:
    - "Use defaults" - "Exclude node_modules, dist, build, .git, coverage, __pycache__"
    - "Specify exclusions" - "I'll provide specific patterns to exclude"
    - "Include everything" - "Don't exclude anything beyond standard ignores"
  - MultiSelect: false

**Question Set 6: Naming Conventions (Optional)**
- **Question 1: Naming Patterns**
  - Header: "Naming"
  - Question: "Does your codebase use specific naming conventions I should know about?"
  - Options:
    - "Auto-detect" - "Infer naming patterns from the codebase"
    - "Specify patterns" - "I'll describe the naming conventions used"
  - MultiSelect: false

## Output Validation Criteria

### Output Format

The output of this step is structured JSON that **MUST** be merged with the output from Stage 1.1.

### Output Content

The output **MUST** include the following properties:

```json
{
  "workflow_type": "create | update",
  "existing_diagram_path": "path/to/diagram.excalidraw",
  "scope": "full-system | subsystem | data-flow | integration",
  "subsystem_path": "path/to/subsystem",
  "detail_level": "high-level | detailed | comprehensive",
  "focus_paths": ["path1", "path2"],
  "exclude_patterns": ["pattern1", "pattern2"],
  "naming_conventions": {
    "services": "*-service",
    "modules": "*-module"
  }
}
```

| Property | Required | Description |
|----------|----------|-------------|
| `scope` | Yes | One of: `"full-system"`, `"subsystem"`, `"data-flow"`, `"integration"` |
| `subsystem_path` | Conditional | Required if `scope` is `"subsystem"`. Path to the specific subsystem. |
| `detail_level` | Yes | One of: `"high-level"`, `"detailed"`, `"comprehensive"` |
| `focus_paths` | No | Array of directory paths to prioritize in analysis. Empty array if auto-detect. |
| `exclude_patterns` | No | Array of glob patterns to exclude. Defaults to standard exclusions if not specified. |
| `naming_conventions` | No | Object describing naming patterns. Null if auto-detect. |

### Validation Process

Before proceeding to the next phase, you **MUST** verify:

1. **Scope Defined**: A valid scope has been selected
2. **Subsystem Specified**: If scope is "subsystem", the subsystem path is provided
3. **Detail Level Set**: A valid detail level has been selected
4. **User Confirmation**: Summarize the selected options and confirm with the user

You **SHOULD** present a summary to the user for confirmation:

```markdown
## Scope Confirmation

- **Scope**: Full System
- **Detail Level**: Detailed
- **Focus**: Auto-detect
- **Exclusions**: Default patterns (node_modules, dist, build, etc.)

Does this look correct?
```

If the user requests changes, you **MUST** return to the relevant question set to collect updated information.

### Internal Use

Use this validated output internally to configure the architecture analysis in Phase 2. Proceed to [Stage 2.1: Exploring Codebase](../phase-2-analysis/stage-2.1-codebase-exploration.md).
