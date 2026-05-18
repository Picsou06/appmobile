<?php

namespace App\Console\Commands;

use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Console\Command;

class SendNotification extends Command
{
    protected $signature = 'app:send-notification';
    protected $description = 'Simule un like sur un post pour tester le système de notifications par polling';

    public function handle(): void
    {
        $users = User::orderBy('id')->get(['id', 'firstname', 'lastname', 'email']);

        if ($users->isEmpty()) {
            $this->error('Aucun utilisateur en base.');
            return;
        }

        $this->info("\nUtilisateurs disponibles :");
        $this->table(['ID', 'Prénom', 'Nom', 'Email'], $users->map(fn($u) => [
            $u->id, $u->firstname, $u->lastname, $u->email,
        ]));

        $actorId = (int) $this->ask('ID de l\'utilisateur qui ajoute le like');
        $actor   = User::find($actorId);

        if (! $actor) {
            $this->error("Utilisateur #{$actorId} introuvable.");
            return;
        }

        $posts = Post::with('user')->orderBy('id')->get(['id', 'title', 'description', 'user_id']);

        if ($posts->isEmpty()) {
            $this->error('Aucun post (challenge) en base.');
            return;
        }

        $this->info("\nPosts (challenges) disponibles :");
        $this->table(['ID', 'Titre', 'Description', 'Auteur'], $posts->map(fn($p) => [
            $p->id,
            $p->title ?: '—',
            mb_strimwidth($p->description ?? '', 0, 50, '…'),
            optional($p->user)->firstname . ' ' . optional($p->user)->lastname,
        ]));

        $postId = (int) $this->ask('ID du post (challenge) à liker');
        $post   = Post::find($postId);

        if (! $post) {
            $this->error("Post #{$postId} introuvable.");
            return;
        }

        $existing = $post->likes()->where('user_id', $actor->id)->first();

        if ($existing) {
            $existing->delete();
            $this->warn("Like supprimé : {$actor->firstname} {$actor->lastname} avait déjà liké « {$post->title} » (post #{$post->id}).");
            $this->line("Le polling détectera la disparition du like au prochain cycle.");
        } else {
            $post->likes()->create(['user_id' => $actor->id]);
            $this->info("Like ajouté : {$actor->firstname} {$actor->lastname} a liké « {$post->title} » (post #{$post->id}).");
            $this->line("Le polling (toutes les 30s) détectera ce nouveau like et enverra une notification locale à l'auteur du post.");
        }

        $likesCount = $post->likes()->count();
        $this->newLine();
        $this->line("Total likes sur ce post : <fg=yellow>{$likesCount}</>");
    }
}
