# Iterating on Feedback Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Categorizing Requested Changes](#01--categorizing-requested-changes)
  - [02 / Updating Configuration](#02--updating-configuration)
  - [03 / Regenerating Diagram](#03--regenerating-diagram)
  - [04 / Validating Updated Diagram](#04--validating-updated-diagram)
  - [05 / Presenting Updated Diagram](#05--presenting-updated-diagram)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference applies user-requested changes and regenerates the diagram. It handles component additions, removals, layout adjustments, and style modifications, then validates the updated diagram before returning to user review.

## Input Validation Criteria

This step requires validated output from [Stage 4.2: Reviewing with User](./stage-4.2-user-review.md).

You **MUST** verify the following inputs before proceeding:

| Input | Required | Validation |
|-------|----------|------------|
| `completion_status` | Yes | Must be `"changes_pending"` |
| `requested_changes` | Yes | Non-empty array of change objects |
| `diagram_path` | Yes | Path to current .excalidraw file |
| `config_file_path` | Yes | Path to current configuration JSON |
| `iteration_count` | Yes | Current iteration number (must be < 5) |

If `iteration_count` >= 5, you **MUST** inform the user that maximum iterations have been reached and save the current state.

## Step Instructions

### 01 / Categorizing Requested Changes

You **MUST** group changes by type for efficient processing.

**Step 1a: Change Categories**

| Category | Change Types |
|----------|--------------|
| Components | `add_component`, `remove_component`, `modify_component` |
| Connections | `add_connection`, `remove_connection`, `modify_connection` |
| Layout | `adjust_position`, `change_layout`, `add_group` |
| Style | `change_color`, `add_label`, `modify_style` |

**Step 1b: Categorization Script**

```javascript
function categorizeChanges(feedback) {
  return {
    components: feedback.filter(c =>
      ['add_component', 'remove_component', 'modify_component'].includes(c.type)
    ),
    connections: feedback.filter(c =>
      ['add_connection', 'remove_connection', 'modify_connection'].includes(c.type)
    ),
    layout: feedback.filter(c =>
      ['adjust_position', 'change_layout', 'add_group'].includes(c.type)
    ),
    style: feedback.filter(c =>
      ['change_color', 'add_label', 'modify_style'].includes(c.type)
    )
  };
}
```

**Step 1c: Processing Order**

You **SHOULD** process changes in this order:
1. Component additions (need to exist before connections)
2. Component removals (cascade removes connections)
3. Connection changes
4. Layout adjustments
5. Style changes

### 02 / Updating Configuration

You **MUST** modify the architecture configuration based on feedback.

**Step 2a: Adding Components**

```json
{
  "id": "new-component-id",
  "type": "database",
  "name": "Component Name",
  "description": "Component description",
  "layer": 3,
  "position": 2
}
```

**Step 2b: Adding Connections**

```json
{
  "from": "source-component",
  "to": "target-component",
  "type": "sync",
  "label": "Connection Label"
}
```

**Step 2c: Removing Components**

```javascript
// Filter out removed components
config.components = config.components.filter(
  c => !removedIds.includes(c.id)
);

// Also remove associated connections
config.connections = config.connections.filter(
  conn => !removedIds.includes(conn.from) && !removedIds.includes(conn.to)
);
```

**Step 2d: Adjusting Layout**

```javascript
// Update component positions
config.components.forEach(comp => {
  if (positionChanges[comp.id]) {
    comp.layer = positionChanges[comp.id].layer;
    comp.position = positionChanges[comp.id].position;
  }
});

// Or change overall layout
config.layout.type = 'grid';
config.layout.spacing.horizontal = 300;
```

### 03 / Regenerating Diagram

You **MUST** apply changes using the appropriate method.

**Step 3a: Full Regeneration**

Use for significant changes (multiple components added/removed):

```bash
node scripts/generate-diagram.js \
  --config /tmp/updated-config.json \
  --output <output-path>.excalidraw
```

**Step 3b: Incremental Update**

Use when preserving existing layout:

```bash
node scripts/update-diagram.js \
  --existing <current-diagram>.excalidraw \
  --config /tmp/updated-config.json \
  --output <output-path>.excalidraw \
  --preserve-layout true \
  --merge-strategy update-existing
```

**Step 3c: Manual Modifications**

For minor changes, edit the Excalidraw JSON directly.

**Move component**:
```javascript
// Find element and update position
element.x = newX;
element.y = newY;

// Update bound text position
const label = elements.find(e => e.containerId === element.id);
if (label) {
  label.x = newX + element.width/2 - label.width/2;
  label.y = newY + element.height/2 - label.height/2;
}
```

**Update label**:
```javascript
const label = elements.find(e => e.type === 'text' && e.containerId === componentId);
label.text = newLabelText;
label.originalText = newLabelText;
```

**Change color**:
```javascript
const component = elements.find(e => e.customData?.componentId === componentId);
component.backgroundColor = '#newColor';
component.strokeColor = '#newStrokeColor';
```

### 04 / Validating Updated Diagram

You **MUST** re-run validation checks from Stage 4.1.

**Step 4a: Iteration Validation Checklist**

- [ ] New components added correctly
- [ ] Removed components no longer present
- [ ] Connections updated appropriately
- [ ] Layout changes applied
- [ ] No orphaned elements (labels without containers)
- [ ] No broken bindings (arrows to missing elements)
- [ ] File is valid JSON

**Step 4b: Quick Validation Script**

```javascript
function validateIteration(diagram, changes) {
  const errors = [];
  const elementIds = new Set(diagram.elements.map(e => e.id));

  // Verify additions
  changes.filter(c => c.type === 'add_component').forEach(c => {
    const found = diagram.elements.some(e =>
      e.customData?.componentId === c.details.id
    );
    if (!found) errors.push(`Component ${c.details.id} not added`);
  });

  // Verify removals
  changes.filter(c => c.type === 'remove_component').forEach(c => {
    const found = diagram.elements.some(e =>
      e.customData?.componentId === c.details.id
    );
    if (found) errors.push(`Component ${c.details.id} not removed`);
  });

  // Verify no broken bindings
  const arrows = diagram.elements.filter(e => e.type === 'arrow');
  arrows.forEach(arrow => {
    if (arrow.startBinding && !elementIds.has(arrow.startBinding.elementId)) {
      errors.push(`Arrow ${arrow.id} has invalid start binding`);
    }
    if (arrow.endBinding && !elementIds.has(arrow.endBinding.elementId)) {
      errors.push(`Arrow ${arrow.id} has invalid end binding`);
    }
  });

  return { valid: errors.length === 0, errors };
}
```

### 05 / Presenting Updated Diagram

You **MUST** present the changes to the user and return to Stage 4.2.

**Step 5a: Update Summary Template**

```markdown
## Changes Applied

### Added ([count])
- [component name] ([type])
- [source] → [target] connection
...

### Modified ([count])
- [component]: [what changed]
...

### Removed ([count])
- [component name]
...

### Updated File
`[diagram_path]`

Would you like to review the updated diagram?
```

**Step 5b: Increment Iteration Counter**

```javascript
iterationCount++;
```

**Step 5c: Check Maximum Iterations**

```javascript
const MAX_ITERATIONS = 5;

if (iterationCount >= MAX_ITERATIONS) {
  // Inform user and save current state
  console.log('Maximum iterations reached. Saving current diagram.');
  // Present final diagram without offering further changes
}
```

## Output Validation Criteria

### Output Format

The output of this step is an updated diagram file and a change summary.

### Output Content

The output **MUST** include:

```json
{
  "changes_applied": [
    {
      "type": "add_component",
      "details": { "id": "component-id", "name": "Component Name" },
      "success": true
    }
  ],
  "updated_diagram_path": "/path/to/updated.excalidraw",
  "iteration_count": 2,
  "validation_status": "passed",
  "ready_for_review": true
}
```

### Validation Process

Before returning to user review, you **MUST** verify:

1. **All Changes Applied**: Each requested change was successfully implemented
2. **No New Errors**: Validation passes with no new issues introduced
3. **File Updated**: The diagram file reflects all changes
4. **Configuration Synced**: The configuration file matches the diagram

**Validation Failure Handling**:

| Failure Type | Resolution |
|--------------|------------|
| Change failed to apply | Report specific failure and ask for clarification |
| Validation errors | Fix errors before presenting to user |
| Maximum iterations | Inform user and finalize current state |

### Iteration Loop

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │ Stage   │    │ Stage   │    │ Stage   │     │
│  │  4.1    │───▶│  4.2    │───▶│  4.3    │─────┤
│  │Validate │    │ Review  │    │ Iterate │     │
│  └─────────┘    └────┬────┘    └─────────┘     │
│                      │                          │
│                      │ Approved                 │
│                      ▼                          │
│                 ┌─────────┐                     │
│                 │Complete │                     │
│                 └─────────┘                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Internal Use

After completing this step, return to [Stage 4.2: Reviewing with User](./stage-4.2-user-review.md) for another review cycle, unless maximum iterations have been reached.
