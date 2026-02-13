# Mapping Relationships Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Spawning Relationship Discovery Subagents](#01--spawning-relationship-discovery-subagents)
  - [02 / Tracing Service Dependencies](#02--tracing-service-dependencies)
  - [03 / Mapping Data Store Connections](#03--mapping-data-store-connections)
  - [04 / Discovering Async Communication](#04--discovering-async-communication)
  - [05 / Building Connection Inventory](#05--building-connection-inventory)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference guides the agent through identifying how components communicate and depend on each other. Agent-driven relationship mapping can follow code paths, understand context, and discover implicit relationships that pattern-matching alone would miss.

## Input Validation Criteria

This step requires validated output from [Stage 2.2: Identifying Components](./stage-2.2-component-identification.md).

You **MUST** verify the following inputs before proceeding:

| Input | Required | Validation |
|-------|----------|------------|
| `components` | Yes | Non-empty array of component objects |
| Each component `id` | Yes | Unique string identifier |
| Each component `type` | Yes | Valid component type |

If input validation fails, you **MUST** return to Stage 2.2 to complete component identification.

## Step Instructions

### 01 / Spawning Relationship Discovery Subagents

You **SHOULD** spawn `Explore` subagents to discover different relationship types in parallel.

**Step 1a: Parallel Relationship Discovery**

Spawn subagents for each relationship category:

```
Task (parallel):
  subagent_type: "Explore"
  description: "Find service-to-service communication"
  prompt: "Search for HTTP clients, API calls between services..."

Task (parallel):
  subagent_type: "Explore"
  description: "Find database connections"
  prompt: "Search for which services connect to which databases..."

Task (parallel):
  subagent_type: "Explore"
  description: "Find async communication"
  prompt: "Search for message queue publishers and consumers..."
```

**Step 1b: Provide Component Context**

When spawning subagents, you **SHOULD** include the component inventory so they know what to look for:

```
Task:
  subagent_type: "Explore"
  description: "Map service relationships"
  prompt: |
    Given these components:
    - user-service (services/user-service)
    - order-service (services/order-service)
    - postgresql (database)
    - redis (cache)

    Find all connections between them. Look for:
    - HTTP/REST calls between services
    - Database connections
    - Cache usage
    - Message passing
```

### 02 / Tracing Service Dependencies

You **MUST** identify how services communicate with each other.

**Step 2a: Spawn Service Communication Subagent**

```
Task:
  subagent_type: "Explore"
  description: "Trace service-to-service communication"
  prompt: |
    Find all communication paths between services in this codebase.

    **Look for HTTP/REST communication:**
    - axios, fetch, got, request library usage
    - Internal service URLs (localhost:PORT, service-name:PORT)
    - Environment variables like *_SERVICE_URL, *_API_URL

    **Look for gRPC communication:**
    - .proto file imports
    - gRPC client instantiation
    - Service stubs

    **Look for GraphQL federation:**
    - Schema stitching
    - Federated queries

    For each connection found, return:
    1. Source service
    2. Target service
    3. Protocol (HTTP, gRPC, GraphQL)
    4. Specific endpoints if identifiable
    5. Whether it's synchronous or async

    Return as a structured list of connections.
```

**Step 2b: Direct Service Communication Search**

If not using subagents, use `Grep` to find patterns:

```
Grep: "axios|fetch\(|got\(|http\.request"
Grep: "localhost:\d+|SERVICE_URL|_API_URL"
Grep: "grpc|\.proto|GrpcClient"
```

**Step 2c: Trace Import Dependencies**

For each service, trace what it imports:

```
Grep: "import.*from.*services|require.*services"
Grep: "from @shared|from @common|from @lib"
```

### 03 / Mapping Data Store Connections

You **MUST** identify which services access which data stores.

**Step 3a: Spawn Database Connection Subagent**

```
Task:
  subagent_type: "Explore"
  description: "Map database connections"
  prompt: |
    Find all database and cache connections in this codebase.

    For each service, identify:
    1. Which databases it connects to (Postgres, MySQL, MongoDB, etc.)
    2. Which caches it uses (Redis, Memcached)
    3. Access patterns (read-only, read-write)
    4. ORM/ODM being used (Prisma, TypeORM, Mongoose, etc.)

    Look for:
    - Database connection strings and configurations
    - ORM model definitions and which services use them
    - Repository patterns
    - Data access layers

    Return connections as:
    - service-id → database-id (access-type)

    Example: user-service → postgresql (read-write)
```

**Step 3b: Direct Database Connection Search**

```
Grep: "DATABASE_URL|DB_HOST|MONGODB_URI|REDIS_URL"
Grep: "createConnection|createPool|mongoose\.connect"
Grep: "@Entity|@Table|@model|prisma\."
```

**Step 3c: Match Services to Databases**

For each database found in Stage 2.2:
1. Search which services import/use database clients
2. Check configuration files for database references
3. Look for environment variable usage

### 04 / Discovering Async Communication

You **MUST** identify message queue and event-driven communication.

**Step 4a: Spawn Async Communication Subagent**

```
Task:
  subagent_type: "Explore"
  description: "Find message queue communication"
  prompt: |
    Find all asynchronous communication patterns in this codebase.

    **Message Queue Publishers:**
    - Which services publish to queues?
    - What queue/topic names?
    - What events are published?

    **Message Queue Consumers:**
    - Which services consume from queues?
    - What queue/topic names?
    - What handlers process messages?

    **Event Emitters:**
    - Internal event bus usage
    - Domain event patterns
    - Event sourcing

    Look for patterns:
    - publish(), emit(), send(), produce()
    - subscribe(), on(), consume(), listen()
    - Queue/topic names in strings or constants

    Return as:
    - publisher-service → queue → consumer-service
    - Include event/message types if identifiable
```

**Step 4b: Direct Async Pattern Search**

```
Grep: "\.publish\(|\.emit\(|producer\.send|sendToQueue"
Grep: "\.subscribe\(|\.on\(|consumer\.run|channel\.consume"
Grep: "amqplib|kafkajs|bullmq|@aws-sdk/client-sqs"
```

**Step 4c: Match Publishers to Consumers**

For each queue/topic found:
1. Identify all publishers
2. Identify all consumers
3. Create connections for each publisher → queue → consumer path

### 05 / Building Connection Inventory

You **MUST** compile all discovered relationships into a connection inventory.

**Step 5a: Aggregate Subagent Results**

Combine findings from all subagents into a unified connection list:

```json
{
  "connections": [
    {
      "id": "gateway-to-user",
      "from": "api-gateway",
      "to": "user-service",
      "type": "sync",
      "protocol": "HTTP",
      "label": "REST API"
    },
    {
      "id": "user-to-postgres",
      "from": "user-service",
      "to": "postgresql",
      "type": "sync",
      "protocol": "SQL"
    },
    {
      "id": "order-to-queue",
      "from": "order-service",
      "to": "rabbitmq",
      "type": "async",
      "protocol": "AMQP",
      "label": "order.created"
    }
  ]
}
```

**Step 5b: Validate Component References**

You **MUST** ensure all connections reference valid component IDs:

```
For each connection:
  - Verify "from" exists in component inventory
  - Verify "to" exists in component inventory
  - Remove or flag connections with invalid references
```

**Step 5c: Deduplicate Connections**

Remove duplicate connections (same from/to pair):
- Keep the most detailed version (one with labels, protocol info)
- Merge information from duplicates

**Step 5d: Assign Connection Types**

| Relationship | Type | Visual |
|--------------|------|--------|
| HTTP/REST calls | `sync` | Solid arrow |
| gRPC calls | `sync` | Solid arrow |
| Database queries | `sync` | Solid arrow |
| Cache read/write | `sync` | Solid arrow |
| Queue publish | `async` | Dashed arrow |
| Queue consume | `async` | Dashed arrow |
| Event emit | `event` | Dashed + triangle |
| Data pipeline | `data` | Dotted arrow |

**Step 5e: Request User Verification**

If relationship discovery is uncertain, use `AskUserQuestion`:

```
AskUserQuestion:
  header: "Connections"
  question: "I found these service connections. Are there any I missed or got wrong?"
  options:
    - label: "Looks complete"
      description: "The discovered connections are accurate"
    - label: "Missing connections"
      description: "There are connections I need to add"
    - label: "Incorrect connections"
      description: "Some connections are wrong and need correction"
```

## Output Validation Criteria

### Output Format

The output of this step is structured JSON representing all connections between components.

### Output Content

The output **MUST** include:

```json
{
  "connections": [
    {
      "id": "unique-connection-id",
      "from": "source-component-id",
      "to": "target-component-id",
      "type": "sync | async | data | event",
      "protocol": "HTTP | gRPC | SQL | AMQP | etc",
      "label": "Optional description"
    }
  ],
  "connection_counts": {
    "sync": 8,
    "async": 4,
    "data": 2
  },
  "discovery_notes": "Notes about uncertain or inferred connections"
}
```

**Connection Types**:

| Type | Visual Style | Use Case |
|------|--------------|----------|
| `sync` | Solid arrow | HTTP requests, database queries, gRPC calls |
| `async` | Dashed arrow | Message queue publish/subscribe |
| `data` | Dotted arrow | Data flow, ETL pipelines |
| `event` | Dashed + triangle | Event-driven, pub/sub patterns |

**Required Connection Properties**:

| Property | Required | Description |
|----------|----------|-------------|
| `id` | Yes | Unique connection identifier |
| `from` | Yes | Source component ID (must exist in components) |
| `to` | Yes | Target component ID (must exist in components) |
| `type` | Yes | Connection type: `sync`, `async`, `data`, or `event` |
| `protocol` | No | Communication protocol |
| `label` | No | Label to display on the connection arrow |

### Validation Process

Before proceeding to the next phase, you **MUST** verify:

1. **Valid References**: All `from` and `to` values reference existing component IDs
2. **Unique IDs**: All connection IDs are unique
3. **Valid Types**: All connection types are valid
4. **No Self-References**: No connection has the same `from` and `to` value
5. **Coverage Check**: Major components have at least one connection

**Validation Failure Handling**:

| Failure | Resolution |
|---------|------------|
| Invalid component reference | Remove connection or spawn subagent to verify |
| Missing connections | Spawn targeted subagents to investigate specific services |
| Uncertain relationships | Use `AskUserQuestion` to clarify with user |

### Internal Use

Use this validated output combined with the component inventory to build the complete architecture configuration for diagram generation. Proceed to [Stage 3.1: Planning Structure](../phase-3-generation/stage-3.1-structure-planning.md).
