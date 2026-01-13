



export interface IncomingList {
  incoming_id: number
  purchase_order_id: number
  purchase_order_number: string
  incoming_date: string
  sample_code: string
  total_quantity: number
  remarks: string
  created_at: string
  incoming_item: IncomingItemList[]
}

export interface IncomingItemList {
  incoming_item_id: number
  incoming_id: number
  purchase_order_item_id: number
  purchase_order_id: number
  item_id: number
  item_name: string
  image_name: string
  brand_name: string
  category_name: string
  item_type_name: string
  uom_name: string
  received_quantity: number
  created_at: string
}
