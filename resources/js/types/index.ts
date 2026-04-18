import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
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
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
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
}

export interface Warehouse {
    id: number;
    name: string;
    location: string;
}

export interface WarehouseItem {
    id: number;
    item_id: number;
    warehouse_id: number;
    quantity: number;
}
