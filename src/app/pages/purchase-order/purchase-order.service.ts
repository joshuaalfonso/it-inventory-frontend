

import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PurchaseOrderList, PurchaseOrderPost } from "./purchase-order.model";


const TABLE_NAME = 'purchase-order';

interface ApiResponse {
    success: boolean,
    message: string
    data: PurchaseOrderList
}

@Injectable({providedIn: 'root'})
export class PurchaseOrderService {

    private apiBaseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) {}

    getAllPurchaseOrderApi() {
        return this.http.get<PurchaseOrderList[]>(
            `${this.apiBaseUrl}${TABLE_NAME}`
        )
    }

    getPurchaseOrderByIDApi(purchase_order_id: number) {
        // const params = new HttpParams().set('purchase_order_id', purchase_order_id)
        return this.http.get<PurchaseOrderList>(
            `${this.apiBaseUrl}${TABLE_NAME}/${purchase_order_id}`,
        )
    }

    createPurchaseOrderApi(newItem: PurchaseOrderPost) {
        return this.http.post<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    updatePurchaseOrderapi(newItem: PurchaseOrderPost) {
        return this.http.put<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }
    approvePurchaseOrderapi(purchase_order_id: number) {
        //  const params = new HttpParams().set('purchase_order_id', purchase_order_id)
        return this.http.put<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}/approve/${purchase_order_id}`,
            null,
        )
    }

    // updateItemApi(newItem: FormData) {
    //     return this.http.put<ApiResponse>(
    //         `${this.apiBaseUrl}${TABLE_NAME}`,
    //         newItem
    //     )
    // }

    // updateBrandApi(newItem: BrandPost) {
    //     return this.http.put<ApiResponse>(
    //         `${this.apiBaseUrl}${TABLE_NAME}`,
    //         newItem
    //     )
    // }

}