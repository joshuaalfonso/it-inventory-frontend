

import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { IncomingList } from "./incoming.model";


const TABLE_NAME = 'incoming';

// interface ApiResponse {
//     success: boolean,
//     message: string
//     data: PurchaseOrderList
// }

@Injectable({providedIn: 'root'})
export class IncomingService {

    private apiBaseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) {}

    getAllIncomingApi() {
        return this.http.get<IncomingList[]>(
            `${this.apiBaseUrl}${TABLE_NAME}`
        )
    }

    getIncomingByIDApi(incoming_id: number) {
        // const params = new HttpParams().set('purchase_order_id', purchase_order_id)
        return this.http.get<IncomingList>(
            `${this.apiBaseUrl}${TABLE_NAME}/${incoming_id}`,
        )
    }

    createIncomingApi(newItem: any) {
        return this.http.post<any>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    // updatePurchaseOrderapi(newItem: PurchaseOrderPost) {
    //     return this.http.put<ApiResponse>(
    //         `${this.apiBaseUrl}${TABLE_NAME}`,
    //         newItem
    //     )
    // }
    
    // approvePurchaseOrderapi(purchase_order_id: number) {
    //      const params = new HttpParams().set('purchase_order_id', purchase_order_id)
    //     return this.http.put<ApiResponse>(
    //         `${this.apiBaseUrl}${TABLE_NAME}/approve/${purchase_order_id}`,
    //         null,
    //     )
    // }



}