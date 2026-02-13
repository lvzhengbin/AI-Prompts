# Reference Documentation

This document provides technical reference for the Excalidraw Architecture Diagram skill, including the JSON schema, element specifications, and script API documentation.

## Excalidraw JSON Schema

### Top-Level Structure

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "string",
  "elements": [],
  "appState": {},
  "files": {}
}
```

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | Always `"excalidraw"` |
| `version` | number | Schema version (currently 2) |
| `source` | string | Origin URL or identifier |
| `elements` | array | Array of element objects |
| `appState` | object | Application state and preferences |
| `files` | object | Embedded file data (images) |

### App State Properties

```json
{
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#ffffff"
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| `gridSize` | number\|null | Grid spacing in pixels, null for no grid |
| `viewBackgroundColor` | string | Canvas background color (hex) |

---

## Element Specifications

### Base Element Properties

All elements share these common properties:

```json
{
  "id": "unique-string-id",
  "type": "rectangle",
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 100,
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#a5d8ff",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "seed": 12345,
  "version": 1,
  "versionNonce": 67890,
  "isDeleted": false,
  "groupIds": [],
  "frameId": null,
  "roundness": null,
  "boundElements": null,
  "updated": 1699999999999,
  "link": null,
  "locked": false
}
```

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier (use UUID or nanoid) |
| `type` | string | Element type (see types below) |
| `x`, `y` | number | Top-left position coordinates |
| `width`, `height` | number | Element dimensions |
| `angle` | number | Rotation in radians |
| `strokeColor` | string | Border/line color (hex) |
| `backgroundColor` | string | Fill color (hex or "transparent") |
| `fillStyle` | string | Fill pattern: "solid", "hachure", "cross-hatch" |
| `strokeWidth` | number | Line thickness (1-4 typical) |
| `strokeStyle` | string | "solid", "dashed", "dotted" |
| `roughness` | number | Hand-drawn effect (0=smooth, 1=normal, 2=rough) |
| `opacity` | number | Transparency (0-100) |
| `seed` | number | Random seed for roughness consistency |
| `version` | number | Change tracking counter |
| `versionNonce` | number | Random nonce for version disambiguation |
| `isDeleted` | boolean | Soft delete flag |
| `groupIds` | array | IDs of groups containing this element |
| `frameId` | string\|null | Parent frame ID |
| `roundness` | object\|null | Corner rounding configuration |
| `boundElements` | array\|null | Elements bound to this one |
| `updated` | number | Last modification timestamp |
| `link` | string\|null | Associated URL |
| `locked` | boolean | Prevent modifications |

### Element Types

#### Rectangle

Used for services, modules, and containers.

```json
{
  "type": "rectangle",
  "roundness": {
    "type": 3
  }
}
```

Roundness types:
- `null` - Sharp corners
- `{ "type": 2 }` - Slightly rounded
- `{ "type": 3 }` - Fully rounded corners

#### Ellipse

Used for databases (styled as ovals) and circular elements.

```json
{
  "type": "ellipse"
}
```

#### Diamond

Used for cache layers, decision points, and special components.

```json
{
  "type": "diamond"
}
```

#### Text

Used for labels and annotations.

```json
{
  "type": "text",
  "text": "Label Text",
  "fontSize": 20,
  "fontFamily": 1,
  "textAlign": "center",
  "verticalAlign": "middle",
  "baseline": 18,
  "containerId": null,
  "originalText": "Label Text",
  "lineHeight": 1.25
}
```

| Property | Type | Description |
|----------|------|-------------|
| `text` | string | Display text content |
| `fontSize` | number | Font size in pixels |
| `fontFamily` | number | 1=Virgil (hand-drawn), 2=Helvetica, 3=Cascadia |
| `textAlign` | string | "left", "center", "right" |
| `verticalAlign` | string | "top", "middle", "bottom" |
| `baseline` | number | Text baseline offset |
| `containerId` | string\|null | ID of container element |
| `originalText` | string | Original text before wrapping |
| `lineHeight` | number | Line height multiplier |

#### Arrow

Used for connections and data flows.

```json
{
  "type": "arrow",
  "points": [[0, 0], [200, 100]],
  "lastCommittedPoint": null,
  "startBinding": {
    "elementId": "source-element-id",
    "focus": 0,
    "gap": 5
  },
  "endBinding": {
    "elementId": "target-element-id",
    "focus": 0,
    "gap": 5
  },
  "startArrowhead": null,
  "endArrowhead": "arrow"
}
```

| Property | Type | Description |
|----------|------|-------------|
| `points` | array | Array of [x, y] coordinates relative to element position |
| `startBinding` | object\|null | Connection to source element |
| `endBinding` | object\|null | Connection to target element |
| `startArrowhead` | string\|null | "arrow", "bar", "dot", "triangle", null |
| `endArrowhead` | string\|null | Same options as startArrowhead |
| `focus` | number | Binding point position (-1 to 1) |
| `gap` | number | Distance from element edge |

#### Line

Used for grouping boundaries and separators.

```json
{
  "type": "line",
  "points": [[0, 0], [100, 0], [100, 100]],
  "lastCommittedPoint": null,
  "startBinding": null,
  "endBinding": null,
  "startArrowhead": null,
  "endArrowhead": null
}
```

---

## Architecture Configuration Schema

The scripts accept a configuration JSON with the following structure:

```json
{
  "metadata": {
    "title": "System Architecture",
    "description": "Overview of the application architecture",
    "version": "1.0.0",
    "created": "2024-01-01T00:00:00Z"
  },
  "layout": {
    "type": "hierarchical",
    "direction": "top-down",
    "spacing": {
      "horizontal": 250,
      "vertical": 150
    },
    "padding": 50
  },
  "components": [
    {
      "id": "unique-id",
      "type": "service",
      "name": "API Gateway",
      "description": "Routes incoming requests",
      "layer": 0,
      "position": 0,
      "style": {
        "backgroundColor": "#a5d8ff",
        "strokeColor": "#339af0"
      }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "from": "component-id-1",
      "to": "component-id-2",
      "type": "sync",
      "label": "REST API",
      "style": {
        "strokeStyle": "solid",
        "strokeColor": "#1e1e1e"
      }
    }
  ],
  "groups": [
    {
      "id": "group-1",
      "name": "Backend Services",
      "componentIds": ["service-1", "service-2"],
      "style": {
        "backgroundColor": "#f8f9fa"
      }
    }
  ]
}
```

### Component Types

| Type | Description | Default Style |
|------|-------------|---------------|
| `service` | Backend service or API | Blue rectangle |
| `frontend` | Client application | Purple rectangle |
| `database` | Data storage | Green ellipse |
| `cache` | Caching layer | Red diamond |
| `queue` | Message queue | Purple parallelogram |
| `external` | Third-party service | Yellow dashed rectangle |
| `gateway` | API gateway, load balancer | Blue rounded rectangle |
| `storage` | File/blob storage | Green rectangle |

### Connection Types

| Type | Description | Default Style |
|------|-------------|---------------|
| `sync` | Synchronous call | Solid arrow |
| `async` | Asynchronous message | Dashed arrow |
| `data` | Data flow | Dotted line |
| `event` | Event-driven | Dashed with dot |

### Layout Types

| Type | Description |
|------|-------------|
| `hierarchical` | Layered top-down or left-right |
| `force` | Force-directed graph layout |
| `grid` | Grid-based positioning |
| `manual` | Use explicit x, y positions |

---

## Script API

### generate-diagram.js

Generates a new Excalidraw diagram from configuration.

**Usage:**
```bash
node scripts/generate-diagram.js --config <path> --output <path> [options]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `--config` | Yes | Path to architecture configuration JSON |
| `--output` | Yes | Output path for .excalidraw file |
| `--layout` | No | Override layout type |
| `--style` | No | Style preset: "default", "minimal", "detailed" |

**Example:**
```bash
node scripts/generate-diagram.js \
  --config /tmp/arch-config.json \
  --output ./docs/architecture.excalidraw \
  --style detailed
```

### update-diagram.js

Updates an existing Excalidraw diagram with new components.

**Usage:**
```bash
node scripts/update-diagram.js --existing <path> --config <path> --output <path> [options]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `--existing` | Yes | Path to existing .excalidraw file |
| `--config` | Yes | Path to updated architecture configuration |
| `--output` | Yes | Output path for updated file |
| `--preserve-layout` | No | Keep existing element positions |
| `--merge-strategy` | No | "add-only", "full-sync", "update-existing" |

**Merge Strategies:**
- `add-only` - Only add new components, never remove
- `full-sync` - Match diagram exactly to config (add and remove)
- `update-existing` - Update existing, add new, but don't remove

### parse-architecture.js

Analyzes codebase and generates architecture configuration.

**Usage:**
```bash
node scripts/parse-architecture.js --root <path> --output <path> [options]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `--root` | Yes | Root directory of codebase to analyze |
| `--output` | Yes | Output path for configuration JSON |
| `--depth` | No | Analysis depth: "shallow", "medium", "deep" |
| `--include` | No | Glob patterns to include |
| `--exclude` | No | Glob patterns to exclude |

---

## Color Palette

### Component Colors

| Component | Background | Stroke | Description |
|-----------|------------|--------|-------------|
| Service | `#a5d8ff` | `#339af0` | Blue - primary services |
| Frontend | `#d0bfff` | `#7950f2` | Purple - client apps |
| Database | `#d3f9d8` | `#40c057` | Green - data storage |
| Cache | `#ffc9c9` | `#fa5252` | Red - caching |
| Queue | `#eebefa` | `#be4bdb` | Violet - messaging |
| External | `#fff3bf` | `#fab005` | Yellow - third-party |
| Gateway | `#a5d8ff` | `#228be6` | Blue darker - gateways |
| Storage | `#b2f2bb` | `#2f9e44` | Green darker - files |

### Connection Colors

| Type | Color | Description |
|------|-------|-------------|
| Default | `#1e1e1e` | Standard black |
| Sync | `#339af0` | Blue for sync calls |
| Async | `#be4bdb` | Purple for async |
| Data | `#40c057` | Green for data flow |
| Error | `#fa5252` | Red for error paths |

### Background Colors

| Purpose | Color |
|---------|-------|
| Canvas | `#ffffff` |
| Group | `#f8f9fa` |
| Highlight | `#fff9db` |

---

## ID Generation

All element IDs should be unique strings. Recommended approaches:

1. **UUID v4**: `crypto.randomUUID()`
2. **Nanoid**: `nanoid()` (21 characters)
3. **Prefixed**: `${type}-${index}` for debugging

Example ID patterns:
- Components: `comp-api-gateway`, `comp-user-service`
- Connections: `conn-gateway-to-user`
- Text: `label-comp-api-gateway`
- Groups: `group-backend-services`

---

## Seed Generation

The `seed` property controls the random roughness of hand-drawn elements. Use consistent seeds for visual coherence:

```javascript
function generateSeed() {
  return Math.floor(Math.random() * 2147483647);
}
```

Elements that should look related can share the same seed for visual consistency.
