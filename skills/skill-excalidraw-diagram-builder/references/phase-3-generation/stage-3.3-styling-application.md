# Applying Styling Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Applying Component Type Styling](#01--applying-component-type-styling)
  - [02 / Applying Connection Styling](#02--applying-connection-styling)
  - [03 / Applying Text Styling](#03--applying-text-styling)
  - [04 / Applying Group Styling](#04--applying-group-styling)
  - [05 / Verifying Final Styling](#05--verifying-final-styling)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference ensures consistent visual styling across all diagram elements. The generation scripts apply styling automatically, but this step provides verification and guidance for manual adjustments or style customization.

## Input Validation Criteria

This step requires validated output from [Stage 3.2: Creating Diagram](./stage-3.2-diagram-creation.md).

You **MUST** verify the following inputs before proceeding:

| Input | Required | Validation |
|-------|----------|------------|
| `diagram_path` | Yes | Path to valid .excalidraw file |
| `element_count` | Yes | Number of elements (must be > 0) |
| Generated diagram | Yes | File exists and is valid Excalidraw JSON |

If input validation fails, you **MUST** return to Stage 3.2 to regenerate the diagram.

## Step Instructions

### 01 / Applying Component Type Styling

The generation scripts **SHOULD** have applied component styling automatically. Verify or manually apply these styles.

**Component Color Palette**:

| Component Type | Background | Stroke | Shape |
|---------------|------------|--------|-------|
| Service/API | `#a5d8ff` | `#339af0` | Rounded rectangle |
| Frontend | `#d0bfff` | `#7950f2` | Rounded rectangle |
| Database | `#d3f9d8` | `#40c057` | Ellipse |
| Cache | `#ffc9c9` | `#fa5252` | Diamond |
| Queue | `#eebefa` | `#be4bdb` | Rectangle |
| External | `#fff3bf` | `#fab005` | Dashed rectangle |
| Gateway | `#a5d8ff` | `#228be6` | Rounded rectangle |
| Storage | `#b2f2bb` | `#2f9e44` | Rectangle |

**Style Configuration Reference**:

```javascript
const COMPONENT_STYLES = {
  service: {
    backgroundColor: '#a5d8ff',
    strokeColor: '#339af0',
    roundness: { type: 3 },
    strokeStyle: 'solid'
  },
  frontend: {
    backgroundColor: '#d0bfff',
    strokeColor: '#7950f2',
    roundness: { type: 3 },
    strokeStyle: 'solid'
  },
  database: {
    backgroundColor: '#d3f9d8',
    strokeColor: '#40c057',
    shape: 'ellipse'
  },
  cache: {
    backgroundColor: '#ffc9c9',
    strokeColor: '#fa5252',
    shape: 'diamond'
  },
  queue: {
    backgroundColor: '#eebefa',
    strokeColor: '#be4bdb',
    roundness: { type: 2 }
  },
  external: {
    backgroundColor: '#fff3bf',
    strokeColor: '#fab005',
    strokeStyle: 'dashed'
  },
  gateway: {
    backgroundColor: '#a5d8ff',
    strokeColor: '#228be6',
    roundness: { type: 3 }
  },
  storage: {
    backgroundColor: '#b2f2bb',
    strokeColor: '#2f9e44',
    roundness: { type: 2 }
  }
};
```

### 02 / Applying Connection Styling

Verify connections are styled based on their communication pattern.

**Connection Styles**:

| Connection Type | Stroke Style | Color | Arrowhead | Use Case |
|----------------|--------------|-------|-----------|----------|
| Synchronous | Solid | `#1e1e1e` | Arrow | HTTP, gRPC, direct calls |
| Asynchronous | Dashed | `#be4bdb` | Arrow | Message queue, events |
| Data Flow | Dotted | `#40c057` | Arrow | ETL, data pipelines |
| Event | Dashed | `#fab005` | Triangle | Event-driven, pub/sub |

**Connection Style Configuration**:

```javascript
const CONNECTION_STYLES = {
  sync: {
    strokeStyle: 'solid',
    strokeColor: '#1e1e1e',
    strokeWidth: 2,
    endArrowhead: 'arrow'
  },
  async: {
    strokeStyle: 'dashed',
    strokeColor: '#be4bdb',
    strokeWidth: 2,
    endArrowhead: 'arrow'
  },
  data: {
    strokeStyle: 'dotted',
    strokeColor: '#40c057',
    strokeWidth: 2,
    endArrowhead: 'arrow'
  },
  event: {
    strokeStyle: 'dashed',
    strokeColor: '#fab005',
    strokeWidth: 2,
    endArrowhead: 'triangle'
  }
};
```

### 03 / Applying Text Styling

Verify labels are readable and consistently formatted.

**Label Styles**:

| Label Type | Font Size | Font Family | Alignment |
|------------|-----------|-------------|-----------|
| Component name | 16px | Virgil (1) | Center |
| Connection label | 12px | Virgil (1) | Left |
| Group title | 20px | Virgil (1) | Left |
| Diagram title | 28px | Virgil (1) | Center |

**Font Family Options**:

| Value | Font | Use Case |
|-------|------|----------|
| 1 | Virgil | Hand-drawn style (default) |
| 2 | Helvetica | Clean, professional |
| 3 | Cascadia | Monospace, code-like |

**Text Style Configuration**:

```javascript
const TEXT_STYLES = {
  componentLabel: {
    fontSize: 16,
    fontFamily: 1,
    textAlign: 'center',
    verticalAlign: 'middle',
    strokeColor: '#1e1e1e'
  },
  connectionLabel: {
    fontSize: 12,
    fontFamily: 1,
    textAlign: 'left',
    strokeColor: '#868e96'
  },
  groupTitle: {
    fontSize: 20,
    fontFamily: 1,
    textAlign: 'left',
    strokeColor: '#495057'
  },
  diagramTitle: {
    fontSize: 28,
    fontFamily: 1,
    textAlign: 'center',
    strokeColor: '#1e1e1e'
  }
};
```

### 04 / Applying Group Styling

If components are grouped, verify consistent group styling.

**Group Styles**:

| Group Type | Background | Stroke | Style |
|------------|------------|--------|-------|
| Default | `#f8f9fa` | `#dee2e6` | Dashed |
| Domain | `#e7f5ff` | `#74c0fc` | Solid |
| Infrastructure | `#fff9db` | `#ffd43b` | Dashed |

**Group Style Configuration**:

```javascript
const GROUP_STYLES = {
  default: {
    backgroundColor: '#f8f9fa',
    strokeColor: '#dee2e6',
    strokeStyle: 'dashed',
    strokeWidth: 1,
    opacity: 50
  },
  domain: {
    backgroundColor: '#e7f5ff',
    strokeColor: '#74c0fc',
    strokeStyle: 'solid'
  },
  infrastructure: {
    backgroundColor: '#fff9db',
    strokeColor: '#ffd43b',
    strokeStyle: 'dashed'
  }
};
```

### 05 / Verifying Final Styling

You **MUST** perform a final style verification before proceeding.

**Verification Checklist**:

- [ ] All components of same type have matching colors
- [ ] All connections of same type have matching styles
- [ ] Labels are readable (sufficient contrast)
- [ ] No overlapping text
- [ ] Consistent stroke widths throughout (typically 2px)
- [ ] Roughness setting consistent (typically 1)
- [ ] Fill style consistent (typically "solid")

**Common Issues to Check**:

| Issue | Resolution |
|-------|------------|
| Inconsistent colors | Apply component type colors from palette |
| Unreadable labels | Increase font size or adjust positioning |
| Overlapping elements | Adjust spacing in layout configuration |
| Missing arrowheads | Set `endArrowhead: "arrow"` on connections |
| Wrong line style | Set `strokeStyle` to correct value |

## Output Validation Criteria

### Output Format

The output of this step is a styled `.excalidraw` file ready for user review.

### Output Content

The styled diagram **MUST** meet these criteria:

**Component Styling**:
- All shapes use correct colors for their type
- Stroke widths are consistent (2px default)
- Roundness is applied where appropriate
- Fill style is "solid" (not hachure)

**Connection Styling**:
- Line styles match communication types
- Arrowheads are present on connections
- Colors differentiate sync/async patterns

**Text Styling**:
- All labels are readable
- Font sizes are appropriate
- Text is properly aligned within containers

### Validation Process

Before proceeding to the next phase, you **MUST** verify:

1. **Visual Consistency**: All same-type elements look identical
2. **Readability**: All text is legible
3. **Completeness**: All components have labels
4. **Style Accuracy**: Colors and styles match the specification

**Manual Verification**:

If possible, open the `.excalidraw` file in Excalidraw (https://excalidraw.com) to visually verify the styling.

**Automated Style Check** (optional):

```javascript
// Check that all rectangles have consistent styling
const rectangles = elements.filter(e => e.type === 'rectangle');
const hasConsistentStroke = rectangles.every(r => r.strokeWidth === 2);
const hasConsistentRoughness = rectangles.every(r => r.roughness === 1);
```

### Internal Use

The styled diagram is now ready for validation and user review. Proceed to [Stage 4.1: Validating Diagram](../phase-4-validation/stage-4.1-diagram-validation.md).
