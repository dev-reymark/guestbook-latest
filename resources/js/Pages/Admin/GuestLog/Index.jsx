import { useState } from "react";
import React from "react";
import { Head } from "@inertiajs/react";
import {
    Input,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    DateRangePicker,
    Pagination,
    getKeyValue,
} from "@heroui/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { DeleteIcon, SearchIcon } from "@/Components/Icons";
import Swal from "sweetalert2";
import { Inertia } from "@inertiajs/inertia";
import { formatLocalDateTime } from "@/utils/date";

export default function Index({ auth, guestLogs }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState({ start: null, end: null });

    const handleDelete = (guestId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(route("guest.log.destroy", { guestId }), {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "The guest has been deleted.",
                            "success"
                        );
                        // Reload the page to reflect changes
                        Inertia.reload();
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "An error occurred while deleting the guest.",
                            "error"
                        );
                    },
                });
            }
        });
    };

    const filterLogs = (guestLog) => {
        const matchesSearchTerm = guestLog.guest.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesDateRange =
            (!dateRange.start ||
                new Date(guestLog.created_at) >= new Date(dateRange.start)) &&
            (!dateRange.end ||
                new Date(guestLog.created_at) <= new Date(dateRange.end));

        return matchesSearchTerm && matchesDateRange;
    };

    const filteredGuestLogs = guestLogs.filter(filterLogs);

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 15;

    const pages = Math.ceil(filteredGuestLogs.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredGuestLogs.slice(start, end);
    }, [page, rowsPerPage, filteredGuestLogs]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Guest Logs
                </h2>
            }
        >
            <Head title="Guests Logs" />
            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-end gap-2 mb-4">
                            <Input
                                variant="bordered"
                                placeholder="Search by guest name"
                                className="w-full sm:max-w-[35%]"
                                startContent={
                                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                                }
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Table
                            selectionMode="single"
                            aria-label="Guests Table"
                            bottomContent={
                                <div className="flex w-full justify-center">
                                    <Pagination
                                        isCompact
                                        showControls
                                        showShadow
                                        color="secondary"
                                        page={page}
                                        total={pages}
                                        onChange={(page) => setPage(page)}
                                    />
                                </div>
                            }
                            classNames={{
                                wrapper: "min-h-[222px]",
                            }}
                            topContent={
                                <div className="flex items-center justify-between">
                                    <p className="text-sm italic font-medium text-gray-900 dark:text-white">
                                        showing {items.length} of{" "}
                                        {filteredGuestLogs.length}
                                    </p>
                                    <DateRangePicker
                                        label="Filter by Date"
                                        labelPlacement="top"
                                        className="max-w-xs"
                                        variant="bordered"
                                        visibleMonths={2}
                                        onChange={(range) =>
                                            setDateRange(range)
                                        }
                                    />
                                </div>
                            }
                        >
                            <TableHeader>
                                <TableColumn className="text-success">
                                    #
                                </TableColumn>
                                <TableColumn>Guest ID</TableColumn>
                                <TableColumn>Guest Name</TableColumn>
                                <TableColumn>Meeting with</TableColumn>
                                <TableColumn>Purpose of Visit</TableColumn>
                                <TableColumn>Check In</TableColumn>
                                <TableColumn>Check Out</TableColumn>
                            </TableHeader>
                            <TableBody
                                emptyContent={"No guests found."}
                                items={items}
                            >
                                {items.map((guestLog, index) => (
                                    <TableRow key={guestLog.id}>
                                        <TableCell className="text-success">
                                            {(page - 1) * rowsPerPage +
                                                index +
                                                1}
                                        </TableCell>
                                        <TableCell>
                                            {guestLog.guest_id}
                                        </TableCell>
                                        <TableCell>
                                            {guestLog.guest.name}
                                        </TableCell>
                                        <TableCell>
                                            {guestLog.meeting_with || "--"}
                                        </TableCell>
                                        <TableCell>
                                            {guestLog.purpose_of_visit}
                                        </TableCell>
                                        <TableCell>
                                            {formatLocalDateTime(
                                                guestLog.check_in_time
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {formatLocalDateTime(
                                                guestLog.check_out_time
                                            ) || "--"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
