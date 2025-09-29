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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); //Supplier Code
            $table->string('company_name'); //Company Name
            $table->string('contact_person')->nullable(); //Contact Person
            $table->string('tin')->nullable(); //TIN (BIR compliance)
            $table->text('address')->nullable(); //Address
            $table->string('contact_number')->nullable(); //Contact Number
            $table->string('email')->nullable(); //Email
            $table->string('payment_terms'); //Payment Terms (COD, 30 days, etc.)
            $table->text('bank_details')->nullable(); //Bank Details (for payments)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
