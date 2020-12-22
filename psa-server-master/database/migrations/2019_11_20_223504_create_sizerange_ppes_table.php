<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSizerangePpesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sizerange_ppes', function (Blueprint $table) {
            $table->bigIncrements('sizer_sn');
            $table->string('sn');
            $table->foreign('sn')->references('sn')->on('ppes')->onDelete('cascade');
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
        Schema::dropIfExists('sizerange_ppes');
    }
}
