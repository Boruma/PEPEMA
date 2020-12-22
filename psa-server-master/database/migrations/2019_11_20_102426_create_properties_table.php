<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->bigIncrements('property_ID');
            $table->bigInteger('propertyTemplate_ID')->nullable();
            $table->string('name');
            $table->string('text')->nullable();
            $table->date('date')->nullable();
            $table->integer('minValue')->nullable();
            $table->integer('maxValue')->nullable();
            $table->integer('intervall')->nullable();
            $table->string('type');

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
        Schema::dropIfExists('properties');
    }
}
