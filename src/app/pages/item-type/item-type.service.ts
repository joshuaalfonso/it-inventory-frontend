import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ItemTypeList, ItemTypePost } from "./item-type.model";


const TABLE_NAME = 'item-type';

interface ApiResponse {
    success: boolean,
    message: string
    data: ItemTypeList
}

@Injectable({providedIn: 'root'})
export class ItemTypeService {

    private apiBaseUrl = environment.apiUrl;


    constructor(
        private http: HttpClient
    ) {}

    getAllItemTypeApi() {
        return this.http.get<ItemTypeList[]>(
            `${this.apiBaseUrl}${TABLE_NAME}`
        )
    }

    createItemTypeApi(newItem: ItemTypePost) {
        return this.http.post<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    updateItemTypeApi(newItem: ItemTypePost) {
        return this.http.put<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

}