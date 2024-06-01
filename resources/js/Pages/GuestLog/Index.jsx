import { useState } from "react";
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
} from "@nextui-org/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { DeleteIcon, SearchIcon } from "@/Components/Icons";
import Swal from "sweetalert2";
import { Inertia } from "@inertiajs/inertia";

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
            <div className="py-12">
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
                            <DateRangePicker
                                label="Filter by Date"
                                labelPlacement="top"
                                className="max-w-xs"
                                variant="bordered"
                                visibleMonths={2}
                                onChange={(range) => setDateRange(range)}
                            />
                        </div>

                        <Table selectionMode="single" aria-label="Guests Table">
                            <TableHeader>
                                <TableColumn>Guest ID</TableColumn>
                                <TableColumn>Guest Name</TableColumn>
                                <TableColumn>Purpose of Visit</TableColumn>
                                <TableColumn>Check In</TableColumn>
                                <TableColumn>Check Out</TableColumn>
                                <TableColumn>Actions</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={"No guests found."}>
                                {filteredGuestLogs.map((guestLog) => (
                                    <TableRow key={guestLog.id}>
                                        <TableCell>
                                            {guestLog.guest_id}
                                        </TableCell>
                                        <TableCell>
                                            {guestLog.guest.name}
                                        </TableCell>
                                        <TableCell>
                                            {guestLog.purpose_of_visit}
                                        </TableCell>
                                        <TableCell>
                                            {guestLog.check_in_time}
                                        </TableCell>
                                        <TableCell>
                                            {guestLog.check_out_time}
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative flex items-center justify-center gap-2 text-lg cursor-pointer active:opacity-50">
                                                <Tooltip
                                                    showArrow={true}
                                                    color="danger"
                                                    content="Delete"
                                                >
                                                    <span className="text-primary cursor-pointer active:opacity-50">
                                                        <DeleteIcon
                                                            className="text-danger"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    guestLog.id
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                </Tooltip>
                                            </div>
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
