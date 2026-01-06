import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CategoryList, CategoryPost } from "./category.model";


const TABLE_NAME = 'category';

interface ApiResponse {
    success: boolean,
    message: string
    data: CategoryList
}

@Injectable({providedIn: 'root'})
export class CategoryService {

    private apiBaseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) {}

    getAllCategoryApi() {
        return this.http.get<CategoryList[]>(
            `${this.apiBaseUrl}${TABLE_NAME}`
        )
    }

    createCategoryApi(newItem: CategoryPost) {
        return this.http.post<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    updateCategoryApi(newItem: CategoryPost) {
        return this.http.put<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

}