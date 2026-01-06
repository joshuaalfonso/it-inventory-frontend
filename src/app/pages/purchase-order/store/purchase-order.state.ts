import { PurchaseOrderList } from "../purchase-order.model";



export interface PurchaseOrderState {
    purchaseOrder: PurchaseOrderList[];
    loading: boolean;
    error: null | string;
}

export const PurchaseOrderIninitialState = {
    purchaseOrder: [],
    loading: false,
    error: null
}