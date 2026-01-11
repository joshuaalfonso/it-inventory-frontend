import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { IncomingIninitialState, IncomingState } from './incoming.state';
import { IncomingService } from '../incoming.service';


@Injectable({providedIn: 'root'})
export class IncomingStore extends signalStore(

    withState<IncomingState>(IncomingIninitialState),

    withMethods((store) => {

        const api = inject(IncomingService);

        return {

            // get list
            loadIncoming(forceReload: boolean = false) {

                if (store.incoming().length > 0 && !forceReload) {
                    return;
                }

                patchState(store, {
                    loading: true,
                });

                api.getAllIncomingApi()
                .pipe(take(1)).subscribe({
                    next: (response) => {
                        patchState(store, {
                            incoming: response,
                            loading: false
                        })
                    },
                    error: (err) => {
                        patchState(store, {
                            loading: false,
                            error: err.message ?? 'Failed to load incoming.'
                        })
                    }
                })

            },

            createIncoming(newItem: any) {
                return api.createIncomingApi(newItem).pipe(
                take(1),
                tap((response: any) => {
                    patchState(store, {
                        incoming: [response.data, ...store.incoming()],
                    });
                })
                );
            },

            // updatePurchaseOrder(newItem: PurchaseOrderPost) {
            //     return api.updatePurchaseOrderapi(newItem)
            //     .pipe(
            //         take(1),
            //         tap((response: any) => {
            //             const purchaseOrders = store.purchaseOrder();
            //             const index = purchaseOrders.findIndex(p => p.purchase_order_id === response.data.purchase_order_id);
            //             if (index !== -1) {
            //                 purchaseOrders[index] = response.data;
            //             }
            //             patchState(store, { purchaseOrder: purchaseOrders });
            //         })
            //     )
            // },       

            // approvePurchaseOrder(purchase_order_id: number) {
            //     return api.approvePurchaseOrderapi(purchase_order_id).pipe(
            //         take(1),
            //         tap(() => {
            //             // Update the local store
            //             patchState(store, {
            //                 purchaseOrder: store.purchaseOrder().map(po =>
            //                     po.purchase_order_id === purchase_order_id ? { ...po, status: 1 } : po
            //                 ),
            //             });
            //         })
            //     );
            // }


        }

    }),

    
){}