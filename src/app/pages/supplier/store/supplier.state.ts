import { SupplierList } from "../supplier.model";



export interface SupplierState {
    supplier: SupplierList[];
    loading: boolean;
    error: null | string;
}

export const SupplierIninitialState = {
    supplier: [],
    loading: false,
    error: null
}