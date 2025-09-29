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
            $table->unsignedBigInteger('product_id');
            $table->index('product_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade'); //Product
            $table->unsignedBigInteger('warehouse_id')->nullable();
            $table->index('warehouse_id');
            $table->foreign('warehouse_id')->references('id')->on('warehouses')->onDelete('set null'); //Warehouse / Branch / Location
            $table->string('type'); //For 'In', 'Out', 'Adjustment'
            $table->string('reference_no'); //Reference No. (DR, PO, Invoice)
            $table->unsignedBigInteger('supplier_id')->nullable();
            $table->index('supplier_id');
            $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('set null'); //Stock In / Receiving
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
        if (Schema::hasTable('stock_movements')) {
            Schema::table('stock_movements', function (Blueprint $table) {
                $table->dropForeign(['product_id']);
                $table->dropForeign(['warehouse_id']);
                $table->dropForeign(['supplier_id']);
                $table->dropColumn(['product_id']);
                $table->dropColumn(['warehouse_id']);
                $table->dropColumn(['supplier_id']);
            });
        }
    }
};
