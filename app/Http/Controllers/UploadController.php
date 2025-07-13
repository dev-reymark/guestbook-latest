<?php

namespace App\Http\Controllers;

use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class UploadController extends Controller
{
    public function index()
    {
        $mediaUrls = Upload::pluck('file_path')->toArray();

        // Pass image URLs to the view
        return inertia('Home', ['mediaUrls' => $mediaUrls]);
    }

    public function create()
    {
        return inertia('Admin/Upload/Index');
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,mp4|max:10240', // Max 10MB
        ]);

        try {
            $file = $request->file('file');

            // Get file details BEFORE moving
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getClientMimeType();
            $sizeKB = round($file->getSize() / 1024, 2); // in KB

            Log::info('Media upload initiated', [
                'file_name' => $originalName,
                'file_type' => $mimeType,
                'file_size_kb' => $sizeKB,
                'uploaded_by_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Ensure uploads dir exists
            $destinationPath = storage_path('app/public/uploads');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
                Log::info('Created uploads directory', ['path' => $destinationPath]);
            }

            // Save file
            $filename = uniqid('media_', true) . '.' . $file->getClientOriginalExtension();
            $absolutePath = $file->move($destinationPath, $filename)->getPathname();

            Log::info('File moved to storage successfully', ['path' => $absolutePath]);

            // Store in DB
            $upload = Upload::create([
                'file_path' => 'uploads/' . $filename,
                'file_type' => $mimeType,
                'file_size' => $sizeKB,
            ]);

            Log::info('Media metadata saved to database', ['upload_id' => $upload->id]);

            return back()->with('success', 'Media uploaded successfully.');
        } catch (\Throwable $e) {
            Log::error('Media upload failed', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'Media upload failed: ' . $e->getMessage());
        }
    }

    public function show()
    {
        return response()->json(Upload::all());
    }

    public function destroy($id)
    {
        $upload = Upload::findOrFail($id);

        if (Storage::disk('public')->exists($upload->file_path)) {
            Storage::disk('public')->delete($upload->file_path);
        }

        $upload->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
