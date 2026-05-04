<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Post;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('mobile-token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'firstname' => 'nullable|string|max:255',
            'lastname'  => 'nullable|string|max:255',
            'email'     => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json(['message' => 'Profil mis à jour', 'user' => $user]);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:6|confirmed'
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect'], 400);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json(['message' => 'Mot de passe modifié']);
    }

    public function updateAvatar(Request $request)
    {
        $user = $request->user();

        $request->validate(['avatar' => 'required|image|max:2048']);

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar = $path;
        $user->save();

        return response()->json(['message' => 'Avatar mis à jour', 'avatar' => $path]);
    }

    public function posts(Request $request)
    {
        $user  = $request->user();
        $posts = $user->posts()->withCount(['likes', 'comments'])->latest()->paginate(50);
        Post::attachLikedBy($posts, $user->id);
        return response()->json($posts);
    }

    public function showPost(Request $request, $id)
    {
        $user = $request->user();
        $post = $user->posts()->find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json($post);
    }
}
