# 📚 Guía de Despliegue - Portfolio Angular

## 🚀 Comandos para Desplegar Actualizaciones

### 📋 Checklist Pre-Despliegue
- [ ] Todos los cambios guardados y probados localmente
- [ ] Servidor de desarrollo funcionando correctamente (`ng serve`)
- [ ] Sin errores de compilación
- [ ] Git Bash disponible

---

## 🔄 Proceso Completo de Actualización

### 1️⃣ **Preparación del Entorno**
```bash
# Iniciar Git Bash
& "C:\Program Files\Git\usr\bin\bash.exe" --login -i

# Navegar al directorio del proyecto
cd /c/Users/JeeP_/OneDrive/Escritorio/portafolio/portafolio

# Verificar rama actual
git status
git branch
```

### 2️⃣ **Actualizar Rama Master**
```bash
# Asegurarse de estar en master
git checkout master

# Agregar todos los cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "Descripción de los cambios realizados"

# Subir cambios a master
git push origin master
```

### 3️⃣ **Construir para Producción**
```bash
# Limpiar builds anteriores (opcional)
rm -rf dist/

# Construir para producción
ng build --configuration production

# Verificar que se creó el directorio
ls -la dist/portafolio/browser/
```

### 4️⃣ **Corregir Base Href (CRÍTICO)**
```bash
# Verificar el contenido actual del index.html
head -10 dist/portafolio/browser/index.html

# Si el base href es incorrecto, corregirlo manualmente
# Debe ser: <base href="/portfolio/">
# NO debe ser: <base href="C:/Program Files/Git/portfolio/">
```

**⚠️ IMPORTANTE**: Si el base href está mal, usar el editor para cambiarlo a `/portfolio/`

### 5️⃣ **Desplegar a GitHub Pages**
```bash
# Desplegar usando angular-cli-ghpages
npx angular-cli-ghpages --dir=dist/portafolio/browser --no-silent

# Esperar mensaje de éxito:
# "🌟 Successfully published via angular-cli-ghpages! Have a nice day!"
```

### 6️⃣ **Verificación Post-Despliegue**
- Visitar: https://jeep12.github.io/portfolio
- Verificar que no hay errores 404 en la consola del navegador
- Probar navegación entre páginas
- Verificar que las imágenes cargan correctamente
- Probar funcionalidades (temas, animaciones, etc.)

---

## 🛠️ Comandos de Solución de Problemas

### 🔧 Problemas Comunes y Soluciones

#### **Error 404 en archivos JS/CSS**
```bash
# Verificar base href
grep -n "base href" dist/portafolio/browser/index.html

# Si está incorrecto, corregir manualmente:
# Cambiar: <base href="C:/Program Files/Git/portfolio/">
# Por: <base href="/portfolio/">

# Redesplegar
npx angular-cli-ghpages --dir=dist/portafolio/browser --no-silent
```

#### **Conflictos de Dependencias**
```bash
# Si hay problemas con FontAwesome u otras dependencias
npm install --legacy-peer-deps

# O forzar la instalación
npm install --force
```

#### **Limpiar Cache de GitHub Pages**
```bash
# Forzar nuevo despliegue
npx angular-cli-ghpages --dir=dist/portafolio/browser --no-silent --message="Force update cache"
```

#### **Verificar Estado del Repositorio**
```bash
# Ver estado actual
git status

# Ver historial de commits
git log --oneline -5

# Ver ramas disponibles
git branch -a
```

---

## 📁 Estructura de Archivos Importante

```
portafolio/
├── src/                          # Código fuente
├── public/assets/images/         # Imágenes públicas
├── dist/portafolio/browser/      # Build de producción (ESTO se despliega)
├── package.json                  # Dependencias
└── angular.json                  # Configuración Angular
```

---

## ⚡ Comandos Rápidos (Una Línea)

### **Actualización Completa**
```bash
git add . && git commit -m "Update" && git push origin master && ng build --production && npx angular-cli-ghpages --dir=dist/portafolio/browser
```

### **Solo Redesplegar (sin cambios de código)**
```bash
ng build --production && npx angular-cli-ghpages --dir=dist/portafolio/browser
```

### **Verificación Rápida**
```bash
ng build --production && head -10 dist/portafolio/browser/index.html
```

---

## 🔍 URLs y Enlaces Importantes

- **Sitio en vivo**: https://jeep12.github.io/portfolio
- **Repositorio**: https://github.com/Jeep12/portfolio
- **Rama de despliegue**: `gh-pages` (automática)
- **Rama de desarrollo**: `master`

---

## 📝 Notas Importantes

### ✅ **Buenas Prácticas**
- Siempre probar localmente antes de desplegar
- Usar mensajes de commit descriptivos
- Verificar el base href después del build
- Mantener master limpio (sin archivos de build)

### ❌ **Evitar**
- No commitear la carpeta `dist/` en master
- No usar `--base-href` con rutas absolutas de Windows
- No desplegar sin verificar el build localmente
- No ignorar errores de consola en el navegador

### 🔄 **Flujo de Trabajo Recomendado**
1. Desarrollo en `master`
2. Commit y push a `master`
3. Build local
4. Verificar base href
5. Desplegar a `gh-pages`
6. Verificar en producción

---

## 🆘 Contacto de Emergencia

Si algo sale mal y necesitas ayuda:
1. Revisa los logs de la consola del navegador
2. Verifica que el base href sea `/portfolio/`
3. Asegúrate de que el directorio `dist/portafolio/browser/` contenga todos los archivos
4. Intenta un redespliegue limpio

---

## 📊 Historial de Versiones

- **v1.0**: Despliegue inicial con angular-cli-ghpages
- **v1.1**: Corrección de base href para GitHub Pages
- **v1.2**: Integración de temas y hero canvas
- **Actual**: Sistema de despliegue estable con corrección automática

---

*Última actualización: Enero 2025*
*Autor: JeeP_*
