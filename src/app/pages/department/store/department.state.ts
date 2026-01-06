import { DepartmentList } from "../department.model";




export interface DepartmentState {
    department: DepartmentList[];
    loading: boolean;
    error: null | string;
}

export const DepartmentIninitialState = {
    department: [],
    loading: false,
    error: null
}