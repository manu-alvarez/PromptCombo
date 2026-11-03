# Contribución

## Flujo

1. Crea una rama desde `main`.
2. Haz cambios pequeños y cohesivos.
3. Ejecuta `npm run check`.
4. Revisa `git diff` y el `dist/index.html` regenerado.
5. Abre un pull request describiendo el cambio y la verificación.

## Convenciones

- Español para documentación y textos de interfaz.
- Inglés para identificadores, funciones, variables y mensajes de commit.
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Sin dependencias nuevas sin justificación, impacto y alternativa considerada.
- Sin cookies, telemetría ni peticiones de red en tiempo de ejecución.
- La persistencia local de la composición debe pasar por `core/persistence.js`; la de proyectos por `core/project-store.js`. No accedas a `localStorage` desde `ui/`.
- Mantener la dirección de dependencias `ui → core → data`.
- Mantener el compilador y el generador como funciones puras y testeables.
- Leer `AGENTS.md` y `docs/CONTRACTS.md` antes de ampliar el alcance.
- No presentar módulos `agent`, `subagent` o `skill` como ejecutables: son contratos y procedimientos textuales.
- Los artefactos generados no se ejecutan ni se instalan; el ZIP y el JSON se validan antes de exportar/importar.
- Cualquier runtime, MCP, permiso o evaluación de modelos requiere un ADR y un diseño separado.

## Añadir o modificar módulos

- Respeta el contrato de campos de `scripts/validate-data.mjs`.
- IDs y códigos deben ser únicos.
- Las skills deben conservar los ocho campos: propósito, cuándo usarla, entradas, procedimiento, restricciones, salida, criterios de aceptación y ejemplo.
- Si añades una receta, verifica que todos sus IDs existen y que sus variables están activas.

## Verificación mínima

```bash
npm run validate
npm test
npm run build
```

Para cambios de interfaz, valida además:

- Navegación completa por teclado.
- Foco visible y restauración de foco del diálogo.
- Responsive a 320, 390, 768, 1024 y 1440 px.
- Copia, descarga, recetas, deshacer y reinicio.
- Creación guiada, generación, edición, regeneración, ZIP, exportación/importación JSON y guardados.
- Consola del navegador sin errores.

## Seguridad

No incluyas secretos, tokens, rutas privadas ni datos personales. Sigue [SECURITY.md](SECURITY.md) para vulnerabilidades.
