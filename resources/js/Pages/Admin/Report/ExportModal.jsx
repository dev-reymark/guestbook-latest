import { addToast } from "@heroui/react";
import { useForm } from "@inertiajs/react";

export default function ExportModal({ show, onClose }) {
    const { data, setData } = useForm({
        format: "xlsx",
        start_date: "",
        end_date: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios({
                method: "get",
                url: route("guests.export"),
                params: data,
                responseType: "blob",
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;

            // Get filename from headers or use default
            const filename = response.headers["content-disposition"]
                ? response.headers["content-disposition"]
                      .split("filename=")[1]
                      .replace(/"/g, "")
                : `guests-report.${data.format}`;

            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);

            // Success toast
            addToast({
                title: "Export Successful",
                description: `Guests report downloaded as ${filename}`,
                color: "success",
                timeout: 5000,
            });

            onClose();
        } catch (error) {
            console.error("Export failed:", error);

            let errorMessage = "Export failed";
            if (error.response) {
                errorMessage =
                    error.response.data.message ||
                    error.response.statusText ||
                    `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = "Network error - no response received";
            }

            // Error toast
            addToast({
                title: "Export Failed",
                description: errorMessage,
                color: "danger",
                timeout: 8000,
            });
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Export Guests Report</h2>
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
