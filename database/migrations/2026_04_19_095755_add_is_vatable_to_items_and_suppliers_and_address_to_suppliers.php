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
        Schema::table('items', function (Blueprint $table) {
            $table->boolean('is_vatable')->default(false)->after('unit_cost');
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->boolean('is_vatable')->default(false)->after('email');
            $table->text('address')->nullable()->after('is_vatable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn('is_vatable');
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn(['is_vatable', 'address']);
        });
    }
};
