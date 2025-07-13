import { useForm } from "@inertiajs/react";

export default function ExportModal({ show, onClose }) {
    const { data, setData, post } = useForm({
        format: "xlsx",
        start_date: "",
        end_date: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("guests.export"), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Export Guests</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Format</label>
                        <select
                            className="w-full border rounded p-2"
                            value={data.format}
                            onChange={(e) => setData("format", e.target.value)}
                        >
                            <option value="xlsx">Excel (.xlsx)</option>
                            <option value="csv">CSV (.csv)</option>
                            <option value="pdf">PDF (.pdf)</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">
                            Date Range (Optional)
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="date"
                                className="border rounded p-2 flex-1"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                            />
                            <input
                                type="date"
                                className="border rounded p-2 flex-1"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData("end_date", e.target.value)
                                }
                            />
                        </div>
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
                            Export
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
