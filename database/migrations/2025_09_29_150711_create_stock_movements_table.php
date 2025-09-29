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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade'); //Product
            $table->foreignId('warehouse_id')->constrained()->onDelete('set null'); //Warehouse / Branch / Location
            $table->string('type'); //For 'In', 'Out', 'Adjustment'
            $table->string('reference_no'); //Reference No. (DR, PO, Invoice)
            $table->foreignId('supplier_id')->nullable()->constrained()->onDelete('set null'); //Stock In / Receiving
            $table->date('date'); //Date Received
            $table->integer('quantity'); //Quantity
            $table->decimal('unit_cost', 8, 2)->nullable(); //Unit Cost
            $table->date('expiry_date')->nullable(); //Expiry Date (if applicable)
            $table->string('destination')->nullable(); //Destination (Customer / Branch / Disposal)
            $table->string('reason')->nullable(); //Reason (Sale, Transfer, Damage, Expired)
            $table->integer('adjustment_diff')->nullable(); //Adjustments
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
