import { useEffect, useState } from "react";
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
    addToast,
} from "@heroui/react";
import PrivacyModal from "@/Components/Guest/PrivacyModal";
import { useAutoRedirect } from "@/hooks/useAutoRedirect";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { MdWifiOff } from "react-icons/md";

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

    // useAutoRedirect();
    const isOnline = useNetworkStatus();

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
            router.post(route("guest.register"), values, {
                onSuccess: (response) => {
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
                    addToast({
                        title: "Success",
                        description: response.props.flash.success, // Access flash from response
                        color: "success",
                    });
                    console.log(response);
                },
                onError: (errors) => {
                    const flattenedErrors = {};
                    if (errors.message) {
                        // For non-validation errors
                        flattenedErrors.message = errors.message;
                    } else {
                        // For validation errors
                        Object.keys(errors).forEach((key) => {
                            flattenedErrors[key] = Array.isArray(errors[key])
                                ? errors[key][0]
                                : errors[key];
                        });
                    }

                    setErrors(flattenedErrors);
                    addToast({
                        title: "Error",
                        description:
                            flattenedErrors.message ||
                            "Please check the form for errors",
                        color: "danger",
                    });
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            });
        } catch (error) {
            console.error(error);
            addToast({
                title: "Error",
                description: error.message || "An unexpected error occurred",
                color: "danger",
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

    const handleCancelPrivacy = () => {
        setIsPrivacyModalOpen(false);
        // Reset all form values to initial state
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
        // Clear any errors
        setErrors({});
    };

    const handleCancelRegister = () => {
        setIsRegisterModalOpen(false);
        // Reset all form values to initial state
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
        // Clear any errors
        setErrors({});
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

            <Modal
                isOpen={!isOnline}
                hideCloseButton
                placement="center"
                backdrop="blur"
                isDismissable={false}
            >
                <ModalContent>
                    <ModalBody className="p-6 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <MdWifiOff className="text-red-500 text-5xl" />
                            <h2 className="text-xl font-bold text-red-600">
                                Offline Mode
                            </h2>
                            <p className="text-sm text-gray-600">
                                You are currently offline. Some features may be
                                unavailable. Please reconnect to continue.
                            </p>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Privacy Modal */}
            <PrivacyModal
                isOpen={isPrivacyModalOpen}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setValues((prev) => ({ ...prev, is_agreed: false }));
                    }
                    setIsPrivacyModalOpen(isOpen);
                }}
                isChecked={values.is_agreed}
                onCheckboxChange={handleCheckboxChange}
                onAgree={() => {
                    setIsPrivacyModalOpen(false);
                    setIsRegisterModalOpen(true);
                }}
                onCancel={handleCancelPrivacy}
            />

            {/* Registration Modal */}
            <Modal
                isOpen={isRegisterModalOpen}
                onOpenChange={() => setIsRegisterModalOpen(false)}
                size="2xl"
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
                                        ? "Please wait..."
                                        : "Register"}
                                </Button>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={handleCancelRegister}
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
