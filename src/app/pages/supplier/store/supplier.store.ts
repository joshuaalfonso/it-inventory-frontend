import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { SupplierIninitialState, SupplierState } from './supplier.state';
import { SupplierService } from '../supplier.service';
import { SupplierPost } from '../supplier.model';


@Injectable({providedIn: 'root'})
export class SupplierStore extends signalStore(

    withState<SupplierState>(SupplierIninitialState),

    withMethods((store) => {

        const api = inject(SupplierService);

        return {

            loadSupplier(forceReload: boolean = false) {

                if (store.supplier().length > 0 && !forceReload) {
                    return;
                }

                patchState(store, {
                    loading: true,
                });

                api.getAllSupplierApi()
                .pipe(take(1)).subscribe({
                    next: (response) => {
                        patchState(store, {
                            supplier: response,
                            loading: false
                        })
                    },
                    error: (err) => {
                        patchState(store, {
                            loading: false,
                            error: err.message ?? 'Failed to load unit of measure.'
                        })
                    }
                })

            },

            createSupplier(newItem: SupplierPost) {
                return api.createSupplierApi(newItem).pipe(
                    take(1),
                    tap((response: any) => {
                        patchState(store, {
                            supplier: [response.data, ...store.supplier()],
                        });
                    })
                );
            },

            updateSupplier(newItem: SupplierPost) {
                return api.updateSupplierApi(newItem)
                .pipe(
                    take(1),
                    tap((response: any) => {
                        const suppliers = store.supplier();
                        const index = suppliers.findIndex(s => s.supplier_id === response.data.supplier_id);
                        if (index !== -1) {
                            // mutate in-place
                            suppliers[index] = response.data;
                        }
                        // patchState with the same array reference
                        patchState(store, { supplier: suppliers });
                    })
                )
            }       

        }

    }),

    
){}