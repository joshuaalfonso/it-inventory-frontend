import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { BrandService } from '../brand.service';
import { EMPTY, catchError, take, tap } from 'rxjs';
import { BrandInitialState, BrandState } from './brand.state';
import { BrandPost } from '../brand.model';
// import { rxMethod } from '@ngrx/signals/rxjs-interop'



@Injectable({providedIn: 'root'})
export class BrandStore extends signalStore(

    withState<BrandState>(BrandInitialState),

    withMethods((store) => {

        const api = inject(BrandService);

        return {

            loadBrands(forceLoad?: boolean) {
                if (!forceLoad && store.brand().length > 0) return EMPTY;

                patchState(store, { loading: true, error: null });

                return api.getAllBrandApi().pipe(
                    take(1),
                    tap((brands) => patchState(store, { brand: brands, loading: false })),
                    catchError((error) => {
                    patchState(store, { loading: false, error: error.message || 'Something went wrong' });
                    return EMPTY;
                    })
                );
            },

            createBrand(newItem: BrandPost) {
                return api.createBrandApi(newItem).pipe(
                    tap((response: any) => {
                        patchState(store, {
                            brand: [response.data, ...store.brand()],
                        });
                    })
                )
            },

            updateBrand(newItem: BrandPost) {
                return api.updateBrandApi(newItem)
                .pipe(
                    take(1),
                    tap((response: any) => {
                        const brands = store.brand();
                        const index = brands.findIndex(b => b.brand_id === response.data.brand_id);
                        if (index !== -1) {
                            brands[index] = response.data;
                        }
                        patchState(store, { brand: brands });
                    })
                )
            }       
            

        }

    }),

){}
            // reactive approach
            // loadBrands: rxMethod<void>(
            //     pipe(
            //         tap(() => patchState(store, { loading: true })),

            //         switchMap(() =>
            //             api.getAllBrandApi().pipe(
            //                 tap((response) => {
            //                     patchState(store, {
            //                         brand: response,
            //                         loading: false
            //                     });
            //                 }),
            //                 catchError((error) => {
            //                     patchState(store, {error: error?.message || 'Something went wrong.', loading: false });
            //                     console.error(error);
            //                     return EMPTY;
            //                 })
            //             )
            //         )

            //     )
            // ),

            // async await appraoch
            // async loadBrands(forceLoad?: boolean) {
            //     if (!forceLoad && store.brand().length > 0) return;
            //     if (store.loading()) return;

            //     patchState(store, { loading: true, error: null });

            //     try {
            //         const brands = await firstValueFrom(api.getAllBrandApi());

            //         patchState(store, {
            //             brand: brands,
            //             loading: false
            //         });

            //     } catch (error: any) {
            //         patchState(store, {
            //             loading: false,
            //             error: error.message || 'Something went wrong'
            //         });
            //     }
            // },


            // reactive approach
            // loadBrands: rxMethod<void>(
            //     pipe(
            //         tap(() => patchState(store, { loading: true })),

            //         switchMap(() =>
            //             api.getAllBrandApi().pipe(
            //                 tap((response) => {
            //                     patchState(store, {
            //                         brand: response,
            //                         loading: false
            //                     });
            //                 }),
            //                 catchError((error) => {
            //                     patchState(store, {error: error?.message || 'Something went wrong.', loading: false });
            //                     console.error(error);
            //                     return EMPTY;
            //                 })
            //             )
            //         )
            //     )
            // ),

            // imperative approach
            // loadBrands(forceLoad?: boolean) {

            //     if (!forceLoad && store.brand().length > 0) {
            //         return
            //     }

            //     patchState(store, { loading: true, error: null });

            //     api.getAllBrandApi().pipe(
            //         take(1), 
            //         tap((brands) => {
            //             patchState(store, {
            //                 brand: brands,
            //                 loading: false
            //             });
            //         }),
            //         catchError((error) => {
            //             patchState(store, {
            //                 loading: false,
            //                 error: error.message || 'Something went wrong'
            //             });
            //             return of([]); 
            //         })
            //     ).subscribe();

            // },

            // loadBrand(forceReload: boolean = false) {

            //     if (store.brand().length > 0 && !forceReload) {
            //         return;
            //     }

            //     patchState(store, {
            //         loading: true,
            //     });

            //     api.getAllBrandApi()
            //     .pipe(take(1)).subscribe({
            //         next: (response) => {
            //             patchState(store, {
            //                 brand: response,
            //                 loading: false
            //             })
            //         },
            //         error: (err) => {
            //             patchState(store, {
            //                 loading: false,
            //                 error: err.message ?? 'Failed to load brands.'
            //             })
            //         }
            //     })

            // },