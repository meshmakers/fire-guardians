FROM meshmakers/dotnet_aspnetcore-runtime-node:1.2.4.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM meshmakers/dotnet_sdk-node:1.2.4.0 AS build
ARG BUILD_CONFIGURATION=Release

# Angular 22 / CLI 22 require Node >=22.22.3 (engine ^22.22.3 || ^24.15.0 ||
# >=26.0.0). The dotnet_sdk-node:1.2.4.0 base ships an older Node the CLI rejects,
# so the in-container SPA build (dotnet build -> npm) would fail. Install Node
# 24.15 (org-standard line) over the base via the inherited nvm and put it first
# on PATH. TODO: drop once dotnet_sdk-node ships a Node 24.15+ tag.
ENV NODE_VERSION=24.15.0
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} && nvm alias default ${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

WORKDIR /src
COPY ["src/Directory.Build.props", "src/Directory.Build.props"]
COPY ["src/FireGuardiansWebApp/FireGuardiansWebApp.csproj", "src/FireGuardiansWebApp/"]
COPY ["src/FireGuardiansCkModel/FireGuardiansCkModel.csproj", "src/FireGuardiansCkModel/"]
RUN dotnet restore "src/FireGuardiansWebApp/FireGuardiansWebApp.csproj"
COPY . .
WORKDIR "/src/src/FireGuardiansWebApp"
RUN dotnet build "FireGuardiansWebApp.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "FireGuardiansWebApp.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FireGuardiansWebApp.dll"]
