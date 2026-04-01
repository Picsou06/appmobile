<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Ad;

class AdController extends Controller
{
	public function index(Request $request)
	{
		$request->validate([
			'lat' => 'required|numeric|between:-90,90',
			'lng' => 'required|numeric|between:-180,180',
		]);

		$lat = $request->float('lat');
		$lng = $request->float('lng');

		$ads = Ad::with('user')
			->selectRaw('ads.*, DISTANCE(lat, lng, ?, ?) AS distance', [$lat, $lng])
			->orderBy('distance')
			->paginate(20);

		return response()->json($ads);
	}

	public function store(Request $request)
	{
		$validated = $request->validate($this->adRules());

		$validated['image']   = $this->storeImage($request);
		$validated['user_id'] = $request->user()->id;

		$ad = Ad::create($validated);

		return response()->json(['data' => $ad->load('user')], 201);
	}

	public function show(string $id)
	{
		$ad = Ad::with('user')->findOrFail($id);

		return response()->json(['data' => $ad]);
	}

	public function update(Request $request, string $id)
	{
		$ad = Ad::where('id', $id)
			->where('user_id', $request->user()->id)
			->firstOrFail();

		$validated = $request->validate($this->adRules());

		$imagePath = $this->storeImage($request);
		if ($imagePath !== null) {
			$validated['image'] = $imagePath;
		}

		$ad->update($validated);

		return response()->json(['data' => $ad->load('user')]);
	}

	public function destroy(Request $request, string $id)
	{
		$ad = Ad::where('id', $id)
			->where('user_id', $request->user()->id)
			->firstOrFail();

		if ($ad->image) {
			\Storage::disk('public')->delete($ad->image);
		}

		$ad->delete();

		return response()->json(['message' => 'Annonce supprimée.']);
	}

	public function myAds(Request $request)
	{
		$ads = Ad::with('user')
			->where('user_id', $request->user()->id)
			->latest()
			->paginate(20);

		return response()->json($ads);
	}

	private function adRules(): array
	{
		return [
			'title'       => 'required|string|max:255',
			'description' => 'required|string',
			'image'       => 'nullable|image|max:5120',
			'city'        => 'required|string|max:255',
			'lat'         => 'required|numeric|between:-90,90',
			'lng'         => 'required|numeric|between:-180,180',
		];
	}

	private function storeImage(Request $request): ?string
	{
		if (!$request->hasFile('image')) {
			return null;
		}

		$filename = Str::uuid() . '.' . $request->file('image')->getClientOriginalExtension();

		return $request->file('image')->storeAs('ads', $filename, 'public');
	}
}
