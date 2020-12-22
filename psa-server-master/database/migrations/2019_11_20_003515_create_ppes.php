<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePpes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ppes', function (Blueprint $table) {
            $table->string('sn')->index()->unique();
            $table->string("state")->nullable();
            $table->date('commissioningdate')->nullable();
            $table->string('comment')->nullable();
            $table->boolean('delivered')->nullable();
            $table->unsignedBigInteger('pe_ID');
            $table->foreign('pe_ID')->references('pe_ID')->on('pes')->onDelete('cascade');
            
            $table->unsignedBigInteger('order_ID')->nullable();
            $table->foreign('order_ID')->references('order_ID')->on('order_ents');
            $table->unsignedBigInteger('stock_ID')->nullable();
            $table->foreign('stock_ID')->references('stock_ID')->on('stocks')->onDelete('cascade');
            $table->unsignedBigInteger('employee_ID')->nullable();
            $table->foreign('employee_ID')->references('employee_ID')->on('employees');

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
        Schema::dropIfExists('ppe');
    }
}
