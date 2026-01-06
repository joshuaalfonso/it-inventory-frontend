
export interface PurchaseOrderList {
    purchase_order_id: number
    purchase_order_date: string
    purchase_order_number: string | null 
    purchase_requisition_number: string
    delivery_date: string 
    total_quantity: number
    status: number
    created_at: string
    purchase_order_item: PurchaseOrderItemList[]
}

export interface PurchaseOrderItemList {
  purchase_order_item_id: number
  purchase_order_id: number
  item_id: number
  item_name: string
  image_name: string
  brand_name: string
  category_name: string
  item_type_name: string
  uom_name: string
  employee_id: number
  employee_name: string
  ordered_quantity: number
  price: number
}


export interface PurchaseOrderPost {
  purchase_order_id: number
  purchase_order_date: string | null
  purchase_order_number: string | null
  purchase_requisition_number: string | null
  delivery_date: string | null
  total_quantity: number
  purchase_order_item: PurchaseOrderItemPost[]
}

export interface PurchaseOrderItemPost {
  purchase_order_item_id: number 
  item_id: number
  employee_id: number
  ordered_quantity: number
  price: number
}
