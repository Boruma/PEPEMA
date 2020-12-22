<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHasToSizesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('has_to_sizes', function (Blueprint $table) {
            $table->string('name')->unique();
            $table->unsignedBigInteger('employee_ID');
            $table->foreign('employee_ID')->references('employee_ID')->on('employees');
            $table->unsignedBigInteger('size_ID');
            $table->foreign('size_ID')->references('size_ID')->on('sizes');
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
        Schema::dropIfExists('has_to_sizes');
    }
}
