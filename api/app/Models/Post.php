<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Like;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image',
        'user_id',
    ];
   
    public function user()     { return $this->belongsTo(User::class); }
    public function likes()    { return $this->hasMany(Like::class); }
    public function comments() { return $this->hasMany(Comment::class); }

    public static function attachLikedBy($posts, ?int $userId): void
    {
        if (!$userId) {
            $posts->each(fn($p) => $p->liked_by_me = false);
            return;
        }
        $likedIds = array_flip(
            Like::where('user_id', $userId)
                ->whereIn('post_id', $posts->pluck('id'))
                ->pluck('post_id')->toArray()
        );
        $posts->each(fn($p) => $p->liked_by_me = isset($likedIds[$p->id]));
    }
}
