<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Upload;

class UploadController extends Controller
{
    public function create()
    {
        return inertia('Upload/Index');
    }
    public function upload(Request $request)
    {
        $request->validate([
            'media_url' => 'nullable|url',
        ]);


        Upload::create([
            'media_url' => $request->media_url
        ]);

        return inertia('Upload/UploadForm', [
            'media_url' => $request->media_url
        ]);
    }

    public function index()
    {
        // Fetch image URLs from the database
        $mediaUrls = Upload::pluck('media_url')->toArray();

        // Pass image URLs to the view
        return inertia('Home', ['mediaUrls' => $mediaUrls]);
    }

    public function show()
    {
        $uploads = Upload::all();
        return response()->json($uploads);
    }

    public function destroy($id)
    {
        $upload = Upload::findOrFail($id);
        $upload->delete();

        return response()->json(['message' => 'Upload deleted successfully']);
    }
}
