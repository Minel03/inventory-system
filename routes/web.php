<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\StockTransferController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('items', ItemController::class)->names('items');
    Route::resource('categories', CategoryController::class)->names('categories');
    Route::resource('suppliers', SupplierController::class)->names('suppliers');
    Route::resource('warehouses', WarehouseController::class)->names('warehouses');

    Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
    Route::post('/purchases', [PurchaseController::class, 'store'])->name('purchases.store');

    Route::get('/transfers', [StockTransferController::class, 'index'])->name('transfers.index');
    Route::post('/transfers', [StockTransferController::class, 'store'])->name('transfers.store');

    Route::get('/configuration', [ConfigurationController::class, 'index'])->name('configuration.index');
    Route::get('/configuration/categories', [ConfigurationController::class, 'categories'])->name('configuration.categories');
    Route::post('/configuration/update', [ConfigurationController::class, 'update'])->name('configuration.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
