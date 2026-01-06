import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { PurchaseOrderIninitialState, PurchaseOrderState } from './purchase-order.state';
import { PurchaseOrderService } from '../purchase-order.service';
import { PurchaseOrderPost } from '../purchase-order.model';


@Injectable({providedIn: 'root'})
export class PurchaseOrderStore extends signalStore(

    withState<PurchaseOrderState>(PurchaseOrderIninitialState),

    withMethods((store) => {

        const api = inject(PurchaseOrderService);

        return {

            // get brand list
            loadPurchaseOrder(forceReload: boolean = false) {

                if (store.purchaseOrder().length > 0 && !forceReload) {
                    return;
                }

                patchState(store, {
                    loading: true,
                });

                api.getAllPurchaseOrderApi()
                .pipe(take(1)).subscribe({
                    next: (response) => {
                        patchState(store, {
                            purchaseOrder: response,
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

            createPurchaseOrder(newItem: PurchaseOrderPost) {
                return api.createPurchaseOrderApi(newItem).pipe(
                take(1),
                tap((response: any) => {
                    patchState(store, {
                        purchaseOrder: [response.data, ...store.purchaseOrder()],
                    });
                })
                );
            },

            updatePurchaseOrder(newItem: PurchaseOrderPost) {
                return api.updatePurchaseOrderapi(newItem)
                .pipe(
                    take(1),
                    tap((response: any) => {
                        const purchaseOrders = store.purchaseOrder();
                        const index = purchaseOrders.findIndex(p => p.purchase_order_id === response.data.purchase_order_id);
                        if (index !== -1) {
                            purchaseOrders[index] = response.data;
                        }
                        patchState(store, { purchaseOrder: purchaseOrders });
                    })
                )
            },       

            approvePurchaseOrder(purchase_order_id: number) {
                return api.approvePurchaseOrderapi(purchase_order_id).pipe(
                    take(1),
                    tap(() => {
                        // Update the local store
                        patchState(store, {
                            purchaseOrder: store.purchaseOrder().map(po =>
                                po.purchase_order_id === purchase_order_id ? { ...po, status: 1 } : po
                            ),
                        });
                    })
                );
            }


        }

    }),

    
){}