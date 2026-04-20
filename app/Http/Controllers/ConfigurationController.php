<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfigurationController extends Controller
{
    /**
     * Display general configuration settings.
     */
    public function index()
    {
        $settings = Setting::whereIn('group', ['general', 'numbering'])
            ->get()
            ->pluck('value', 'key');

        return Inertia::render('Configuration/General', [
            'settings' => $settings,
        ]);
    }

    /**
     * Display category-related configuration settings.
     */
    public function categories()
    {
        return Inertia::render('Configuration/Categories', [
            'settings' => Setting::where('group', 'categories')->get()->pluck('value', 'key'),
        ]);
    }

    /**
     * Display item-related configuration settings.
     */
    public function items()
    {
        return Inertia::render('Configuration/Items', [
            'settings' => Setting::where('group', 'items')->get()->pluck('value', 'key'),
        ]);
    }

    /**
     * Update configuration settings.
     */
    public function update(Request $request)
    {
        $settings = $request->get('settings', []);
        $group = $request->get('group', 'general');

        foreach ($settings as $key => $value) {
            Setting::set($key, $value, $group);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
