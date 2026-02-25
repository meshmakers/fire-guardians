param (
    [string]$configuration = "Debug"
)

if (!(Test-Path -Path $PSScriptRoot/../src/FireGuardiansCkModel/bin/$configuration/net10.0/octo-ck-libraries/FireGuardiansCkModel/out/ck-fireguardians.yaml)) {
    Write-Host "Fire Guardians Construction Kit not found at $PSScriptRoot/../src/FireGuardiansCkModel//bin/$configuration/net10.0/octo-ck-libraries/FireGuardiansCkModel/out/ck-fireguardians.yaml"
    exit 1
}


octo-cli -c importck -f ck-basic-2.yaml -w
octo-cli -c importck -f ../src/FireGuardiansCkModel/bin/$configuration/net10.0/octo-ck-libraries/FireGuardiansCkModel/out/ck-fireguardians.yaml -w
