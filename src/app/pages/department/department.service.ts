import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { DepartmentList, DepartmentPost } from "./department.model";


const TABLE_NAME = 'department';

interface ApiResponse {
    success: boolean,
    message: string
    data: DepartmentList
}

@Injectable({providedIn: 'root'})
export class DepartmentService {

    private apiBaseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) {}

    getAllDepartmentApi() {
        return this.http.get<DepartmentList[]>(
            `${this.apiBaseUrl}${TABLE_NAME}`
        )
    }

    createDepartmentApi(newItem: DepartmentPost) {
        return this.http.post<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    updateDepartmentApi(newItem: DepartmentPost) {
        return this.http.put<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

}