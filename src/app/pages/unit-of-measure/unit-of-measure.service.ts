
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { UnitOfMeasureList, UnitOfMeasurePost } from "./unit-of-measure.model";


const TABLE_NAME = 'uom';

interface ApiResponse {
    success: boolean,
    message: string
    data: UnitOfMeasureList
}

@Injectable({providedIn: 'root'})
export class UnitOfMeasureService {

    private apiBaseUrl = environment.apiUrl;


    constructor(
        private http: HttpClient
    ) {}

    getAllUnitOfMeasureApi() {
        return this.http.get<UnitOfMeasureList[]>(
            `${this.apiBaseUrl}${TABLE_NAME}`
        )
    }

    createUnitOfMeasureApi(newItem: UnitOfMeasurePost) {
        return this.http.post<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

    updateUnitOfMeasureApi(newItem: UnitOfMeasurePost) {
        return this.http.put<ApiResponse>(
            `${this.apiBaseUrl}${TABLE_NAME}`,
            newItem
        )
    }

}