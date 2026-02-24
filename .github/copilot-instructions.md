# Copilot Instructions - EcoMarket (mercadolibre)

## Proyecto
Marketplace tipo MercadoLibre para vehículos eléctricos. Nombre: "EcoMarket".
URL producción: **https://mercadolibre.centralchat.pro/**

## Stack técnico
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla (NO frameworks)
- **Backend**: PHP con SQLite
- **NO hay compilación**. NUNCA usar `run_build`.

## Repositorio Git
- **Repo**: `https://github.com/JuanjoG92/mercadolibre.git`
- **Branch principal**: `main`
- **Carpeta local**: `C:\mercadolibre`

## Flujo de trabajo y deploy
- Modificar en LOCAL (`C:\mercadolibre`).
- ```powershell
  cd C:\mercadolibre; git add -A; git commit -m "descripción"; git push origin main
  ```
- Luego: `ssh -i "$env:USERPROFILE\.ssh\nueva_llave" root@172.96.8.245 "cd /var/www/mercadolibre; git pull"`
- Usar `;` como separador en PowerShell.
- Para comandos complejos en VPS: crear script en deploy/, push, pull, ejecutar con bash.

## VPS
- IP: `172.96.8.245`
- Ruta: `/var/www/mercadolibre`
- Servidor: Nginx + PHP 7.4 + SQLite

## Paleta de colores
- Primary: `#0f766e` (teal)
- Accent: `#f59e0b` (amarillo MercadoLibre)
- Background: `#f5f5f5`

## Reglas
- Archivos modulares 500-700 líneas máx.
- Mobile-first responsive.
- i18n: ES/EN con `data-i18n` + objeto `L` en `js/app.js`.
