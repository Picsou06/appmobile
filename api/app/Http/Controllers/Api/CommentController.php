<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, string $postId)
    {
        $post = Post::findOrFail($postId);

        $validated = $request->validate(['body' => 'required|string|max:1000']);

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,
            'body'    => $validated['body'],
        ]);

        return response()->json(['data' => $comment->load('user')], 201);
    }
}
