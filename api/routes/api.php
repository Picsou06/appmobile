<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;

Route::get('/ping', function () {
  return response()->json([
	  'message' => 'API OK',
	  'time' => now()
  ]);
});

Route::apiResource('posts', PostController::class)->only(['index']);
Route::get('/users/{user_id}/posts', [PostController::class, 'posts']);
Route::get('/users/posts/{id}', [PostController::class, 'showPost']);

Route::post('/login', [UserController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
	Route::post('/posts', [PostController::class, 'store']);
	Route::post('/posts/{id}', [PostController::class, 'update']);
	Route::delete('/posts/{id}', [PostController::class, 'destroy']);

	Route::post('/logout', [UserController::class, 'logout']);
	Route::get('/user', [UserController::class, 'show']);

	Route::put('/user', [UserController::class, 'update']);
	Route::put('/user/password', [UserController::class, 'updatePassword']);
	Route::post('/user/avatar', [UserController::class, 'updateAvatar']);

	Route::get('/user/posts', [UserController::class, 'posts']);
	Route::get('/user/posts/{id}', [UserController::class, 'showPost']);
});
