import { ItemList } from "../item.model";





export interface ItemState {
    item: ItemList[];
    loading: boolean;
    error: null | string;
    filters: ItemFilters
}

export interface ItemFilters {
  brand_id: number[] ;
  category_id: number | null;
  uom_id: number | null;
  item_type_id: number | null;
  search: string;
}

export const ItemIninitialState = {
    item: [],
    loading: false,
    error: null,
    filters: {
        brand_id: [],
        category_id: null,
        uom_id: null,
        item_type_id: null,
        search: '',
    }
}