# Inventory System

A robust and modern Inventory Management System built with **Laravel**, **Inertia.js**, **React**, and **Tailwind CSS**. Designed to handle stock control, multi-warehouse transfers, and comprehensive purchasing workflows.

## 🌐 Demo

**Live Demo:** [https://inventory-system-production-b202.up.railway.app/](https://inventory-system-production-b202.up.railway.app/)

## 🎯 Project Goal

This system was developed to simulate a real-world warehouse and procurement workflow used by logistics and retail companies. It demonstrates full-stack development using Laravel and React while implementing enterprise-grade inventory processes, audit-ready reporting, and strict approval hierarchies.

---

## 📸 Screenshots

| Dashboard | Inventory Management |
|---|---|
| ![Dashboard Placeholder](https://via.placeholder.com/800x450?text=Dashboard+Analytics) | ![Inventory Placeholder](https://via.placeholder.com/800x450?text=Inventory+Control) |

| Stock Transfers | Purchase Orders |
|---|---|
| ![Transfers Placeholder](https://via.placeholder.com/800x450?text=Stock+Transfers) | ![Orders Placeholder](https://via.placeholder.com/800x450?text=Purchase+Workflow) |

---

## 🏗️ System Architecture

- **Frontend**: React 19 + Inertia.js + Tailwind CSS (Shadcn UI)
- **Backend**: Laravel 12 RESTful controllers and services
- **Database**: Relational database (MySQL/PostgreSQL/SQLite)
- **Authentication**: Laravel Breeze + Custom Role-based permissions

## 📦 Core Modules

- **Inventory Management**: Real-time tracking of items across multiple warehouses.
- **Supplier Management**: Comprehensive vendor database with VAT settings.
- **Warehouse Management**: Support for multiple locations and global/local access control.
- **Purchase Requisition Workflow**: Multi-level (L1/L2) management approval system.
- **Purchase Order Processing**: Formalized ordering with support for partial deliveries.
- **Stock Transfers**: Multi-step internal movements (`In Transit`, `Received`).
- **Reporting & Analytics**: Native vector PDF (jsPDF) and CSV exports.

---

## 🚀 Features

- **Dashboard Analytics**: View Total Inventory Value, Low Stock Alerts, and Top Moving Items (30-day volume).
- **Inertia.js Integration**: Provides a Single Page Application (SPA) feel with the power of Laravel's routing.
- **Role-Based Access Control**: Granular permissions (Admin, Level 1 Approver, Level 2 Approver, Warehouse Staff).
- **Document Numbering**: Configurable PR/PO numbering systems via the settings module.

## 🔮 Future Improvements

- [ ] **Barcode/QR Scanning**: Mobile support for warehouse stock counting.
- [ ] **Inventory Audit Logs**: Detailed history of every single unit movement.
- [ ] **Email Notifications**: Real-time alerts for pending approvals and low stock.
- [ ] **REST API**: External integrations for third-party logistics providers.

---

## ⚙️ Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/inventory-system.git
    cd inventory-system
    ```

2. **Install PHP dependencies**
    ```bash
    composer install
    ```

3. **Install Node dependencies**
    ```bash
    npm install
    ```

4. **Environment Setup**
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
    *Update the `.env` file with your database credentials.*

5. **Run Migrations & Seeders**
    ```bash
    php artisan migrate --seed
    ```

6. **Start the Development Servers**
    *In terminal 1:*
    ```bash
    php artisan serve
    ```
    *In terminal 2:*
    ```bash
    npm run dev
    ```

## 🔐 Default Credentials

After seeding, log in using the default Superadmin credentials:
- **Email**: `admin@example.com`
- **Password**: `password`

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
