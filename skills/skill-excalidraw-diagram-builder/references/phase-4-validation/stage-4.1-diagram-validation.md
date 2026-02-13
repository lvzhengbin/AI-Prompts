# Validating Diagram Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Verifying Component Completeness](#01--verifying-component-completeness)
  - [02 / Verifying Connection Completeness](#02--verifying-connection-completeness)
  - [03 / Checking for Visual Issues](#03--checking-for-visual-issues)
  - [04 / Validating JSON Structure](#04--validating-json-structure)
  - [05 / Generating Validation Report](#05--generating-validation-report)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference verifies the generated diagram is complete, structurally valid, and visually correct. It ensures all identified components are represented and all connections are properly created before presenting the diagram to the user.

## Input Validation Criteria

This step requires validated output from [Stage 3.3: Applying Styling](../phase-3-generation/stage-3.3-styling-application.md).

You **MUST** verify the following inputs before proceeding:

| Input | Required | Validation |
|-------|----------|------------|
| `diagram_path` | Yes | Path to valid .excalidraw file |
| `config_file_path` | Yes | Path to architecture configuration JSON |
| Generated diagram | Yes | File exists and is valid Excalidraw JSON |
| Configuration JSON | Yes | Valid JSON with components and connections |

If input validation fails, you **MUST** return to Stage 3.3 to verify styling or Stage 3.2 to regenerate the diagram.

## Step Instructions

### 01 / Verifying Component Completeness

You **MUST** check that all identified components are represented in the diagram.

**Step 1a: Build Component Checklist**

For each component in the configuration, verify:
- Component shape exists in diagram
- Component has correct type styling
- Component has readable label
- Component position is within canvas bounds

**Step 1b: Programmatic Component Check**

```javascript
function validateComponents(config, diagram) {
  const diagramComponentIds = new Set(
    diagram.elements
      .filter(e => e.customData?.componentId)
      .map(e => e.customData.componentId)
  );

  const missing = config.components.filter(
    c => !diagramComponentIds.has(c.id)
  );

  return {
    complete: missing.length === 0,
    missing: missing.map(c => c.name),
    coverage: ((config.components.length - missing.length) / config.components.length) * 100
  };
}
```

**Step 1c: Record Component Coverage**

You **MUST** record the component coverage percentage:
- 100%: All components represented
- <100%: Missing components need investigation

### 02 / Verifying Connection Completeness

You **MUST** check that all connections are properly created.

**Step 2a: Build Connection Checklist**

For each connection in the configuration, verify:
- Arrow element exists in diagram
- Arrow connects correct source and target
- Arrow has correct styling (solid/dashed)
- Arrow has label if specified
- Bindings are valid (reference existing elements)

**Step 2b: Binding Validation**

```javascript
function validateConnections(config, diagram) {
  const elementIds = new Set(diagram.elements.map(e => e.id));
  const arrows = diagram.elements.filter(e => e.type === 'arrow');

  const invalidBindings = arrows.filter(arrow => {
    const startValid = !arrow.startBinding ||
                       elementIds.has(arrow.startBinding.elementId);
    const endValid = !arrow.endBinding ||
                     elementIds.has(arrow.endBinding.elementId);
    return !startValid || !endValid;
  });

  return {
    valid: invalidBindings.length === 0,
    invalid: invalidBindings.map(a => a.id),
    total: arrows.length
  };
}
```

### 03 / Checking for Visual Issues

You **MUST** identify potential visual problems.

**Step 3a: Overlapping Element Detection**

```javascript
function checkOverlaps(elements) {
  const shapes = elements.filter(e =>
    ['rectangle', 'ellipse', 'diamond'].includes(e.type)
  );

  const overlaps = [];
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      if (elementsOverlap(shapes[i], shapes[j])) {
        overlaps.push([shapes[i].id, shapes[j].id]);
      }
    }
  }
  return overlaps;
}
```

**Step 3b: Line Crossing Analysis**

Note any unnecessary arrow crossings:
- **Acceptable**: Lines cross when connecting distant components
- **Problematic**: Lines cross when components could be rearranged

**Step 3c: Label Readability Verification**

You **MUST** verify labels are readable:

| Check | Requirement |
|-------|-------------|
| Text overflow | Text doesn't overflow component bounds |
| Font size | Minimum 12px for readability |
| Contrast | Sufficient contrast between text and background |
| Connection labels | Labels don't overlap arrows |

### 04 / Validating JSON Structure

You **MUST** ensure the Excalidraw file is well-formed.

**Step 4a: Structure Validation Script**

```javascript
function validateStructure(diagram) {
  const errors = [];

  // Required top-level properties
  if (diagram.type !== 'excalidraw') {
    errors.push('Missing or invalid type property');
  }
  if (!Array.isArray(diagram.elements)) {
    errors.push('Elements must be an array');
  }
  if (!diagram.appState) {
    errors.push('Missing appState object');
  }

  // Element validation
  const ids = new Set();
  diagram.elements.forEach((el, index) => {
    if (!el.id) {
      errors.push(`Element at index ${index} missing id`);
    } else if (ids.has(el.id)) {
      errors.push(`Duplicate element id: ${el.id}`);
    } else {
      ids.add(el.id);
    }

    if (!el.type) {
      errors.push(`Element ${el.id} missing type`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
```

**Step 4b: Validation Checklist**

You **MUST** verify:
- [ ] File is valid JSON
- [ ] Has `"type": "excalidraw"` at root
- [ ] `elements` array is populated
- [ ] All element IDs are unique
- [ ] Arrow bindings reference existing elements

### 05 / Generating Validation Report

You **MUST** compile validation results into a structured report.

**Report Template**:

```markdown
## Diagram Validation Report

### Component Coverage
- Total components in config: [N]
- Components in diagram: [N]
- Coverage: [X]%

### Connection Coverage
- Total connections in config: [N]
- Connections in diagram: [N]
- Coverage: [X]%

### Visual Issues
- Overlapping elements: [None/List]
- Invalid bindings: [None/List]
- Readability issues: [None/List]

### Structure Validation
- JSON valid: [Yes/No]
- All IDs unique: [Yes/No]
- Required properties present: [Yes/No]

### Status: [PASSED/FAILED]
```

## Output Validation Criteria

### Output Format

The output of this step is a structured validation report and status.

### Output Content

The validation output **MUST** include:

```json
{
  "component_coverage": 100,
  "connection_coverage": 100,
  "visual_issues": [],
  "structure_errors": [],
  "validation_status": "passed",
  "validation_report": "markdown report string"
}
```

**Validation Status Values**:

| Status | Meaning | Action |
|--------|---------|--------|
| `passed` | All checks successful | Proceed to user review |
| `failed` | Critical issues found | Return to generation phase |
| `warnings` | Minor issues found | Proceed with warnings noted |

### Validation Process

Before proceeding to the next stage, you **MUST** verify:

1. **Component Coverage**: 100% of components represented (or documented exclusions)
2. **Connection Coverage**: 100% of connections created
3. **No Critical Visual Issues**: No overlapping elements or broken bindings
4. **Valid Structure**: JSON is well-formed and complete

**Validation Failure Handling**:

| Failure Type | Resolution |
|--------------|------------|
| Missing components | Return to Stage 3.2 and regenerate |
| Invalid bindings | Fix arrow references or regenerate |
| Overlapping elements | Adjust layout spacing and regenerate |
| Invalid JSON | Check generation script for errors |

### Internal Use

Use the validation report to inform the user review stage. If validation passed, proceed to [Stage 4.2: Reviewing with User](./stage-4.2-user-review.md).
