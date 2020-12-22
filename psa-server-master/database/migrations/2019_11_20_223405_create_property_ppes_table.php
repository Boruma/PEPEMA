<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertyPpesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('property_ppes', function (Blueprint $table) {
            $table->bigIncrements('prop_sn');
            $table->string('sn');
            $table->foreign('sn')->references('sn')->on('ppes')->onDelete('cascade');
            $table->unsignedBigInteger('property_ID');
            $table->foreign('property_ID')->references('property_ID')->on('properties')->onDelete('cascade');
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
        Schema::dropIfExists('property_ppes');
    }
}
