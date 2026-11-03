/* Scaffoldings */
export const scaffolds = [
  {
    id: 'scaffold-pwa-vanilla',
    code: 'ST-01',
    short: 'PV',
    title: 'PWA vanilla modular',
    tagline: 'Estructura equilibrada para una PWA con Vanilla JS, tests y assets.',
    usage: 'Proyecto mantenible que necesita service worker, builds y separación por capas sin depender de un framework.',
    tree: `proyecto/
├── index.html
├── manifest.json
├── sw.js
├── styles.css
├── assets/
│   ├── icon.svg
│   └── fonts/
├── src/
│   ├── app.js
│   ├── components/
│   ├── state/
│   ├── services/
│   └── utils/
├── tests/
│   ├── unit/
│   └── integration/
└── README.md`,
    rules: [
      'Cada archivo de src/components expone una única unidad de interfaz.',
      'state/ contiene estado y transiciones; no manipula el DOM.',
      'services/ encapsula red, almacenamiento y APIs externas.',
      'utils/ solo alberga funciones puras y reutilizables.',
      'tests/ replica la estructura de src/ para localizar cada prueba.'
    ]
  },
  {
    id: 'scaffold-feature-first',
    code: 'ST-02',
    short: 'FF',
    title: 'Organización feature-first',
    tagline: 'Agrupa por capacidad de producto en lugar de por tipo técnico.',
    usage: 'Aplicaciones con varios dominios funcionales que crecerán de forma independiente.',
    tree: `src/
├── app/
│   ├── bootstrap.js
│   ├── router.js
│   └── shell.js
├── features/
│   ├── prompts/
│   │   ├── prompts.view.js
│   │   ├── prompts.state.js
│   │   ├── prompts.service.js
│   │   └── prompts.test.js
│   └── exports/
│       ├── exports.view.js
│       └── exports.service.js
├── shared/
│   ├── components/
│   ├── lib/
│   └── config/
└── styles/
    ├── tokens.css
    ├── base.css
    └── features.css`,
    rules: [
      'Una feature no importa archivos internos de otra feature; usa shared/ o un contrato público.',
      'Los archivos de una misma feature deben poder eliminarse o moverse como una unidad.',
      'shared/ no contiene reglas exclusivas de un dominio.',
      'La configuración global vive en shared/config y se valida al arrancar.'
    ]
  },
  {
    id: 'scaffold-single-file',
    code: 'ST-03',
    short: 'SF',
    title: 'Aplicación single-file',
    tagline: 'Máxima portabilidad con una sola página y cero peticiones de red.',
    usage: 'Herramientas offline distribuidas como archivo, demos o utilidades de un solo documento.',
    tree: `promptcombo/
├── index.html
├── README.md
└── assets/
    └── preview.png`,
    rules: [
      'Todo CSS y JavaScript va embebido en index.html.',
      'No se permiten CDNs, fuentes remotas ni peticiones de red.',
      'Los datos se definen antes del motor y viven en estructuras versionadas.',
      'Los assets opcionales solo se usan en documentación, no en tiempo de ejecución.',
      'Toda funcionalidad crítica debe poder probarse abriendo el archivo en local.'
    ]
  }
];
