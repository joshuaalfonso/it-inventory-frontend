



import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { SupplierList, SupplierPost } from "./supplier.model";


const TABLE_NAME = 'supplier';

interface ApiResponse {
    success: boolean,
    message: string
    data: SupplierList
}

@Injectable({providedIn: 'root'})
export class SupplierService {

    private apiBaseUrl = environment.apiUrl;


    constructor(
        private http: HttpClient
    ) {}

    getAllSupplierApi() {
        return this.http.get<SupplierList[]>(
            `${this.apiBaseUrl}${TABLE_NAME}`
        )
    }

    createSupplierApi(newItem: SupplierPost) {
        return this.http.post<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    updateSupplierApi(newItem: SupplierPost) {
        return this.http.put<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

}