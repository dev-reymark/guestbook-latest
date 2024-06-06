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
                    <ModalHeader className="flex flex-col gap-1">
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <MdSecurity size={24} className="text-success" />
                            <h2 className="uppercase text-md bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
                                Guestbook Kiosk Privacy Notice
                            </h2>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Listbox variant="shadow" aria-label="Privacy Policy">
                            <ListboxSection title="" showDivider>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                This privacy notice discloses
                                                the privacy practices for the
                                                Guestbook Kiosk (the "Kiosk").
                                                This Kiosk is provided by
                                                Datalogic Systems Corporation
                                                ("we," "us," or "our"). This
                                                notice applies to information
                                                collected through the Kiosk.
                                            </p>
                                        </>
                                    }
                                ></ListboxItem>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                The Kiosk may collect the
                                                following information from you:
                                                <ol>
                                                    <li>Name,</li>
                                                    <li>Company,</li>
                                                    <li>Email,</li>
                                                    <li>Phone,</li>
                                                    <li>ID, and</li>
                                                    <li>Address.</li>
                                                </ol>
                                            </p>
                                        </>
                                    }
                                    startContent={
                                        <FaRegUserCircle
                                            className={iconClasses}
                                        />
                                    }
                                >
                                    Information We Collect
                                </ListboxItem>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                We use the information collected
                                                through the Kiosk to:
                                                <br />
                                                Potentially contact you if
                                                necessary (e.g., to clarify a
                                                message).
                                            </p>
                                        </>
                                    }
                                    startContent={
                                        <FiInfo className={iconClasses} />
                                    }
                                >
                                    How We Use Your Information
                                </ListboxItem>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                We will not share your
                                                information with any third party
                                                without your consent, except:
                                                <br /> To comply with legal
                                                obligations or law enforcement
                                                requests. <br /> To protect our
                                                rights or the safety of others.
                                            </p>
                                        </>
                                    }
                                    startContent={
                                        <FiShare className={iconClasses} />
                                    }
                                >
                                    Information Sharing
                                </ListboxItem>
                                <ListboxItem
                                    key=""
                                    description="We will retain the information collected through the Kiosk for as long as necessary to fulfill the purposes outlined in this privacy notice, unless a longer retention period is required or permitted by law."
                                    startContent={
                                        <FiShield className={iconClasses} />
                                    }
                                >
                                    Data Retention
                                </ListboxItem>
                                <ListboxItem
                                    key=""
                                    description={
                                        <>
                                            <p>
                                                You have the following choices
                                                regarding your information:
                                                <br />
                                                You can choose not to enter any
                                                information into the Kiosk.
                                                <br /> You can review and edit
                                                your message before submitting
                                                it.
                                            </p>
                                        </>
                                    }
                                    startContent={
                                        <FiCheckCircle
                                            className={iconClasses}
                                        />
                                    }
                                >
                                    Your Choices
                                </ListboxItem>
                                <ListboxItem
                                    key=""
                                    description="We take reasonable steps to protect the information collected through the Kiosk from unauthorized access, use, disclosure, alteration, or destruction. However, no internet transmission or electronic storage system is completely secure."
                                    startContent={
                                        <FiLock className={iconClasses} />
                                    }
                                >
                                    Security
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
                                                    dpcompliance@datalogicorp.net
                                                </b>
                                            </p>
                                        </>
                                    }
                                >
                                    Contact Us
                                </ListboxItem>
                            </ListboxSection>
                        </Listbox>
                        <div>
                            <Checkbox
                                name="is_agreed"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            >
                                Yes, I agree to the terms of this privacy notice
                            </Checkbox>
                        </div>
                    </ModalBody>
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
