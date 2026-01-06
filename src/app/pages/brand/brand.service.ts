import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { BrandList, BrandPost } from "./brand.model";


const TABLE_NAME = 'brand';

interface ApiResponse {
    success: boolean,
    message: string
    data: BrandList
}

@Injectable({providedIn: 'root'})
export class BrandService {

    private apiBaseUrl = environment.apiUrl;


    constructor(
        private http: HttpClient
    ) {}

    getAllBrandApi() {
        return this.http.get<BrandList[]>(
            `${this.apiBaseUrl}${TABLE_NAME}`
        )
    }

    createBrandApi(newItem: BrandPost) {
        return this.http.post<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    updateBrandApi(newItem: BrandPost) {
        return this.http.put<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

}