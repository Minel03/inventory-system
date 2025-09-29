<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku'); //Item Code / SKU (unique identifier)
            $table->string('barcode')->nullable(); //Barcode / QR Code
            $table->string('name'); //Item Name
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); //Category (e.g., Food, Supplies, Electronics)
            $table->string('brand')->nullable(); //Brand
            $table->text('description')->nullable(); //Description
            $table->string('unit_measure'); //Unit of Measure (pcs, box, kg, L, etc.)
            $table->foreignId('supplier_id')->constrained()->onDelete('set null'); //Supplier / Vendor
            $table->integer('reorder_level')->default(0); //Reorder Level (low stock threshold)
            $table->decimal('cost_price', 8, 2); //Cost Price
            $table->decimal('sell_price', 8, 2); //Selling Price (SRP) – include VAT/NON-VAT tag
            $table->boolean('vat_included')->default(true); //VAT/NON-VAT tag
            $table->date('expiry_date')->nullable(); //Expiration Date (for perishable goods, FDA requirement)
            $table->string('batch_number')->nullable(); //Batch / Lot Number
            $table->json('tags')->nullable(); //Tags (for quick searching like “Fast-moving”)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
