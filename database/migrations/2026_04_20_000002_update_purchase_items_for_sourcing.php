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
        Schema::table('purchase_items', function (Blueprint $table) {
            $table->integer('quantity_transferred')->default(0)->after('quantity');
            $table->integer('quantity_ordered')->default(0)->after('quantity_transferred');
        });

        Schema::table('stock_transfers', function (Blueprint $table) {
            $table->foreignId('purchase_item_id')->nullable()->after('id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_transfers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('purchase_item_id');
        });

        Schema::table('purchase_items', function (Blueprint $table) {
            $table->dropColumn(['quantity_transferred', 'quantity_ordered']);
        });
    }
};
