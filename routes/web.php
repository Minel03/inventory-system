<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StockTransferController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UsersController;
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
    Route::resource('units', UnitController::class)->names('units');
    Route::resource('users', UsersController::class)->names('users');
    Route::resource('roles', RoleController::class)->names('roles');

    Route::resource('purchases', PurchaseController::class)->names('purchases');
    Route::get('/purchases/{purchase}/print', [PurchaseController::class, 'print'])->name('purchases.print');
    Route::patch('/purchases/{purchase}/approve', [PurchaseController::class, 'approve'])->name('purchases.approve');
    Route::patch('/purchases/{purchase}/approve-l1', [PurchaseController::class, 'approveL1'])->name('purchases.approve-l1');
    Route::patch('/purchases/{purchase}/approve-l2', [PurchaseController::class, 'approveL2'])->name('purchases.approve-l2');
    Route::patch('/purchases/{purchase}/assign-supplier', [PurchaseController::class, 'assignSupplier'])->name('purchases.assign-supplier');
    Route::patch('/purchases/{purchase}/receive', [PurchaseController::class, 'receive'])->name('purchases.receive');
    Route::patch('/purchases/{purchase}/cancel', [PurchaseController::class, 'cancel'])->name('purchases.cancel');

    Route::resource('transfers', StockTransferController::class)->names('transfers');
    Route::patch('/transfers/{transfer}/receive', [StockTransferController::class, 'receive'])->name('transfers.receive');


    Route::get('/configuration', [ConfigurationController::class, 'index'])->name('configuration.index');
    Route::get('/configuration/categories', [ConfigurationController::class, 'categories'])->name('configuration.categories');
    Route::get('/configuration/items', [ConfigurationController::class, 'items'])->name('configuration.items');

    Route::post('/configuration/update', [ConfigurationController::class, 'update'])->name('configuration.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
