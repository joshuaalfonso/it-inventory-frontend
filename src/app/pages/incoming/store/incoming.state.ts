import { IncomingList } from "../incoming.model";



export interface IncomingState {
    incoming: IncomingList[];
    loading: boolean;
    error: null | string;
}

export const IncomingIninitialState = {
    incoming: [],
    loading: false,
    error: null
}