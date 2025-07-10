import { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { router, usePage } from "@inertiajs/react";
import {
    Input,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Select,
    SelectItem,
} from "@heroui/react";
import Swal from "sweetalert2";
import PrivacyModal from "@/Components/Guest/PrivacyModal";
import { useAutoRedirect } from "@/hooks/useAutoRedirect";
import { useFlashMessages } from "@/hooks/useflashMessages";

export default function RegisterForm() {
    const [values, setValues] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        id_type: "",
        id_number: "",
        is_agreed: false,
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    useAutoRedirect();
    useFlashMessages();

    const handleChange = (e) => {
        const { name, value } = e.target;
        let capitalizedValue = value;
        if (name === "name" || name === "company") {
            capitalizedValue = value
                .split(" ")
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                )
                .join(" ");
        }
        setValues((prevValues) => ({
            ...prevValues,
            [name]: capitalizedValue,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            router.post("/guest/register", values, {
                onSuccess: () => {
                    setIsRegisterModalOpen(false);
                    setValues({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        address: "",
                        id_type: "",
                        id_number: "",
                        is_agreed: false,
                    });
                },
                onError: (err) => {
                    setErrors(err);
                    Swal.fire({
                        title: "Validation Error",
                        text: "Please check the form for errors",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
            setIsProcessing(false);
        }
    };

    const handleCheckboxChange = () => {
        setValues((prev) => ({
            ...prev,
            is_agreed: !prev.is_agreed,
        }));
    };

    const handleRegisterClick = () => {
        setIsPrivacyModalOpen(true);
    };

    const handleAgree = () => {
        setIsPrivacyModalOpen(false);
        setIsRegisterModalOpen(true);
    };

    return (
        <div>
            <Button
                color="primary"
                variant="shadow"
                className="mt-6"
                onPress={handleRegisterClick}
            >
                Register
            </Button>

            {/* Privacy Modal */}
            <PrivacyModal
                isOpen={isPrivacyModalOpen}
                onOpenChange={setIsPrivacyModalOpen}
                isChecked={values.is_agreed}
                onCheckboxChange={handleCheckboxChange}
                onAgree={handleAgree}
            />

            {/* Registration Modal */}
            <Modal
                isOpen={isRegisterModalOpen}
                onOpenChange={() => setIsRegisterModalOpen(false)}
                size="xl"
                scrollBehavior="outside"
                isDismissable={false}
                isKeyboardDismissDisabled
                hideCloseButton
                placement="center"
            >
                <ModalContent>
                    <ModalHeader className="flex items-center">
                        <section className="bg-white py-[15px]">
                            <div className="mx-auto px-2 sm:container">
                                <div className="flex items-center border-b border-stroke pb-6">
                                    <div>
                                        <h4 className="mb-1 font-extrabold text-dark">
                                            Welcome 👋
                                        </h4>
                                        <p className="text-sm font-medium text-body-color">
                                            Please take a moment to fill out the
                                            form below to register.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </ModalHeader>
                    <ModalBody>
                        <p className="mb-4">
                            <span className="font-semibold text-danger">
                                (*) Required Field
                            </span>
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    name="name"
                                    label="Full Name"
                                    value={values.name}
                                    onChange={handleChange}
                                    isRequired
                                    isInvalid={!!errors.name}
                                    errorMessage={errors.name}
                                    onClear={() =>
                                        setValues({ ...values, name: "" })
                                    }
                                    variant="bordered"
                                />
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    name="company"
                                    label="Company Name"
                                    value={values.company}
                                    onChange={handleChange}
                                    isRequired
                                    isInvalid={!!errors.company}
                                    errorMessage={errors.company}
                                    isClearable
                                    onClear={() =>
                                        setValues({ ...values, company: "" })
                                    }
                                    variant="bordered"
                                />
                            </div>
                            <div className="flex gap-2 mb-4">
                                <Input
                                    type="text"
                                    name="phone"
                                    label="Phone Number"
                                    value={values.phone}
                                    onChange={handleChange}
                                    isInvalid={!!errors.phone}
                                    errorMessage={errors.phone}
                                    onClear={() =>
                                        setValues({ ...values, phone: "" })
                                    }
                                    variant="bordered"
                                />
                                <Input
                                    type="email"
                                    name="email"
                                    label="Email Address"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                    errorMessage={errors.email}
                                    onClear={() =>
                                        setValues({ ...values, email: "" })
                                    }
                                    variant="bordered"
                                />
                            </div>
                            <div className="flex gap-2 mb-4">
                                <Select
                                    name="id_type"
                                    label="ID Type"
                                    value={values.id_type}
                                    onChange={handleChange}
                                    placeholder="Please select"
                                    isInvalid={!!errors.id_type}
                                    errorMessage={errors.id_type}
                                    variant="bordered"
                                >
                                    <SelectItem
                                        value="company_id"
                                        key="Company ID"
                                    >
                                        Company ID
                                    </SelectItem>
                                    <SelectItem value="passport" key="Passport">
                                        Passport
                                    </SelectItem>
                                    <SelectItem
                                        value="national_id"
                                        key="National ID"
                                    >
                                        National ID
                                    </SelectItem>
                                    <SelectItem
                                        value="driver_license"
                                        key="Driver's License"
                                    >
                                        Driver's License
                                    </SelectItem>
                                    <SelectItem value="work_id" key="Work ID">
                                        Work ID
                                    </SelectItem>
                                    <SelectItem value="voter_id" key="Voter ID">
                                        Voter ID
                                    </SelectItem>
                                    <SelectItem value="tin" key="TIN">
                                        TIN
                                    </SelectItem>
                                    <SelectItem
                                        value="postal_id"
                                        key="Postal ID"
                                    >
                                        Postal ID
                                    </SelectItem>
                                </Select>

                                <Input
                                    type="text"
                                    name="id_number"
                                    label="ID Number"
                                    value={values.id_number}
                                    onChange={handleChange}
                                    isInvalid={!!errors.id_number}
                                    errorMessage={errors.id_number}
                                    onClear={() =>
                                        setValues({ ...values, id_number: "" })
                                    }
                                    variant="bordered"
                                />
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    name="address"
                                    label="Address Line 1"
                                    value={values.address}
                                    onChange={handleChange}
                                    isInvalid={!!errors.address}
                                    errorMessage={errors.address}
                                    onClear={() =>
                                        setValues({ ...values, address: "" })
                                    }
                                    variant="bordered"
                                />
                            </div>
                            <div className="flex gap-2 justify-end mt-5 mb-5">
                                <Button
                                    color="primary"
                                    type="submit"
                                    isDisabled={
                                        isProcessing ||
                                        !values.name ||
                                        !values.company
                                    }
                                >
                                    {isProcessing
                                        ? "Registering..."
                                        : "Register"}
                                </Button>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={() =>
                                        setIsRegisterModalOpen(false)
                                    }
                                    isDisabled={isProcessing}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
