# Inventory System

A robust and modern Inventory Management System built with **Laravel**, **Inertia.js**, **React**, and **Tailwind CSS**. Designed to handle stock control, multi-warehouse transfers, and comprehensive purchasing workflows.

## 🚀 Features

- **Dashboard Analytics**: View Total Inventory Value, Low Stock Alerts, Top Moving Items (30-day volume), and Recent Transfers at a glance.
- **Inventory Control**: Real-time tracking of items across multiple warehouses.
- **Stock Transfers**: Multi-step transfer workflows (`Processing` → `Processed` → `In Transit` → `Received`) with accurate stock deductions and additions.
- **Purchase Requisitions (PR)**: Internal requests for new stock, complete with multi-level management approvals.
- **Purchase Orders (PO)**: Formalized orders sent to suppliers, supporting partial deliveries and goods receipts.
- **Supplier Management**: Keep track of vendors and external suppliers.
- **Analytics & Reporting**:
    - Detailed, native vector PDF exports (via jsPDF) and CSV downloads for PRs and POs.
    - Item movement tracking to identify fast, average, and slow-moving items over a 30-day volume.
- **Role-Based Access Control**: Granular permissions via Spatie Roles & Permissions (e.g., Admin, Level 1 Approver, Level 2 Approver, Warehouse Staff).
- **Responsive UI**: Built with Shadcn UI and Tailwind CSS for a seamless desktop and mobile experience.

## 🛠️ Tech Stack

- **Backend**: Laravel 12 (PHP)
- **Frontend**: React 19 (via Inertia.js)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Database**: MySQL / PostgreSQL / SQLite
- **Icons**: Lucide React
- **Exporting**: jsPDF & jsPDF-AutoTable

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

    _Update the `.env` file with your database credentials._

5. **Run Migrations & Seeders**

    ```bash
    php artisan migrate --seed
    ```

    _This will seed the database with initial roles, permissions, a superadmin user, and default settings._

6. **Start the Development Servers**

    In your first terminal, start the Laravel server:

    ```bash
    php artisan serve
    ```

    In your second terminal, run Vite to compile the frontend assets:

    ```bash
    npm run dev
    ```

## 🔐 Default Credentials

After seeding, you can log in using the default Superadmin credentials:

- **Email**: `admin@example.com`
- **Password**: `password`

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
