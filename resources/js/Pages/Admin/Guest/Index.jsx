import { DeleteIcon, EyeIcon, SearchIcon } from "@/Components/Icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage } from "@inertiajs/react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableCell,
    TableRow,
    Button,
    Input,
    Tooltip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
} from "@heroui/react";
import React from "react";
import { FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

export default function Index({ auth }) {
    const {
        props: { guests },
    } = usePage();
    const [filterValue, setFilterValue] = React.useState("");
    const sortedGuests = guests
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
    const filteredGuests = sortedGuests.filter((guest) =>
        guest.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedGuestDetails, setSelectedGuestDetails] =
        React.useState(null);
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
                Inertia.delete(route("guest.destroy", { id: guestId }), {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "The guest has been deleted.",
                            "success"
                        );
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

    const handleExport = async () => {
        if (filteredGuests.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "No Records",
                text: "There are no guests to export.",
            });
            return;
        }
        try {
            const response = await axios.get("/generate-report", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Guests_Report.pdf");
            document.body.appendChild(link);
            link.click();

            Swal.fire({
                icon: "success",
                title: "PDF Report Generated",
                text: "The PDF report has been successfully generated and downloaded.",
            });
        } catch (error) {
            console.error("Error generating PDF report:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to generate PDF report. Please try again later.",
            });
        }
    };

    const openModal = (guest) => {
        setSelectedGuestDetails(guest);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 10;

    const pages = Math.ceil(filteredGuests.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredGuests.slice(start, end);
    }, [page, rowsPerPage, filteredGuests]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Registered Guests
                </h2>
            }
        >
            <Head title="Registered Guests" />

            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-end gap-3 items-end mb-4">
                            <Input
                                variant="bordered"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                placeholder="Search by name"
                                className="w-full sm:max-w-[35%]"
                                startContent={
                                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                                }
                            />
                        </div>
                    </div>
                    <Table
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
                            <div className="flex justify-between items-center">
                                <Button
                                    color="primary"
                                    variant="bordered"
                                    onPress={handleExport}
                                    startContent={<FaFilePdf size={20} />}
                                >
                                    Export to PDF
                                </Button>

                                <p className="text-sm italic text-gray-700">
                                    showing {items.length} of{" "}
                                    {filteredGuests.length} guests
                                </p>
                            </div>
                        }
                    >
                        <TableHeader>
                            <TableColumn className="text-success">
                                #
                            </TableColumn>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>EMAIL</TableColumn>
                            <TableColumn>PHONE</TableColumn>
                            <TableColumn>COMPANY</TableColumn>
                            <TableColumn>ID TYPE</TableColumn>
                            <TableColumn>ID NUMBER</TableColumn>
                            <TableColumn>ADDRESS</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody
                            emptyContent={"No guests found"}
                            items={items}
                        >
                            {items.map(
                                (
                                    guest,
                                    index /* Change filteredGuests to items */
                                ) => (
                                    <TableRow key={guest.id}>
                                        <TableCell className="text-success">
                                            {(page - 1) * rowsPerPage +
                                                index +
                                                1}
                                        </TableCell>
                                        <TableCell>{guest.name}</TableCell>
                                        <TableCell>
                                            {guest.email || "--"}
                                        </TableCell>
                                        <TableCell>
                                            {guest.phone || "--"}
                                        </TableCell>
                                        <TableCell>{guest.company}</TableCell>
                                        <TableCell>
                                            {guest.id_type || "--"}
                                        </TableCell>
                                        <TableCell>
                                            {guest.id_number || "--"}
                                        </TableCell>
                                        <TableCell>
                                            {guest.address || "--"}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                color="secondary"
                                                variant="flat"
                                                onPress={() => openModal(guest)}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Modal
                isDismissable={false}
                isOpen={isModalOpen}
                onOpenChange={closeModal}
                hideCloseButton
                backdrop="blur"
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Guest Details
                            </ModalHeader>
                            <ModalBody>
                                {selectedGuestDetails && (
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            label="Name"
                                            variant="bordered"
                                            value={selectedGuestDetails.name}
                                        />
                                        <Input
                                            label="Email"
                                            variant="bordered"
                                            value={selectedGuestDetails.email}
                                        />
                                        <Input
                                            label="Phone"
                                            variant="bordered"
                                            value={
                                                selectedGuestDetails.phone ??
                                                undefined
                                            }
                                        />

                                        <Input
                                            label="Company"
                                            variant="bordered"
                                            value={
                                                selectedGuestDetails.company ??
                                                undefined
                                            }
                                        />

                                        <Input
                                            label="Address"
                                            variant="bordered"
                                            value={
                                                selectedGuestDetails.address ??
                                                undefined
                                            }
                                        />
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={closeModal}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </AuthenticatedLayout>
    );
}
