# Ensure that you have logged in to identity services (om-login-local.ps1, om-login-k8-staging.ps1)

# Allow access of fire guardians app to identity service
octo-cli -c AddAuthorizationCodeClient --clienturi https://localhost:7171/ --clientid fire-guardians-app --redirectUri "https://localhost:7171/" --name "Fire Guardians App"
octo-cli -c AddAuthorizationCodeClient --clienturi https://localhost:44486/ --clientid fire-guardians-app-debug --redirectUri "https://localhost:44486/" --name "Fire Guardians App debug"
octo-cli -c AddScopeToClient --clientid fire-guardians-app --name "assetSystemAPI.full_access"
octo-cli -c AddScopeToClient --clientid fire-guardians-app-debug --name "assetSystemAPI.full_access"

octo-cli -c AddClientCredentialsClient --clientId "fire-guardians-app-backend" --name "Fire Guardians App Backend" --secret "l8L@w5iEv*Ym"
octo-cli -c AddScopeToClient --clientid fire-guardians-app-backend --name "assetSystemAPI.full_access"





