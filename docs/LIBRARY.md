# Biblioteca de recursos

## Modelo

Cada recurso declara:

- `id` estable y `version`.
- `type`: role, skill, prompt, template, file, command, register, recipe, package, adapter o validator.
- Título, descripción y objetivo.
- Categoría, etiquetas y casos de uso.
- Entradas, salidas y variables cuando aplica.
- Recursos relacionados, incluidas las recetas y paquetes que consumen el recurso.
- Destinos compatibles.
- Estado editorial: `draft`, `experimental`, `stable` o `deprecated`.
- Procedencia, licencia y fecha de revisión.
- Verificación: `structural`, `examples`, `generator`, `target` y `model`, con estados `passed`, `failed`, `not_tested` o `not_applicable`.

`not_tested` no significa compatible: significa que no se ha probado.

## Inventario actual

| Tipo | Recursos |
|---|---:|
| Prompts | 4 |
| Roles | 22 |
| Skills | 67 |
| Comandos | 37 |
| Registros | 14 |
| Plantillas | 23 |
| Archivos | 6 |
| Adaptadores | 7 |
| Validadores | 5 |
| Recetas | 21 |
| Paquetes | 15 |
| **Total** | **221** |

El catálogo de composición contiene 108 bloques: 56 base y 52 recursos composables derivados de la biblioteca (22 roles y 67 skills en total). Los 49 recursos derivados del catálogo base tienen estado `stable`; los 172 recursos nuevos quedan en `experimental` hasta revisión editorial explícita. Las recetas nuevas no duplican módulos del compositor: las referencias se resuelven en la capa de biblioteca.

## Descubrimiento

La vista **Biblioteca** permite:

- buscar por título, resumen, etiquetas, tipo o categoría;
- filtrar por tipo, categoría, estado editorial y destino;
- abrir una ficha con metadatos, relaciones, compatibilidad y verificación;
- añadir recursos a un proyecto;
- iniciar una receta o paquete desde su ficha.

Las recomendaciones de la pantalla Crear siguen siendo reglas de palabras clave, no un modelo generativo.

El catálogo de **Composición** reutiliza 52 recursos composables de la biblioteca (37 skills y 15 roles) y muestra su estado editorial. Los recursos restantes se consultan en Biblioteca y no se presentan como bloques del compositor.

## Generación

Los recursos seleccionados se materializan como referencias:

```text
library/
├── skills/<id>.md
├── roles/<id>.md
├── commands/<id>.prompt.md
├── registers/<id>.md
└── templates/<id>.md
docs/library-index.md
```

Los recursos de tipo `file` se escriben en su ruta declarada. Los adaptadores y validadores se documentan en el índice y no generan archivos por sí mismos.

Añadir un recurso no lo instala, no lo registra en un cliente y no ejecuta su contenido.

## Compatibilidad

- Los formatos se generan según lo implementado en `core/generator.js`.
- La compatibilidad con clientes concretos queda como `not_tested` hasta probarla en su superficie real.
- No se importan recursos externos automáticamente.
- Un recurso `deprecated` debe conservarse para proyectos guardados y sustituirse con una referencia explícita.

## Mantenimiento

1. Añadir o cambiar un recurso en `src/data/library-resources.js` o `command-defs.js`.
2. Actualizar relaciones y recursos predeterminados de las recetas.
3. Ejecutar `npm run validate` y `npm test`.
4. Revisar la generación del recurso y del paquete.
5. Actualizar la fecha de revisión y el estado de verificación.
6. No marcar como `stable` un recurso sin pruebas de generación y estructura.

## Extracción estructurada

La receta de extracción genera:

- un prompt de extracción;
- un JSON Schema;
- una entrada de ejemplo;
- una salida válida;
- una salida inválida claramente nombrada.

Subconjunto de esquema soportado: `type` (`string`, `number`, `integer`, `boolean`, `array`, `object`), `properties`, `required`, `additionalProperties`, `items` y `enum`.

La validación separa tres niveles: parseo del JSON, estructura del esquema e instancias de ejemplo. Comprueba que la salida válida cumple el esquema y que la salida inválida no lo cumple. No ejecuta un validador completo de JSON Schema ni comprueba el comportamiento de un modelo.

## OpenAPI

La receta de documentación de API genera un YAML OpenAPI 3.1 a partir de las operaciones declaradas. La comprobación cubre versión, `info`, `paths`, indentación básica, referencias internas, parámetros de ruta y presencia de los métodos declarados.

No es una validación semántica completa. El contrato se presenta como borrador revisable y no implementa el servidor.
