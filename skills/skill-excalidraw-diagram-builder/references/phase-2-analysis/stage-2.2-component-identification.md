# Identifying Components Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Spawning Component Discovery Subagents](#01--spawning-component-discovery-subagents)
  - [02 / Identifying Services and Modules](#02--identifying-services-and-modules)
  - [03 / Discovering Data Stores](#03--discovering-data-stores)
  - [04 / Finding External Integrations](#04--finding-external-integrations)
  - [05 / Detecting Message Systems](#05--detecting-message-systems)
  - [06 / Building Component Inventory](#06--building-component-inventory)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference guides the agent through identifying all architectural components in the codebase. Using agent-driven exploration with subagents allows for parallel discovery, adaptive pattern matching, and contextual understanding that rigid scripts cannot provide.

## Input Validation Criteria

This step requires validated output from [Stage 2.1: Exploring Codebase](./stage-2.1-codebase-exploration.md).

You **MUST** verify the following inputs before proceeding:

| Input | Required | Validation |
|-------|----------|------------|
| `project_type` | Yes | Valid project type from Stage 2.1 |
| `architecture_style` | Yes | Valid architecture style from Stage 2.1 |
| `directory_structure` | Yes | Categorized directory map from Stage 2.1 |
| `key_files` | Yes | Paths to configuration files from Stage 2.1 |

If input validation fails, you **MUST** return to Stage 2.1 to complete the codebase exploration.

## Step Instructions

### 01 / Spawning Component Discovery Subagents

You **SHOULD** spawn multiple `Explore` subagents in parallel to discover different component types simultaneously.

**Step 1a: Parallel Component Discovery**

For comprehensive codebases, spawn subagents for each component category:

```
Task (parallel):
  subagent_type: "Explore"
  description: "Find services and modules"
  prompt: "Search for service and module definitions..."

Task (parallel):
  subagent_type: "Explore"
  description: "Find data stores"
  prompt: "Search for database and cache configurations..."

Task (parallel):
  subagent_type: "Explore"
  description: "Find external integrations"
  prompt: "Search for third-party service integrations..."
```

**Step 1b: Subagent Coordination**

You **MUST** aggregate results from all subagents and resolve any conflicts or duplicates. The subagent approach enables:
- Parallel exploration of large codebases
- Specialized prompts for each component type
- Faster overall discovery time

### 02 / Identifying Services and Modules

You **MUST** identify the main application components based on the architecture style.

**Step 2a: Spawn Service Discovery Subagent**

```
Task:
  subagent_type: "Explore"
  description: "Identify services and modules"
  prompt: |
    Find all services and modules in this codebase. Based on the detected
    architecture style, look for:

    **For Microservices:**
    - Service directories under services/, microservices/, or packages/
    - Independent package.json/go.mod/requirements.txt per service
    - Docker containers defined in docker-compose.yml
    - Kubernetes deployments

    **For Monolith:**
    - Main application modules
    - Feature modules or bounded contexts
    - Controller/Service/Repository layers

    **For Serverless:**
    - Lambda function handlers
    - Function definitions in serverless.yml
    - API Gateway endpoints

    For each component found, return:
    1. Name/identifier
    2. Type (service, module, function, etc.)
    3. Directory path
    4. Brief description of its purpose (inferred from code/comments)

    Return as a structured list.
```

**Step 2b: Direct Service Search (Alternative)**

If not using subagents, search directly with `Grep` and `Glob`:

```
Grep: "class.*Service|@Service|@Injectable"
Grep: "class.*Controller|@Controller|@RestController"
Grep: "class.*Module|@Module"
Glob: "services/*/package.json"
Glob: "packages/*/index.ts"
```

**Step 2c: Service Detection Patterns**

| Pattern | Indicates |
|---------|-----------|
| `services/*/` directories | Microservice boundaries |
| `@Service`, `@Injectable` | Service classes |
| `@Controller`, `@RestController` | API controllers |
| `handler.js`, `handler.py` | Serverless functions |
| Independent `package.json` per dir | Monorepo packages |

### 03 / Discovering Data Stores

You **MUST** identify all database and storage components.

**Step 3a: Spawn Data Store Discovery Subagent**

```
Task:
  subagent_type: "Explore"
  description: "Find data stores"
  prompt: |
    Find all data stores used in this codebase. Search for:

    **Databases:**
    - Connection strings and configurations
    - ORM/ODM configurations (Prisma, TypeORM, Sequelize, SQLAlchemy, GORM)
    - Database migration files
    - Model/Entity definitions

    **Caches:**
    - Redis configurations
    - Memcached usage
    - In-memory cache implementations

    **File/Object Storage:**
    - S3 bucket configurations
    - Local file storage paths
    - CDN configurations

    **Search Engines:**
    - Elasticsearch configurations
    - Algolia/Meilisearch usage

    For each data store, return:
    1. Type (postgres, mysql, mongodb, redis, s3, etc.)
    2. Name/identifier
    3. Configuration file location
    4. Which services/modules use it (if identifiable)

    Do NOT capture actual credentials or connection strings.
```

**Step 3b: Direct Data Store Search**

```
Grep: "DATABASE_URL|DB_HOST|MONGODB_URI|REDIS_URL"
Grep: "createConnection|createPool|mongoose.connect"
Grep: "@Entity|@Table|@model"
Glob: "**/prisma/schema.prisma"
Glob: "**/migrations/*.sql"
```

**Step 3c: Data Store Detection Patterns**

| Pattern | Database Type |
|---------|---------------|
| `prisma/schema.prisma` | PostgreSQL/MySQL (Prisma) |
| `mongoose`, `mongodb` | MongoDB |
| `redis`, `ioredis` | Redis |
| `@aws-sdk/client-s3` | AWS S3 |
| `elasticsearch`, `@elastic` | Elasticsearch |

### 04 / Finding External Integrations

You **MUST** identify third-party service connections.

**Step 4a: Spawn Integration Discovery Subagent**

```
Task:
  subagent_type: "Explore"
  description: "Find external integrations"
  prompt: |
    Find all external service integrations in this codebase. Look for:

    **Payment Services:**
    - Stripe, PayPal, Square, Braintree

    **Authentication:**
    - Auth0, Okta, Firebase Auth, Cognito

    **Communication:**
    - SendGrid, Twilio, AWS SES, Mailgun

    **Cloud Services:**
    - AWS SDK usage (which services?)
    - Google Cloud APIs
    - Azure services

    **Third-party APIs:**
    - REST API clients
    - GraphQL clients
    - Webhook handlers

    For each integration, return:
    1. Service name
    2. Purpose (payment, auth, email, etc.)
    3. SDK/client library used
    4. Which internal services use it

    Return as a structured list.
```

**Step 4b: Direct Integration Search**

```
Grep: "stripe|paypal|braintree"
Grep: "auth0|okta|cognito|firebase"
Grep: "sendgrid|twilio|@aws-sdk"
Grep: "axios.create|fetch\(|new Client\("
```

### 05 / Detecting Message Systems

You **MUST** identify asynchronous communication components.

**Step 5a: Spawn Message System Discovery Subagent**

```
Task:
  subagent_type: "Explore"
  description: "Find message queues and event systems"
  prompt: |
    Find all message queues and event systems in this codebase. Look for:

    **Message Queues:**
    - RabbitMQ (amqplib, amqp)
    - Kafka (kafkajs, node-rdkafka)
    - AWS SQS
    - Redis pub/sub
    - BullMQ/Bull

    **Event Systems:**
    - EventEmitter patterns
    - Domain events
    - Event sourcing

    **Pub/Sub:**
    - Google Pub/Sub
    - AWS SNS
    - Redis pub/sub

    For each system found, return:
    1. Type (kafka, rabbitmq, sqs, etc.)
    2. Queue/topic names (if identifiable)
    3. Publishers (which services publish)
    4. Consumers (which services consume)

    Return as a structured list.
```

**Step 5b: Direct Message System Search**

```
Grep: "amqplib|kafkajs|sqs|BullQueue"
Grep: "publish|subscribe|emit|on\("
Grep: "@EventHandler|@Subscribe|@Consume"
Glob: "**/queues/*.ts"
Glob: "**/events/*.ts"
```

### 06 / Building Component Inventory

You **MUST** compile all discovered components into a unified inventory.

**Step 6a: Aggregate Subagent Results**

Combine findings from all subagents into a single component list:

```json
{
  "components": [
    {
      "id": "user-service",
      "type": "service",
      "name": "User Service",
      "path": "services/user-service",
      "description": "Handles user authentication and profile management"
    },
    {
      "id": "postgres-main",
      "type": "database",
      "name": "PostgreSQL",
      "path": "config/database.yml",
      "description": "Primary relational database"
    }
  ]
}
```

**Step 6b: Assign Component Types**

Categorize each component for diagram styling:

| Type | Category | Diagram Shape |
|------|----------|---------------|
| service | Application | Rounded rectangle |
| frontend | Application | Rounded rectangle |
| database | Data Store | Ellipse |
| cache | Data Store | Diamond |
| queue | Messaging | Rectangle |
| external | Integration | Dashed rectangle |

**Step 6c: Validate Component Coverage**

You **MUST** verify the inventory is complete by checking:
- All service directories are represented
- All databases in config files are included
- All external services from package dependencies are identified
- Message queues match what's in infrastructure files

**Step 6d: Request User Clarification**

If component boundaries are unclear, use `AskUserQuestion`:

```
AskUserQuestion:
  header: "Components"
  question: "I found these potential services but I'm unsure about their boundaries. Can you confirm?"
  options:
    - label: "Looks correct"
      description: "The identified components are accurate"
    - label: "Let me clarify"
      description: "I'll provide more details about the component structure"
```

## Output Validation Criteria

### Output Format

The output of this step is a structured component inventory in JSON format.

### Output Content

The output **MUST** include:

```json
{
  "components": [
    {
      "id": "unique-id",
      "type": "service | frontend | database | cache | queue | external",
      "name": "Human-readable name",
      "path": "path/to/component",
      "description": "Brief description",
      "technology": "nodejs | python | postgres | redis | etc"
    }
  ],
  "component_counts": {
    "services": 5,
    "databases": 2,
    "caches": 1,
    "queues": 1,
    "external": 3
  },
  "discovery_notes": "Any components that were difficult to classify or need user confirmation"
}
```

| Property | Required | Description |
|----------|----------|-------------|
| `components` | Yes | Array of all discovered components |
| `components[].id` | Yes | Unique identifier for the component |
| `components[].type` | Yes | Component category for styling |
| `components[].name` | Yes | Human-readable display name |
| `components[].path` | Conditional | Required for service/frontend types |
| `components[].description` | No | Brief description of purpose |
| `components[].technology` | No | Technology/framework used |
| `component_counts` | Yes | Summary counts by type |
| `discovery_notes` | No | Notes about uncertain classifications |

### Validation Process

Before proceeding to the next step, you **MUST** verify:

1. **Minimum Components**: At least one component has been identified
2. **Type Coverage**: Components span multiple types (services + data stores at minimum)
3. **No Duplicates**: Each component has a unique ID
4. **Paths Valid**: All paths reference actual directories/files

**Validation Failure Handling**:

| Failure | Resolution |
|---------|------------|
| No components found | Spawn additional subagents with broader search patterns |
| Missing data stores | Specifically search for database configuration files |
| Unclear component boundaries | Use `AskUserQuestion` to clarify with user |

### Internal Use

Use this component inventory to map relationships in the next step. Proceed to [Stage 2.3: Mapping Relationships](./stage-2.3-relationship-mapping.md).
