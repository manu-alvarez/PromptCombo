/* Índice de skills. Cada lote mantiene un bloque de cinco procedimientos. */
import { skillsBatch1 } from './skills-01-05.js';
import { skillsBatch2 } from './skills-06-10.js';
import { skillsBatch3 } from './skills-11-15.js';
import { skillsBatch4 } from './skills-16-20.js';
import { skillsBatch5 } from './skills-21-25.js';
import { skillsBatch6 } from './skills-26-30.js';

export const skills = [
  ...skillsBatch1,
  ...skillsBatch2,
  ...skillsBatch3,
  ...skillsBatch4,
  ...skillsBatch5,
  ...skillsBatch6
];
