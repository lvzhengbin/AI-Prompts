# Determining User Intent Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Asking Workflow Type](#01--asking-workflow-type)
  - [02 / Locating Existing Diagram (Update Workflow Only)](#02--locating-existing-diagram-update-workflow-only)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference establishes the primary workflow direction by understanding what the user wants to accomplish with their architecture diagram. It determines whether the user needs to create a new diagram from scratch or update an existing Excalidraw file to reflect current codebase changes.

## Input Validation Criteria

Since this is the first step in the workflow, you **MUST** assume no prior inputs are available. The user must provide all necessary information during this step. You **MAY** use prior contextual information about the user's codebase or previous requests to inform suggested answers, but you **MUST** explicitly confirm the workflow choice with the user by following the step instructions below.

## Step Instructions

### 01 / Asking Workflow Type

You **MUST** use the `AskUserQuestion` tool to determine which workflow the user needs.

**Question Set 1: Workflow Selection**
- **Question 1: Workflow Type**
  - Header: "Workflow"
  - Question: "What would you like to do with your architecture diagram?"
  - Options:
    - "Create New" - "Generate a new architecture diagram by analyzing the codebase"
    - "Update Existing" - "Modify an existing Excalidraw diagram to match current code"
  - MultiSelect: false

### 02 / Locating Existing Diagram (Update Workflow Only)

If the user selected the **Update** workflow, you **MUST** locate the existing diagram file.

**Step 2a: Ask for Known Path**

You **SHOULD** first ask if the user knows the path to their existing `.excalidraw` file:

**Question Set 2: Diagram Location**
- **Question 1: Diagram Path**
  - Header: "Diagram"
  - Question: "Do you know the path to your existing .excalidraw file?"
  - Options:
    - "Yes, I'll provide the path" - "I know where my diagram file is located"
    - "No, search for it" - "Search the codebase for .excalidraw files"
  - MultiSelect: false

**Step 2b: Search for Diagrams (if path unknown)**

If the user does not know the path, you **MUST** search for Excalidraw files:

```bash
find . -name "*.excalidraw" -type f 2>/dev/null
```

**Step 2c: Present Found Files**

If multiple files are found, you **MUST** present them using `AskUserQuestion`:

**Question Set 3: File Selection**
- **Question 1: Select Diagram**
  - Header: "Select"
  - Question: "Which diagram would you like to update?"
  - Options: Dynamically generated from search results
  - MultiSelect: false

**Step 2d: Validate Selected File**

You **MUST** validate the selected file before proceeding:

1. Verify the file exists and is readable
2. Parse the file as JSON
3. Confirm it contains `"type": "excalidraw"` at the root level
4. If validation fails, inform the user and request an alternative path

## Output Validation Criteria

### Output Format

The output of this step is structured JSON that **MUST** be stored internally for use by subsequent steps.

### Output Content

The output **MUST** include the following properties:

```json
{
  "workflow_type": "create | update",
  "existing_diagram_path": "path/to/diagram.excalidraw"
}
```

| Property | Required | Description |
|----------|----------|-------------|
| `workflow_type` | Yes | Either `"create"` or `"update"` |
| `existing_diagram_path` | Conditional | Required if `workflow_type` is `"update"`. Path to the validated `.excalidraw` file. |

### Validation Process

Before proceeding to the next step, you **MUST** verify:

1. **Workflow Type Confirmed**: The user has explicitly selected either "Create" or "Update"
2. **Path Validation (Update only)**: If update workflow:
   - The file path exists
   - The file is valid JSON
   - The file contains `"type": "excalidraw"`
3. **User Confirmation**: The user has confirmed the selected option(s)

If validation fails, you **MUST** inform the user of the specific issue and request corrected input before proceeding.

### Internal Use

Use this validated output internally to determine the workflow path. Proceed to [Stage 1.2: Defining Scope](./stage-1.2-scope-definition.md).
