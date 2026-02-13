# Reviewing with User Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Presenting Diagram Summary](#01--presenting-diagram-summary)
  - [02 / Explaining Exclusions](#02--explaining-exclusions)
  - [03 / Requesting User Feedback](#03--requesting-user-feedback)
  - [04 / Documenting Requested Changes](#04--documenting-requested-changes)
  - [05 / Confirming Completion](#05--confirming-completion)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference presents the generated diagram to the user for feedback and approval. It provides a clear summary of what was generated, explains any exclusions, and gathers structured feedback for potential iterations.

## Input Validation Criteria

This step requires validated output from [Stage 4.1: Validating Diagram](./stage-4.1-diagram-validation.md).

You **MUST** verify the following inputs before proceeding:

| Input | Required | Validation |
|-------|----------|------------|
| `diagram_path` | Yes | Path to validated .excalidraw file |
| `validation_status` | Yes | Must be `"passed"` or `"warnings"` |
| `validation_report` | Yes | Complete validation report from Stage 4.1 |
| `components` | Yes | List of components included in diagram |
| `connections` | Yes | List of connections included in diagram |

If `validation_status` is `"failed"`, you **MUST** return to the appropriate generation stage before presenting to user.

## Step Instructions

### 01 / Presenting Diagram Summary

You **MUST** provide the user with a clear summary of what was generated.

**Step 1a: Summary Template**

```markdown
## Architecture Diagram Generated

**Output File**: `[diagram_path]`

### Components Included ([count])
| Type | Name | Description |
|------|------|-------------|
| [type] | [name] | [description] |
...

### Connections ([count])
- [source] → [target] ([protocol])
...

### Layout
- Type: [layout_type] ([direction])
- Layers: [layer_count]
- Dimensions: ~[width]x[height] pixels
```

**Step 1b: Present Summary to User**

Display the summary using standard markdown output. You **SHOULD** include:
- Total component count by type
- Total connection count
- Layout information
- File location

### 02 / Explaining Exclusions

If any components were intentionally excluded, you **MUST** explain why.

**Step 2a: Common Exclusion Reasons**

| Category | Reason |
|----------|--------|
| Test files | Not part of production architecture |
| Build artifacts | Generated, not architectural |
| Documentation | Not executable components |
| Deprecated code | Marked for removal |
| Scope limitation | Outside requested focus area |

**Step 2b: Exclusion Report**

If exclusions exist, present:

```markdown
### Components Not Included
| Component | Reason |
|-----------|--------|
| [name] | [reason] |
...
```

### 03 / Requesting User Feedback

You **MUST** use `AskUserQuestion` to gather feedback.

**Step 3a: Initial Review Question**

```
AskUserQuestion:
  header: "Review"
  question: "I've generated the architecture diagram. Would you like to make any changes?"
  options:
    - label: "Looks Good"
      description: "The diagram accurately represents the architecture"
    - label: "Add Components"
      description: "I need to add missing components"
    - label: "Remove Components"
      description: "Some components should be excluded"
    - label: "Adjust Layout"
      description: "Change positioning or grouping"
    - label: "Other Changes"
      description: "I have specific modifications"
```

**Step 3b: Follow-up Questions**

Based on the user's response, you **MUST** ask appropriate follow-up questions.

**If "Add Components"**:
```
AskUserQuestion:
  header: "Add"
  question: "What components should be added?"
  options:
    - label: "Specify manually"
      description: "I'll describe the components to add"
    - label: "Re-analyze"
      description: "Search for more components in the codebase"
```

**If "Remove Components"**:
```
AskUserQuestion:
  header: "Remove"
  question: "Which components should be removed?"
  options:
    - label: "Specify by name"
      description: "I'll tell you which components to remove"
    - label: "Show me the list"
      description: "Show me all components so I can choose"
```

**If "Adjust Layout"**:
```
AskUserQuestion:
  header: "Layout"
  question: "What layout changes do you need?"
  options:
    - label: "Reposition components"
      description: "Move specific components"
    - label: "Change direction"
      description: "Switch between top-down and left-right"
    - label: "Add grouping"
      description: "Group related components together"
    - label: "Increase spacing"
      description: "Add more space between elements"
```

### 04 / Documenting Requested Changes

You **MUST** record all user feedback for the iteration phase.

**Step 4a: Change Record Structure**

```json
{
  "feedback": {
    "status": "changes_requested",
    "changes": [
      {
        "type": "add_component",
        "details": {
          "id": "component-id",
          "type": "database",
          "name": "Component Name",
          "connects_to": ["other-service"]
        }
      },
      {
        "type": "remove_component",
        "details": {
          "id": "component-to-remove"
        }
      },
      {
        "type": "adjust_position",
        "details": {
          "component": "component-id",
          "action": "move_right"
        }
      },
      {
        "type": "add_label",
        "details": {
          "connection": "connection-id",
          "label": "Label Text"
        }
      }
    ]
  }
}
```

**Step 4b: Change Types**

| Type | Description |
|------|-------------|
| `add_component` | Add a new component to the diagram |
| `remove_component` | Remove an existing component |
| `modify_component` | Change a component's properties |
| `add_connection` | Add a new connection between components |
| `remove_connection` | Remove an existing connection |
| `adjust_position` | Move a component's position |
| `change_layout` | Change the overall layout type |
| `add_group` | Group components together |
| `add_label` | Add or modify a label |
| `change_style` | Modify colors or visual style |

### 05 / Confirming Completion

If user approves the diagram, you **MUST** provide completion confirmation.

**Step 5a: Completion Message**

```markdown
## Diagram Complete

Your architecture diagram has been saved to:
`[diagram_path]`

### How to Open
1. Visit [excalidraw.com](https://excalidraw.com)
2. Click "Open" in the menu
3. Select the `.excalidraw` file

### Editing Tips
- Drag components to reposition
- Double-click to edit labels
- Use arrow tool to add connections
- Export as PNG/SVG for documentation

### Keeping It Updated
Run the update workflow when your architecture changes:
"Update my architecture diagram to reflect recent changes"
```

## Output Validation Criteria

### Output Format

The output of this step is a structured feedback record and completion status.

### Output Content

The output **MUST** include:

```json
{
  "user_approval": true,
  "requested_changes": [],
  "feedback_notes": "",
  "completion_status": "approved"
}
```

Or if changes were requested:

```json
{
  "user_approval": false,
  "requested_changes": [
    {
      "type": "change_type",
      "details": {}
    }
  ],
  "feedback_notes": "User comments",
  "completion_status": "changes_pending"
}
```

**Completion Status Values**:

| Status | Meaning | Next Action |
|--------|---------|-------------|
| `approved` | User accepted the diagram | Workflow complete |
| `changes_pending` | User requested modifications | Proceed to Stage 4.3 |

### Validation Process

Before proceeding, you **MUST** verify:

1. **User Response Captured**: User provided explicit approval or change request
2. **Changes Documented**: If changes requested, all changes are recorded with sufficient detail
3. **No Ambiguity**: Change requests are specific enough to implement

**Validation Failure Handling**:

| Issue | Resolution |
|-------|------------|
| Unclear feedback | Ask clarifying follow-up questions |
| Missing details | Request specific component/connection names |
| Conflicting requests | Ask user to clarify priority |

### Internal Use

If `completion_status` is `"approved"`, the workflow is complete.

If `completion_status` is `"changes_pending"`, proceed to [Stage 4.3: Iterating on Feedback](./stage-4.3-iteration.md) with the documented changes.
