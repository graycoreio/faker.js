import type { LocaleEntry } from './definitions';

/**
 * The possible definitions related to clothing.
 */
export type ClothingDefinitions = LocaleEntry<{
  brand: string[];
  productType: string[];
  size: string[];
  style: string[];
  material: string[];
}>;
