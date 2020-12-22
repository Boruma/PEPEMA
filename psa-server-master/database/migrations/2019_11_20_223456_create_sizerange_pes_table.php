<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSizerangePesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sizerange_pes', function (Blueprint $table) {
            $table->bigIncrements('sizer_pe_ID');
            $table->unsignedBigInteger('pe_ID');
            $table->foreign('pe_ID')->references('pe_ID')->on('pes')->onDelete('cascade');
            $table->unsignedBigInteger('sizer_ID');
            $table->foreign('sizer_ID')->references('sizer_ID')->on('size_ranges')->onDelete('cascade');
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
        Schema::dropIfExists('sizerange_pes');
    }
}
