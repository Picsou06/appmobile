<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request, string $postId)
    {
        $post = Post::findOrFail($postId);
        $userId = $request->user()->id;

        $like = $post->likes()->where('user_id', $userId)->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            $post->likes()->create(['user_id' => $userId]);
            $liked = true;
        }

        return response()->json(['liked' => $liked]);
    }
}
