import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import {
    Input,
    Checkbox,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Select,
    SelectItem,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import PrivacyAndTermsModal from "@/Components/PrivacyAndTerms";

export default function GuestRegisterForm() {
    const [values, setValues] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        id_type: "",
        id_number: "",
        is_agreed: true,
    });
    const [isChecked, setIsChecked] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let capitalizedValue = value;
        if (name === "name" || name === "company") {
            capitalizedValue = value
                .split(" ") // Split the value into an array of words
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                ) // Capitalize the first letter of each word
                .join(" "); // Join the words back into a string
        }
        setValues((prevValues) => ({
            ...prevValues,
            [name]: capitalizedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await Inertia.post("/guest/register", values);
        Swal.fire({
            title: "Success!",
            text: "You are registered successfully!",
            icon: "success",
            confirmButtonText: "OK",
        });

        Inertia.visit(route("guestlog.create"));
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div>
            <Button
                color="primary"
                variant="shadow"
                className="mt-6"
                onPress={() => setIsOpen(true)}
            >
                Register
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => setIsOpen(!isOpen)}
                size="lg"
                scrollBehavior="outside"
                isDismissable={false}
                isKeyboardDismissDisabled
                hideCloseButton
            >
                <ModalContent>
                    <ModalHeader className="justify-center text-2xl py-5">
                        <div className="space-y-1 text-center">
                            <h2 className="text-2xl mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary relative">
                                    Guest Registration
                                    <span className="absolute  left-1/2 transform -translate-x-1/2 -bottom-2 h-[3px] w-16 bg-[#2aefe6]"></span>
                                </span>
                            </h2>
                            <p className="text-sm font-light">
                                Please fill up the form below to register.
                            </p>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    name="name"
                                    label="Name"
                                    value={values.name}
                                    onChange={handleChange}
                                    isRequired
                                    onClear={() =>
                                        setValues({ ...values, name: "" })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    name="company"
                                    label="Company"
                                    value={values.company}
                                    onChange={handleChange}
                                    isRequired
                                    isClearable
                                    onClear={() =>
                                        setValues({ ...values, company: "" })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    name="phone"
                                    label="Phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onClear={() =>
                                        setValues({ ...values, phone: "" })
                                    }
                                    isRequired
                                />
                            </div>
                            <div className="mb-4">
                                <Select
                                    name="id_type"
                                    label="ID Type"
                                    value={values.id_type}
                                    onChange={handleChange}
                                    placeholder="Select ID Type"
                                >
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
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    name="id_number"
                                    label="ID Number"
                                    value={values.id_number}
                                    onChange={handleChange}
                                    onClear={() =>
                                        setValues({ ...values, id_number: "" })
                                    }
                                />
                            </div>

                            <div className="mb-4">
                                <Input
                                    type="email"
                                    name="email"
                                    label="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onClear={() =>
                                        setValues({ ...values, email: "" })
                                    }
                                />
                            </div>

                            <div className="mb-4">
                                <Input
                                    type="text"
                                    name="address"
                                    label="Address"
                                    value={values.address}
                                    onChange={handleChange}
                                    onClear={() =>
                                        setValues({ ...values, address: "" })
                                    }
                                />
                            </div>
                            <div>
                                <Checkbox
                                    name="is_agreed"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                >
                                    I agree to the <PrivacyAndTermsModal />
                                </Checkbox>
                            </div>
                            <div className="flex gap-3 justify-end mt-5 mb-5">
                                <Button
                                    color="primary"
                                    type="submit"
                                    isDisabled={!isChecked}
                                >
                                    Register
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() =>
                                        Inertia.visit(route("guestlog.create"))
                                    }
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
