<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoleEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('role_employees', function (Blueprint $table) {
            $table->bigIncrements('role_emp_ID');
            $table->unsignedBigInteger('employee_ID');
            $table->foreign('employee_ID')->references('employee_ID')->on('employees')->onDelete('cascade');
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
        Schema::dropIfExists('role_employees');
    }
}
