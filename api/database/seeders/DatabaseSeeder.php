<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;

class DatabaseSeeder extends Seeder
{
	use WithoutModelEvents;

	/**
	 * Seed the application's database.
	 */
	public function run(): void
	{
		$testUser = User::factory()->create([
			'firstname' => 'Test',
			'lastname'  => 'User',
			'email'     => 'test@test.com',
		]);

		$users = User::factory(9)->create()->prepend($testUser);

		Post::factory(50)->create()->each(function ($post) use ($users) {
            $post->user_id = $users->random()->id;
            $post->save();
        });

		$this->call(AdSeeder::class);
	}
}
