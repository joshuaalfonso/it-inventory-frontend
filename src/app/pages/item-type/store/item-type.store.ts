import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { ItemTypeIninitialState, ItemTypeState } from './item-type.state';
import { ItemTypeService } from '../item-type.service';
import { ItemTypePost } from '../item-type.model';


@Injectable({providedIn: 'root'})
export class ItemTypeStore extends signalStore(

    withState<ItemTypeState>(ItemTypeIninitialState),

    withMethods((store) => {

        const api = inject(ItemTypeService);

        return {

            // get item type list
            loadItemType(forceReload: boolean = false) {

                if (store.itemType().length > 0 && !forceReload) {
                    return;
                }

                patchState(store, {
                    loading: true,
                });

                api.getAllItemTypeApi()
                .pipe(take(1)).subscribe({
                    next: (response) => {
                        patchState(store, {
                            itemType: response,
                            loading: false
                        })
                    },
                    error: (err) => {
                        patchState(store, {
                            loading: false,
                            error: err.message ?? 'Failed to load item type.'
                        })
                    }
                })

            },

            createItemType(newItem: ItemTypePost) {
                return api.createItemTypeApi(newItem).pipe(
                take(1),
                tap((response: any) => {
                    patchState(store, {
                        itemType: [response.data, ...store.itemType()],
                    });
                })
                );
            },

            updateItemType(newItem: ItemTypePost) {
                return api.updateItemTypeApi(newItem)
                .pipe(
                    take(1),
                    tap((response: any) => {
                        const itemTypes = store.itemType();
                        const index = itemTypes.findIndex(i => i.item_type_id === response.data.item_type_id);
                        if (index !== -1) {
                            // mutate in-place
                            itemTypes[index] = response.data;
                        }
                        // patchState with the same array reference
                        patchState(store, { itemType: itemTypes });
                    })
                )
            }       

        }

    }),

    
){}