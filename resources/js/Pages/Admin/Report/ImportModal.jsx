import { useForm } from "@inertiajs/react";
import { addToast } from "@heroui/react";
import { useState } from "react";
import { FiHelpCircle } from "react-icons/fi";

export default function ImportModal({ show, onClose }) {
    const { data, setData, post, errors, clearErrors } = useForm({
        file: null,
    });
    const [showHelp, setShowHelp] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("guests.import"), {
            preserveScroll: true,
            onSuccess: () => {
                addToast({
                    title: "Import Successful",
                    description: "Guests were imported successfully.",
                    color: "success",
                });
                onClose();
                setData("file", null);
                clearErrors();
            },
            onError: () => {
                addToast({
                    title: "Import Failed",
                    description: "There was a problem importing the file.",
                    color: "danger",
                });
            },
        });
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold">Import Guests</h2>
                        <button
                            onClick={() => setShowHelp(true)}
                            className="text-gray-500 hover:text-blue-600"
                            title="Help"
                        >
                            <FiHelpCircle size={20} />
                        </button>
                    </div>
                    <p className="italic text-sm text-danger-600 mb-4">
                        Important Note: The existing data will be overwritten.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2">
                                File (CSV or Excel)
                            </label>
                            <input
                                type="file"
                                className="w-full border rounded p-2"
                                onChange={(e) =>
                                    setData("file", e.target.files[0])
                                }
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
                                onClick={() => {
                                    onClose();
                                    setData("file", null);
                                    clearErrors();
                                }}
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

            {/* Help Modal */}
            {showHelp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold">
                                Import Instructions
                            </h2>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="font-medium">
                                File Format Requirements:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    File must be in CSV, XLSX, or XLS format
                                </li>
                                <li>
                                    First row should contain headers (column
                                    names)
                                </li>
                                <li>
                                    Supported headers (case insensitive):
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>name / Name</li>
                                        <li>id_type / ID Type</li>
                                        <li>id_number / ID Number</li>
                                        <li>email / Email</li>
                                        <li>phone / Phone</li>
                                        <li>company / Company</li>
                                        <li>address / Address</li>
                                    </ul>
                                </li>
                            </ul>

                            <p className="font-medium">Example CSV Format:</p>
                            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                                {`Name,ID Type,ID Number,Email,Phone,Company,Address
John Doe,Passport,AB123456,john@example.com,+123456789,ABC Corp,123 Street`}
                            </pre>

                            <p className="text-sm text-gray-600">
                                Note: All fields except "is_agreed" are
                                optional, but recommended.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
