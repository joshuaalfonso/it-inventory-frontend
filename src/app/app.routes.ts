import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
        import('./pages/auth/auth.component').then(m => m.AuthComponent)
    },
    {
        path: '',
        loadComponent: () =>
        import('./layout/layout.component').then(m => m.LayoutComponent),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                import('./pages/dashboard/dashboard.component')
                    .then(c => c.DashboardComponent)
            },
            {
                path: 'item',
                loadComponent: () =>
                import('./pages/item/item.component')
                    .then(c => c.ItemComponent)
            },
            {
                path: 'brand',
                loadComponent: () =>
                import('./pages/brand/brand.component')
                    .then(c => c.BrandComponent)
            },
            {
                path: 'category',
                loadComponent: () =>
                import('./pages/category/category.component')
                    .then(c => c.CategoryComponent)
            },
            {
                path: 'item-type',
                loadComponent: () =>
                import('./pages/item-type/item-type.component')
                    .then(c => c.ItemTypeComponent)
            },
            {
                path: 'unit-of-measure',
                loadComponent: () =>
                import('./pages/unit-of-measure/unit-of-measure.component')
                    .then(c => c.UnitOfMeasureComponent)
            },
            {
                path: 'employee',
                loadComponent: () =>
                import('./pages/employee/employee.component')
                    .then(c => c.EmployeeComponent)
            },
            {
                path: 'department',
                loadComponent: () =>
                import('./pages/department/department.component')
                    .then(c => c.DepartmentComponent)
            },
            {
                path: 'supplier',
                loadComponent: () =>
                import('./pages/supplier/supplier.component')
                    .then(c => c.SupplierComponent)
            },
            {
                path: 'purchase-order',
                loadComponent: () =>
                import('./pages/purchase-order/purchase-order.component')
                    .then(c => c.PurchaseOrderComponent)
            },
            {
                path: 'purchase-order/:purchase_order_id',
                loadComponent: () =>
                import('./pages/purchase-order/components/purchase-order-detail/purchase-order-detail.component')
                    .then(c => c.PurchaseOrderDetailComponent)
            },
            {
                path: 'purchase-order/create-edit/:purchase_order_id',
                loadComponent: () =>
                import('./pages/purchase-order/components/create-edit-purchase-order/create-edit-purchase-order.component')
                    .then(c => c.CreateEditPurchaseOrderComponent)
            },
        ]
    },
];
