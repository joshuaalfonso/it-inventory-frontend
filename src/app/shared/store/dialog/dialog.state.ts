


export interface DialogState<T> {
  open: boolean;
  selectedItem: T | null;
}


export const DialogInitialState = <T>(): DialogState<T> => ({
  open: false,
  selectedItem: null,
});


