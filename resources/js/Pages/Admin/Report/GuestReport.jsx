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
import { Head } from "@inertiajs/react";
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
    const [dateRange, setDateRange] = useState({});

    const generatePDFReportAllLogs = async () => {
        try {
            if (
                !guestVisitsData ||
                guestVisitsData.datasets[0].data.every((value) => value === 0)
            ) {
                Swal.fire({
                    icon: "warning",
                    title: "No Records",
                    text: "There are no guest logs available to export.",
                });
                return;
            }

            const response = await axios.get("/generate-report-all-guestlogs", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "All_Guest_Logs_Report.pdf");
            document.body.appendChild(link);
            link.click();

            Swal.fire({
                icon: "success",
                title: "PDF Report Generated",
                text: "The PDF report for all logs has been successfully generated and downloaded.",
            });
        } catch (error) {
            console.error("Error generating PDF report for all logs:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to generate PDF report for all logs. Please try again later.",
            });
        }
    };

    const generatePDFReportCustomRange = async () => {
        if (!dateRange.start || !dateRange.end) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Please select date range.",
            });
            return;
        }

        try {
            if (
                !guestVisitsData ||
                guestVisitsData.datasets[0].data.every((value) => value === 0)
            ) {
                Swal.fire({
                    icon: "warning",
                    title: "No Records",
                    text: "There are no guest logs available for the selected date range.",
                });
                return;
            }
            const response = await axios.get("/generate-report-guestlog", {
                responseType: "blob",
                params: {
                    start_date: dateRange.start,
                    end_date: dateRange.end,
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                "Guest_logs_report_from_" +
                    dateRange.start +
                    "_to_" +
                    dateRange.end +
                    ".pdf"
            );
            document.body.appendChild(link);
            link.click();

            Swal.fire({
                icon: "success",
                title: "PDF Report Generated",
                text: "The PDF report for the selected date range has been successfully generated and downloaded.",
            });
        } catch (error) {
            console.error(
                "Error generating PDF report for custom range:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to generate PDF report for the selected date range. Please try again later.",
            });
        }
    };

    const [guestVisitsData, setGuestVisitsData] = useState(null);

    useEffect(() => {
        fetchGuestVisitsData();
    }, []);

    const fetchGuestVisitsData = async () => {
        try {
            const response = await axios.get("/guest-visits-per-month");
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

    const fillMissingData = (
        existingLabels,
        existingData
    ) => {
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
                    <Card className="w-full">
                        <CardHeader className="flex gap-3">
                            <div className="flex justify-between gap-3">
                                <Button
                                    color="primary"
                                    variant="shadow"
                                    onClick={generatePDFReportAllLogs}
                                >
                                    Export All
                                </Button>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        color="secondary"
                                        onClick={generatePDFReportCustomRange}
                                    >
                                        Export Custom Date
                                    </Button>

                                    <DateRangePicker
                                        label="Select Date Range"
                                        size="sm"
                                        value={dateRange}
                                        onChange={setDateRange}
                                        className="w-50"
                                        visibleMonths={2}
                                        pageBehavior="single"
                                    />
                                </div>
                            </div>
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
        </AuthenticatedLayout>
    );
};

export default GuestReport;
