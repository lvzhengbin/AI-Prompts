#!/usr/bin/env node

/**
 * update-diagram.js
 *
 * Updates an existing Excalidraw diagram with new components from configuration.
 *
 * Usage:
 *   node update-diagram.js --existing <path> --config <path> --output <path> [options]
 *
 * Arguments:
 *   --existing         Path to existing .excalidraw file
 *   --config           Path to updated architecture configuration JSON
 *   --output           Output path for updated .excalidraw file
 *   --preserve-layout  Keep existing element positions (default: true)
 *   --merge-strategy   add-only, full-sync, update-existing (default: update-existing)
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    'preserve-layout': 'true',
    'merge-strategy': 'update-existing'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.replace(/^--/, '');
      const value = args[i + 1];
      if (value && !value.startsWith('--')) {
        parsed[key] = value;
        i++;
      } else {
        parsed[key] = 'true';
      }
    }
  }

  return parsed;
}

// Generate unique ID
function generateId(prefix = '') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = prefix ? `${prefix}-` : '';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Generate random seed
function generateSeed() {
  return Math.floor(Math.random() * 2147483647);
}

// Component type styles (same as generate-diagram.js)
const COMPONENT_STYLES = {
  service: {
    backgroundColor: '#a5d8ff',
    strokeColor: '#339af0',
    shape: 'rectangle',
    roundness: { type: 3 }
  },
  frontend: {
    backgroundColor: '#d0bfff',
    strokeColor: '#7950f2',
    shape: 'rectangle',
    roundness: { type: 3 }
  },
  database: {
    backgroundColor: '#d3f9d8',
    strokeColor: '#40c057',
    shape: 'ellipse',
    roundness: null
  },
  cache: {
    backgroundColor: '#ffc9c9',
    strokeColor: '#fa5252',
    shape: 'diamond',
    roundness: null
  },
  queue: {
    backgroundColor: '#eebefa',
    strokeColor: '#be4bdb',
    shape: 'rectangle',
    roundness: { type: 2 }
  },
  external: {
    backgroundColor: '#fff3bf',
    strokeColor: '#fab005',
    shape: 'rectangle',
    roundness: null,
    strokeStyle: 'dashed'
  },
  gateway: {
    backgroundColor: '#a5d8ff',
    strokeColor: '#228be6',
    shape: 'rectangle',
    roundness: { type: 3 }
  },
  storage: {
    backgroundColor: '#b2f2bb',
    strokeColor: '#2f9e44',
    shape: 'rectangle',
    roundness: { type: 2 }
  }
};

// Connection type styles
const CONNECTION_STYLES = {
  sync: {
    strokeStyle: 'solid',
    strokeColor: '#1e1e1e',
    endArrowhead: 'arrow'
  },
  async: {
    strokeStyle: 'dashed',
    strokeColor: '#be4bdb',
    endArrowhead: 'arrow'
  },
  data: {
    strokeStyle: 'dotted',
    strokeColor: '#40c057',
    endArrowhead: 'arrow'
  },
  event: {
    strokeStyle: 'dashed',
    strokeColor: '#fab005',
    endArrowhead: 'triangle'
  }
};

// Default element dimensions
const DEFAULTS = {
  componentWidth: 160,
  componentHeight: 80,
  fontSize: 16,
  fontFamily: 1,
  strokeWidth: 2,
  roughness: 1,
  opacity: 100
};

// Extract component ID from element's custom data or text content
function extractComponentId(element, allElements) {
  // Check for custom data
  if (element.customData?.componentId) {
    return element.customData.componentId;
  }

  // Try to find associated text element
  if (element.boundElements) {
    for (const bound of element.boundElements) {
      if (bound.type === 'text') {
        const textEl = allElements.find(e => e.id === bound.id);
        if (textEl && textEl.text) {
          // Use lowercase, no spaces as ID
          return textEl.text.toLowerCase().replace(/\s+/g, '-');
        }
      }
    }
  }

  return null;
}

// Find existing element by component ID
function findElementByComponentId(elements, componentId) {
  // First try direct match on customData
  let found = elements.find(e =>
    e.customData?.componentId === componentId
  );

  if (found) return found;

  // Try matching by bound text content
  for (const element of elements) {
    if (element.boundElements) {
      for (const bound of element.boundElements) {
        if (bound.type === 'text') {
          const textEl = elements.find(e => e.id === bound.id);
          if (textEl && textEl.text) {
            const derivedId = textEl.text.toLowerCase().replace(/\s+/g, '-');
            if (derivedId === componentId || textEl.text === componentId) {
              return element;
            }
          }
        }
      }
    }
  }

  return null;
}

// Create base element properties
function createBaseElement(type, x, y, width, height) {
  return {
    id: generateId(type),
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: DEFAULTS.strokeWidth,
    strokeStyle: 'solid',
    roughness: DEFAULTS.roughness,
    opacity: DEFAULTS.opacity,
    seed: generateSeed(),
    version: 1,
    versionNonce: generateSeed(),
    isDeleted: false,
    groupIds: [],
    frameId: null,
    roundness: null,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false
  };
}

// Create a shape element
function createShape(component, x, y, width, height) {
  const style = COMPONENT_STYLES[component.type] || COMPONENT_STYLES.service;
  const customStyle = component.style || {};

  const shape = createBaseElement(style.shape, x, y, width, height);

  shape.backgroundColor = customStyle.backgroundColor || style.backgroundColor;
  shape.strokeColor = customStyle.strokeColor || style.strokeColor;
  shape.roundness = style.roundness;

  if (style.strokeStyle) {
    shape.strokeStyle = style.strokeStyle;
  }

  shape.customData = { componentId: component.id };

  return shape;
}

// Create text label element
function createTextLabel(text, x, y, width, containerId = null) {
  const textElement = createBaseElement('text', x, y, width, 24);

  textElement.text = text;
  textElement.fontSize = DEFAULTS.fontSize;
  textElement.fontFamily = DEFAULTS.fontFamily;
  textElement.textAlign = 'center';
  textElement.verticalAlign = 'middle';
  textElement.baseline = Math.round(DEFAULTS.fontSize * 0.9);
  textElement.containerId = containerId;
  textElement.originalText = text;
  textElement.lineHeight = 1.25;
  textElement.strokeColor = '#1e1e1e';
  textElement.backgroundColor = 'transparent';

  return textElement;
}

// Create arrow element
function createArrow(connection, startElement, endElement) {
  const style = CONNECTION_STYLES[connection.type] || CONNECTION_STYLES.sync;
  const customStyle = connection.style || {};

  const startX = startElement.x + startElement.width / 2;
  const startY = startElement.y + startElement.height;
  const endX = endElement.x + endElement.width / 2;
  const endY = endElement.y;

  const arrow = createBaseElement('arrow', startX, startY, 0, 0);

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  arrow.points = [[0, 0], [deltaX, deltaY]];
  arrow.lastCommittedPoint = null;

  arrow.startBinding = {
    elementId: startElement.id,
    focus: 0,
    gap: 5
  };

  arrow.endBinding = {
    elementId: endElement.id,
    focus: 0,
    gap: 5
  };

  arrow.startArrowhead = null;
  arrow.endArrowhead = customStyle.endArrowhead || style.endArrowhead;
  arrow.strokeStyle = customStyle.strokeStyle || style.strokeStyle;
  arrow.strokeColor = customStyle.strokeColor || style.strokeColor;

  return arrow;
}

// Create arrow label
function createArrowLabel(label, arrow) {
  const midX = arrow.x + (arrow.points[1][0] / 2) - 30;
  const midY = arrow.y + (arrow.points[1][1] / 2) - 10;

  return createTextLabel(label, midX, midY, 60);
}

// Calculate position for new component based on existing layout
function calculateNewPosition(existingElements, config) {
  // Find bounds of existing elements
  let maxX = 0;
  let maxY = 0;
  let minX = Infinity;

  existingElements.forEach(el => {
    if (el.type !== 'text' && el.type !== 'arrow' && el.type !== 'line') {
      maxX = Math.max(maxX, el.x + (el.width || 0));
      maxY = Math.max(maxY, el.y + (el.height || 0));
      minX = Math.min(minX, el.x);
    }
  });

  // Add new component to the right of existing elements
  const spacing = config.layout?.spacing || { horizontal: 250, vertical: 150 };

  return {
    x: maxX + spacing.horizontal / 2,
    y: minX !== Infinity ? existingElements[0]?.y || 50 : 50
  };
}

// Update existing element properties
function updateElement(element, component, preserveLayout) {
  const style = COMPONENT_STYLES[component.type] || COMPONENT_STYLES.service;
  const customStyle = component.style || {};

  // Update styling but preserve position if requested
  element.backgroundColor = customStyle.backgroundColor || style.backgroundColor;
  element.strokeColor = customStyle.strokeColor || style.strokeColor;

  if (style.roundness !== undefined) {
    element.roundness = style.roundness;
  }

  if (style.strokeStyle) {
    element.strokeStyle = style.strokeStyle;
  }

  // Update metadata
  element.customData = { componentId: component.id };
  element.version = (element.version || 0) + 1;
  element.versionNonce = generateSeed();
  element.updated = Date.now();

  return element;
}

// Main update function
function updateDiagram(existingDoc, config, options) {
  const preserveLayout = options['preserve-layout'] !== 'false';
  const mergeStrategy = options['merge-strategy'] || 'update-existing';

  let elements = [...existingDoc.elements];
  const componentElements = {};

  // Build map of existing components
  const existingComponents = new Map();
  elements.forEach(el => {
    if (el.type !== 'text' && el.type !== 'arrow' && el.type !== 'line') {
      const componentId = extractComponentId(el, elements);
      if (componentId) {
        existingComponents.set(componentId, el);
      }
    }
  });

  console.log(`Found ${existingComponents.size} existing components`);

  // Track which components from config are processed
  const processedIds = new Set();
  const newElements = [];

  // Process components from config
  config.components.forEach(component => {
    const existingEl = existingComponents.get(component.id);

    if (existingEl) {
      // Update existing component
      console.log(`  Updating: ${component.name || component.id}`);
      updateElement(existingEl, component, preserveLayout);
      componentElements[component.id] = existingEl;
      processedIds.add(component.id);

      // Update associated text label
      if (existingEl.boundElements) {
        existingEl.boundElements.forEach(bound => {
          if (bound.type === 'text') {
            const textEl = elements.find(e => e.id === bound.id);
            if (textEl) {
              textEl.text = component.name || component.id;
              textEl.originalText = component.name || component.id;
              textEl.version = (textEl.version || 0) + 1;
              textEl.updated = Date.now();
            }
          }
        });
      }
    } else {
      // Add new component
      console.log(`  Adding: ${component.name || component.id}`);
      const pos = calculateNewPosition(elements.concat(newElements), config);
      const width = DEFAULTS.componentWidth;
      const height = DEFAULTS.componentHeight;

      const shape = createShape(component, pos.x, pos.y, width, height);
      const labelText = component.name || component.id;
      const label = createTextLabel(
        labelText,
        pos.x + width / 2 - (labelText.length * 4),
        pos.y + height / 2 - 12,
        width - 20,
        shape.id
      );

      shape.boundElements = [{ id: label.id, type: 'text' }];

      newElements.push(shape);
      newElements.push(label);
      componentElements[component.id] = shape;
      processedIds.add(component.id);
    }
  });

  // Handle removal based on merge strategy
  if (mergeStrategy === 'full-sync') {
    // Remove components not in config
    existingComponents.forEach((el, componentId) => {
      if (!processedIds.has(componentId)) {
        console.log(`  Removing: ${componentId}`);

        // Mark element and associated elements as deleted
        el.isDeleted = true;

        if (el.boundElements) {
          el.boundElements.forEach(bound => {
            const boundEl = elements.find(e => e.id === bound.id);
            if (boundEl) {
              boundEl.isDeleted = true;
            }
          });
        }
      }
    });
  }

  // Add new elements
  elements = elements.concat(newElements);

  // Build component elements map for connections
  config.components.forEach(component => {
    if (!componentElements[component.id]) {
      const existing = findElementByComponentId(elements, component.id);
      if (existing) {
        componentElements[component.id] = existing;
      }
    }
  });

  // Remove existing arrows if full-sync
  if (mergeStrategy === 'full-sync') {
    elements.forEach(el => {
      if (el.type === 'arrow') {
        el.isDeleted = true;
      }
    });
  }

  // Process connections
  if (config.connections) {
    config.connections.forEach(connection => {
      const startElement = componentElements[connection.from];
      const endElement = componentElements[connection.to];

      if (startElement && endElement && !startElement.isDeleted && !endElement.isDeleted) {
        // Check if connection already exists
        const existingArrow = elements.find(el =>
          el.type === 'arrow' &&
          !el.isDeleted &&
          el.startBinding?.elementId === startElement.id &&
          el.endBinding?.elementId === endElement.id
        );

        if (!existingArrow || mergeStrategy === 'full-sync') {
          const arrow = createArrow(connection, startElement, endElement);

          if (!startElement.boundElements) startElement.boundElements = [];
          if (!endElement.boundElements) endElement.boundElements = [];

          startElement.boundElements.push({ id: arrow.id, type: 'arrow' });
          endElement.boundElements.push({ id: arrow.id, type: 'arrow' });

          elements.push(arrow);

          if (connection.label) {
            const arrowLabel = createArrowLabel(connection.label, arrow);
            elements.push(arrowLabel);
          }
        }
      }
    });
  }

  // Filter out deleted elements
  elements = elements.filter(el => !el.isDeleted);

  // Build final document
  return {
    type: 'excalidraw',
    version: 2,
    source: existingDoc.source || 'claude-architecture-skill',
    elements,
    appState: existingDoc.appState || {
      gridSize: null,
      viewBackgroundColor: '#ffffff'
    },
    files: existingDoc.files || {}
  };
}

// Main execution
function main() {
  const args = parseArgs();

  if (!args.existing || !args.config || !args.output) {
    console.error('Usage: node update-diagram.js --existing <path> --config <path> --output <path>');
    console.error('');
    console.error('Arguments:');
    console.error('  --existing         Path to existing .excalidraw file');
    console.error('  --config           Path to updated architecture configuration JSON');
    console.error('  --output           Output path for updated .excalidraw file');
    console.error('  --preserve-layout  Keep existing element positions (default: true)');
    console.error('  --merge-strategy   add-only, full-sync, update-existing (default: update-existing)');
    process.exit(1);
  }

  // Read existing diagram
  let existingDoc;
  try {
    const existingContent = fs.readFileSync(args.existing, 'utf8');
    existingDoc = JSON.parse(existingContent);
  } catch (error) {
    console.error(`Error reading existing diagram: ${error.message}`);
    process.exit(1);
  }

  // Read configuration
  let config;
  try {
    const configContent = fs.readFileSync(args.config, 'utf8');
    config = JSON.parse(configContent);
  } catch (error) {
    console.error(`Error reading configuration file: ${error.message}`);
    process.exit(1);
  }

  // Update diagram
  console.log('Updating architecture diagram...');
  console.log(`  Existing elements: ${existingDoc.elements?.length || 0}`);
  console.log(`  Config components: ${config.components?.length || 0}`);
  console.log(`  Config connections: ${config.connections?.length || 0}`);
  console.log(`  Merge strategy: ${args['merge-strategy']}`);
  console.log(`  Preserve layout: ${args['preserve-layout']}`);

  const updatedDoc = updateDiagram(existingDoc, config, args);

  // Write output
  const outputPath = args.output.endsWith('.excalidraw')
    ? args.output
    : `${args.output}.excalidraw`;

  try {
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(updatedDoc, null, 2));
    console.log(`\nDiagram updated successfully: ${outputPath}`);
    console.log(`  Total elements: ${updatedDoc.elements.length}`);
  } catch (error) {
    console.error(`Error writing output file: ${error.message}`);
    process.exit(1);
  }
}

main();
