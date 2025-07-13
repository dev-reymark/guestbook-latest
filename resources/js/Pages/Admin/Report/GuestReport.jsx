import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    DateRangePicker,
    Divider,
} from "@heroui/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Chart,
    LinearScale,
    CategoryScale,
    LineController,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from "chart.js";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { TbDatabaseImport, TbFileExport } from "react-icons/tb";
import ExportModal from "./ExportModal";
import ImportModal from "./ImportModal";

Chart.register(
    LinearScale,
    CategoryScale,
    LineController,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);

const GuestReport = ({ auth }) => {
    const [showExportModal, setShowExportModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    const [guestVisitsData, setGuestVisitsData] = useState(null);

    useEffect(() => {
        fetchGuestVisitsData();
    }, []);

    const fetchGuestVisitsData = async () => {
        try {
            const response = await axios.get(
                "/guestlogs/guest-visits-per-month"
            );
            console.log(
                "Response from /guest-visits-per-month:",
                response.data
            );
            const transformedData = transformData(response.data);
            setGuestVisitsData(transformedData);
        } catch (error) {
            console.error("Error fetching guest visits data:", error);
        }
    };

    const transformData = (data) => {
        const { labels, datasets } = data;

        // Ensure labels for all months
        const allMonthsLabels = generateAllMonthsLabels();

        // Fill missing data with zeros
        const filledData = fillMissingData(labels, datasets[0].data);

        const currentYear = new Date().getFullYear();
        const labeledMonths = allMonthsLabels.map(
            (month) => `${month} ${currentYear}`
        );

        const transformedData = {
            labels: labeledMonths,
            datasets: [
                {
                    label: "Guest Visits",
                    data: filledData,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                },
            ],
        };
        return transformedData;
    };

    const generateAllMonthsLabels = () => {
        const labels = [];
        const currentDate = new Date();
        for (let i = 0; i < 12; i++) {
            currentDate.setMonth(i);
            labels.push(
                currentDate.toLocaleString("default", { month: "long" })
            );
        }
        return labels;
    };

    const fillMissingData = (existingLabels, existingData) => {
        const allMonthsLabels = generateAllMonthsLabels();
        const filledData = [];
        allMonthsLabels.forEach((month, index) => {
            const dataIndex = existingLabels.indexOf(month);
            if (dataIndex !== -1) {
                filledData.push(existingData[dataIndex]);
            } else {
                filledData.push(0);
            }
        });
        return filledData;
    };

    const renderGraph = (data) => {
        const ctx = document.getElementById("guestChart");

        if (!ctx) {
            console.error("Canvas element not found.");
            return;
        }

        // Destroy existing chart if it exists
        Chart.getChart(ctx)?.destroy();

        const options = {
            responsive: true,
            scales: {
                y: {
                    type: "linear",
                    beginAtZero: true,
                    max: Math.max(...data.datasets[0].data) + 10, // Adjust maximum value for y-axis
                },
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "Month",
                    },
                },
            },
        };

        new Chart(ctx, {
            type: "line",
            data: data,
            options: options,
        });
    };

    useEffect(() => {
        if (guestVisitsData) {
            renderGraph(guestVisitsData);
        }
    }, [guestVisitsData]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Analytics and Reports
                </h2>
            }
        >
            <Head title="Generate Report" />

            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8 bg-white rounded-xl border border-gray-100 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a
                                onClick={() => setShowImportModal(true)}
                                className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                            >
                                <div className="flex items-center">
                                    <TbDatabaseImport
                                        size={20}
                                        className="text-success-600 mr-3"
                                    />
                                    <span className="font-medium">
                                        Import Data
                                    </span>
                                </div>
                            </a>

                            <a
                                as="button"
                                onClick={() => setShowExportModal(true)}
                                className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                            >
                                <div className="flex items-center">
                                    <TbFileExport
                                        size={20}
                                        className="text-success-600 mr-3"
                                    />
                                    <span className="font-medium">
                                        Export Data
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                    <Card className="w-full">
                        <CardHeader>
                            <h3 className="text-lg font-medium text-gray-900">
                                Guest Visits Per Month
                            </h3>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <canvas id="guestChart"></canvas>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            <p>
                                <AiOutlineQuestionCircle
                                    className="inline"
                                    size={20}
                                />
                                &nbsp;The graph above shows the number of guest
                                visits per month.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <ExportModal
                show={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <ImportModal
                show={showImportModal}
                onClose={() => setShowImportModal(false)}
            />
        </AuthenticatedLayout>
    );
};

export default GuestReport;
