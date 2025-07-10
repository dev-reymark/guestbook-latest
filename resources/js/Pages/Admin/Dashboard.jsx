import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Card } from "@heroui/react";

export default function Dashboard({
    auth,
    totalRegisteredGuest,
    guestsRegisteredLastWeek,
    percentChange,
    totalGuestLogs,
    guestLogsLastWeek,
    guestLogsPercentChange,
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 p-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                        <Card as={Link} isPressable href={route("guest.index")}>
                            <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                                <div className="inline-flex justify-center items-center">
                                    <span className="size-2 inline-block bg-primary rounded-full me-2"></span>
                                    <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">
                                        Total Registered Guest
                                    </span>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">
                                        {totalRegisteredGuest}
                                    </h3>
                                </div>

                                <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
                                    <dt className="pe-3">
                                        <span
                                            className={
                                                percentChange >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            <svg
                                                className="inline-block size-4 self-center"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
                                                />
                                            </svg>
                                            <span className="inline-block text-sm">
                                                {percentChange?.toFixed(1)}%
                                            </span>
                                        </span>
                                        <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                            change
                                        </span>
                                    </dt>

                                    <dd className="text-start ps-3">
                                        <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                            {guestsRegisteredLastWeek}
                                        </span>
                                        <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                            last week
                                        </span>
                                    </dd>
                                </dl>
                            </div>
                        </Card>

                        <Card as={Link} isPressable href={route("guest.log.index")}>
                            <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                                <div className="inline-flex justify-center items-center">
                                    <span className="size-2 inline-block bg-green-500 rounded-full me-2"></span>
                                    <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">
                                        Successful Guest Logs
                                    </span>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">
                                        {totalGuestLogs}
                                    </h3>
                                </div>

                                <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
                                    <dt className="pe-3">
                                        <span
                                            className={
                                                guestLogsPercentChange >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            <svg
                                                className="inline-block size-4 self-center"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
                                                />
                                            </svg>
                                            <span className="inline-block text-sm">
                                                {guestLogsPercentChange?.toFixed(
                                                    1
                                                )}
                                                %
                                            </span>
                                        </span>
                                        <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                            change
                                        </span>
                                    </dt>
                                    <dd className="text-start ps-3">
                                        <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                            {guestLogsLastWeek}
                                        </span>
                                        <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                            last week
                                        </span>
                                    </dd>
                                </dl>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
