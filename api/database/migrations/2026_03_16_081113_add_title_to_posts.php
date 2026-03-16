<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::disableForeignKeyConstraints();

		Schema::table('posts', function (Blueprint $table) {
			$table->string('title')->after('id');
		});

		DB::table('posts')->update(['title' => 'Default Title']);

		Schema::enableForeignKeyConstraints();
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::table('posts', function (Blueprint $table) {
			$table->dropColumn('title');
		});
	}
};
