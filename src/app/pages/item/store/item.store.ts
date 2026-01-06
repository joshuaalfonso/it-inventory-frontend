import { signalStore, withMethods, withState, patchState, withComputed } from '@ngrx/signals';
import { computed, inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { ItemIninitialState, ItemState, ItemFilters } from './item.state';
import { ItemService } from '../item.service';


@Injectable({providedIn: 'root'})
export class ItemStore extends signalStore(

    withState<ItemState>(ItemIninitialState),

    withComputed((store) => ({

        filteredItem: computed(() => {

            let items = store.item();
            const {search, brand_id, category_id, uom_id} = store.filters();

            if (search) {
                const term = search.toLowerCase();
                items = items.filter(i =>
                    i.item_name?.toLowerCase().includes(term) ||
                    i.brand_name?.toLowerCase().includes(term) ||
                    i.category_name?.toLowerCase().includes(term) ||
                    i.item_type_name?.toLowerCase().includes(term) ||
                    i.uom_name?.toLowerCase().includes(term) 
                );
            }

            // if (Array.isArray(brand_id) && brand_id.length > 0) {
            //     items = items.filter(i => brand_id.includes(i.brand_id));
            // }

             if (brand_id.length > 0) {
                items = items.filter(i => brand_id.includes(i.brand_id));
            }


            if (category_id) {
                items = items.filter(i => i.category_id === category_id);
            }

            if (uom_id) {
                items = items.filter(i => i.uom_id === uom_id);
            }

            return items

        })

    })),

    withMethods((store) => {

        const api = inject(ItemService);

        return {

            // get brand list
            loadItem(forceReload: boolean = false) {

                if (store.item().length > 0 && !forceReload) {
                    return;
                }

                patchState(store, {
                    loading: true,
                });

                api.getAllItemApi()
                .pipe(take(1)).subscribe({
                    next: (response) => {
                        patchState(store, {
                            item: response,
                            loading: false
                        })
                    },
                    error: (err) => {
                        patchState(store, {
                            loading: false,
                            error: err.message ?? 'Failed to load items.'
                        })
                    }
                })

            },

            createItem(newItem: FormData) {
                return api.createItemApi(newItem)
                .pipe(
                    tap((response) => {
                        patchState(store, {
                            item: [response.data, ...store.item()],
                        });
                    })
                )
            },

            updateItem(newItem: FormData) {
                return api.updateItemApi(newItem)
                .pipe(
                    take(1),
                    tap((response: any) => {
                        const items = store.item();
                        const index = items.findIndex(i => i.item_id === response.data.item_id);
                        if (index !== -1) {
                            // mutate in-place
                            items[index] = response.data;
                        }
                        // patchState with the same array reference
                        patchState(store, { item: items });
                    })
                )
            },

            setSearchFilter(search: string) {
                patchState(store, {
                    filters: {
                        ...store.filters(),
                        search
                    }
                });
            },

            setBrandIds(brand_id: number) {
                const currentFilters = store.filters();
                const currentBrandIds = currentFilters.brand_id || [];

                const updatedBrandIds = currentBrandIds.includes(brand_id)
                    ? currentBrandIds.filter(id => id !== brand_id) 
                    : [...currentBrandIds, brand_id]; 

                patchState(store, {
                    filters: {
                        ...currentFilters,
                        brand_id: updatedBrandIds
                    }
                });
            },

            resetFilters() {
                patchState(store, {
                    filters: { ...ItemIninitialState.filters }
                })
            }

        }

    }),

    
){}