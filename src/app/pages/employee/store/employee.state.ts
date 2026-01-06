import { EmployeeList } from "../employee.model";




export interface EmployeeState {
    employee: EmployeeList[];
    loading: boolean;
    error: null | string;
}

export const EmployeeIninitialState = {
    employee: [],
    loading: false,
    error: null
}