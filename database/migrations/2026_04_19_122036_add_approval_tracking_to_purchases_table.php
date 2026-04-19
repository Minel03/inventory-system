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
        Schema::table('purchases', function (Blueprint $table) {
            $table->foreignId('l1_approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('l1_approved_at')->nullable();
            $table->foreignId('l2_approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('l2_approved_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropConstrainedForeignId('l1_approved_by');
            $table->dropColumn('l1_approved_at');
            $table->dropConstrainedForeignId('l2_approved_by');
            $table->dropColumn('l2_approved_at');
        });
    }
};
