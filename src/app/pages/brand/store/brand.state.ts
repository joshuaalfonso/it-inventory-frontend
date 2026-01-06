


import { BrandList } from "../brand.model";


export interface BrandState {
    brand: BrandList[];
    loading: boolean;
    error: null | string;
}

export const BrandIninitialState = {
    brand: [],
    loading: false,
    error: null
}