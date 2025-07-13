import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Card } from "@heroui/react";
import { LuDatabaseBackup } from "react-icons/lu";
import { VscSignOut } from "react-icons/vsc";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { Inertia } from "@inertiajs/inertia";

export default function Dashboard({
    auth,
    totalRegisteredGuest,
    guestsRegisteredLastWeek,
    guestsPercentChange,
    totalGuestLogs,
    guestLogsLastWeek,
    guestLogsPercentChange,
}) {
    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    const handleLogout = () => {
        Inertia.post(route("logout"));
    };

    const getTrendIndicator = (percentChange) => {
        const isPositive = percentChange >= 0;
        return {
            icon: isPositive ? (
                <svg
                    className="inline-block size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"
                    />
                </svg>
            ) : (
                <svg
                    className="inline-block size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"
                        transform="rotate(180 8 8)"
                    />
                </svg>
            ),
            color: isPositive ? "text-green-600" : "text-red-600",
            text: isPositive ? "increase" : "decrease",
        };
    };

    const guestTrend = getTrendIndicator(guestsPercentChange);
    const logTrend = getTrendIndicator(guestLogsPercentChange);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-white leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome back, {auth.user.name}!
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card
                            as={Link}
                            isPressable
                            href={route("guests.index")}
                            className="hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Registered Guests
                                    </h3>
                                    <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/50">
                                        <svg
                                            className="w-6 h-6 text-primary-600 dark:text-primary-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                            />
                                        </svg>
                                    </span>
                                </div>

                                <div className="mb-2">
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {formatNumber(totalRegisteredGuest)}
                                    </p>
                                </div>

                                <div className="flex items-center text-sm">
                                    <span
                                        className={`inline-flex items-center ${guestTrend.color}`}
                                    >
                                        {guestTrend.icon}
                                        <span className="ml-1 font-medium">
                                            {Math.abs(
                                                guestsPercentChange?.toFixed(1)
                                            )}
                                            % {guestTrend.text}
                                        </span>
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                                        vs last week (
                                        {formatNumber(guestsRegisteredLastWeek)}
                                        )
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card
                            as={Link}
                            isPressable
                            href={route("guestlogs.index")}
                            className="hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Guest Logs
                                    </h3>
                                    <span className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                                        <svg
                                            className="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </span>
                                </div>

                                <div className="mb-2">
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {formatNumber(totalGuestLogs)}
                                    </p>
                                </div>

                                <div className="flex items-center text-sm">
                                    <span
                                        className={`inline-flex items-center ${logTrend.color}`}
                                    >
                                        {logTrend.icon}
                                        <span className="ml-1 font-medium">
                                            {Math.abs(
                                                guestLogsPercentChange?.toFixed(
                                                    1
                                                )
                                            )}
                                            % {logTrend.text}
                                        </span>
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                                        vs last week (
                                        {formatNumber(guestLogsLastWeek)})
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="mt-8 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link
                                href={route("backups.index")}
                                className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                            >
                                <div className="flex items-center">
                                    <LuDatabaseBackup
                                        size={20}
                                        className="text-primary-600 mr-3"
                                    />
                                    <span className="font-medium">
                                        Backup Database
                                    </span>
                                </div>
                            </Link>

                            <Link
                                href={route("reports.create")}
                                className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                            >
                                <div className="flex items-center">
                                    <HiOutlineDocumentReport
                                        size={20}
                                        className="text-success-600 mr-3"
                                    />
                                    <span className="font-medium">
                                        View Reports
                                    </span>
                                </div>
                            </Link>
                            <Link
                                as="button"
                                onClick={handleLogout}
                                className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                            >
                                <div className="flex items-center">
                                    <VscSignOut
                                        size={20}
                                        className="text-red-600 mr-3"
                                    />
                                    <span className="font-medium">Logout</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
