# Creating Diagram Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Executing Diagram Generation (Create Workflow)](#01--executing-diagram-generation-create-workflow)
  - [02 / Executing Diagram Update (Update Workflow)](#02--executing-diagram-update-update-workflow)
  - [03 / Creating Elements Manually (Alternative)](#03--creating-elements-manually-alternative)
  - [04 / Validating Generated File](#04--validating-generated-file)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference generates or updates the actual Excalidraw diagram file. It executes the appropriate script based on the workflow type (create or update) and produces a valid `.excalidraw` file.

## Input Validation Criteria

This step requires validated output from [Stage 3.1: Planning Structure](./stage-3.1-structure-planning.md).

You **MUST** verify the following inputs before proceeding:

| Input | Required | Validation |
|-------|----------|------------|
| `config_file_path` | Yes | Path to valid architecture configuration JSON |
| `workflow_type` | Yes | `"create"` or `"update"` |
| `existing_diagram_path` | Conditional | Required if `workflow_type` is `"update"` |
| Configuration JSON | Yes | Valid JSON with components and connections |

**Pre-execution Validation**:

```bash
# Verify configuration file exists
ls -la /tmp/architecture-config.json

# Verify JSON is valid
node -e "JSON.parse(require('fs').readFileSync('/tmp/architecture-config.json'))"
```

If input validation fails, you **MUST** return to Stage 3.1 to correct the configuration.

## Step Instructions

### 01 / Executing Diagram Generation (Create Workflow)

If `workflow_type` is `"create"`, you **MUST** run the generation script.

**Step 1a: Execute Generation Script**

```bash
node scripts/generate-diagram.js \
  --config /tmp/architecture-config.json \
  --output <output-path>.excalidraw
```

**Script Parameters**:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `--config` | Yes | Path to architecture configuration JSON |
| `--output` | Yes | Output path for .excalidraw file |
| `--layout` | No | Override layout type (hierarchical, grid) |
| `--style` | No | Style preset (default, minimal, detailed) |

**Step 1b: Verify Expected Output**

The script **SHOULD** produce output similar to:

```
Generating architecture diagram...
  Components: 8
  Connections: 12
  Layout: hierarchical

Diagram generated successfully: ./architecture.excalidraw
  Total elements: 32
```

**Step 1c: Handle Generation Errors**

If the script fails:
1. Check the error message for specific issues
2. Verify the configuration JSON is valid
3. Ensure all required dependencies are available
4. Fall back to manual element creation if necessary

### 02 / Executing Diagram Update (Update Workflow)

If `workflow_type` is `"update"`, you **MUST** run the update script.

**Step 2a: Execute Update Script**

```bash
node scripts/update-diagram.js \
  --existing <existing-diagram>.excalidraw \
  --config /tmp/architecture-config.json \
  --output <output-path>.excalidraw \
  --preserve-layout true \
  --merge-strategy update-existing
```

**Script Parameters**:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `--existing` | Yes | Path to existing .excalidraw file |
| `--config` | Yes | Path to updated configuration JSON |
| `--output` | Yes | Output path for updated file |
| `--preserve-layout` | No | Keep existing element positions (default: true) |
| `--merge-strategy` | No | How to handle differences |

**Merge Strategies**:

| Strategy | Behavior |
|----------|----------|
| `add-only` | Only add new components, never remove existing ones |
| `full-sync` | Match diagram exactly to config (add new, remove missing) |
| `update-existing` | Update existing components, add new ones, but don't remove |

**Step 2b: Verify Expected Output**

```
Updating architecture diagram...
  Existing elements: 24
  Config components: 10
  Config connections: 15
  Merge strategy: update-existing
  Preserve layout: true

  Updating: User Service
  Adding: Payment Service
  Adding: Notification Service

Diagram updated successfully: ./updated-architecture.excalidraw
  Total elements: 38
```

### 03 / Creating Elements Manually (Alternative)

If scripts are unavailable, you **MAY** create elements manually using the `Write` tool.

**Step 3a: Create Rectangle (Service)**

```json
{
  "id": "service-001",
  "type": "rectangle",
  "x": 100,
  "y": 100,
  "width": 160,
  "height": 80,
  "strokeColor": "#339af0",
  "backgroundColor": "#a5d8ff",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "roundness": { "type": 3 },
  "seed": 12345,
  "version": 1,
  "versionNonce": 67890,
  "isDeleted": false,
  "groupIds": [],
  "boundElements": []
}
```

**Step 3b: Create Ellipse (Database)**

```json
{
  "id": "db-001",
  "type": "ellipse",
  "x": 100,
  "y": 300,
  "width": 160,
  "height": 80,
  "strokeColor": "#40c057",
  "backgroundColor": "#d3f9d8",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "roughness": 1
}
```

**Step 3c: Create Arrow (Connection)**

```json
{
  "id": "arrow-001",
  "type": "arrow",
  "x": 180,
  "y": 180,
  "width": 0,
  "height": 120,
  "points": [[0, 0], [0, 120]],
  "startBinding": { "elementId": "service-001", "focus": 0, "gap": 5 },
  "endBinding": { "elementId": "db-001", "focus": 0, "gap": 5 },
  "startArrowhead": null,
  "endArrowhead": "arrow",
  "strokeStyle": "solid",
  "strokeWidth": 2
}
```

**Step 3d: Create Text Label**

```json
{
  "id": "label-001",
  "type": "text",
  "x": 130,
  "y": 130,
  "width": 100,
  "height": 24,
  "text": "API Server",
  "fontSize": 16,
  "fontFamily": 1,
  "textAlign": "center",
  "verticalAlign": "middle",
  "containerId": "service-001"
}
```

### 04 / Validating Generated File

You **MUST** validate the generated diagram file before proceeding.

**Step 4a: Check File Exists**

```bash
ls -la <output-path>.excalidraw
```

**Step 4b: Verify JSON Structure**

```bash
node -e "const d = JSON.parse(require('fs').readFileSync('<output-path>.excalidraw')); console.log('Type:', d.type, 'Elements:', d.elements.length)"
```

**Step 4c: Validation Checklist**

You **MUST** verify:
- [ ] File is valid JSON
- [ ] Has `"type": "excalidraw"` at root
- [ ] `elements` array is populated
- [ ] All element IDs are unique
- [ ] Arrow bindings reference existing elements

## Output Validation Criteria

### Output Format

The output of this step is a valid `.excalidraw` file on disk.

### Output Content

The generated file **MUST** conform to the Excalidraw JSON schema:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "claude-architecture-skill",
  "elements": [
    // Array of element objects
  ],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#ffffff"
  },
  "files": {}
}
```

**Required Properties**:

| Property | Required | Description |
|----------|----------|-------------|
| `type` | Yes | Must be `"excalidraw"` |
| `version` | Yes | Schema version (currently 2) |
| `elements` | Yes | Array of diagram elements |
| `appState` | Yes | Application state object |

**Element Validation**:

Each element **MUST** have:
- Unique `id`
- Valid `type` (rectangle, ellipse, diamond, arrow, text, line)
- Position (`x`, `y`)
- Dimensions (`width`, `height`)

### Validation Process

Before proceeding to the next step, you **MUST** verify:

1. **File Created**: The output file exists at the specified path
2. **Valid JSON**: The file parses as valid JSON
3. **Correct Type**: Root `type` is `"excalidraw"`
4. **Elements Present**: `elements` array contains expected components
5. **Unique IDs**: No duplicate element IDs

**Automated Validation**:

```bash
node -e "
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('<output-path>.excalidraw'));
const ids = d.elements.map(e => e.id);
const uniqueIds = new Set(ids);
console.log('Valid:', d.type === 'excalidraw');
console.log('Elements:', d.elements.length);
console.log('Unique IDs:', ids.length === uniqueIds.size);
"
```

If validation fails, you **MUST** either:
1. Regenerate the diagram with corrected configuration
2. Manually fix the generated file
3. Inform the user of the specific error

### Internal Use

Store the following for use in subsequent steps:
- `diagram_path`: Path to the generated/updated .excalidraw file
- `element_count`: Number of elements in the diagram
- `generation_log`: Summary of what was created/updated

Proceed to [Stage 3.3: Applying Styling](./stage-3.3-styling-application.md).
