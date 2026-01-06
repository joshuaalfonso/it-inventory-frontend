import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { EmployeeIninitialState, EmployeeState } from './employee.state';
import { EmployeeService } from '../employee.service';
import { EmployeePost } from '../employee.model';


@Injectable({providedIn: 'root'})
export class EmployeeStore extends signalStore(

    withState<EmployeeState>(EmployeeIninitialState),

    withMethods((store) => {

        const api = inject(EmployeeService);

        return {

            // get employee list
            loadEmployee(forceReload: boolean = false) {

                if (store.employee().length > 0 && !forceReload) {
                    return;
                }

                patchState(store, {
                    loading: true,
                });

                api.getAllEmployeeApi()
                .pipe(take(1)).subscribe({
                    next: (response) => {
                        patchState(store, {
                            employee: response,
                            loading: false
                        })
                    },
                    error: (err) => {
                        patchState(store, {
                            loading: false,
                            error: err.message ?? 'Failed to load employees.'
                        })
                    }
                })

            },

            createEmployee(newItem: EmployeePost) {
                return api.createEmployeeApi(newItem).pipe(
                take(1),
                tap((response: any) => {
                    patchState(store, {
                        employee: [response.data, ...store.employee()],
                    });
                })
                );
            },

            updateEmployee(newItem: EmployeePost) {
                return api.updateEmployeeApi(newItem)
                .pipe(
                    take(1),
                    tap((response) => {
                        const employees = store.employee();
                        const index = employees.findIndex(e => e.employee_id === response.data.employee_id);
                        if (index !== -1) {
                            // mutate in-place
                            employees[index] = response.data;
                        }
                        // patchState with the same array reference
                        patchState(store, { employee: employees });
                    })
                )
            }       

        }

    }),

    
){}