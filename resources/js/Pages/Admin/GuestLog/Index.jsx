import { useState, useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
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
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { DeleteIcon, SearchIcon, EditIcon } from "@/Components/Icons";
import Swal from "sweetalert2";
import { Inertia } from "@inertiajs/inertia";
import { formatLocalDateTime } from "@/utils/date";

export default function Index({ auth, guestLogs }) {
    const { props } = usePage();
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [formData, setFormData] = useState({
        meeting_with: "",
        purpose_of_visit: "",
        check_in_time: "",
        check_out_time: "",
    });

    const handleDelete = (logId) => {
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
                Inertia.delete(route("guestlog.destroy", { logId }), {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "The log has been deleted.",
                            "success"
                        );
                    },
                    onError: () => {
                        Swal.fire("Error!", "Failed to delete log.", "error");
                    },
                });
            }
        });
    };

    const openEditModal = (log) => {
        setSelectedLog(log);
        setFormData({
            meeting_with: log.meeting_with || "",
            purpose_of_visit: log.purpose_of_visit,
            check_in_time: log.check_in_time,
            check_out_time: log.check_out_time || "",
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        Inertia.put(
            route("guestlog.update", { logId: selectedLog.id }),
            formData,
            {
                onSuccess: () => {
                    Swal.fire(
                        "Updated!",
                        "The log has been updated.",
                        "success"
                    );
                    closeModal();
                },
                onError: (errors) => {
                    Swal.fire("Error!", "Failed to update log.", "error");
                },
            }
        );
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

    const [page, setPage] = useState(1);
    const rowsPerPage = 15;

    const pages = Math.ceil(filteredGuestLogs.length / rowsPerPage);

    const items = useMemo(() => {
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
                                <TableColumn>Actions</TableColumn>
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
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Tooltip content="Edit">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        onPress={() =>
                                                            openEditModal(
                                                                guestLog
                                                            )
                                                        }
                                                    >
                                                        <EditIcon className="text-lg text-default-400" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Delete">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        onPress={() =>
                                                            handleDelete(
                                                                guestLog.id
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon className="text-lg text-danger" />
                                                    </Button>
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

            {/* Edit Modal */}
            <Modal
                isDismissable={false}
                size="xl"
                isOpen={isModalOpen}
                onClose={closeModal}
                hideCloseButton
                placement="center"
            >
                <ModalContent>
                    <ModalHeader>Edit Guest Log</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <Input
                                label="Meeting With"
                                name="meeting_with"
                                value={formData.meeting_with}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Purpose of Visit"
                                name="purpose_of_visit"
                                value={formData.purpose_of_visit}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Check In Time"
                                type="datetime-local"
                                name="check_in_time"
                                value={formData.check_in_time}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Check Out Time"
                                type="datetime-local"
                                name="check_out_time"
                                value={formData.check_out_time}
                                onChange={handleInputChange}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={closeModal}
                        >
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleSubmit}>
                            Save Changes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AuthenticatedLayout>
    );
}
