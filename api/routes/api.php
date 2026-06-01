<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\CommentController;

Route::get('/ping', function () {
  return response()->json([
	  'message' => 'API OK',
	  'time' => now()
  ]);
});

Route::apiResource('posts', PostController::class)->only(['index', 'show']);
Route::get('/users/{user_id}/posts', [PostController::class, 'posts']);
Route::get('/users/posts/{id}', [PostController::class, 'showPost']);

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login'])->name('login');

Route::get('/ads', [AdController::class, 'index']);
Route::get('/ads/{id}', [AdController::class, 'show']);

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

	Route::post('/ads', [AdController::class, 'store']);
	Route::post('/ads/{id}', [AdController::class, 'update']);
	Route::delete('/ads/{id}', [AdController::class, 'destroy']);
	Route::get('/user/ads', [AdController::class, 'myAds']);

	Route::post('/posts/{id}/like', [LikeController::class, 'toggle']);
	Route::post('/posts/{id}/comments', [CommentController::class, 'store']);
});
