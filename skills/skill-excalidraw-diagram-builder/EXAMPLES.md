# Architecture Diagram Examples

This document provides example configurations and patterns for common architecture types. Use these as references when generating diagrams.

## Example 1: Three-Tier Web Application

A classic web application with frontend, backend API, and database layers.

### Configuration

```json
{
  "metadata": {
    "title": "Three-Tier Web Application",
    "description": "Standard web app with React frontend, Node.js API, and PostgreSQL"
  },
  "layout": {
    "type": "hierarchical",
    "direction": "top-down",
    "spacing": { "horizontal": 250, "vertical": 150 }
  },
  "components": [
    {
      "id": "frontend",
      "type": "frontend",
      "name": "React Frontend",
      "description": "Single-page application",
      "layer": 0,
      "position": 0
    },
    {
      "id": "api",
      "type": "service",
      "name": "Node.js API",
      "description": "REST API server",
      "layer": 1,
      "position": 0
    },
    {
      "id": "database",
      "type": "database",
      "name": "PostgreSQL",
      "description": "Primary database",
      "layer": 2,
      "position": 0
    }
  ],
  "connections": [
    {
      "from": "frontend",
      "to": "api",
      "type": "sync",
      "label": "HTTP/REST"
    },
    {
      "from": "api",
      "to": "database",
      "type": "sync",
      "label": "SQL"
    }
  ]
}
```

### Visual Layout

```
┌─────────────────┐
│  React Frontend │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│   Node.js API   │
└────────┬────────┘
         │ SQL
         ▼
┌─────────────────┐
│   PostgreSQL    │
└─────────────────┘
```

---

## Example 2: Microservices Architecture

A distributed system with multiple services, API gateway, and shared infrastructure.

### Configuration

```json
{
  "metadata": {
    "title": "E-Commerce Microservices",
    "description": "Distributed microservices for e-commerce platform"
  },
  "layout": {
    "type": "hierarchical",
    "direction": "top-down",
    "spacing": { "horizontal": 200, "vertical": 120 }
  },
  "components": [
    {
      "id": "client",
      "type": "frontend",
      "name": "Web Client",
      "layer": 0,
      "position": 1
    },
    {
      "id": "gateway",
      "type": "gateway",
      "name": "API Gateway",
      "description": "Kong/nginx",
      "layer": 1,
      "position": 1
    },
    {
      "id": "user-service",
      "type": "service",
      "name": "User Service",
      "layer": 2,
      "position": 0
    },
    {
      "id": "product-service",
      "type": "service",
      "name": "Product Service",
      "layer": 2,
      "position": 1
    },
    {
      "id": "order-service",
      "type": "service",
      "name": "Order Service",
      "layer": 2,
      "position": 2
    },
    {
      "id": "user-db",
      "type": "database",
      "name": "Users DB",
      "layer": 3,
      "position": 0
    },
    {
      "id": "product-db",
      "type": "database",
      "name": "Products DB",
      "layer": 3,
      "position": 1
    },
    {
      "id": "order-db",
      "type": "database",
      "name": "Orders DB",
      "layer": 3,
      "position": 2
    },
    {
      "id": "message-queue",
      "type": "queue",
      "name": "RabbitMQ",
      "layer": 2,
      "position": 3
    },
    {
      "id": "cache",
      "type": "cache",
      "name": "Redis Cache",
      "layer": 1,
      "position": 2
    }
  ],
  "connections": [
    { "from": "client", "to": "gateway", "type": "sync", "label": "HTTPS" },
    { "from": "gateway", "to": "user-service", "type": "sync" },
    { "from": "gateway", "to": "product-service", "type": "sync" },
    { "from": "gateway", "to": "order-service", "type": "sync" },
    { "from": "user-service", "to": "user-db", "type": "sync" },
    { "from": "product-service", "to": "product-db", "type": "sync" },
    { "from": "order-service", "to": "order-db", "type": "sync" },
    { "from": "order-service", "to": "message-queue", "type": "async", "label": "Events" },
    { "from": "message-queue", "to": "user-service", "type": "async" },
    { "from": "gateway", "to": "cache", "type": "sync", "label": "Cache" }
  ],
  "groups": [
    {
      "id": "services-group",
      "name": "Microservices",
      "componentIds": ["user-service", "product-service", "order-service"]
    },
    {
      "id": "data-group",
      "name": "Data Layer",
      "componentIds": ["user-db", "product-db", "order-db"]
    }
  ]
}
```

### Visual Layout

```
                    ┌─────────────┐
                    │ Web Client  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐     ┌─────────────┐
                    │ API Gateway │────▶│ Redis Cache │
                    └──────┬──────┘     └─────────────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │User Service │ │Product Svc  │ │Order Service│◀│  RabbitMQ   │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └─────────────┘
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  Users DB   │ │ Products DB │ │  Orders DB  │
    └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Example 3: Event-Driven Architecture

A system based on event sourcing and CQRS patterns.

### Configuration

```json
{
  "metadata": {
    "title": "Event-Driven System",
    "description": "CQRS and Event Sourcing architecture"
  },
  "layout": {
    "type": "hierarchical",
    "direction": "left-right",
    "spacing": { "horizontal": 180, "vertical": 100 }
  },
  "components": [
    {
      "id": "command-api",
      "type": "service",
      "name": "Command API",
      "description": "Write operations",
      "layer": 0,
      "position": 0
    },
    {
      "id": "query-api",
      "type": "service",
      "name": "Query API",
      "description": "Read operations",
      "layer": 0,
      "position": 2
    },
    {
      "id": "event-store",
      "type": "database",
      "name": "Event Store",
      "description": "Append-only event log",
      "layer": 1,
      "position": 0
    },
    {
      "id": "event-bus",
      "type": "queue",
      "name": "Event Bus",
      "description": "Kafka",
      "layer": 1,
      "position": 1
    },
    {
      "id": "projector",
      "type": "service",
      "name": "Projector",
      "description": "Event processor",
      "layer": 2,
      "position": 1
    },
    {
      "id": "read-db",
      "type": "database",
      "name": "Read Model DB",
      "description": "Denormalized views",
      "layer": 2,
      "position": 2
    }
  ],
  "connections": [
    { "from": "command-api", "to": "event-store", "type": "sync", "label": "Store Event" },
    { "from": "event-store", "to": "event-bus", "type": "async", "label": "Publish" },
    { "from": "event-bus", "to": "projector", "type": "async", "label": "Subscribe" },
    { "from": "projector", "to": "read-db", "type": "sync", "label": "Update View" },
    { "from": "query-api", "to": "read-db", "type": "sync", "label": "Query" }
  ]
}
```

---

## Example 4: Serverless Architecture

AWS Lambda-based serverless application.

### Configuration

```json
{
  "metadata": {
    "title": "Serverless Image Processing",
    "description": "AWS Lambda-based image processing pipeline"
  },
  "layout": {
    "type": "hierarchical",
    "direction": "left-right",
    "spacing": { "horizontal": 200, "vertical": 120 }
  },
  "components": [
    {
      "id": "api-gw",
      "type": "gateway",
      "name": "API Gateway",
      "layer": 0,
      "position": 0
    },
    {
      "id": "upload-lambda",
      "type": "service",
      "name": "Upload Handler",
      "description": "Lambda function",
      "layer": 1,
      "position": 0
    },
    {
      "id": "s3-bucket",
      "type": "storage",
      "name": "S3 Bucket",
      "description": "Image storage",
      "layer": 2,
      "position": 0
    },
    {
      "id": "process-lambda",
      "type": "service",
      "name": "Image Processor",
      "description": "Lambda function",
      "layer": 2,
      "position": 1
    },
    {
      "id": "dynamo",
      "type": "database",
      "name": "DynamoDB",
      "description": "Metadata store",
      "layer": 3,
      "position": 0
    },
    {
      "id": "sns",
      "type": "queue",
      "name": "SNS Topic",
      "description": "Notifications",
      "layer": 3,
      "position": 1
    }
  ],
  "connections": [
    { "from": "api-gw", "to": "upload-lambda", "type": "sync", "label": "Invoke" },
    { "from": "upload-lambda", "to": "s3-bucket", "type": "sync", "label": "Put Object" },
    { "from": "s3-bucket", "to": "process-lambda", "type": "event", "label": "S3 Event" },
    { "from": "process-lambda", "to": "dynamo", "type": "sync", "label": "Save Metadata" },
    { "from": "process-lambda", "to": "sns", "type": "async", "label": "Notify" }
  ]
}
```

---

## Example 5: Data Pipeline Architecture

ETL and data processing pipeline.

### Configuration

```json
{
  "metadata": {
    "title": "Data Analytics Pipeline",
    "description": "ETL pipeline for analytics processing"
  },
  "layout": {
    "type": "hierarchical",
    "direction": "left-right",
    "spacing": { "horizontal": 180, "vertical": 100 }
  },
  "components": [
    {
      "id": "sources",
      "type": "external",
      "name": "Data Sources",
      "description": "APIs, DBs, Files",
      "layer": 0,
      "position": 0
    },
    {
      "id": "ingestion",
      "type": "service",
      "name": "Ingestion Service",
      "description": "Apache NiFi",
      "layer": 1,
      "position": 0
    },
    {
      "id": "raw-storage",
      "type": "storage",
      "name": "Data Lake (Raw)",
      "description": "S3/HDFS",
      "layer": 2,
      "position": 0
    },
    {
      "id": "spark",
      "type": "service",
      "name": "Spark Processing",
      "description": "Transform & Clean",
      "layer": 3,
      "position": 0
    },
    {
      "id": "warehouse",
      "type": "database",
      "name": "Data Warehouse",
      "description": "Snowflake/Redshift",
      "layer": 4,
      "position": 0
    },
    {
      "id": "bi-tool",
      "type": "frontend",
      "name": "BI Dashboard",
      "description": "Tableau/Looker",
      "layer": 5,
      "position": 0
    }
  ],
  "connections": [
    { "from": "sources", "to": "ingestion", "type": "data", "label": "Extract" },
    { "from": "ingestion", "to": "raw-storage", "type": "data", "label": "Land" },
    { "from": "raw-storage", "to": "spark", "type": "data", "label": "Read" },
    { "from": "spark", "to": "warehouse", "type": "data", "label": "Load" },
    { "from": "warehouse", "to": "bi-tool", "type": "sync", "label": "Query" }
  ]
}
```

---

## Common Patterns

### Pattern: Load Balancer with Multiple Instances

```json
{
  "components": [
    { "id": "lb", "type": "gateway", "name": "Load Balancer", "layer": 0 },
    { "id": "app-1", "type": "service", "name": "App Instance 1", "layer": 1, "position": 0 },
    { "id": "app-2", "type": "service", "name": "App Instance 2", "layer": 1, "position": 1 },
    { "id": "app-3", "type": "service", "name": "App Instance 3", "layer": 1, "position": 2 }
  ],
  "connections": [
    { "from": "lb", "to": "app-1", "type": "sync" },
    { "from": "lb", "to": "app-2", "type": "sync" },
    { "from": "lb", "to": "app-3", "type": "sync" }
  ]
}
```

### Pattern: Database Replication

```json
{
  "components": [
    { "id": "primary-db", "type": "database", "name": "Primary DB", "layer": 0 },
    { "id": "replica-1", "type": "database", "name": "Read Replica 1", "layer": 1, "position": 0 },
    { "id": "replica-2", "type": "database", "name": "Read Replica 2", "layer": 1, "position": 1 }
  ],
  "connections": [
    { "from": "primary-db", "to": "replica-1", "type": "async", "label": "Replication" },
    { "from": "primary-db", "to": "replica-2", "type": "async", "label": "Replication" }
  ]
}
```

### Pattern: Circuit Breaker

```json
{
  "components": [
    { "id": "service-a", "type": "service", "name": "Service A" },
    { "id": "circuit-breaker", "type": "gateway", "name": "Circuit Breaker" },
    { "id": "service-b", "type": "external", "name": "External Service B" }
  ],
  "connections": [
    { "from": "service-a", "to": "circuit-breaker", "type": "sync" },
    { "from": "circuit-breaker", "to": "service-b", "type": "sync", "label": "Protected Call" }
  ]
}
```

### Pattern: Sidecar Proxy

```json
{
  "components": [
    { "id": "app", "type": "service", "name": "Application" },
    { "id": "sidecar", "type": "gateway", "name": "Envoy Sidecar" }
  ],
  "connections": [
    { "from": "app", "to": "sidecar", "type": "sync", "label": "localhost" }
  ],
  "groups": [
    { "id": "pod", "name": "Pod", "componentIds": ["app", "sidecar"] }
  ]
}
```

---

## Usage Tips

1. **Start Simple**: Begin with core components, add detail iteratively
2. **Use Layers**: Group components by logical layers (presentation, business, data)
3. **Label Connections**: Always label connection types and protocols
4. **Group Related Items**: Use groups to visually cluster related services
5. **Consistent Naming**: Use clear, consistent names across the diagram
6. **Color Coding**: Use component type colors consistently
7. **Minimize Crossings**: Arrange components to reduce line crossings
