# Planning Structure Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Defining Component Layout Strategy](#01--defining-component-layout-strategy)
  - [02 / Assigning Component Layers](#02--assigning-component-layers)
  - [03 / Planning Connection Routing](#03--planning-connection-routing)
  - [04 / Building Architecture Configuration](#04--building-architecture-configuration)
  - [05 / Writing Configuration File](#05--writing-configuration-file)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference plans the visual layout and organization of the architecture diagram before generation. It transforms the component and connection inventories from Phase 2 into a structured configuration file suitable for diagram generation scripts.

## Input Validation Criteria

This step requires validated output from Phase 2 (Architecture Analysis).

You **MUST** verify the following inputs before proceeding:

| Input | Required | Validation |
|-------|----------|------------|
| `components` | Yes | Non-empty array of component objects with unique IDs |
| `connections` | Yes | Array of connection objects (may be empty) |
| Each component `id` | Yes | Unique string identifier |
| Each component `type` | Yes | Valid component type |
| Each connection `from` | Yes | References existing component ID |
| Each connection `to` | Yes | References existing component ID |

If input validation fails, you **MUST** return to the appropriate Phase 2 step to complete the analysis.

## Step Instructions

### 01 / Defining Component Layout Strategy

You **MUST** select a layout strategy based on the detected architecture style.

**Layout Options**:

| Layout Type | Best For | Description |
|-------------|----------|-------------|
| `hierarchical` | Layered architectures, request flows | Top-to-bottom or left-to-right arrangement |
| `grid` | Microservices with peer relationships | Components in rows/columns |
| `grouped` | Domain-driven designs | Components clustered by domain |

**Step 1a: Select Layout Type**

You **SHOULD** use `hierarchical` layout for most cases. Select based on architecture style:

| Architecture Style | Recommended Layout |
|-------------------|-------------------|
| Monolith | `hierarchical` (top-down) |
| Microservices | `hierarchical` or `grid` |
| Serverless | `hierarchical` (left-right) |
| Event-driven | `hierarchical` (top-down) |

**Step 1b: Configure Layout Parameters**

```json
{
  "layout": {
    "type": "hierarchical",
    "direction": "top-down",
    "spacing": {
      "horizontal": 250,
      "vertical": 150
    },
    "padding": 50
  }
}
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `type` | `hierarchical` | Layout algorithm |
| `direction` | `top-down` | Flow direction (`top-down` or `left-right`) |
| `spacing.horizontal` | `250` | Horizontal space between components (pixels) |
| `spacing.vertical` | `150` | Vertical space between layers (pixels) |
| `padding` | `50` | Canvas edge padding (pixels) |

### 02 / Assigning Component Layers

You **MUST** assign each component to a logical layer based on its type.

**Layer Assignment Table**:

| Layer | Component Types | Position |
|-------|----------------|----------|
| 0 | `frontend`, `client` | Top |
| 1 | `gateway`, `loadbalancer` | Upper |
| 2 | `service`, `worker`, `api`, `external` | Middle |
| 3 | `database`, `cache`, `queue`, `storage` | Bottom |

**Step 2a: Apply Layer Assignment**

For each component, you **MUST** add `layer` and `position` properties:

```javascript
function assignLayer(componentType) {
  const layerMap = {
    'frontend': 0, 'client': 0,
    'gateway': 1, 'loadbalancer': 1,
    'service': 2, 'worker': 2, 'api': 2, 'external': 2,
    'database': 3, 'cache': 3, 'queue': 3, 'storage': 3
  };
  return layerMap[componentType] ?? 2;
}
```

**Step 2b: Assign Positions Within Layers**

Components in the same layer are positioned left-to-right. The `position` value (0, 1, 2, ...) determines horizontal ordering.

### 03 / Planning Connection Routing

You **SHOULD** plan connection paths to minimize visual clutter.

**Routing Guidelines**:

1. Vertical connections are preferred for hierarchical flow
2. Minimize line crossings where possible
3. Group related connections visually
4. Use consistent arrow directions (typically downward/rightward)

**Connection Ordering Priority**:

1. Primary data flows (frontend → backend → database)
2. Secondary/supporting connections (cache, external APIs)
3. Async/event connections (queues, pub/sub)

### 04 / Building Architecture Configuration

You **MUST** construct the complete architecture configuration JSON.

**Step 4a: Add Metadata**

```json
{
  "metadata": {
    "title": "Application Architecture",
    "description": "Generated from codebase analysis",
    "version": "1.0.0",
    "created": "2024-01-01T00:00:00Z"
  }
}
```

**Step 4b: Combine Components and Connections**

Merge the component inventory with layer assignments and connections into a single configuration object.

### 05 / Writing Configuration File

You **MUST** save the configuration to a file for script processing.

**Step 5a: Write to Temporary File**

Use the `Write` tool to create the configuration file:

```
/tmp/architecture-config.json
```

**Step 5b: Verify File Creation**

Confirm the file was created successfully and contains valid JSON.

## Output Validation Criteria

### Output Format

The output of this step is a JSON configuration file saved to disk.

### Output Content

The configuration file **MUST** conform to this schema:

```json
{
  "metadata": {
    "title": "string",
    "description": "string",
    "version": "string",
    "created": "ISO8601 timestamp"
  },
  "layout": {
    "type": "hierarchical | grid",
    "direction": "top-down | left-right",
    "spacing": {
      "horizontal": "number",
      "vertical": "number"
    },
    "padding": "number"
  },
  "components": [
    {
      "id": "string (unique)",
      "type": "service | frontend | database | cache | queue | external | gateway | storage",
      "name": "string",
      "description": "string (optional)",
      "layer": "number",
      "position": "number"
    }
  ],
  "connections": [
    {
      "id": "string (optional)",
      "from": "component ID",
      "to": "component ID",
      "type": "sync | async | data | event",
      "label": "string (optional)"
    }
  ],
  "groups": [
    {
      "id": "string",
      "name": "string",
      "componentIds": ["component IDs"],
      "style": { "backgroundColor": "hex color" }
    }
  ]
}
```

### Validation Process

Before proceeding to the next step, you **MUST** verify:

1. **Valid JSON**: The configuration file is valid JSON
2. **Required Fields**: All required fields are present
3. **Unique IDs**: All component IDs are unique
4. **Valid References**: All connection `from`/`to` values reference existing component IDs
5. **Layer Assignment**: All components have valid `layer` and `position` values
6. **File Written**: The configuration file exists at the specified path

**Validation Script** (optional):

```bash
node -e "const c = require('/tmp/architecture-config.json'); console.log('Components:', c.components.length, 'Connections:', c.connections.length)"
```

If validation fails, you **MUST** correct the configuration before proceeding.

### Internal Use

Use the path to this configuration file as input to the diagram generation scripts in the next step. Proceed to [Stage 3.2: Creating Diagram](./stage-3.2-diagram-creation.md).
