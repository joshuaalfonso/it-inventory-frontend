import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ItemList } from "./item.model";


const TABLE_NAME = 'item';

interface ApiResponse {
    success: boolean,
    message: string
    data: ItemList
}

@Injectable({providedIn: 'root'})
export class ItemService {

    private apiBaseUrl = environment.apiUrl;


    constructor(
        private http: HttpClient
    ) {}

    getAllItemApi() {
        return this.http.get<ItemList[]>(
            `${this.apiBaseUrl}${TABLE_NAME}`
        )
    }

    createItemApi(newItem: FormData) {
        return this.http.post<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    updateItemApi(newItem: FormData) {
        return this.http.put<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    // updateBrandApi(newItem: BrandPost) {
    //     return this.http.put<ApiResponse>(
    //         `${this.apiBaseUrl}${TABLE_NAME}`,
    //         newItem
    //     )
    // }

}