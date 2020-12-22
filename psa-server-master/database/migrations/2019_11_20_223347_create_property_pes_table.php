<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertyPesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('property_pes', function (Blueprint $table) {
            $table->bigIncrements('prop_pe_ID');
            $table->unsignedBigInteger('pe_ID');
            $table->foreign('pe_ID')->references('pe_ID')->on('pes')->onDelete('cascade');
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
        Schema::dropIfExists('property_pes');
    }
}
