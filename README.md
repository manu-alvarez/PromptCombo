# PromptCombo

> Generador guiado y offline de prompts, instrucciones y artefactos para proyectos de IA.

[![CI](https://github.com/manu-alvarez/PromptCombo/actions/workflows/ci.yml/badge.svg)](https://github.com/manu-alvarez/PromptCombo/actions/workflows/ci.yml)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-39ff14.svg)](LICENSE)

**Demo pública:** <https://manu-alvarez.github.io/PromptCombo/>

**Versión actual:** 2.4.0 (`/ V2.4`). Consulta las [notas de versión](docs/RELEASE-NOTES.md) y los [límites de compatibilidad](docs/RELEASE-NOTES.md#compatibilidad).

PromptCombo convierte una necesidad en un paquete editable de archivos: prompts, `AGENTS.md`, reglas de Cursor, contexto para Claude Code, instrucciones de Copilot, paquetes de skills, contratos de agentes, comandos, estructuras de proyecto, documentación de diseño, planes de testing y esquemas JSON.

El compositor de bloques original se conserva como **modo avanzado**. La entrada principal es un flujo guiado que selecciona una receta, pide solo los datos necesarios y genera artefactos revisables.

![Interfaz de PromptCombo](docs/promptcombo.png)

## Qué puedes crear

| Familia | Recetas |
|---|---:|
| Prompts | 2 |
| Instrucciones de repositorio | 4 |
| Skills | 1 |
| Agentes | 1 |
| Comandos | 4 |
| Proyectos | 4 |
| Diseño y frontend | 1 |
| Validación | 4 |
| **Total** | **21** |

Cada receta declara objetivo, ejemplo, preguntas, destinos compatibles, entregables y límites. No hay tarjetas vacías ni enlaces que aparenten funciones inexistentes.

## Flujo guiado

1. **Crear**: describe qué necesitas en lenguaje natural.
2. **Plantillas**: acepta la sugerencia por palabras clave o elige una familia manualmente.
3. **Proyecto**: completa solo los campos necesarios; los predeterminados están marcados.
4. **Entregables**: selecciona los destinos y genera los archivos.
5. **Revisión**: edita, valida y corrige.
6. **Exportación**: copia, descarga un archivo, un ZIP o el proyecto JSON.

La interpretación es local y transparente: usa términos y categorías, no un modelo generativo. Si no reconoce la petición, muestra opciones en lugar de inventar una intención.

## Biblioteca de recursos

La vista **Biblioteca** reúne **221 recursos** con identificador, versión, tipo, estado editorial, procedencia, compatibilidad, relaciones y estado de verificación:

- 22 roles.
- 67 skills.
- 37 comandos.
- 14 registros documentales.
- 23 plantillas.
- 6 plantillas de archivo.
- 7 adaptadores.
- 5 validadores.
- 21 recetas.
- 15 paquetes curados.

Los recursos seleccionados generan referencias en `library/` y un `docs/library-index.md` dentro del proyecto. Añadir un recurso no lo instala, no lo ejecuta y no altera la composición del prompt maestro. Los 49 recursos derivados del catálogo original son `stable`; los 172 nuevos quedan `experimental` hasta revisión editorial.

## Recetas incluidas

| Receta | Artefactos principales |
|---|---|
| Prompt profesional | `prompts/<proyecto>-<tipo>.md` |
| Investigación con fuentes | Prompt de investigación y registro de fuentes |
| `AGENTS.md` | `AGENTS.md` |
| Reglas de Cursor | `.cursor/rules/project.mdc` |
| Instrucciones de Copilot | Instrucciones generales, por ruta y prompt file |
| Contexto para Claude Code | `CLAUDE.md` |
| Skill con `SKILL.md` | `SKILL.md`, plantilla de salida y checklist |
| Contrato de agente | Contratos de agente/subagentes y casos de evaluación JSON |
| Paquete de comandos | Archivos `.prompt.md` independientes |
| Estructura de proyecto | README, `.env.example`, `.gitignore`, arquitectura, ADR y árbol |
| Diseño frontend | Brief, IA, pantallas, componentes, tokens, accesibilidad y prompt |
| Revisión y testing | Plan, checklist, casos y criterios de aceptación |
| Extracción estructurada | Prompt, JSON Schema, entrada, salida válida y salida inválida |
| De idea a requisitos | Brief, requisitos, alcance y aceptación |
| Desarrollo de funcionalidad | Plan, implementación, pruebas y verificación |
| Debugging reproducible | Informe, reproducción y regresión |
| Migración planificada | Fases, compatibilidad y rollback |
| Preparación de entrega | Checklist, notas, migración y reversión |
| Transferencia de proyecto | Handoff, contexto y decisiones |
| Revisión de seguridad | Modelo de amenazas, checklist y aprobaciones |
| Documentación de API | Contrato OpenAPI, guía y ejemplos |

## Adaptadores de destino

- Markdown genérico.
- `AGENTS.md`.
- Cursor (`.mdc`).
- Claude Code (`CLAUDE.md`).
- GitHub Copilot (instrucciones generales, por ruta y prompt file).
- Agent Skills (`SKILL.md` y recursos).
- JSON Schema y ejemplos JSON.

Los formatos se generan según lo documentado y se marcan como revisables. La app no declara compatibilidad universal con clientes que no se hayan comprobado.

## Proyecto, archivos y validación

- Árbol de archivos y editor de texto por artefacto.
- Indicadores de **editado manualmente** y **desactualizado**.
- Regeneración de un archivo o del paquete con confirmación si hay ediciones.
- Validación de campos obligatorios, placeholders, rutas, colisiones, JSON y frontmatter.
- Los errores bloquean la exportación ZIP; los avisos no.
- La validación es local y estructural: no prueba el comportamiento de un modelo.

## Exportación y guardado

- Copiar un archivo.
- Descargar un archivo.
- Descargar un ZIP con la estructura de rutas.
- Exportar el proyecto editable como JSON.
- Importar un proyecto exportado, validándolo antes de sustituir el actual.
- Guardar proyectos en `localStorage` para continuar después.
- Los ZIP usan UTF-8, rutas relativas seguras y un escritor propio sin dependencias.

## Modo avanzado

La sección **Avanzado** conserva el compositor original:

- Catálogo de 108 módulos: 4 prompts, 22 roles, 3 flujos, 1 agente, 3 subagentes, 67 skills, 5 plantillas y 3 scaffoldings (56 originales + 52 recursos composables de biblioteca).
- Las 67 skills mantienen sus ocho campos; 30 son originales y 37 se derivan de la biblioteca.
- Reordenación, variables, recetas, copia y descarga del prompt maestro.
- Persistencia independiente de la composición.

## Alcance y límites

PromptCombo genera archivos; **no los ejecuta**.

- No llama a modelos, no instala dependencias y no aplica permisos.
- Generar un `AGENTS.md` no ejecuta un agente.
- Generar un `SKILL.md` no instala una skill.
- Generar una configuración no concede acceso.
- Validar un JSON no evalúa el comportamiento de un modelo.
- Los contratos y prompts son especificaciones textuales; su cumplimiento depende del runtime.

Consulta [Contratos y límites](docs/CONTRACTS.md) y la [decisión de alcance](docs/adr/0001-prompt-composer-boundary.md).

## Arquitectura

```text
Datos (src/data)
  ├── catálogo de 108 módulos
  └── recetas del generador
        │
        ▼
Core (src/core)
  ├── generador determinista de artefactos
  ├── modelo y validación de proyecto
  ├── persistencia, ZIP, intención y utilidades
  └── compilador del modo avanzado
        │
        ▼
UI (src/ui)
  ├── studio guiado
  └── compositor avanzado
        │
        ▼
Build (esbuild) ──► dist/index.html
```

La dirección de dependencias es `ui → core → data`. Los datos no conocen el DOM. La generación es determinista: la misma receta, valores y destinos producen el mismo contenido y las mismas rutas.

## Estructura del proyecto

```text
PromptCombo/
├── AGENTS.md                   # Instrucciones para agentes del repositorio
├── src/
│   ├── index.html              # Shell de desarrollo
│   ├── main.js                 # Entrada y arranque
│   ├── core/                   # Generador, proyecto, persistencia, ZIP, compilador
│   ├── data/                   # Catálogo, skills y recetas del generador
│   ├── styles/                 # Tokens, compositor y studio
│   └── ui/                     # Studio guiado y compositor avanzado
├── scripts/                    # Build, servidor, validación y servicio launchd
├── test/                       # Datos, generador, proyecto, ZIP, persistencia y servidor
├── docs/                       # Arquitectura, contratos, ADR, despliegue y captura
├── legacy/                     # Entregable original V1.0 conservado
├── dist/index.html             # Entregable offline generado y versionado
└── .github/workflows/ci.yml    # Validación, tests y build
```

## Requisitos

- Node.js 20+ (recomendado 22; ver `.nvmrc`).
- npm 10+.
- macOS solo para el servicio `launchd`.

## Inicio rápido

```bash
npm ci
npm run build
npm start
```

Abre <http://127.0.0.1:8282/>.

También puedes abrir `dist/index.html` directamente. Es un archivo offline; el almacenamiento local puede variar según el navegador y el origen.

## Desarrollo y verificación

```bash
npm run dev      # desarrollo en 127.0.0.1:8282
npm run validate # catálogo y recetas
npm test         # pruebas automatizadas
npm run check    # validate + test + build
```

Antes de entregar un cambio de UI, comprueba teclado, foco, responsive, consola, generación, edición, regeneración, ZIP, JSON y persistencia.

## GitHub Pages

El workflow `.github/workflows/pages.yml` construye y publica `dist/` en:

```text
https://manu-alvarez.github.io/PromptCombo/
```

Usa el artefacto estático, sin Jekyll. El despliegue se ejecuta en cada push a `main` o manualmente desde Actions.

## Despliegue local persistente

```bash
npm run deploy:local
```

Instala el agente `com.promptcombo.server` con `launchd`. Escucha solo en `127.0.0.1:8282`; no hay exposición remota ni Tailscale configurado.

```bash
npm run service:status
npm run service:restart
npm run service:logs
npm run service:uninstall
```

Consulta [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Seguridad y privacidad

- Sin backend, telemetría, cuentas ni peticiones de red en ejecución.
- Las entradas, importaciones y plantillas se tratan como contenido no confiable.
- No se usa `eval` ni se ejecuta el contenido generado.
- Las rutas de exportación se validan contra traversal, duplicados y colisiones.
- Los JSON se validan antes de importar.
- La persistencia es local; exporta el proyecto para respaldarlo.
- Generar archivos no concede permisos ni certifica su funcionamiento.

Para vulnerabilidades, sigue [SECURITY.md](SECURITY.md).

## Documentación

- [Instrucciones para agentes](AGENTS.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Contratos y límites](docs/CONTRACTS.md)
- [Biblioteca de recursos](docs/LIBRARY.md)
- [Auditoría del catálogo](docs/CATALOG-AUDIT.md)
- [ADR: compositor, no runtime](docs/adr/0001-prompt-composer-boundary.md)
- [Despliegue](docs/DEPLOYMENT.md)
- [Contribución](CONTRIBUTING.md)
- [Seguridad](SECURITY.md)

## Limitaciones

Los problemas conocidos y los límites de compatibilidad se mantienen en las [notas de versión](docs/RELEASE-NOTES.md#problemas-conocidos).

- La interpretación de necesidades es orientativa y se basa en palabras clave.
- No hay integración con modelos ni proveedores externos.
- La compatibilidad de formatos se limita a lo implementado y documentado.
- No se evalúa el comportamiento de modelos externos.
- Los proyectos se guardan por origen y navegador; no hay sincronización remota.
- Varias pestañas comparten la misma clave local: la última que guarde sobrescribe.
- Los archivos generados requieren revisión antes de usarse en un proyecto real.

## Licencia

MIT © 2026 Manu Álvarez. Consulta [LICENSE](LICENSE).
