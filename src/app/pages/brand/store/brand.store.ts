import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { BrandService } from '../brand.service';
import { take, tap } from 'rxjs';
import { BrandIninitialState, BrandState } from './brand.state';
import { BrandPost } from '../brand.model';


@Injectable({providedIn: 'root'})
export class BrandStore extends signalStore(

    withState<BrandState>(BrandIninitialState),

    withMethods((store) => {

        const api = inject(BrandService);

        return {

            // get brand list
            loadBrand(forceReload: boolean = false) {

                if (store.brand().length > 0 && !forceReload) {
                    return;
                }

                patchState(store, {
                    loading: true,
                });

                api.getAllBrandApi()
                .pipe(take(1)).subscribe({
                    next: (response) => {
                        patchState(store, {
                            brand: response,
                            loading: false
                        })
                    },
                    error: (err) => {
                        patchState(store, {
                            loading: false,
                            error: err.message ?? 'Failed to load brands.'
                        })
                    }
                })

            },

            createBrand(newItem: BrandPost) {
                return api.createBrandApi(newItem).pipe(
                take(1),
                tap((response: any) => {
                    patchState(store, {
                        brand: [response.data, ...store.brand()],
                    });
                })
                );
            },

            updateBrand(newItem: BrandPost) {
                return api.updateBrandApi(newItem)
                .pipe(
                    take(1),
                    tap((response: any) => {
                        const brands = store.brand();
                        const index = brands.findIndex(b => b.brand_id === response.data.brand_id);
                        if (index !== -1) {
                            // mutate in-place
                            brands[index] = response.data;
                        }
                        // patchState with the same array reference
                        patchState(store, { brand: brands });
                    })
                )
            }       

        }

    }),

    
){}