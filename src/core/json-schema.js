/* Validador parcial del subconjunto de JSON Schema que genera PromptCombo. */

const TYPE_CHECKS = {
  string: (value) => typeof value === 'string',
  number: (value) => typeof value === 'number' && Number.isFinite(value),
  integer: (value) => Number.isInteger(value),
  boolean: (value) => typeof value === 'boolean',
  array: (value) => Array.isArray(value),
  object: (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
};

export const SUPPORTED_SCHEMA_TYPES = Object.keys(TYPE_CHECKS);

export function validateJsonInstance(schema, value, path = '') {
  const errors = [];
  if (!schema || typeof schema !== 'object') {
    return { valid: false, errors: [{ path, message: 'El esquema no es un objeto válido.' }] };
  }

  if (schema.type) {
    const check = TYPE_CHECKS[schema.type];
    if (!check) {
      errors.push({ path, message: `Tipo no soportado: ${schema.type}.` });
    } else if (!check(value)) {
      errors.push({ path, message: `Se esperaba ${schema.type}.` });
      return { valid: false, errors };
    }
  }

  if (Array.isArray(schema.enum) && !schema.enum.some((item) => Object.is(item, value))) {
    errors.push({ path, message: 'El valor no está en el enum.' });
  }

  if (schema.type === 'object' && value && typeof value === 'object' && !Array.isArray(value)) {
    for (const required of schema.required || []) {
      if (!Object.hasOwn(value, required)) {
        errors.push({ path: `${path}/${required}`, message: 'Falta un campo obligatorio.' });
      }
    }

    const properties = schema.properties || {};
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(properties, key)) {
          errors.push({ path: `${path}/${key}`, message: 'Propiedad no permitida por additionalProperties: false.' });
        }
      }
    }

    for (const [key, propertySchema] of Object.entries(properties)) {
      if (!Object.hasOwn(value, key)) continue;
      errors.push(...validateJsonInstance(propertySchema, value[key], `${path}/${key}`).errors);
    }
  }

  if (schema.type === 'array' && Array.isArray(value) && schema.items) {
    value.forEach((item, index) => {
      errors.push(...validateJsonInstance(schema.items, item, `${path}/${index}`).errors);
    });
  }

  return { valid: errors.length === 0, errors };
}

export const SUPPORTED_SCHEMA_KEYWORDS = ['type', 'properties', 'required', 'additionalProperties', 'items', 'enum'];

export function validateSchemaDefinition(schema, path = '') {
  const errors = [];
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    return { valid: false, errors: [{ path, message: 'El esquema debe ser un objeto.' }] };
  }

  if (schema.type !== undefined) {
    if (!TYPE_CHECKS[schema.type]) {
      errors.push({ path, message: `Tipo no soportado: ${schema.type}.` });
    }
  }

  if (schema.properties !== undefined) {
    if (!schema.properties || typeof schema.properties !== 'object' || Array.isArray(schema.properties)) {
      errors.push({ path, message: 'properties debe ser un objeto.' });
    } else {
      for (const [key, child] of Object.entries(schema.properties)) {
        errors.push(...validateSchemaDefinition(child, `${path}/properties/${key}`).errors);
      }
    }
  }

  if (schema.required !== undefined) {
    if (!Array.isArray(schema.required) || schema.required.some((item) => typeof item !== 'string')) {
      errors.push({ path, message: 'required debe ser un array de nombres.' });
    }
  }

  if (schema.additionalProperties !== undefined && typeof schema.additionalProperties !== 'boolean') {
    errors.push({ path, message: 'additionalProperties debe ser booleano en este subconjunto.' });
  }

  if (schema.type === 'array' && schema.items !== undefined) {
    errors.push(...validateSchemaDefinition(schema.items, `${path}/items`).errors);
  }

  if (schema.enum !== undefined && !Array.isArray(schema.enum)) {
    errors.push({ path, message: 'enum debe ser un array.' });
  }

  return { valid: errors.length === 0, errors };
}
