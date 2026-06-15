# Fire Guardians

Welcome to the official GitHub repository for [Fire Guardians](https://www.fire-guardians.com) — a Progressive Web App (PWA) built on the [OctoMesh platform](https://www.meshmakers.io). Our mission is to provide a real-time solution for preventing, tracking and reporting wildfires including restoration. We aim to create a vigilant community of individuals, collectively known as "Fire Guardians", who can report fire incidents and receive alerts promptly, thus aiding in the prevention and mitigation of wildfires.

## Features

- **User Registration and Authentication** — Sign up and log in using Google or Facebook credentials via OctoMesh Identity Service (OAuth 2.0 / OIDC).
- **Interactive Map** — View fire reports on a Google Maps-based interface with geospatial filtering.
- **Fire Reporting** — Report fires by dragging a marker on the map and confirming the location. The location is automatically reverse-geocoded.
- **Location Tracking** — Track your location to contribute to safety mapping and receive relevant alerts.
- **Real-Time Push Notifications** — Receive Web Push alerts when fires are reported within a 10 km radius of your location.
- **Progressive Web App** — Installable on mobile and desktop with offline caching support via Angular Service Worker.

## Architecture

The application consists of two main components:

1. **Construction Kit Data Model** (`FireGuardiansCkModel`) — YAML-based schema definitions for the OctoMesh data platform, defining entity types for fire reports, user wallets, and notification subscriptions.
2. **Web Application** (`FireGuardiansWebApp`) — An ASP.NET Core backend hosting an Angular 21 SPA. The frontend communicates with OctoMesh Asset Services directly via GraphQL (Apollo Angular). The backend provides configuration and runs a background service for push notifications.

For detailed architecture documentation, see [DEVELOPER.md](DEVELOPER.md).

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Angular 21, TypeScript, Angular Material, Apollo Angular (GraphQL), Google Maps API, Angular Signals |
| Backend | ASP.NET Core 10, .NET 10, OctoMesh SDK, Web Push (VAPID), NLog |
| Data | OctoMesh Construction Kit (YAML schema), OctoMesh Asset Services (GraphQL) |
| Auth | OAuth 2.0 / OIDC via OctoMesh Identity Service |
| DevOps | Docker, Azure Pipelines |

## Prerequisites

Before you begin, ensure you have the following installed:

- .NET SDK 10.0+
- Node.js 20.x or later
- npm 10.x or later
- Angular CLI 21.x (`npm install -g @angular/cli`)
- A modern web browser to test the PWA

## Getting Started

### 1. Clone and Build

```bash
git clone https://github.com/meshmakers/FireGuardians.git
cd FireGuardians
dotnet build -c Debug    # debug build
dotnet build -c Release  # release build
```

### 2. Configure OctoMesh

Clone the getting started repository from https://github.com/meshmakers/getting-started and follow the instructions to install OctoMesh services.

Then configure the OctoMesh services for Fire Guardians:

```pwsh
cd scripts

# Log in to the local OctoMesh instance
./om-login-local.ps1

# Register OAuth clients in the Identity Service
./om-setupIdentityService.ps1

# Create the Fire Guardians tenant
./om-create-tenants.ps1

# Import the Construction Kit data model (requires the solution to be built first)
./om-importck.ps1
```

### 3. Run the Application

```bash
cd src/FireGuardiansWebApp
dotnet run
```

The application will be available at `https://localhost:44486`. The ASP.NET Core SPA proxy serves the Angular development server with hot reload.

## Project Structure

```
fire-guardians/
├── src/
│   ├── FireGuardiansWebApp/         # ASP.NET Core backend + Angular SPA
│   │   ├── ClientApp/               # Angular 21 frontend
│   │   ├── Controllers/             # Configuration endpoint
│   │   ├── Services/                # Auth service, notification background service
│   │   ├── Repository/              # Data access (FireReports, Wallets)
│   │   └── Models/                  # Backend DTOs
│   └── FireGuardiansCkModel/        # OctoMesh Construction Kit definitions
│       └── ConstructionKit/         # YAML type and attribute schemas
├── scripts/                         # PowerShell setup scripts
├── devops-build/                    # Azure Pipelines configuration
├── DEVELOPER.md                     # Detailed developer documentation
└── FireGuardians.sln
```

## Documentation

See [DEVELOPER.md](DEVELOPER.md) for comprehensive developer documentation covering:

- Detailed architecture overview with diagrams
- Complete technology stack reference
- Backend and frontend implementation details
- Construction Kit data model
- GraphQL API operations
- Authentication and authorization flows
- Push notification system
- Configuration and environment variables
- Docker build and deployment
- CI/CD pipeline
- Setup scripts reference

## Contributing

We encourage contributions to the Fire Guardians project. Please read our CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.