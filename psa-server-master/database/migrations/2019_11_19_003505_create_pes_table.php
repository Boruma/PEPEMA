<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pes', function (Blueprint $table) {
            $table->bigIncrements('pe_ID');
            $table->string("name", 50);
            $table->string('supplItemID')->nullable();
            $table->unsignedBigInteger('company_ID');
            $table->unsignedBigInteger('supplier_ID');
            $table->foreign('company_ID')->references('company_ID')->on('companies')->onDelete('cascade');
            $table->foreign('supplier_ID')->references('supplier_ID')->on('suppliers')->onDelete('cascade');;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pe');
    }
}
