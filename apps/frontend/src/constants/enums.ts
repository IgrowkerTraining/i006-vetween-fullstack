/**
 * Enums estáticos que reflajan los valores válidos definidos en el Swagger de la API.
 * Fuente: https://api.swaggerhub.com/apis/personal-c69/Vetween/2.0.0
 * Actualizar aquí cuando cambie el contrato del backend.
 */

export const ESPECIES = [
  { value: "Caninos", label: "Caninos" },
  { value: "Felinos", label: "Felinos" },
  { value: "Aves", label: "Aves" },
  { value: "Peces", label: "Peces" },
  { value: "Roedores", label: "Roedores" },
  { value: "Otro", label: "Otro" },
] as const;

export const PROVINCIAS = [
  { value: "CABA", label: "CABA" },
  { value: "Buenos Aires", label: "Buenos Aires" },
  { value: "Catamarca", label: "Catamarca" },
  { value: "Chaco", label: "Chaco" },
  { value: "Chubut", label: "Chubut" },
  { value: "Cordoba", label: "Córdoba" },
  { value: "Corrientes", label: "Corrientes" },
  { value: "Entre Rios", label: "Entre Ríos" },
  { value: "Formosa", label: "Formosa" },
  { value: "Jujuy", label: "Jujuy" },
  { value: "La Pampa", label: "La Pampa" },
  { value: "La Rioja", label: "La Rioja" },
  { value: "Mendoza", label: "Mendoza" },
  { value: "Misiones", label: "Misiones" },
  { value: "Neuquen", label: "Neuquén" },
  { value: "Rio Negro", label: "Río Negro" },
  { value: "Salta", label: "Salta" },
  { value: "San Juan", label: "San Juan" },
  { value: "San Luis", label: "San Luis" },
  { value: "Santa Cruz", label: "Santa Cruz" },
  { value: "Santa Fe", label: "Santa Fe" },
  { value: "Santiago del Estero", label: "Santiago del Estero" },
  { value: "Tierra del Fuego", label: "Tierra del Fuego" },
  { value: "Tucuman", label: "Tucumán" },
] as const;
