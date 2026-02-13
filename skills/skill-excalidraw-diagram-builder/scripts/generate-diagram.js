#!/usr/bin/env node

/**
 * generate-diagram.js
 *
 * Generates Excalidraw architecture diagrams from a configuration JSON file.
 *
 * Usage:
 *   node generate-diagram.js --config <path> --output <path> [--layout <type>] [--style <preset>]
 *
 * Arguments:
 *   --config   Path to architecture configuration JSON
 *   --output   Output path for .excalidraw file
 *   --layout   Override layout type (hierarchical, grid, force)
 *   --style    Style preset (default, minimal, detailed)
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    parsed[key] = value;
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

// Generate random seed for roughness
function generateSeed() {
  return Math.floor(Math.random() * 2147483647);
}

// Component type styles
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
  fontFamily: 1, // Virgil (hand-drawn)
  strokeWidth: 2,
  roughness: 1,
  opacity: 100
};

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

// Create a shape element (rectangle, ellipse, diamond)
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

  // Store component ID for reference
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

// Create arrow/connection element
function createArrow(connection, startElement, endElement) {
  const style = CONNECTION_STYLES[connection.type] || CONNECTION_STYLES.sync;
  const customStyle = connection.style || {};

  // Calculate connection points
  const startX = startElement.x + startElement.width / 2;
  const startY = startElement.y + startElement.height;
  const endX = endElement.x + endElement.width / 2;
  const endY = endElement.y;

  const arrow = createBaseElement('arrow', startX, startY, 0, 0);

  // Calculate relative points
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

// Create text label for arrow
function createArrowLabel(label, arrow) {
  // Position label at midpoint of arrow
  const midX = arrow.x + (arrow.points[1][0] / 2) - 30;
  const midY = arrow.y + (arrow.points[1][1] / 2) - 10;

  return createTextLabel(label, midX, midY, 60);
}

// Calculate component positions using hierarchical layout
function calculateHierarchicalLayout(components, layout) {
  const spacing = layout.spacing || { horizontal: 250, vertical: 150 };
  const padding = layout.padding || 50;
  const direction = layout.direction || 'top-down';

  // Group components by layer
  const layers = {};
  components.forEach(comp => {
    const layer = comp.layer || 0;
    if (!layers[layer]) {
      layers[layer] = [];
    }
    layers[layer].push(comp);
  });

  // Sort layers
  const layerNums = Object.keys(layers).map(Number).sort((a, b) => a - b);

  // Calculate positions
  const positions = {};

  layerNums.forEach((layerNum, layerIndex) => {
    const layerComps = layers[layerNum];

    // Sort by position within layer
    layerComps.sort((a, b) => (a.position || 0) - (b.position || 0));

    const layerWidth = layerComps.length * spacing.horizontal;
    const startX = padding + (layerWidth > 0 ? -layerWidth / 2 + spacing.horizontal / 2 : 0);

    layerComps.forEach((comp, posIndex) => {
      if (direction === 'top-down') {
        positions[comp.id] = {
          x: startX + posIndex * spacing.horizontal + (layerWidth / 2),
          y: padding + layerIndex * spacing.vertical
        };
      } else if (direction === 'left-right') {
        positions[comp.id] = {
          x: padding + layerIndex * spacing.horizontal,
          y: startX + posIndex * spacing.vertical + (layerWidth / 2)
        };
      }
    });
  });

  return positions;
}

// Calculate positions using grid layout
function calculateGridLayout(components, layout) {
  const spacing = layout.spacing || { horizontal: 250, vertical: 150 };
  const padding = layout.padding || 50;
  const columns = layout.columns || Math.ceil(Math.sqrt(components.length));

  const positions = {};

  components.forEach((comp, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;

    positions[comp.id] = {
      x: padding + col * spacing.horizontal,
      y: padding + row * spacing.vertical
    };
  });

  return positions;
}

// Main diagram generation function
function generateDiagram(config) {
  const elements = [];
  const componentElements = {};

  // Calculate layout
  const layoutType = config.layout?.type || 'hierarchical';
  let positions;

  switch (layoutType) {
    case 'grid':
      positions = calculateGridLayout(config.components, config.layout);
      break;
    case 'hierarchical':
    default:
      positions = calculateHierarchicalLayout(config.components, config.layout);
  }

  // Create component shapes
  config.components.forEach(component => {
    const pos = positions[component.id];
    const width = DEFAULTS.componentWidth;
    const height = DEFAULTS.componentHeight;

    // Create shape
    const shape = createShape(component, pos.x, pos.y, width, height);
    elements.push(shape);
    componentElements[component.id] = shape;

    // Create label
    const labelText = component.name || component.id;
    const label = createTextLabel(
      labelText,
      pos.x + width / 2 - (labelText.length * 4),
      pos.y + height / 2 - 12,
      width - 20,
      shape.id
    );

    // Bind label to shape
    shape.boundElements = [{ id: label.id, type: 'text' }];

    elements.push(label);
  });

  // Create connections
  if (config.connections) {
    config.connections.forEach(connection => {
      const startElement = componentElements[connection.from];
      const endElement = componentElements[connection.to];

      if (startElement && endElement) {
        // Add arrow to bound elements of both shapes
        const arrow = createArrow(connection, startElement, endElement);

        // Update bound elements
        if (!startElement.boundElements) startElement.boundElements = [];
        if (!endElement.boundElements) endElement.boundElements = [];

        startElement.boundElements.push({ id: arrow.id, type: 'arrow' });
        endElement.boundElements.push({ id: arrow.id, type: 'arrow' });

        elements.push(arrow);

        // Add label if specified
        if (connection.label) {
          const arrowLabel = createArrowLabel(connection.label, arrow);
          elements.push(arrowLabel);
        }
      }
    });
  }

  // Build final Excalidraw document
  const excalidrawDoc = {
    type: 'excalidraw',
    version: 2,
    source: 'claude-architecture-skill',
    elements,
    appState: {
      gridSize: null,
      viewBackgroundColor: '#ffffff'
    },
    files: {}
  };

  return excalidrawDoc;
}

// Main execution
function main() {
  const args = parseArgs();

  if (!args.config || !args.output) {
    console.error('Usage: node generate-diagram.js --config <path> --output <path>');
    console.error('');
    console.error('Arguments:');
    console.error('  --config   Path to architecture configuration JSON');
    console.error('  --output   Output path for .excalidraw file');
    console.error('  --layout   Override layout type (hierarchical, grid)');
    console.error('  --style    Style preset (default, minimal, detailed)');
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

  // Override layout if specified
  if (args.layout) {
    config.layout = config.layout || {};
    config.layout.type = args.layout;
  }

  // Generate diagram
  console.log('Generating architecture diagram...');
  console.log(`  Components: ${config.components?.length || 0}`);
  console.log(`  Connections: ${config.connections?.length || 0}`);
  console.log(`  Layout: ${config.layout?.type || 'hierarchical'}`);

  const diagram = generateDiagram(config);

  // Write output
  const outputPath = args.output.endsWith('.excalidraw')
    ? args.output
    : `${args.output}.excalidraw`;

  try {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(diagram, null, 2));
    console.log(`\nDiagram generated successfully: ${outputPath}`);
    console.log(`  Total elements: ${diagram.elements.length}`);
  } catch (error) {
    console.error(`Error writing output file: ${error.message}`);
    process.exit(1);
  }
}

main();
