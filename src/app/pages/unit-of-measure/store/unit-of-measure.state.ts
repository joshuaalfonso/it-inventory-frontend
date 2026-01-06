import { UnitOfMeasureList } from "../unit-of-measure.model";



export interface UnitOfMeasureState {
    unitOfMeasure: UnitOfMeasureList[];
    loading: boolean;
    error: null | string;
}

export const UnitOfMeasureIninitialState = {
    unitOfMeasure: [],
    loading: false,
    error: null
}