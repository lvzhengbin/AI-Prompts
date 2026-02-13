# Exploring Codebase Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Spawning Initial Exploration Subagent](#01--spawning-initial-exploration-subagent)
  - [02 / Identifying Project Type](#02--identifying-project-type)
  - [03 / Detecting Architecture Style](#03--detecting-architecture-style)
  - [04 / Mapping Directory Structure](#04--mapping-directory-structure)
  - [05 / Locating Key Configuration Files](#05--locating-key-configuration-files)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)

## Purpose

This step reference guides the agent through exploring the codebase to gather foundational information about project structure and technology stack. Unlike script-based analysis, agent-driven exploration can adapt to unfamiliar patterns, ask clarifying questions, and make contextual decisions.

## Input Validation Criteria

This step requires validated output from Phase 1 (Discovering and Clarifying).

You **MUST** verify the following inputs before proceeding:

| Input | Required | Validation |
|-------|----------|------------|
| `workflow_type` | Yes | Must be `"create"` or `"update"` |
| `scope` | Yes | Must be one of: `"full-system"`, `"subsystem"`, `"data-flow"`, `"integration"` |
| `detail_level` | Yes | Must be one of: `"high-level"`, `"detailed"`, `"comprehensive"` |
| `focus_paths` | No | Array of valid directory paths if provided |
| `exclude_patterns` | No | Array of glob patterns if provided |

If input validation fails, you **MUST** return to the appropriate Phase 1 step to collect the missing or invalid information.

## Step Instructions

### 01 / Spawning Initial Exploration Subagent

You **SHOULD** spawn an `Explore` subagent to perform a quick initial survey of the codebase.

**Step 1a: Quick Survey Subagent**

Use the `Task` tool with `subagent_type: "Explore"` for initial reconnaissance:

```
Task:
  subagent_type: "Explore"
  description: "Survey codebase structure"
  prompt: |
    Perform a quick survey of this codebase to identify:
    1. Primary programming language(s) used
    2. Project type (web app, API, library, monorepo, etc.)
    3. Top-level directory structure
    4. Key configuration files present (package.json, requirements.txt, etc.)

    Return a structured summary of your findings.
```

**Step 1b: Interpret Subagent Results**

You **MUST** use the subagent's findings to guide subsequent exploration steps. The subagent provides:
- Initial understanding of project structure
- Identification of which exploration patterns to prioritize
- Detection of unusual or custom project structures

### 02 / Identifying Project Type

You **MUST** determine the primary project type by checking for configuration files.

**Step 2a: Use Glob to Find Config Files**

```
Glob: "**/package.json"
Glob: "**/requirements.txt"
Glob: "**/pyproject.toml"
Glob: "**/go.mod"
Glob: "**/Cargo.toml"
Glob: "**/pom.xml"
Glob: "**/build.gradle"
```

**Step 2b: Project Type Detection Table**

| Files Found | Project Type |
|-------------|--------------|
| `package.json` | Node.js/JavaScript/TypeScript |
| `requirements.txt`, `pyproject.toml`, `Pipfile` | Python |
| `pom.xml`, `build.gradle`, `build.gradle.kts` | Java/Kotlin |
| `go.mod`, `go.sum` | Go |
| `Cargo.toml` | Rust |
| `composer.json` | PHP |
| `Gemfile` | Ruby |
| `*.csproj`, `*.sln` | .NET |

**Step 2c: Read Primary Config File**

You **MUST** read the primary configuration file to understand dependencies:

```
Read: package.json (for Node.js)
Read: requirements.txt or pyproject.toml (for Python)
Read: go.mod (for Go)
```

### 03 / Detecting Architecture Style

You **MUST** determine the architecture style to inform diagram layout.

**Step 3a: Spawn Architecture Detection Subagent**

For complex codebases, use a subagent for thorough analysis:

```
Task:
  subagent_type: "Explore"
  description: "Detect architecture style"
  prompt: |
    Analyze this codebase to determine its architecture style. Look for:

    **Microservices indicators:**
    - Multiple service directories (services/, microservices/)
    - docker-compose.yml with multiple services
    - Kubernetes manifests
    - API gateway configurations

    **Monolith indicators:**
    - Single src/ or app/ directory
    - Unified entry point (main.py, index.js, main.go)
    - Layered structure (controllers/, services/, models/)

    **Serverless indicators:**
    - serverless.yml or sam.yaml
    - Lambda function directories
    - AWS CDK or Terraform with Lambda resources

    **Event-driven indicators:**
    - Event handler directories (events/, handlers/)
    - Message queue configurations (kafka, rabbitmq, sqs)
    - Event sourcing patterns

    Return the detected style with supporting evidence.
```

**Step 3b: Direct Detection (Alternative)**

If not using a subagent, check for indicators directly:

```
Glob: "**/docker-compose.yml"
Glob: "**/serverless.yml"
Glob: "**/k8s/**/*.yaml"
Grep: "addEventListener|EventEmitter|@EventHandler" (for event-driven)
```

**Step 3c: Architecture Style Matrix**

| Style | Key Indicators |
|-------|----------------|
| Microservices | Multiple service dirs, docker-compose with >3 services, K8s manifests |
| Monolith | Single src/, layered directories, unified build |
| Serverless | serverless.yml, Lambda handlers, API Gateway configs |
| Event-driven | Event handlers, message queue clients, pub/sub patterns |
| Hybrid | Combination of above (common in real-world systems) |

### 04 / Mapping Directory Structure

You **MUST** build a comprehensive map of the project layout.

**Step 4a: Spawn Directory Mapping Subagent**

For thorough exploration:

```
Task:
  subagent_type: "Explore"
  description: "Map directory structure"
  prompt: |
    Create a comprehensive map of this codebase's directory structure.
    Categorize directories into:

    - **Source code**: src/, lib/, app/, pkg/
    - **Services**: services/, microservices/, packages/
    - **API**: api/, routes/, controllers/, handlers/
    - **Frontend**: web/, client/, frontend/, ui/
    - **Configuration**: config/, conf/, settings/
    - **Infrastructure**: infra/, terraform/, k8s/, deploy/
    - **Tests**: test/, tests/, __tests__/, spec/
    - **Documentation**: docs/, doc/

    For each directory found, note:
    1. Its category
    2. Approximate number of files
    3. Any notable patterns in naming

    Exclude: node_modules, vendor, dist, build, .git, __pycache__
```

**Step 4b: Direct Directory Exploration**

You **MAY** also explore directly using tools:

```
Glob: "src/**"
Glob: "services/*"
Glob: "packages/*"
Glob: "apps/*"
```

**Step 4c: Record Directory Categories**

Build an internal map categorizing discovered directories:

```json
{
  "source": ["src/"],
  "services": ["services/user-service", "services/order-service"],
  "api": ["api/"],
  "frontend": ["web/", "mobile/"],
  "config": ["config/"],
  "infrastructure": ["terraform/", "k8s/"]
}
```

### 05 / Locating Key Configuration Files

You **MUST** identify configuration and infrastructure files that define the architecture.

**Step 5a: Find Infrastructure Files**

Use `Glob` to locate infrastructure definitions:

```
Glob: "**/Dockerfile"
Glob: "**/docker-compose*.yml"
Glob: "**/kubernetes/**/*.yaml"
Glob: "**/k8s/**/*.yaml"
Glob: "**/terraform/**/*.tf"
Glob: "**/.github/workflows/*.yml"
```

**Step 5b: Find API Specifications**

```
Glob: "**/openapi.yaml"
Glob: "**/swagger.json"
Glob: "**/*.graphql"
Glob: "**/*.proto"
```

**Step 5c: Find Application Configuration**

```
Glob: "**/*.config.js"
Glob: "**/*.config.ts"
Glob: "**/config/*.yaml"
Glob: "**/config/*.json"
Glob: "**/.env.example"
```

**Step 5d: Read Key Files**

You **SHOULD** read key configuration files to understand:
- Service definitions (docker-compose.yml)
- Deployment structure (K8s manifests)
- Environment variables (.env.example)
- API endpoints (openapi.yaml)

## Output Validation Criteria

### Output Format

The output of this step is structured JSON that **MUST** be stored internally for use by subsequent steps.

### Output Content

The output **MUST** include the following properties:

```json
{
  "project_type": "nodejs | python | java | go | rust | php | ruby | dotnet",
  "architecture_style": "microservices | monolith | serverless | event-driven | hybrid",
  "directory_structure": {
    "source": ["src/"],
    "services": ["services/user", "services/order"],
    "api": ["api/"],
    "frontend": ["web/"],
    "config": ["config/"],
    "infrastructure": ["terraform/", "k8s/"]
  },
  "infrastructure": {
    "containerization": "docker | kubernetes | none",
    "ci_cd": "github-actions | gitlab-ci | jenkins | none",
    "iaas": "terraform | cloudformation | none"
  },
  "key_files": {
    "config": ["config/app.config.js", "config/database.yml"],
    "infrastructure": ["Dockerfile", "docker-compose.yml"],
    "api_specs": ["openapi.yaml"]
  },
  "exploration_notes": "Any unusual patterns or findings worth noting"
}
```

| Property | Required | Description |
|----------|----------|-------------|
| `project_type` | Yes | Primary language/runtime |
| `architecture_style` | Yes | Detected architecture pattern |
| `directory_structure` | Yes | Categorized directory map |
| `infrastructure` | Yes | Infrastructure tooling detected |
| `key_files` | Yes | Paths to important configuration files |
| `exploration_notes` | No | Observations about unusual patterns |

### Validation Process

Before proceeding to the next step, you **MUST** verify:

1. **Project Type Identified**: A primary project type has been determined
2. **Architecture Style Detected**: An architecture style has been identified
3. **Directory Structure Mapped**: Key directories have been categorized
4. **Key Files Located**: Configuration and infrastructure files have been found

If any required information is missing, you **SHOULD** spawn additional `Explore` subagents to investigate specific areas.

### Internal Use

Use this validated output internally to guide component identification in the next step. Proceed to [Stage 2.2: Identifying Components](./stage-2.2-component-identification.md).
