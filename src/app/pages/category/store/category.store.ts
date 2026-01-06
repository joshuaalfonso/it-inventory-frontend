import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { CategoryIninitialState, CategoryState } from './category.state';
import { CategoryService } from '../category.service';
import { CategoryPost } from '../category.model';


@Injectable({providedIn: 'root'})
export class CategoryStore extends signalStore(

    withState<CategoryState>(CategoryIninitialState),

    withMethods((store) => {

        const api = inject(CategoryService);

        return {

            // get category list
            loadCategory(forceReload: boolean = false) {

                if (store.category().length > 0 && !forceReload) {
                    return;
                }

                patchState(store, {
                    loading: true,
                });

                api.getAllCategoryApi()
                .pipe(take(1)).subscribe({
                    next: (response) => {
                        patchState(store, {
                            category: response,
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

            createCategory(newItem: CategoryPost) {
                return api.createCategoryApi(newItem).pipe(
                take(1),
                tap((response: any) => {
                    patchState(store, {
                        category: [response.data, ...store.category()],
                    });
                })
                );
            },

            updateCategory(newItem: CategoryPost) {
                return api.updateCategoryApi(newItem)
                .pipe(
                    take(1),
                    tap((response) => {
                        const categories = store.category();
                        const index = categories.findIndex(b => b.category_id === response.data.category_id);
                        if (index !== -1) {
                            // mutate in-place
                            categories[index] = response.data;
                        }
                        // patchState with the same array reference
                        patchState(store, { category: categories });
                    })
                )
            }       

        }

    }),

    
){}