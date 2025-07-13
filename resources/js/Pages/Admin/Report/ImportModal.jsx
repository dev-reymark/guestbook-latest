import { useForm } from "@inertiajs/react";

export default function ImportModal({ show, onClose }) {
    const { data, setData, post, errors } = useForm({
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("guests.import"), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Import Guests</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">
                            File (CSV or Excel)
                        </label>
                        <input
                            type="file"
                            className="w-full border rounded p-2"
                            onChange={(e) => setData("file", e.target.files[0])}
                            accept=".csv,.xlsx,.xls"
                        />
                        {errors.file && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.file}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Import
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
