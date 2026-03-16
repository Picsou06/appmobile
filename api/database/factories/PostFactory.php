<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->sentence(12),
            'image' => fake()->boolean(70)
                ? 'posts/' . fake()->uuid() . '.jpg'
                : null,
            'user_id' => User::inRandomOrder()->first()->id,
        ];
    }
}
