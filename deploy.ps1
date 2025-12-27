# 🚀 Script de Despliegue Automático - Portfolio Angular (PowerShell)
# Autor: JeeP_
# Fecha: Enero 2025

param(
    [string]$CommitMessage = "",
    [switch]$SkipCommit = $false,
    [switch]$Help = $false
)

# Función para mostrar ayuda
function Show-Help {
    Write-Host "Portfolio Deployment Tool - PowerShell Version" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Uso:"
    Write-Host "  .\deploy.ps1 [opciones]"
    Write-Host ""
    Write-Host "Opciones:"
    Write-Host "  -CommitMessage 'mensaje'  Mensaje para el commit"
    Write-Host "  -SkipCommit              Saltar el commit automático"
    Write-Host "  -Help                    Mostrar esta ayuda"
    Write-Host ""
    Write-Host "Ejemplos:"
    Write-Host "  .\deploy.ps1"
    Write-Host "  .\deploy.ps1 -CommitMessage 'Nueva funcionalidad agregada'"
    Write-Host "  .\deploy.ps1 -SkipCommit"
    exit 0
}

if ($Help) {
    Show-Help
}

# Funciones para colores
function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Blue
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

# Banner
Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║       PORTFOLIO DEPLOYMENT TOOL      ║" -ForegroundColor Blue
Write-Host "║              by JeeP_                ║" -ForegroundColor Blue
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "angular.json")) {
    Write-Error "No se encontró angular.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
}

Write-Info "Verificando estado del repositorio..."

# Verificar si hay cambios sin commitear
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Warning "Hay cambios sin commitear."
    
    if (-not $SkipCommit) {
        $response = Read-Host "¿Deseas hacer commit de los cambios? (y/n)"
        
        if ($response -match '^[Yy]$') {
            Write-Info "Agregando archivos..."
            git add .
            
            if (-not $CommitMessage) {
                $CommitMessage = Read-Host "Ingresa el mensaje de commit"
                if (-not $CommitMessage) {
                    $CommitMessage = "Update portfolio - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
                }
            }
            
            Write-Info "Haciendo commit: $CommitMessage"
            git commit -m $CommitMessage
            
            Write-Info "Subiendo cambios a master..."
            git push origin master
            Write-Success "Cambios subidos a master"
        } else {
            Write-Warning "Continuando sin hacer commit..."
        }
    }
}

# Asegurarse de estar en master
$currentBranch = git branch --show-current
if ($currentBranch -ne "master") {
    Write-Info "Cambiando a rama master..."
    git checkout master
}

Write-Info "Limpiando builds anteriores..."
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Success "Directorio dist/ eliminado"
}

Write-Info "Construyendo para producción..."
ng build --configuration production

if ($LASTEXITCODE -ne 0) {
    Write-Error "Error en el build. Revisa los errores de Angular."
    exit 1
}

Write-Success "Build completado exitosamente"

# Verificar que el directorio de build existe
if (-not (Test-Path "dist\portafolio\browser")) {
    Write-Error "No se encontró el directorio de build: dist\portafolio\browser"
    exit 1
}

Write-Info "Verificando base href..."
$indexFile = "dist\portafolio\browser\index.html"

if (Test-Path $indexFile) {
    $content = Get-Content $indexFile -Raw
    
    if ($content -match '<base href="([^"]*)"') {
        $currentBaseHref = $matches[1]
        Write-Info "Base href actual: $currentBaseHref"
        
        if ($currentBaseHref -ne "/portfolio/") {
            Write-Warning "Base href incorrecto. Corrigiendo..."
            
            # Crear backup
            Copy-Item $indexFile "$indexFile.backup"
            
            # Corregir base href
            $content = $content -replace '<base href="[^"]*"', '<base href="/portfolio/"'
            $content | Set-Content $indexFile
            
            Write-Success "Base href corregido a: /portfolio/"
        } else {
            Write-Success "Base href correcto"
        }
    }
} else {
    Write-Error "No se encontró index.html en el build"
    exit 1
}

Write-Info "Desplegando a GitHub Pages..."

# Usar Git Bash para el comando de despliegue
$bashCommand = "cd /c/Users/JeeP_/OneDrive/Escritorio/portafolio/portafolio && npx angular-cli-ghpages --dir=dist/portafolio/browser --no-silent"
& "C:\Program Files\Git\usr\bin\bash.exe" --login -c $bashCommand

if ($LASTEXITCODE -eq 0) {
    Write-Success "¡Despliegue completado exitosamente!"
    Write-Host ""
    Write-Info "Tu portfolio está disponible en:"
    Write-Host "🌐 https://jeep12.github.io/portfolio" -ForegroundColor Green
    Write-Host ""
    Write-Info "Recomendaciones post-despliegue:"
    Write-Host "  1. Visita el sitio para verificar que todo funciona"
    Write-Host "  2. Verifica la consola del navegador para errores 404"
    Write-Host "  3. Prueba la navegación entre páginas"
    Write-Host "  4. Verifica que las imágenes cargan correctamente"
} else {
    Write-Error "Error durante el despliegue"
    exit 1
}

# Limpiar archivos temporales
if (Test-Path "$indexFile.backup") {
    Remove-Item "$indexFile.backup"
}

Write-Success "¡Proceso completado! 🎉"
