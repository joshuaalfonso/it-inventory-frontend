import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { DialogInitialState } from "./dialog.state";




export function DialogStore<T>() {
  return signalStore(

    withState(DialogInitialState<T>()),

    withMethods((store) => ({

      openDialog(item: T | null = null) {
        patchState(store, {
          open: true,
          selectedItem: item,
        });
      },

      closeDialog() {
        patchState(store, {
          open: false,
          selectedItem: null,
        });
      },

    }))
    
  );
}



// export const DialogStore = <T>() =>
//   signalStore(

//     withState(DialogInitialState<T>()),

//     withMethods((store) => ({

//       openDialog(item: T) {
//         patchState(store, {
//           open: true,
//           selectedItem: item,
//         });
//       },

//       closeDialog() {
//         patchState(store, {
//           open: false,
//           selectedItem: null,
//         });
//       },

//     }))


//   );
