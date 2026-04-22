import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import FiltersSheet from "./FiltersSheet";

registerSheet("filters-sheet", FiltersSheet);

declare module "react-native-actions-sheet" {
  interface Sheets {
    "filters-sheet": SheetDefinition<{
      payload: {
        onApply: (filters: any) => void;
        initialFilters?: any;
      };
    }>;
  }
}

export { };
