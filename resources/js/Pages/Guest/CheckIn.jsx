import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Autocomplete,
    AutocompleteItem,
    Avatar,
    Button,
    Input,
    Select,
    SelectItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import Swal from "sweetalert2";
import GuestRegisterForm from "./RegisterForm";
import { SearchIcon } from "@/Components/Icons";
import {
    meetingWithOptions,
    purposeOfVisitOptions,
} from "@/constants/guestOptions";
import { useAutoRedirect } from "@/hooks/useAutoRedirect";
import { useFlashMessages } from "@/hooks/useflashMessages";

export default function CheckIn({ guests }) {
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [values, setValues] = useState({
        meeting_with: "",
        purpose_of_visit: "",
        check_in_time: "",
        check_out_time: "",
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGuestModalOpen, setIsGuestModalOpen] = useState(true);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

    // useAutoRedirect();
    useFlashMessages();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Send the local time string as-is
        const formattedValues = {
            ...values,
            check_in_time: values.check_in_time,
            check_out_time: values.check_out_time || null,
        };

        router.post(`/guest/log/new/${selectedGuest.id}`, formattedValues, {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Check-in recorded successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    router.visit(route("guest.log.show"));
                });
            },
            onError: (errors) => {
                setErrors(errors);
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
    };

    const handleCheckIn = () => {
        const now = new Date();
        // Format as YYYY-MM-DDTHH:MM in local timezone
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        
        setValues((prev) => ({
            ...prev,
            check_in_time: localDateTime,
        }));
    
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.check_in_time;
            return newErrors;
        });
    };

    const filteredGuests = guests
        .filter((guest) =>
            guest.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    const handleGuestSelect = () => {
        if (selectedGuest) {
            setIsGuestModalOpen(false);
            setIsCheckInModalOpen(true);
        } else {
            Swal.fire({
                title: "Selection Required",
                text: "Please select a guest first.",
                icon: "warning",
            });
        }
    };

    return (
        <div className="min-h-screen bg-[url(/assets/images/bg.png)] bg-cover">
            <Head title="Guest Check-In" />

            {/* Guest Selection Modal */}
            <Modal
                isOpen={isGuestModalOpen}
                onClose={() => setIsGuestModalOpen(false)}
                hideCloseButton
                isDismissable={false}
                placement="center"
                size="2xl"
            >
                <ModalContent>
                    <section className="bg-white py-[30px]">
                        <div className="mx-auto px-4 sm:container">
                            <div className="flex items-center border-b border-stroke pb-6">
                                <div>
                                    <h4 className="mb-1 text-lg font-extrabold text-dark">
                                        Guest Check-In
                                    </h4>
                                    <p className="text-sm font-medium text-body-color">
                                        Please search your name to begin
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <ModalBody>
                        <div className="flex gap-3 mb-4">
                            <Autocomplete
                                label={<b>Guest Name</b>}
                                startContent={<SearchIcon size={20} />}
                                labelPlacement="outside"
                                placeholder="Search your name..."
                                description="If you don't see your name, please register first."
                                selectedKey={
                                    selectedGuest
                                        ? String(selectedGuest.id)
                                        : null
                                }
                                onSelectionChange={(key) => {
                                    if (key) {
                                        const guest = guests.find(
                                            (g) => String(g.id) === String(key)
                                        );
                                        setSelectedGuest(guest || null);
                                        setSearchValue(guest?.name || ""); // Sync input with selection
                                    } else {
                                        setSelectedGuest(null);
                                        setSearchValue("");
                                    }
                                }}
                                inputValue={searchValue}
                                onInputChange={(value) => {
                                    setSearchValue(value);
                                    if (!value.trim()) {
                                        setSelectedGuest(null);
                                    }
                                }}
                                isRequired
                                variant="bordered"
                                errorMessage={errors.guest_id}
                                isInvalid={!!errors.guest_id}
                            >
                                {filteredGuests.map((guest) => (
                                    <AutocompleteItem
                                        key={guest.id}
                                        value={String(guest.id)}
                                        textValue={guest.name}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Avatar
                                                name={guest.name}
                                                className="flex-shrink-0"
                                                size="sm"
                                            />
                                            <div>
                                                <span>{guest.name}</span>
                                                <p className="text-xs text-default-500">
                                                    {guest.company}
                                                </p>
                                            </div>
                                        </div>
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                            <GuestRegisterForm />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onPress={handleGuestSelect}
                            isDisabled={!selectedGuest}
                        >
                            Continue
                        </Button>
                        <Button
                            color="danger"
                            variant="flat"
                            onPress={() => router.visit("/")}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Check-in Form Modal */}
            <Modal
                isOpen={isCheckInModalOpen}
                onClose={() => setIsCheckInModalOpen(false)}
                hideCloseButton
                isDismissable={false}
                size="xl"
                scrollBehavior="outside"
                placement="center"
            >
                <ModalContent>
                    <ModalHeader>
                        <section className="w-full">
                            <div className="mx-auto px-2 sm:container">
                                <div className="flex items-center border-b border-stroke pb-6">
                                    <div>
                                        <h4 className="mb-1 text-sm font-extrabold text-dark">
                                            Welcome back, {selectedGuest?.name}
                                        </h4>
                                        <p className="text-sm font-medium text-body-color">
                                            Please complete your visit details
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </ModalHeader>
                    <form onSubmit={handleSubmit}>
                        <ModalBody>
                            <p className="mb-4">
                                <span className="font-semibold text-danger">
                                    (*) Required fields
                                </span>
                            </p>

                            <Autocomplete
                                className="max-w-full mb-4"
                                defaultItems={meetingWithOptions}
                                label={<b>Meeting With</b>}
                                labelPlacement="outside"
                                placeholder="Select person..."
                                variant="bordered"
                                selectedKey={values.meeting_with}
                                onSelectionChange={(key) => {
                                    setValues({
                                        ...values,
                                        meeting_with: key,
                                    });
                                    if (errors.meeting_with) {
                                        setErrors((prev) => {
                                            const newErrors = { ...prev };
                                            delete newErrors.meeting_with;
                                            return newErrors;
                                        });
                                    }
                                }}
                                // isRequired
                                errorMessage={errors.meeting_with}
                                isInvalid={!!errors.meeting_with}
                            >
                                {(person) => (
                                    <AutocompleteItem
                                        key={person.name}
                                        textValue={person.name}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <Avatar
                                                alt={person.name}
                                                className="flex-shrink-0"
                                                size="sm"
                                                src={person.avatar}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-small">
                                                    {person.name}
                                                </span>
                                                <span className="text-tiny text-default-400">
                                                    {person.position}
                                                </span>
                                            </div>
                                        </div>
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>

                            <Select
                                label={<b>Purpose of Visit</b>}
                                labelPlacement="outside"
                                placeholder="Select purpose"
                                selectedKeys={[values.purpose_of_visit]}
                                onChange={(e) => {
                                    setValues({
                                        ...values,
                                        purpose_of_visit: e.target.value,
                                    });
                                    if (errors.purpose_of_visit) {
                                        setErrors((prev) => {
                                            const newErrors = { ...prev };
                                            delete newErrors.purpose_of_visit;
                                            return newErrors;
                                        });
                                    }
                                }}
                                isRequired
                                className="mb-4"
                                errorMessage={errors.purpose_of_visit}
                                isInvalid={!!errors.purpose_of_visit}
                            >
                                {purposeOfVisitOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>

                            <div className="flex gap-4 mb-4 items-end">
                                <Input
                                    label={<b>Check In Time</b>}
                                    placeholder="Select date and time"
                                    labelPlacement="outside"
                                    type="datetime-local"
                                    name="check_in_time"
                                    value={values.check_in_time}
                                    onChange={handleChange}
                                    isRequired
                                    errorMessage={errors.check_in_time}
                                    isInvalid={!!errors.check_in_time}
                                    className="flex-1"
                                />
                                <Button
                                    color="primary"
                                    variant="bordered"
                                    onPress={handleCheckIn}
                                    className="h-[40px]"
                                >
                                    Use Current Time
                                </Button>
                            </div>
                        </ModalBody>
                        <ModalFooter className="flex gap-2">
                            <Button
                                color="primary"
                                type="submit"
                                isLoading={isProcessing}
                                isDisabled={
                                    isProcessing ||
                                    !selectedGuest ||
                                    !values.purpose_of_visit ||
                                    !values.check_in_time
                                }
                                className="flex-1"
                            >
                                {isProcessing ? "Processing..." : "Check-In"}
                            </Button>
                            <Button
                                color="default"
                                variant="flat"
                                className="flex-1"
                                onPress={() => {
                                    setIsCheckInModalOpen(false);
                                    setIsGuestModalOpen(true);
                                }}
                                isDisabled={isProcessing}
                            >
                                Back
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </div>
    );
}
