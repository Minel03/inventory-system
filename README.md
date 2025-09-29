# Inventory System

A web-based application for managing products, categories, and inventory levels efficiently.

## Table of Contents

-   [Features](#features)
-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Project Status](#project-status)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   User authentication and registration
-   Product management: add, edit, delete, and view products
-   Category management
-   Inventory tracking (stock in/out)
-   Dashboard with summary statistics
-   Search and filter functionality
-   Responsive user interface
-   Export inventory data to CSV

## Requirements

-   PHP >= 8.1
-   Composer
-   MySQL or compatible database
-   GD extension enabled (for barcode generation)
-   Web server (Apache, Nginx, etc.)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/inventory-system.git
    ```
2. Install dependencies:
    ```bash
    composer install
    ```
3. Copy `.env.example` to `.env` and configure your environment variables.
4. Run database migrations:
    ```bash
    php artisan migrate
    ```
5. Start the development server:
    ```bash
    php artisan serve
    ```

## Usage

-   Access the application via `http://localhost:8000`
-   Register a new user or log in
-   Add and manage products and categories
-   Track inventory movements
-   Export data as needed

## Project Status

The following modules are complete and functional:

-   User authentication
-   Product and category management
-   Inventory tracking
-   Dashboard and reporting
-   Data export

**Pending:**

-   Barcode generation (requires GD extension)
-   Advanced reporting features

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
