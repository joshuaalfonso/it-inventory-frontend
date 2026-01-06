import { ItemTypeList } from "../item-type.model";



export interface ItemTypeState {
    itemType: ItemTypeList[];
    loading: boolean;
    error: null | string;
}

export const ItemTypeIninitialState = {
    itemType: [],
    loading: false,
    error: null
}