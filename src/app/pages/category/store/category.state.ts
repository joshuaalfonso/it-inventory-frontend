import { CategoryList } from "../category.model";




export interface CategoryState {
    category: CategoryList[];
    loading: boolean;
    error: null | string;
}

export const CategoryIninitialState = {
    category: [],
    loading: false,
    error: null
}