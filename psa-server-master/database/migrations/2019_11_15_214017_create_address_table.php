<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->bigIncrements('address_ID');
            $table->string("place", 50);
            $table->string("street", 50);
            $table->string("housenumber", 10);
            $table->string("postcode", 10);
            $table->string("address_additional", 50)->nullable();
            $table->timestamps();
            $table->bigInteger('company_ID')->nullable()->unsigned();
            $table->foreign('company_ID')->references('company_ID')->on('companies')->onDelete('cascade');
            $table->bigInteger('employee_ID')->nullable()->unsigned();
            $table->foreign('employee_ID')->references('employee_ID')->on('employees')->onDelete('cascade');
            $table->bigInteger('supplier_ID')->nullable()->unsigned();
            $table->foreign('supplier_ID')->references('supplier_ID')->on('suppliers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('address');
    }
}
