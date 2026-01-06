import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { DepartmentIninitialState, DepartmentState } from './department.state';
import { DepartmentService } from '../department.service';
import { DepartmentPost } from '../department.model';


@Injectable({providedIn: 'root'})
export class DepartmentStore extends signalStore(

    withState<DepartmentState>(DepartmentIninitialState),

    withMethods((store) => {

        const api = inject(DepartmentService);

        return {

            // get category list
            loadDepartment(forceReload: boolean = false) {

                if (store.department().length > 0 && !forceReload) {
                    return;
                }

                patchState(store, {
                    loading: true,
                });

                api.getAllDepartmentApi()
                .pipe(take(1)).subscribe({
                    next: (response) => {
                        patchState(store, {
                            department: response,
                            loading: false
                        })
                    },
                    error: (err) => {
                        patchState(store, {
                            loading: false,
                            error: err.message ?? 'Failed to load departments.'
                        })
                    }
                })

            },

            createDepartment(newItem: DepartmentPost) {
                return api.createDepartmentApi(newItem).pipe(
                take(1),
                tap((response: any) => {
                    patchState(store, {
                        department: [response.data, ...store.department()],
                    });
                })
                );
            },

            updateDepartment(newItem: DepartmentPost) {
                return api.updateDepartmentApi(newItem)
                .pipe(
                    take(1),
                    tap((response) => {
                        const departments = store.department();
                        const index = departments.findIndex(b => b.department_id === response.data.department_id);
                        if (index !== -1) {
                            // mutate in-place
                            departments[index] = response.data;
                        }
                        // patchState with the same array reference
                        patchState(store, { department: departments });
                    })
                )
            }       

        }

    }),

    
){}