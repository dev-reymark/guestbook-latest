import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
} from "@heroui/react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { DeleteIcon } from "@/Components/Icons";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Index({ auth }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data, setData, post, processing, reset } = useForm({ file: null });
    const [uploads, setUploads] = useState([]);

    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        const res = await axios.get("/media/all");
        setUploads(res.data);

        // console.log(res.data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("media.upload"), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                Swal.fire("Success", "Media uploaded!", "success");
                fetchUploads();
                reset();
                onClose();
            },
            onError: () => {
                Swal.fire("Error", "Upload failed!", "error");
            },
        });
    };

    const handleDelete = async (id) => {
        const confirmed = await Swal.fire({
            title: "Delete media?",
            icon: "warning",
            showCancelButton: true,
        });

        if (confirmed.isConfirmed) {
            await axios.delete(`/media/${id}`);
            setUploads((prev) => prev.filter((u) => u.id !== id));
            Swal.fire("Deleted!", "", "success");
        }
    };

    const getPreview = (upload) => {
        const url = `/storage/${upload.file_path}`;
        if (upload.file_type.includes("image")) {
            return <img src={url} className="h-16 rounded shadow" />;
        } else if (upload.file_type.includes("video")) {
            return (
                <video src={url} className="h-16" controls preload="metadata">
                    Your browser does not support video.
                </video>
            );
        }
        return "Unsupported file";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl">Upload Media</h2>}
        >
            <Head title="Upload Media" />

            <div className="py-8 px-4 max-w-7xl mx-auto">
                <div className="flex mb-4">
                    <Button color="primary" onPress={onOpen}>
                        Add
                    </Button>
                </div>

                <Table aria-label="Uploaded media">
                    <TableHeader>
                        <TableColumn>File Path</TableColumn>
                        <TableColumn>PREVIEW</TableColumn>
                        <TableColumn>TYPE</TableColumn>
                        <TableColumn>SIZE (KB)</TableColumn>
                        <TableColumn>ACTION</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No media uploaded.">
                        {uploads.map((upload) => (
                            <TableRow key={upload.id}>
                                <TableCell className="italic">
                                    {upload.file_path}
                                </TableCell>
                                <TableCell>{getPreview(upload)}</TableCell>
                                <TableCell>{upload.file_type}</TableCell>
                                <TableCell>{upload.file_size}</TableCell>
                                <TableCell>
                                    <Tooltip content="Delete">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            onPress={() =>
                                                handleDelete(upload.id)
                                            }
                                        >
                                            <DeleteIcon className="text-lg text-danger" />
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalContent>
                        <form onSubmit={handleSubmit}>
                            <ModalHeader>Upload File</ModalHeader>
                            <ModalBody>
                                <Input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.mp4"
                                    onChange={(e) =>
                                        setData("file", e.target.files[0])
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    color="primary"
                                    isLoading={processing}
                                >
                                    Upload
                                </Button>
                                <Button color="danger" onPress={onClose}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
