<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderEntsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_ents', function (Blueprint $table) {
            $table->bigIncrements('order_ID');
            $table->date('orderdate')->nullable();
            $table->date('expectedDeliveryDate')->nullable();
            $table->date('commitedDeliveryDate')->nullable();
            $table->string('state')->nullable();
            $table->unsignedBigInteger('supplier_ID');
            $table->foreign('supplier_ID')->references('supplier_ID')->on('suppliers');
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
        Schema::dropIfExists('order_ents');
    }
}
