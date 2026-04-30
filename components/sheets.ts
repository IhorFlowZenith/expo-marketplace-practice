import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import FiltersSheet from "./FiltersSheet";

export interface FilterOptions {
	category: string;
	gender: string;
	brand: string;
	color: string;
	minPrice: number;
	maxPrice: number;
	sort: string;
}

registerSheet("filters-sheet", FiltersSheet);

declare module "react-native-actions-sheet" {
  interface Sheets {
    "filters-sheet": SheetDefinition<{
      payload: {
        onApply: (filters: FilterOptions) => void;
        initialFilters?: FilterOptions;
      };
    }>;
  }
}

export { };
