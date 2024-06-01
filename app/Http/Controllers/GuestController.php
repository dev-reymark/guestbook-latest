<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Guest;

class GuestController extends Controller
{
    public function create()
    {
        return inertia('Guest/GuestRegisterForm');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'id_type' => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'company' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'is_agreed' => 'required|boolean',
        ]);

        $data = $request->only(['name', 'id_type', 'id_number', 'email', 'phone', 'company', 'address', 'is_agreed']);

        Guest::create($data);

        return redirect()->route('guest.register')->with('success', 'Guest registered successfully!');
    }


    public function index()
    {
        $guests = Guest::all();
        return inertia('Guest/Index', [
            'guests' => $guests
        ]);
    }

    public function destroy($id)
    {
        $guest = Guest::findOrFail($id);
        $guest->delete();

        return redirect()->route('guest.index')->with('success', 'Guest deleted successfully!');
    }

    public function generateReport()
    {
        $guests = Guest::all();
        $pdf = app('dompdf.wrapper')->loadView('guests', ['guests' => $guests]);


        return $pdf->download('guests_report.pdf');
    }

    // public function generateReport(Request $request)
    // {

    //     $guestIds = $request->input('guestIds', []);
    //     $guests = Guest::whereIn('id', $guestIds)->get() ?? [];

    //     $pdf = app('dompdf.wrapper')->loadView('guests', ['guests' => $guests]);

    //     return $pdf->download('guests_report.pdf');
    // }
}
