import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    permissions: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    role: string | null;
    warehouse_id?: number | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Item {
    id: number;
    name: string;
    sku: string;
    unit_cost: number;
    category_id: number;
    category?: Category;
    unit_id?: number;
    unit?: Unit;
    is_vatable: boolean;
    warehouses?: WarehouseItem[];
    movements?: InventoryMovement[];
}

export interface Unit {
    id: number;
    name: string;
    abbreviation: string;
}

export interface Category {
    id: number;
    name: string;
    prefix: string;
    parent_id?: number;
    next_num?: number;
    path_name?: string;
}

export interface Supplier {
    id: number;
    name: string;
    contact_person: string;
    phone: string;
    email?: string;
    address?: string;
    is_vatable: boolean;
}

export interface Warehouse {
    id: number;
    name: string;
    address: string;
    is_main: boolean;
    items?: WarehouseItem[];
    movements?: InventoryMovement[];
}

export interface WarehouseItem {
    id: number;
    item_id: number;
    warehouse_id: number;
    quantity: number;
    warehouse?: Warehouse;
    item?: Item;
}

export interface InventoryMovement {
    id: number;
    item_id: number;
    warehouse_id: number;
    user_id?: number;
    quantity: number;
    type: string;
    reference_id?: number;
    notes?: string;
    created_at: string;
    warehouse?: Warehouse;
    user?: User;
}

export interface PurchaseItem {
    id: number;
    purchase_id: number;
    item_id: number;
    quantity: number;
    quantity_transferred: number;
    quantity_ordered: number;
    quantity_received: number;
    price: number;
    item?: Item;
    transfers?: StockTransfer[];
}

export interface StockTransfer {
    id: number;
    purchase_item_id?: number;
    item_id: number;
    from_warehouse: number;
    to_warehouse: number;
    quantity: number;
    status: 'processing' | 'in_transit' | 'delivered' | 'cancelled';
    created_at: string;
    item?: Item;
    fromWarehouse?: Warehouse;
    toWarehouse?: Warehouse;
}

export interface Purchase {
    id: number;
    pr_number?: string;
    po_number?: string;
    supplier_id?: number;
    warehouse_id?: number;
    purchase_date: string;
    expected_delivery_date?: string;
    status: string; // pending | po_draft | ordered | partially_received | received | cancelled
    notes?: string;
    created_at: string;
    supplier?: Supplier;
    warehouse?: Warehouse;
    items?: PurchaseItem[];
    l1_approved_by?: number;
    l1_approved_at?: string;
    l2_approved_by?: number;
    l2_approved_at?: string;
    l1_approver?: User;
    l2_approver?: User;
}

