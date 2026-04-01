<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ad;
use App\Models\User;

class AdSeeder extends Seeder
{
    public function run(): void
    {
        $userIds = User::pluck('id')->toArray();

        if (empty($userIds)) {
            $this->command->warn('Aucun utilisateur trouvé. Créez des users avant de lancer ce seeder.');
            return;
        }

        $cities = [
            ['name' => 'Paris',      'lat' => 48.8566,  'lng' => 2.3522],
            ['name' => 'Lyon',       'lat' => 45.7640,  'lng' => 4.8357],
            ['name' => 'Marseille',  'lat' => 43.2965,  'lng' => 5.3698],
            ['name' => 'Nice',       'lat' => 43.7102,  'lng' => 7.2620],
            ['name' => 'Bordeaux',   'lat' => 44.8378,  'lng' => -0.5792],
            ['name' => 'Toulouse',   'lat' => 43.6047,  'lng' => 1.4442],
            ['name' => 'Nantes',     'lat' => 47.2184,  'lng' => -1.5536],
            ['name' => 'Strasbourg', 'lat' => 48.5734,  'lng' => 7.7521],
        ];

        $ads = [
            ['title' => 'Vélo de ville à vendre',       'description' => 'Vélo en bon état, peu utilisé. Idéal pour les trajets urbains.'],
            ['title' => 'Canapé 3 places',               'description' => 'Canapé confortable en tissu gris, légère usure sur un accoudoir.'],
            ['title' => 'iPhone 13 Pro',                 'description' => 'Vendu avec chargeur et coque. Batterie à 91%.'],
            ['title' => 'Table basse en bois',           'description' => 'Table basse style industriel, très bon état.'],
            ['title' => 'Cours de guitare',              'description' => 'Professeur expérimenté propose des cours pour tous niveaux.'],
            ['title' => 'Location appartement meublé',  'description' => 'Studio 25m², toutes charges comprises, disponible immédiatement.'],
            ['title' => 'Recherche covoiturage',         'description' => 'Cherche covoiturage hebdomadaire, participation aux frais.'],
            ['title' => 'MacBook Air M2',                'description' => 'Comme neuf, vendu avec sa boîte et garantie restante.'],
            ['title' => 'Réfrigérateur combiné',         'description' => 'Samsung, 2 ans, fonctionne parfaitement, déménagement oblige.'],
            ['title' => 'Garde de chien',                'description' => 'Propose garde de chien à domicile le weekend.'],
        ];

        foreach ($cities as $city) {
            foreach (array_slice($ads, 0, 4) as $adData) {
                Ad::create([
                    'title'       => $adData['title'],
                    'description' => $adData['description'],
                    'city'        => $city['name'],
                    'lat'         => $city['lat'] + (mt_rand(-50, 50) / 1000),
                    'lng'         => $city['lng'] + (mt_rand(-50, 50) / 1000),
                    'user_id'     => $userIds[array_rand($userIds)],
                ]);
            }
        }

        $this->command->info('32 annonces créées dans 8 villes.');
    }
}
