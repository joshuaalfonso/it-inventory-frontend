import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { UnitOfMeasureService } from '../unit-of-measure.service';
import { UnitOfMeasureIninitialState, UnitOfMeasureState } from './unit-of-measure.state';
import { UnitOfMeasurePost } from '../unit-of-measure.model';


@Injectable({providedIn: 'root'})
export class UnitOfMeasureStore extends signalStore(

    withState<UnitOfMeasureState>(UnitOfMeasureIninitialState),

    withMethods((store) => {

        const api = inject(UnitOfMeasureService);

        return {

            loadUnitOfMeasure(forceReload: boolean = false) {

                if (store.unitOfMeasure().length > 0 && !forceReload) {
                    return;
                }

                patchState(store, {
                    loading: true,
                });

                api.getAllUnitOfMeasureApi()
                .pipe(take(1)).subscribe({
                    next: (response) => {
                        patchState(store, {
                            unitOfMeasure: response,
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

            createUnitOfMeasure(newItem: UnitOfMeasurePost) {
                return api.createUnitOfMeasureApi(newItem).pipe(
                take(1),
                tap((response: any) => {
                    patchState(store, {
                        unitOfMeasure: [response.data, ...store.unitOfMeasure()],
                    });
                })
                );
            },

            updateUnitOfMeasure(newItem: UnitOfMeasurePost) {
                return api.updateUnitOfMeasureApi(newItem)
                .pipe(
                    take(1),
                    tap((response: any) => {
                        const unitOfMeasures = store.unitOfMeasure();
                        const index = unitOfMeasures.findIndex(u => u.uom_id === response.data.uom_id);
                        if (index !== -1) {
                            // mutate in-place
                            unitOfMeasures[index] = response.data;
                        }
                        // patchState with the same array reference
                        patchState(store, { unitOfMeasure: unitOfMeasures });
                    })
                )
            }       

        }

    }),

    
){}