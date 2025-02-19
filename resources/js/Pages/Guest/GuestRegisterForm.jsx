import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import {
    Input,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Select,
    SelectItem,
    ModalFooter,
    useDisclosure,
    Listbox,
    ListboxItem,
    ListboxSection,
    Checkbox,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import { FaRegUserCircle } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import {
    FiLock,
    FiCheckCircle,
    FiShield,
    FiInfo,
    FiShare,
} from "react-icons/fi";

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
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

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

    const handleRegisterClick = () => {
        setIsPrivacyModalOpen(true);
    };

    const handleAgree = () => {
        setIsPrivacyModalOpen(false);
        setIsRegisterModalOpen(true);
    };

    const iconClasses =
        "text-xl text-default-500 pointer-events-none flex-shrink-0";

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
            <Modal
                isOpen={isPrivacyModalOpen}
                onOpenChange={setIsPrivacyModalOpen}
                scrollBehavior="inside"
                size="lg"
                isDismissable={false}
                isKeyboardDismissDisabled
                hideCloseButton
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 items-center">
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            {/* <MdSecurity size={24} className="text-success" /> */}
                            {/* <h2 className="uppercase text-md bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
                                Guestbook Kiosk Privacy Notice
                            </h2> */}
                            <h2 className="text-2xl mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary relative">
                                    Guestbook Kiosk Privacy Notice
                                    <span className="absolute  left-1/2 transform -translate-x-1/2 -bottom-2 h-[3px] w-16 bg-[#2aefe6]"></span>
                                </span>
                            </h2>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Listbox aria-label="Guest Consent">
                            <ListboxSection title="" showDivider>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                This section outlines how we
                                                collect, use, and protect your
                                                personal and non-personal
                                                information. We are committed to
                                                safeguarding your privacy and
                                                ensuring a secure online
                                                experience with our guest
                                                logbook.
                                            </p>
                                        </>
                                    }
                                ></ListboxItem>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                We may collect personal details
                                                such as your name, email
                                                address, and phone number when
                                                you complete the registration
                                                form. This information allows us
                                                to effectively manage guest
                                                entries and ensure a
                                                personalized experience.
                                            </p>
                                        </>
                                    }
                                    startContent={
                                        <FaRegUserCircle
                                            className={iconClasses}
                                        />
                                    }
                                >
                                    Information Collection
                                </ListboxItem>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                Your personal information is
                                                utilized for enhancing our guest
                                                logbook services, facilitating
                                                communication with you, and
                                                improving our overall user
                                                experience. We do not engage in
                                                any form of unauthorized
                                                marketing or sharing of your
                                                data.
                                            </p>
                                        </>
                                    }
                                    startContent={
                                        <FiLock className={iconClasses} />
                                    }
                                >
                                    Use of Information
                                </ListboxItem>
                                <ListboxItem
                                    key=""
                                    description="We take appropriate measures to safeguard your data and maintain its confidentiality. Your information is not sold or shared with third parties unless required by law."
                                    startContent={
                                        <FiShield className={iconClasses} />
                                    }
                                >
                                    Data Protection
                                </ListboxItem>
                                <ListboxItem
                                    key=""
                                    description="By using our guest logbook and submitting information through the form, you consent to the terms outlined in this privacy policy."
                                    startContent={
                                        <FiCheckCircle
                                            className={iconClasses}
                                        />
                                    }
                                >
                                    Consent
                                </ListboxItem>
                            </ListboxSection>

                            <ListboxSection>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                We may update this privacy
                                                notice from time to time. We
                                                will post the updated notice on
                                                the Kiosk.
                                            </p>
                                        </>
                                    }
                                >
                                    Changes to this Privacy Notice
                                </ListboxItem>
                            </ListboxSection>
                            <ListboxSection>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                If you have any questions about
                                                this privacy notice, please
                                                contact us at{" "}
                                                <b className="text-blue-500">
                                                    dpcompliance@kiosk.com
                                                </b>
                                            </p>
                                        </>
                                    }
                                >
                                    Contact Us
                                </ListboxItem>
                            </ListboxSection>
                            <ListboxSection>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                Thank you for entrusting us with
                                                your information.
                                            </p>
                                        </>
                                    }
                                ></ListboxItem>
                            </ListboxSection>
                        </Listbox>
                    </ModalBody>
                    <div className="px-4 py-3 sm:px-6">
                        <Checkbox
                            name="is_agreed"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        >
                            <span className="text-xs">
                                I have read and agreed to the privacy notice
                                stated above and I understand that I can revoke
                                my consent at any time.
                            </span>
                        </Checkbox>
                    </div>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onPress={handleAgree}
                            isDisabled={!isChecked}
                        >
                            Continue
                        </Button>
                        <Button
                            color="danger"
                            onPress={() => setIsPrivacyModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Registration Modal */}
            <Modal
                // isOpen={isOpen}
                // onOpenChange={() => setIsOpen(!isOpen)}
                isOpen={isRegisterModalOpen}
                onOpenChange={() => setIsRegisterModalOpen(false)}
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
                            <div className="flex gap-3 justify-end mt-5 mb-5">
                                <Button color="primary" type="submit">
                                    Submit
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
