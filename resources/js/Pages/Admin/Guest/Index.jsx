import { DeleteIcon, EditIcon, EyeIcon, SearchIcon } from "@/Components/Icons";
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
import Swal from "sweetalert2";

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
    const [selectedGuest, setSelectedGuest] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        id_type: "",
        id_number: "",
        address: "",
    });

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

    const openModal = (guest) => {
        setSelectedGuest(guest);
        setFormData({
            name: guest.name,
            email: guest.email || "",
            phone: guest.phone || "",
            company: guest.company || "",
            id_type: guest.id_type || "",
            id_number: guest.id_number || "",
            address: guest.address || "",
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

    const handleUpdate = () => {
        Inertia.put(route("guest.update", { id: selectedGuest.id }), formData, {
            onSuccess: () => {
                Swal.fire(
                    "Updated!",
                    "The guest has been updated successfully.",
                    "success"
                );
                closeModal();
                Inertia.reload();
            },
            onError: (errors) => {
                Swal.fire(
                    "Error!",
                    "An error occurred while updating the guest.",
                    "error"
                );
            },
        });
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
                            <div className="flex justify-start items-center">
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
                            {items.map((guest, index) => (
                                <TableRow key={guest.id}>
                                    <TableCell className="text-success">
                                        {(page - 1) * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell>{guest.name}</TableCell>
                                    <TableCell>{guest.email || "--"}</TableCell>
                                    <TableCell>{guest.phone || "--"}</TableCell>
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
                                        <div className="flex gap-1">
                                            <Tooltip content="Edit">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() =>
                                                        openModal(guest)
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
                                                        handleDelete(guest.id)
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

            <Modal
                isDismissable={false}
                isOpen={isModalOpen}
                onOpenChange={closeModal}
                hideCloseButton
                size="xl"
                backdrop="blur"
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex gap-1">
                                Edit Guest
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label="Name"
                                        name="name"
                                        variant="bordered"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Email"
                                        name="email"
                                        variant="bordered"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Phone"
                                        name="phone"
                                        variant="bordered"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Company"
                                        name="company"
                                        variant="bordered"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="ID Type"
                                        name="id_type"
                                        variant="bordered"
                                        value={formData.id_type}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="ID Number"
                                        name="id_number"
                                        variant="bordered"
                                        value={formData.id_number}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Address"
                                        name="address"
                                        variant="bordered"
                                        value={formData.address}
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
                                <Button color="primary" onPress={handleUpdate}>
                                    Update
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </AuthenticatedLayout>
    );
}
