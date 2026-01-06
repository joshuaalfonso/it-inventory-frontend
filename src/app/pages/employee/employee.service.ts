import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { EmployeeList, EmployeePost } from "./employee.model";


const TABLE_NAME = 'employee';

interface ApiResponse {
    success: boolean,
    message: string
    data: EmployeeList
}

@Injectable({providedIn: 'root'})
export class EmployeeService {

    private apiBaseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) {}

    getAllEmployeeApi() {
        return this.http.get<EmployeeList[]>(
            `${this.apiBaseUrl}${TABLE_NAME}`
        )
    }

    createEmployeeApi(newItem: EmployeePost) {
        return this.http.post<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    updateEmployeeApi(newItem: EmployeePost) {
        return this.http.put<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

}