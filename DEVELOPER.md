# Fire Guardians - Developer Documentation

Fire Guardians is a Progressive Web Application (PWA) for reporting and tracking wildfires in real time. Built on the [OctoMesh platform](https://www.meshmakers.io), it enables a community of users ("Fire Guardians") to report fire incidents, view them on an interactive map, and receive push notifications when fires are detected nearby.

**License:** MIT
**Repository:** <https://github.com/meshmakers/FireGuardians>

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Backend (ASP.NET Core)](#backend-aspnet-core)
5. [Frontend (Angular 21)](#frontend-angular-21)
6. [Construction Kit Data Model](#construction-kit-data-model)
7. [GraphQL API](#graphql-api)
8. [Authentication & Authorization](#authentication--authorization)
9. [Push Notifications](#push-notifications)
10. [Google Maps Integration](#google-maps-integration)
11. [Configuration](#configuration)
12. [Build & Run](#build--run)
13. [Docker & Deployment](#docker--deployment)
14. [CI/CD Pipeline](#cicd-pipeline)
15. [Setup Scripts](#setup-scripts)

---

## Architecture Overview

Fire Guardians follows a **full-stack SPA architecture** with a clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / PWA                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Angular 21 SPA (Standalone Components)                   │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │  │
│  │  │ Google Maps │  │ Apollo Client│  │ Service Worker  │   │  │
│  │  │ (Map View)  │  │ (GraphQL)    │  │ (Push + Cache)  │   │  │
│  │  └─────────────┘  └──────┬───────┘  └─────────────────┘   │  │
│  └───────────────────────────┼───────────────────────────────┘  │
│                              │ HTTPS + JWT                      │
└──────────────────────────────┼──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│  ASP.NET Core Host           │                                  │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │  Controllers          Services          Repositories      │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │ OIDC Config  │  │ Notification │  │ FireReports    │   │  │
│  │  │ Controller   │  │ Producer     │  │ Repository     │   │  │
│  │  └──────────────┘  │ (Background) │  ├────────────────┤   │  │
│  │                    └──────────────┘  │ Wallet         │   │  │
│  │                                      │ Repository     │   │  │
│  │                                      └────────┬───────┘   │  │
│  └───────────────────────────────────────────────┼───────────┘  │
└──────────────────────────────────────────────────┼──────────────┘
                                                   │ GraphQL
                                    ┌──────────────┴──────────────┐
                                    │   OctoMesh Asset Services   │
                                    │   (Multi-Tenant Backend)    │
                                    ├─────────────────────────────┤
                                    │   OctoMesh Identity Service │
                                    │   (OAuth 2.0 / OIDC)        │
                                    └─────────────────────────────┘
```

**Key architectural decisions:**

- The Angular SPA is hosted by the ASP.NET Core backend (`MapFallbackToFile("index.html")`)
- The frontend communicates with OctoMesh Asset Services **directly** via GraphQL (Apollo Angular), authenticated with JWT tokens
- The backend provides a configuration endpoint (`/_configuration`) and runs a background service for push notifications
- Data is modeled using OctoMesh Construction Kit (YAML-based schema) and stored in the OctoMesh multi-tenant data platform
- Authentication uses OAuth 2.0 / OIDC with support for Google and Facebook social login via OctoMesh Identity Service

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Angular | 21.x | SPA framework (standalone components, signals) |
| TypeScript | 5.9.x | Language |
| Angular Material | 21.x | UI component library |
| Apollo Angular | 13.x | GraphQL client |
| angular-oauth2-oidc | 20.x | OAuth 2.0 / OIDC authentication |
| Google Maps JS API | — | Interactive map rendering |
| @angular/google-maps | 21.x | Angular wrapper for Google Maps |
| RxJS | 7.8.x | Reactive programming |
| Angular Service Worker | 21.x | PWA support (caching, push) |
| @meshmakers/shared-auth | — | Shared authentication library |
| @meshmakers/shared-services | — | Shared services library |
| @meshmakers/shared-ui | — | Shared UI component library |
| @meshmakers/octo-services | — | OctoMesh service integration |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| ASP.NET Core | 10.0.x | Web host and API |
| .NET | 10.0 | Runtime |
| Meshmakers.Octo.Sdk.ServiceClient | — | OctoMesh SDK for data access |
| Lib.Net.Http.WebPush | 3.3.x | VAPID Web Push notifications |
| NLog | 6.0.x | Structured logging |
| System.IdentityModel.Tokens.Jwt | — | JWT token handling |

### Build & DevOps

| Tool | Purpose |
|---|---|
| Angular CLI | Frontend build tooling (esbuild) |
| @graphql-codegen | TypeScript type generation from GraphQL |
| Docker | Container builds (multi-stage) |
| Azure Pipelines | CI/CD |

---

## Project Structure

```
fire-guardians/
├── src/
│   ├── FireGuardiansWebApp/                    # ASP.NET Core backend + SPA host
│   │   ├── ClientApp/                          # Angular 21 frontend
│   │   │   ├── src/
│   │   │   │   ├── app/
│   │   │   │   │   ├── home/                   # Map view (main feature)
│   │   │   │   │   ├── create-fire-report/     # Fire report form
│   │   │   │   │   ├── navigation/             # Header, Footer, SideNav
│   │   │   │   │   ├── services/               # Angular services
│   │   │   │   │   │   ├── configuration/      # Backend config loader
│   │   │   │   │   │   ├── location/           # Geolocation & geocoding
│   │   │   │   │   │   ├── notification/       # Push notification subscription
│   │   │   │   │   │   └── wallet/             # User wallet management
│   │   │   │   │   ├── graphQL/                # GraphQL operations & codegen output
│   │   │   │   │   ├── models/                 # TypeScript interfaces
│   │   │   │   │   ├── shared/                 # Utilities & interceptors
│   │   │   │   │   ├── config/                 # Auth & service option defaults
│   │   │   │   │   └── styles/                 # SCSS theme
│   │   │   │   ├── environments/               # Environment configs
│   │   │   │   ├── assets/                     # Static assets
│   │   │   │   └── index.html
│   │   │   ├── angular.json
│   │   │   ├── package.json
│   │   │   ├── tsconfig.json
│   │   │   ├── codegen.yml                     # GraphQL codegen config
│   │   │   └── ngsw-config.json                # Service Worker config
│   │   ├── Controllers/
│   │   │   └── OidcConfigurationController.cs  # /_configuration endpoint
│   │   ├── Services/
│   │   │   ├── AuthenticationService.cs        # OAuth2 client credentials
│   │   │   └── FireNotificationsProducer.cs    # Background push notification service
│   │   ├── Repository/
│   │   │   ├── FireReports/
│   │   │   │   └── FireReportsRepository.cs    # Fire report data access
│   │   │   └── Wallets/
│   │   │       └── WalletRepository.cs         # Wallet data access
│   │   ├── Models/                             # Backend DTOs
│   │   │   ├── FireReportDto.cs
│   │   │   ├── WalletDto.cs
│   │   │   ├── NotificationSubscriptionDto.cs
│   │   │   ├── NamedEntityDto.cs
│   │   │   └── PushNotification.cs
│   │   ├── Program.cs                          # Application entry point
│   │   ├── FireGuardiansOptions.cs             # Configuration POCO
│   │   ├── Dockerfile
│   │   └── FireGuardiansWebApp.csproj
│   │
│   ├── FireGuardiansCkModel/                   # OctoMesh Construction Kit model
│   │   ├── ConstructionKit/
│   │   │   ├── ckModel.yaml                    # Model definition (ID, version, deps)
│   │   │   ├── types/
│   │   │   │   ├── fireReport.yaml             # FireReport type schema
│   │   │   │   ├── wallet.yaml                 # Wallet type schema
│   │   │   │   └── notificationSubscription.yaml
│   │   │   └── attributes/
│   │   │       └── attributes.yaml             # Attribute definitions
│   │   └── FireGuardiansCkModel.csproj
│   │
│   └── Directory.Build.props                   # Shared MSBuild properties
│
├── scripts/                                    # PowerShell setup scripts
│   ├── om-login-local.ps1                      # OctoMesh local login
│   ├── om-setupIdentityService.ps1             # OAuth client setup
│   ├── om-create-tenants.ps1                   # Tenant creation
│   ├── om-delete-tenants.ps1                   # Tenant deletion
│   ├── om-importck.ps1                         # Construction Kit import
│   └── ck-basic.yaml                           # Basic CK definition
│
├── devops-build/                               # Azure Pipelines config
│   ├── azure-pipelines.yml                     # Main pipeline
│   ├── build-and-push-docker-image.yml         # Docker build template
│   ├── set-version.yml                         # Version management
│   ├── update-build-number.yml                 # Build number template
│   ├── download-ca.yml                         # CA certificate download
│   └── handle-artifacts.yml                    # Artifact handling
│
├── FireGuardians.sln                           # Visual Studio solution
├── README.md
└── LICENSE
```

---

## Backend (ASP.NET Core)

### Entry Point — `Program.cs`

The backend uses the minimal hosting model. The startup sequence:

1. **NLog** logging is configured first to capture all startup errors
2. Configuration is loaded from `appsettings.json`, environment variables (prefix `FIRE_`), user secrets, and command line
3. Services are registered (DI container)
4. The HTTP pipeline is configured

```
Configuration Loading Order:
  appsettings.json → appsettings.{Environment}.json → Environment Variables (FIRE_*) → User Secrets → CLI args
```

### Configuration — `FireGuardiansOptions`

All application settings are bound from the `FireGuardians` configuration section:

| Property | Default | Description |
|---|---|---|
| `AssetServiceUrl` | `https://localhost:5001` | OctoMesh Asset Services endpoint |
| `AuthorityUrl` | `https://localhost:5003` | OIDC identity provider URL |
| `PublicUrl` | `https://localhost:44486` | Public-facing application URL |
| `TenantId` | `fireguardians` | OctoMesh tenant identifier |
| `ClientId` | `fire-guardians-app-backend` | OAuth2 client ID for backend |
| `ClientSecret` | — | OAuth2 client secret |
| `VapidPublicKey` | — | VAPID public key for Web Push |
| `VapidPrivateKey` | — | VAPID private key for Web Push |

### Controller — `OidcConfigurationController`

Single controller exposing `GET /_configuration`. Returns an `anonymous` endpoint (no auth required) with:

- OIDC issuer URL
- Client ID (different for debug vs release builds: `fire-guardians-app-debug` / `fire-guardians-app`)
- Asset service URL, tenant ID
- VAPID public key, scopes, redirect URIs

The frontend calls this at startup to dynamically configure OAuth and API endpoints.

### Repositories

Repositories use the OctoMesh SDK `TenantClient` to execute GraphQL queries against the Asset Services backend.

**`IFireReportsRepository`**
- `GetActiveFireReportsAsync()` — returns all fire reports
- `GetActiveFireReportsByPositionAsync(position, minDistance, maxDistance)` — geospatial query returning fire reports within a radius

**`IWalletRepository`**
- `GetWalletSubscriptionAsync(walletId, endpoint)` — checks if a push subscription exists
- `GetNewWalletsWithoutNotificationAsync()` — wallets that have never received a notification
- `GetWalletsNotificationUpdateCandidatesAsync()` — wallets due for a notification update
- `UpdateWalletNotificationUpdateDateTimeAsync(walletRtIds)` — marks wallets as notified

### Services

**`AuthenticationService`**
Handles OAuth2 client credentials flow for service-to-service communication. Manages token lifecycle (caching, expiration checks, refresh). Requests the `AssetSystemApiFullAccess` scope.

**`FireNotificationsProducer`** (Background Service)
Runs as an `IHostedService` on a 60-second interval:

1. Queries wallets that need initial or periodic notification updates
2. For each wallet, queries fire reports within a 10 km radius of the wallet's location
3. Builds a `PushNotification` message with fire report details
4. Sends Web Push notifications to all registered subscription endpoints
5. Updates the wallet's `LastNotificationUpdate` timestamp

```
Loop (every 60s):
  → Get wallets needing notification
  → For each wallet:
      → Query fire reports within 10 km
      → For each subscription endpoint:
          → Send Web Push notification
      → Update wallet notification timestamp
```

---

## Frontend (Angular 21)

### Bootstrap & Initialization

The app uses Angular's standalone component bootstrap (no `NgModule`):

```typescript
// main.ts
bootstrapApplication(AppComponent, appConfig);
```

The `appConfig` in `app.config.ts` registers all providers and runs the `initServices` initializer:

1. `ConfigurationService.loadConfigAsync()` — fetches `/_configuration` from the backend
2. Configures OAuth options (issuer, scopes, redirect URIs, client ID)
3. Configures OctoMesh service URLs
4. `AuthorizeService.initialize()` — sets up OAuth 2.0 with code flow + PKCE

### Routing

Defined in `app.routes.ts`:

| Path | Component | Guard |
|---|---|---|
| `/` | `HomeComponent` | `authorizeGuard` |
| `/report` | `CreateFireReportComponent` | `authorizeGuard` |

All routes are protected by the functional `authorizeGuard`, which redirects unauthenticated users to the login flow.

### Component Hierarchy

```
AppComponent
├── mat-sidenav-container
│   ├── mat-sidenav → SideNavListComponent
│   └── mat-sidenav-content
│       ├── HeaderComponent
│       ├── <router-outlet>
│       │   ├── HomeComponent        (path: /)
│       │   └── CreateFireReportComponent (path: /report)
│       └── FooterComponent
```

### Core Components

**`HomeComponent`** — The main application view

- Initializes Google Maps API via JSONP
- Gets the user's current location via the Geolocation API
- Creates/updates the user's wallet with their location
- Renders an interactive Google Map with:
  - Fire report markers (loaded dynamically based on map bounds)
  - A draggable marker for placing new fire reports
- On `boundsChanged`, fetches fire reports within the visible map area via GraphQL
- Fire report creation: user drags marker → confirms → reverse geocodes location → creates via GraphQL mutation

**`HeaderComponent`** — Top toolbar with:
- Application title and logo
- Notification subscription button (bell icon)
- User menu (login/logout)

**`SideNavListComponent`** — Drawer navigation with login/logout actions

**`FooterComponent`** — Displays application version

### Angular Services

**`ConfigurationService`**
- Loads dynamic configuration from `GET /_configuration`
- Exposes `config` property used by other services for API URLs, tenant ID, VAPID keys

**`LocationService`**
- `getCurrentLocation()` — wraps the browser Geolocation API in a Promise
- `getLocationName(latLng)` — reverse geocodes coordinates to a human-readable address using Google Maps Geocoder

**`WalletService`**
- `getWallet()` — fetches the current user's wallet by identity ID
- `createUpdateWalletLocation(center)` — creates a new wallet or updates an existing wallet's location

**`NotificationService`**
- `subscribeToNotifications()` — subscribes the user to Web Push notifications:
  1. Requests a push subscription from the Service Worker (`SwPush`)
  2. Checks if the subscription already exists in the backend
  3. Creates a new `NotificationSubscription` entity linked to the user's wallet

### HTTP Interceptors

**`authorizeInterceptor`** (functional interceptor from `@meshmakers/shared-auth`)
- Attaches JWT Bearer tokens to outgoing HTTP requests for authenticated API calls

**`MmHttpErrorInterceptor`** (from `@meshmakers/shared-services`)
- Catches HTTP errors and propagates errors to the `MessageService` for user-facing feedback

### GraphQL Integration

GraphQL operations are defined as `.graphql` files in `src/app/graphQL/` and processed by `@graphql-codegen` to generate type-safe Angular services.

The Apollo client is configured to connect to the OctoMesh GraphQL endpoint:
```
{assetServicesUrl}/tenants/{tenantId}/GraphQL
```

Cache uses `rtId` (runtime ID) as the unique data identifier:
```typescript
cache: new InMemoryCache({
  dataIdFromObject: (o) => o['rtId'],
})
```

### PWA Configuration

The Angular Service Worker (`ngsw-config.json`) provides:

- **Prefetch strategy** for the app shell (index.html, CSS, JS bundles)
- **Lazy strategy** for assets (images, fonts)
- Enables installability on mobile and desktop
- Supports background push notification delivery

---

## Construction Kit Data Model

The OctoMesh Construction Kit defines the application's data schema in YAML. The model ID is `FireGuardians-1.0.0` with a dependency on `Basic-[2.0,3.0)`.

### Entity Types

#### FireReport
Derived from `Basic/NamedEntity`

| Attribute | Type | Description |
|---|---|---|
| `Name` | String | Auto-generated location name (inherited) |
| `Description` | String | Optional description (inherited) |
| `Location` | GeospatialPoint | Geographic coordinates of the fire |
| `Image` | BinaryLinked | Optional photo evidence |
| `InitialNotificationSent` | Boolean | Whether the first notification was sent |

#### Wallet
Derived from `Basic/NamedEntity`

| Attribute | Type | Required | Description |
|---|---|---|---|
| `Name` | String | Yes | User display name (inherited) |
| `IdentityId` | String | Yes | User's OIDC identity identifier |
| `Location` | GeospatialPoint | No | User's home/primary location |
| `LastNotificationUpdate` | DateTime | No | Timestamp of last notification |

#### NotificationSubscription
Derived from `System/Entity`
**Association:** Parent-child relationship with Wallet

| Attribute | Type | Description |
|---|---|---|
| `Endpoint` | String | Web Push endpoint URL |
| `SubscriptionConfiguration` | String | Serialized push keys (p256dh, auth) |

### Entity Relationships

```
Wallet (1) ──── parent-child ────> (N) NotificationSubscription
```

Each user has one Wallet. A Wallet can have multiple NotificationSubscriptions (one per browser/device).

---

## GraphQL API

All GraphQL operations target the OctoMesh Asset Services endpoint:
```
{assetServicesUrl}/tenants/{tenantId}/GraphQL
```

### Queries

**Get Fire Reports (geospatial)**
```graphql
query getFireReports($position: GeoSpatialPositionInput!, $maxDistance: Float) {
  runtime {
    fireGuardiansFireReport(
      filter: { location: { near: { position: $position, maxDistance: $maxDistance } } }
    ) {
      items {
        rtId, name, description, rtCreationDateTime
        location { distance, point { coordinates { latitude, longitude } } }
      }
    }
  }
}
```

**Get Wallet by Identity ID**
```graphql
query getWallet($identityId: String!) {
  runtime {
    fireGuardiansWallet(filter: { identityId: { eq: $identityId } }) {
      items { rtId, identityId, name, location { ... } }
    }
  }
}
```

### Mutations

**Create Fire Report**
```graphql
mutation createFireReport($position: GeoSpatialPositionInput!, $name: String!, $description: String) {
  runtime {
    fireGuardiansFireReports {
      create(entities: [{ name: $name, description: $description, location: $position }]) {
        rtId, name, location { ... }
      }
    }
  }
}
```

**Create Wallet / Update Location / Create Notification Subscription** — similar patterns for wallet and subscription management.

---

## Authentication & Authorization

### Frontend (User-Facing)

- **Protocol:** OAuth 2.0 Authorization Code flow with PKCE
- **Library:** `angular-oauth2-oidc` + `@meshmakers/shared-auth`
- **Identity Provider:** OctoMesh Identity Service
- **Social Login:** Google, Facebook (configured in OctoMesh)
- **Silent Refresh:** Token renewal without user interaction via `silent-refresh.html`
- **Guard:** `AuthorizeGuard` protects all routes; unauthenticated users are redirected to login

### Backend (Service-to-Service)

- **Protocol:** OAuth 2.0 Client Credentials flow
- **Client ID:** `fire-guardians-app-backend`
- **Scope:** `AssetSystemApiFullAccess`
- **Token Management:** `AuthenticationService` caches tokens and refreshes on expiration
- Used by the `FireNotificationsProducer` background service to query data and send notifications

### OAuth Clients

| Client ID | Type | Purpose |
|---|---|---|
| `fire-guardians-app` | Public | Production frontend |
| `fire-guardians-app-debug` | Public | Development frontend |
| `fire-guardians-app-backend` | Confidential | Backend service-to-service |

---

## Push Notifications

The notification system uses the **Web Push** protocol with **VAPID** authentication.

### Flow

```
1. User clicks "Subscribe" (bell icon in header)
2. Browser requests push permission → Service Worker creates PushSubscription
3. Frontend sends subscription details (endpoint, keys) to OctoMesh via GraphQL
4. Backend FireNotificationsProducer (every 60s):
   a. Queries wallets needing notifications
   b. For each wallet, queries fire reports within 10 km
   c. Sends Web Push message to each subscription endpoint
   d. Updates wallet's LastNotificationUpdate timestamp
5. Service Worker receives push → displays native notification
```

### Notification Frequency Control

- **Initial notification:** Sent to newly created wallets that have never been notified
- **Periodic updates:** Wallets are re-notified only after 24+ hours since the last notification
- **Radius:** Only fires within 10 km of the wallet's location trigger notifications

---

## Google Maps Integration

- **API:** Google Maps JavaScript API loaded via JSONP
- **Angular Integration:** `@angular/google-maps` (`GoogleMap`, `MapAdvancedMarker`)
- **Map ID:** `871348944e6aa7e7` (custom map styling)
- **Features:**
  - User location detection via Geolocation API
  - Fire report markers loaded dynamically on map pan/zoom (`boundsChanged` event)
  - Draggable marker for new fire report placement
  - Reverse geocoding via `google.maps.Geocoder` for location names
  - Haversine formula for distance calculation between map bounds

---

## Configuration

### Backend Configuration

Settings are loaded from multiple sources (later sources override earlier ones):

```
appsettings.json
  → appsettings.{Environment}.json
    → Environment variables (FIRE_* prefix)
      → User secrets
        → Command line arguments
```

**Environment variable mapping** (prefix `FIRE_`):

| Environment Variable | Maps To |
|---|---|
| `FIRE_FireGuardians__AssetServiceUrl` | `FireGuardians:AssetServiceUrl` |
| `FIRE_FireGuardians__AuthorityUrl` | `FireGuardians:AuthorityUrl` |
| `FIRE_FireGuardians__TenantId` | `FireGuardians:TenantId` |
| `FIRE_FireGuardians__VapidPublicKey` | `FireGuardians:VapidPublicKey` |
| `FIRE_FireGuardians__VapidPrivateKey` | `FireGuardians:VapidPrivateKey` |
| `FIRE_FireGuardians__ClientId` | `FireGuardians:ClientId` |
| `FIRE_FireGuardians__ClientSecret` | `FireGuardians:ClientSecret` |

### Frontend Configuration

The frontend fetches all configuration dynamically from `GET /_configuration` at startup. No environment-specific configuration files are needed in the Angular build — everything is driven by the backend configuration.

---

## Build & Run

### Prerequisites

- .NET SDK 10.0+
- Node.js 20.x+
- npm 10.x+
- Angular CLI (`npm install -g @angular/cli`)
- A running OctoMesh instance (see [Setup Scripts](#setup-scripts))

### Build the Solution

```bash
# Debug build (includes npm install for ClientApp)
dotnet build FireGuardians.sln -c Debug

# Release build
dotnet build FireGuardians.sln -c Release
```

The `.csproj` build targets automatically run `npm install` in Debug mode and `npm run build` for publish.

### Run in Development

```bash
cd src/FireGuardiansWebApp
dotnet run
```

The ASP.NET Core SPA proxy serves the Angular dev server at `https://localhost:44486`.

### GraphQL Code Generation

When GraphQL operations (`.graphql` files) are modified:

```bash
cd src/FireGuardiansWebApp/ClientApp
npm run generate
```

This runs `@graphql-codegen` using `codegen.yml` to regenerate TypeScript types and Angular services.

### Frontend Only

```bash
cd src/FireGuardiansWebApp/ClientApp
npm install
npm start          # Development server
npm run build      # Production build
npm test           # Run unit tests (Karma + Jasmine)
npm run generate   # Regenerate GraphQL types
```

---

## Docker & Deployment

### Dockerfile

The application uses a multi-stage Docker build:

| Stage | Base Image | Purpose |
|---|---|---|
| `base` | `meshmakers/dotnet_aspnetcore-runtime-node` | Runtime image |
| `build` | `meshmakers/dotnet_sdk-node` | Restore + build |
| `publish` | (from build) | `dotnet publish` |
| `final` | (from base) | Production image |

```bash
# Build Docker image
docker build -t fire-guardians -f src/FireGuardiansWebApp/Dockerfile .

# Run container
docker run -p 8080:80 \
  -e FIRE_FireGuardians__AssetServiceUrl=https://your-asset-service \
  -e FIRE_FireGuardians__AuthorityUrl=https://your-identity-service \
  fire-guardians
```

The container exposes ports 80 and 443. The entrypoint is `dotnet FireGuardiansWebApp.dll`.

---

## CI/CD Pipeline

The Azure Pipelines configuration (`devops-build/azure-pipelines.yml`) defines:

**Trigger branches:** `dev/*`, `main`, release tags (`r*`)

**Pipeline stages:**

1. **Update Build Number** — extracts version components
2. **Set Version** — updates `.csproj` assembly info and `package.json` versions
3. **Download CA** — installs private NuGet server certificate
4. **Build & Test** — `dotnet build` + `dotnet test`
5. **Docker Build & Push** — multi-platform image build
6. **Handle Artifacts** — copies NuGet packages, CK docs, API docs

**Docker image push rules:**

| Trigger | Registry | Tag |
|---|---|---|
| Release tag (`r*`) | Public + private | Build number |
| `main` branch | Private only | Build number |
| Other branches | No push | Build only |

---

## Setup Scripts

The `scripts/` directory contains PowerShell scripts for setting up the OctoMesh environment.

### Initial Setup Sequence

```bash
cd scripts

# 1. Configure and log in to the local OctoMesh instance
./om-login-local.ps1

# 2. Register OAuth clients in the Identity Service
./om-setupIdentityService.ps1

# 3. Create the Fire Guardians tenant
./om-create-tenants.ps1

# 4. Import the Construction Kit data model
./om-importck.ps1
```

### Script Details

| Script | Purpose |
|---|---|
| `om-login-local.ps1` | Configures octo-cli connection to local OctoMesh and authenticates |
| `om-setupIdentityService.ps1` | Registers three OAuth2 clients (production, debug, backend) with required scopes |
| `om-create-tenants.ps1` | Creates the `fireguardians` tenant in OctoMesh |
| `om-delete-tenants.ps1` | Deletes the `fireguardians` tenant |
| `om-importck.ps1` | Imports the Basic CK and Fire Guardians CK models into OctoMesh |

### Teardown

```bash
cd scripts
./om-delete-tenants.ps1
```
