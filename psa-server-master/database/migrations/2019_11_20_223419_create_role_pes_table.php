<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolePesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('role_pes', function (Blueprint $table) {
            $table->bigIncrements('role_pe_ID');
            $table->unsignedBigInteger('pe_ID');
            $table->foreign('pe_ID')->references('pe_ID')->on('pes')->onDelete('cascade');
            $table->unsignedBigInteger('role_ID');
            $table->foreign('role_ID')->references('role_ID')->on('roles')->onDelete('cascade');
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
        Schema::dropIfExists('role_pes');
    }
}
