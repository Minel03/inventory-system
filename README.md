# Inventory Management System

A comprehensive inventory management system built with Laravel 11 and Tailwind CSS, designed to meet Philippine business requirements including BIR compliance and FDA requirements for perishable goods.

## Features

### 1. Products/Items Management

-   **Item Code/SKU**: Unique identifier for each product with auto-generation
-   **Barcode/QR Code**: Automatic barcode generation using SKU (Code 128 format)
-   **Item Name**: Product name with brand information
-   **Category**: Organized product categorization (Food, Electronics, etc.)
-   **Brand**: Product brand information
-   **Description**: Detailed product description
-   **Unit of Measure**: Flexible units (pcs, box, kg, L, m, dozen)
-   **Supplier/Vendor**: Link to supplier information
-   **Reorder Level**: Low stock threshold alerts with automatic detection
-   **Cost Price**: Purchase cost tracking with formatted display
-   **Selling Price (SRP)**: Retail price with VAT/NON-VAT tags
-   **Expiration Date**: FDA compliance for perishable goods
-   **Batch/Lot Number**: Product batch tracking
-   **Tags**: Searchable tags for quick filtering (Fast-moving, Slow-moving, etc.)
-   **Current Stock**: Real-time stock calculation from movements
-   **Low Stock Alerts**: Automatic warnings when below reorder level

### 2. Suppliers/Vendors Management

-   **Supplier Code**: Unique supplier identifier
-   **Company Name**: Supplier company information
-   **Contact Person**: Primary contact details
-   **TIN**: BIR compliance tax identification
-   **Address**: Complete supplier address
-   **Contact Information**: Phone and email
-   **Payment Terms**: COD, 30 days, etc.
-   **Bank Details**: Payment information
-   **Search & Filtering**: Advanced search capabilities

### 3. Stock Management

-   **Warehouse/Branch/Location**: Multi-location inventory tracking
-   **Stock In/Receiving**: Incoming inventory with reference numbers
-   **Stock Out/Issuance**: Outgoing inventory with destinations
-   **Adjustments**: Inventory count corrections
-   **Real-time Stock Levels**: Automatic calculation of current stock
-   **Low Stock Alerts**: Automatic notifications for reorder levels
-   **Stock Validation**: Prevents stock out when insufficient inventory
-   **Auto-selection**: Automatic warehouse and supplier selection based on product history

### 4. Purchasing System

-   **Purchase Requisition (PR)**: Internal purchase requests with item arrays
-   **Purchase Order (PO)**: Supplier purchase orders with status tracking
-   **PO Tracking**: Status tracking (Pending, Approved, Received)
-   **Supplier Integration**: Link to supplier information
-   **Auto PO Creation**: Automatic PO generation from approved PRs
-   **Stock Movement Integration**: Automatic stock movements when PO is received

### 5. Categories Management

-   **Product Categorization**: Organized product grouping
-   **Search & Filtering**: Easy category management
-   **CRUD Operations**: Full create, read, update, delete functionality

### 6. Warehouse Management

-   **Multi-location Support**: Multiple warehouse tracking
-   **Location Details**: Complete warehouse information
-   **Stock Tracking**: Per-warehouse inventory levels

### 7. Additional Features

-   **Dashboard**: Overview of inventory status with statistics
-   **Search & Filtering**: Advanced search capabilities across all modules
-   **Responsive Design**: Mobile-friendly interface with Tailwind CSS
-   **Barcode Generation**: Automatic barcode creation using Milon\Barcode
-   **Data Validation**: Comprehensive form validation and error handling
-   **Auto-population**: Smart form field population based on context
-   **Stock Alerts**: Visual indicators for low stock items
-   **Profit Margin Calculation**: Automatic profit margin display
-   **Stock Value Calculation**: Real-time inventory valuation

## Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd inventory-system
    ```

2. **Install dependencies**

    ```bash
    composer install
    npm install
    ```

3. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. **Database configuration**

    - Update `.env` file with your database credentials
    - Run migrations: `php artisan migrate`
    - Seed sample data: `php artisan db:seed`

5. **Build assets**

    ```bash
    npm run build
    ```

6. **Start the application**
    ```bash
    php artisan serve
    ```

## Usage

### Getting Started

1. Access the system at `http://localhost:8000`
2. Start by creating categories for your products
3. Add suppliers to your vendor list
4. Set up warehouses/locations
5. Create products and assign them to categories and suppliers
6. Record stock movements as inventory changes

### Key Workflows

#### Adding a New Product

1. Go to Products → Add New Product
2. Fill in product details including SKU, name, category, supplier
3. Set pricing, reorder levels, and other specifications
4. Add tags for easy searching
5. Save the product (barcode is automatically generated)

#### Recording Stock Movements

1. Go to Stock Movements → Add New Movement
2. Select product, warehouse, and movement type (In/Out/Adjustment)
3. Enter quantity, unit cost, and reference information
4. System automatically validates stock availability for stock out
5. Warehouse and supplier are auto-selected based on product history
6. Save the movement

#### Creating Purchase Orders

1. Go to Purchase Orders → Add New Order
2. Select supplier and add products with quantities
3. Set delivery date and terms
4. Generate and send PO to supplier
5. When received, automatically create stock movements

#### Purchase Requisition Workflow

1. Create a Purchase Requisition with required items
2. Set status to "Approved" to automatically generate Purchase Order
3. Track PO status through to completion
4. Stock movements are automatically created when PO is received

## Database Schema

The system uses the following main tables:

-   `products` - Product information with barcode storage
-   `suppliers` - Supplier/vendor data
-   `categories` - Product categories
-   `warehouses` - Storage locations
-   `stock_movements` - Inventory transactions
-   `purchase_requisitions` - Internal purchase requests
-   `purchase_orders` - Supplier purchase orders

## Technical Features

-   **Laravel 11**: Modern PHP framework
-   **Tailwind CSS**: Utility-first CSS framework
-   **Eloquent ORM**: Database relationships and model casting
-   **Vite**: Modern frontend build tool
-   **Barcode Generation**: SVG barcode creation
-   **Form Validation**: Comprehensive input validation
-   **Search & Pagination**: Efficient data browsing
-   **Responsive Design**: Mobile-first approach

## Requirements

-   PHP 8.1 or higher
-   Laravel 11
-   MySQL 8.0 or higher
-   Node.js 16 or higher
-   Composer

## Compliance Features

-   **BIR Compliance**: TIN tracking for suppliers
-   **FDA Compliance**: Expiration date tracking for perishable goods
-   **VAT/NON-VAT**: Proper tax handling
-   **Batch/Lot Tracking**: Product traceability
-   **Audit Trail**: Complete transaction history

## Support

For support and questions, please contact the development team.

## License

This project is proprietary software. All rights reserved.
