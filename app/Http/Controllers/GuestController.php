<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Guest;
use Illuminate\Support\Facades\Log;

class GuestController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Guest registration request received', ['request' => $request->all()]);

        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:guests,name|max:255',
                'id_type' => 'nullable|string|max:255',
                'id_number' => 'nullable|string|max:255',
                'email' => 'nullable|email|unique:guests,email',
                'phone' => 'nullable|string|unique:guests,phone|max:20',
                'company' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'is_agreed' => 'required|boolean|accepted',
            ]);

            $guest = Guest::create($validated);

            Log::info('Guest registered successfully', [
                'guest_id' => $guest->id,
                'name' => $guest->name,
                'email' => $guest->email,
            ]);

            return redirect()->route('guest.checkin.create')->with([
                'success' => 'Registration successful! You can now proceed to check-in.',
                'name' => $request->name
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Guest registration validation failed', [
                'errors' => $e->errors(),
                'input' => $request->except(['_token']),
                'ip' => $request->ip(),
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error('Guest registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'input' => $request->except(['_token']),
                'ip' => $request->ip(),
            ]);

            return back()->with('error', 'Registration failed. Please try again or contact support if the problem persists.');
        }
    }

    public function index()
    {
        $guests = Guest::all();
        return inertia('Admin/Guest/Index', [
            'guests' => $guests
        ]);
    }

    public function update(Request $request, $id)
    {
        $guest = Guest::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:guests,name,' . $guest->id,
            'id_type' => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:guests,email,' . $guest->id,
            'phone' => 'nullable|string|max:20|unique:guests,phone,' . $guest->id,
            'company' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $guest->update($validated);

        return redirect()->back()->with('success', 'Guest updated successfully');
    }

    public function destroy($id)
    {
        $guest = Guest::findOrFail($id);
        $guest->delete();

        return redirect()->back()->with('success', 'Guest deleted successfully');
    }
}
