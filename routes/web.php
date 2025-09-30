<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\PurchaseRequisitionController;
use App\Http\Controllers\PurchaseOrderController;

// Public routes (no authentication required)
Route::get('/', function () {
    return view('index');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

Route::resource('products', ProductController::class);
Route::resource('suppliers', SupplierController::class);
Route::resource('categories', CategoryController::class);
Route::resource('warehouses', WarehouseController::class);
Route::resource('stock-movements', StockMovementController::class);
Route::resource('purchase-requisitions', PurchaseRequisitionController::class);
Route::resource('purchase-orders', PurchaseOrderController::class);
Route::get('stock-movements/stock-level/{product}', [StockMovementController::class, 'stockLevel'])->name('stock-movements.stock-level');
