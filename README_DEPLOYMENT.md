# 🚀 Portfolio Deployment Scripts

Este repositorio incluye scripts automatizados para facilitar el despliegue de tu portfolio Angular a GitHub Pages.

## 📁 Archivos de Despliegue

- `DEPLOYMENT_GUIDE.md` - Guía completa con comandos manuales
- `deploy.sh` - Script de Bash para Linux/Mac/Git Bash
- `deploy.ps1` - Script de PowerShell para Windows
- `README_DEPLOYMENT.md` - Este archivo

## 🎯 Uso Rápido

### Opción 1: Script de PowerShell (Recomendado para Windows)

```powershell
# Despliegue básico
.\deploy.ps1

# Con mensaje de commit personalizado
.\deploy.ps1 -CommitMessage "Nueva funcionalidad agregada"

# Saltar commit automático
.\deploy.ps1 -SkipCommit

# Ver ayuda
.\deploy.ps1 -Help
```

### Opción 2: Script de Bash

```bash
# Hacer ejecutable (solo la primera vez)
chmod +x deploy.sh

# Ejecutar
./deploy.sh
```

### Opción 3: Comandos Manuales

Ver `DEPLOYMENT_GUIDE.md` para la guía completa paso a paso.

## ⚡ Proceso Automatizado

Los scripts realizan automáticamente:

1. ✅ Verifican el estado del repositorio
2. ✅ Hacen commit de cambios pendientes (opcional)
3. ✅ Cambian a la rama master
4. ✅ Limpian builds anteriores
5. ✅ Construyen para producción
6. ✅ Verifican y corrigen el base href
7. ✅ Despliegan a GitHub Pages
8. ✅ Muestran el resultado y recomendaciones

## 🛡️ Características de Seguridad

- **Verificación de directorio**: Se aseguran de estar en el proyecto correcto
- **Backup automático**: Crean respaldo antes de modificar archivos
- **Validación de build**: Verifican que el build sea exitoso
- **Manejo de errores**: Se detienen si encuentran problemas
- **Limpieza automática**: Eliminan archivos temporales

## 🎨 Salida Colorizada

Los scripts usan colores para facilitar la lectura:
- 🔵 **Azul**: Información general
- 🟢 **Verde**: Operaciones exitosas
- 🟡 **Amarillo**: Advertencias
- 🔴 **Rojo**: Errores

## 🔧 Configuración Inicial

### Para PowerShell:
```powershell
# Permitir ejecución de scripts (solo una vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Para Bash:
```bash
# Hacer ejecutable
chmod +x deploy.sh
```

## 📋 Requisitos

- Node.js y npm instalados
- Angular CLI instalado (`npm install -g @angular/cli`)
- Git configurado
- `angular-cli-ghpages` instalado (se instala automáticamente)
- Git Bash (para Windows)

## 🚨 Solución de Problemas

### Error: "No se puede ejecutar el script"
```powershell
# En PowerShell como administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

### Error: "angular-cli-ghpages no encontrado"
```bash
npm install -g angular-cli-ghpages
```

### Error: "Base href incorrecto"
Los scripts corrigen esto automáticamente, pero si persiste:
```bash
# Verificar manualmente
grep "base href" dist/portafolio/browser/index.html
```

## 📊 Ejemplo de Salida

```
╔══════════════════════════════════════╗
║       PORTFOLIO DEPLOYMENT TOOL      ║
║              by JeeP_                ║
╚══════════════════════════════════════╝

[INFO] Verificando estado del repositorio...
[SUCCESS] Repositorio limpio
[INFO] Construyendo para producción...
[SUCCESS] Build completado exitosamente
[INFO] Verificando base href...
[SUCCESS] Base href correcto
[INFO] Desplegando a GitHub Pages...
[SUCCESS] ¡Despliegue completado exitosamente!

🌐 https://jeep12.github.io/portfolio
```

## 🔄 Flujo de Trabajo Recomendado

1. **Desarrollo**: Haz tus cambios en el código
2. **Pruebas**: Ejecuta `ng serve` y prueba localmente
3. **Despliegue**: Ejecuta el script de despliegue
4. **Verificación**: Visita tu sitio en GitHub Pages

## 📝 Personalización

Puedes modificar los scripts para:
- Cambiar el mensaje de commit por defecto
- Agregar pasos de validación adicionales
- Modificar la configuración de build
- Cambiar la URL del repositorio

## 🤝 Contribuciones

Si encuentras mejoras o errores:
1. Documenta el problema
2. Propón una solución
3. Actualiza los scripts según sea necesario

---

**¡Feliz despliegue! 🎉**

*Última actualización: Enero 2025*
