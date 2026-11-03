/* Interpretación local y transparente de una necesidad mediante palabras clave. */
import { RECIPES } from '../data/studio-recipes.js';
import { normalizeSearch } from './format.js';

export function interpretGoal(text) {
  const query = normalizeSearch(text);
  if (query.length < 3) return { query, matches: [] };

  const matches = RECIPES
    .map((recipe) => {
      let score = 0;

      for (const keyword of recipe.keywords) {
        const normalized = normalizeSearch(keyword);
        if (!normalized) continue;
        if (query.includes(normalized)) {
          score += keyword.includes(' ') ? 4 : 2;
        }
      }

      const title = normalizeSearch(recipe.title);
      if (title && query.includes(title)) score += 6;

      return { recipe, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.recipe.title.localeCompare(b.recipe.title, 'es'))
    .slice(0, 4);

  return { query, matches };
}

export function recipeById(id) {
  return RECIPES.find((recipe) => recipe.id === id) || null;
}
