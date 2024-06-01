import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Link,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Spacer,
} from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { Head, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { DeleteIcon } from "@/Components/Icons";
import { useState, useEffect } from "react";

export default function Index({ auth }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data, setData, post } = useForm({});
    const [uploads, setUploads] = useState([]);

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const response = await axios.get("/upload/all");
                setUploads(response.data);
            } catch (error) {
                console.error("Error fetching uploads:", error);
            }
        };

        fetchUploads();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/uploads/${id}`);
            setUploads(uploads.filter((upload) => upload.id !== id));
        } catch (error) {
            console.error("Error deleting upload:", error);
        }
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await post(route("media.upload"), data);
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Uploaded successfully.",
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    Inertia.visit(route("media.create"));
                }
            });
            onClose();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Upload
                </h2>
            }
        >
            <Head title="Guests" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Button
                        as={Link}
                        onPress={onOpen}
                        color="primary"
                        endContent={<FaPlus />}
                    >
                        Add Media
                    </Button>
                    <Spacer y={5} />

                    <Table aria-label="Media URL TABLE">
                        <TableHeader>
                            <TableColumn>MEDIA URL</TableColumn>
                            <TableColumn>{""}</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="No uploads found.">
                            {uploads.map((upload) => (
                                <TableRow key={upload.id}>
                                    <TableCell>{upload.media_url}</TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center justify-center gap-2 text-lg cursor-pointer active:opacity-50">
                                            <span className="text-primary cursor-pointer active:opacity-50">
                                                <DeleteIcon
                                                    className="text-danger"
                                                    onClick={() =>
                                                        handleDelete(upload.id)
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        placement="top-center"
                        isDismissable={false}
                        hideCloseButton={true}
                        size="xl"
                        scrollBehavior="outside"
                        backdrop="blur"
                    >
                        <ModalContent>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader className="flex flex-col gap-1">
                                    Upload Media Url
                                </ModalHeader>
                                <ModalBody>
                                    <div className="mb-4">
                                        <Input
                                            type="url"
                                            name="media_url"
                                            label="Media URL"
                                            onChange={handleChange}
                                            className="mt-1"
                                            placeholder="Media URL (Image or Video)"
                                        />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" type="submit">
                                        Upload
                                    </Button>
                                    <Button
                                        color="danger"
                                        onClick={() =>
                                            Inertia.visit(route("media.create"))
                                        }
                                    >
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </form>
                        </ModalContent>
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
