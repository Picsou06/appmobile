<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\Post;

class PostController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		Log::info('Fetching posts for API');
		Log::info('Request parameters: ' . $request->user());
		return Post::with('user')->latest()->paginate(10);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		$validated = $request->validate([
			'title'       => 'required|string|max:255',
			'description' => 'required|string',
			'image'       => 'nullable|image|max:5120',
		]);

		$imagePath = null;
		if ($request->hasFile('image')) {
			$filename  = Str::uuid() . '.' . $request->file('image')->getClientOriginalExtension();
			$imagePath = $request->file('image')->storeAs('posts', $filename, 'public');
		}

		$post = Post::create([
			'title'       => $validated['title'],
			'description' => $validated['description'],
			'image'       => $imagePath,
			'user_id'     => $request->user()->id,
		]);

		return response()->json(['data' => $post->load('user')], 201);
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		$post = Post::where('id', $id)
			->where('user_id', $request->user()->id)
			->firstOrFail();

		$validated = $request->validate([
			'title'       => 'required|string|max:255',
			'description' => 'required|string',
			'image'       => 'nullable|image|max:5120',
		]);

		if ($request->hasFile('image')) {
			$filename  = Str::uuid() . '.' . $request->file('image')->getClientOriginalExtension();
			$validated['image'] = $request->file('image')->storeAs('posts', $filename, 'public');
		}

		$post->update($validated);

		return response()->json(['data' => $post->load('user')]);
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Request $request, string $id)
	{
		$post = Post::where('id', $id)
			->where('user_id', $request->user()->id)
			->firstOrFail();

		$post->delete();

		return response()->json(['message' => 'Post supprimé.']);
	}

	public function posts($user_id)
	{
		return Post::with('user')->where('user_id', $user_id)->latest()->paginate(10);
	}

	public function showPost($post_id)
	{
		return Post::with('user')->where('id', $post_id)->firstOrFail();
	}
}
