import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Listbox,
    ListboxItem,
    ListboxSection,
    Link,
} from "@nextui-org/react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import {
    FiLock,
    FiCheckCircle,
    FiShield,
} from "react-icons/fi";

export default function PrivacyAndTermsModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const iconClasses =
        "text-xl text-default-500 pointer-events-none flex-shrink-0";

    return (
        <>
            <Link onPress={onOpen}>privacy and terms.</Link>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                scrollBehavior="inside"
                size="lg"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <MdSecurity
                                        size={24}
                                        className="text-success"
                                    />{" "}
                                    <h2 className="uppercase text-md bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
                                        Guest Logbook Privacy and Terms
                                    </h2>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <Listbox
                                    variant="shadow"
                                    color="primary"
                                    aria-label="Privacy Policy"
                                >
                                    <ListboxSection title="" showDivider>
                                        <ListboxItem
                                            key=""
                                            description={
                                                <>
                                                    <p>
                                                        This section outlines
                                                        how we collect, use, and
                                                        protect your personal
                                                        and non-personal
                                                        information. We are
                                                        committed to
                                                        safeguarding your
                                                        privacy and ensuring a
                                                        secure online experience
                                                        with our guest logbook.
                                                    </p>
                                                </>
                                            }
                                        ></ListboxItem>
                                        <ListboxItem
                                            key=""
                                            description={
                                                <>
                                                    <p>
                                                        We may collect personal
                                                        details such as your
                                                        name, email address, and
                                                        phone number when you
                                                        complete the
                                                        registration form. This
                                                        information allows us to
                                                        effectively manage guest
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
                                                        Your personal
                                                        information is utilized
                                                        for enhancing our guest
                                                        logbook services,
                                                        facilitating
                                                        communication with you,
                                                        and improving our
                                                        overall user experience.
                                                        We do not engage in any
                                                        form of unauthorized
                                                        marketing or sharing of
                                                        your data.
                                                    </p>
                                                </>
                                            }
                                            startContent={
                                                <FiLock
                                                    className={iconClasses}
                                                />
                                            }
                                        >
                                            Use of Information
                                        </ListboxItem>
                                        <ListboxItem
                                            key=""
                                            description="We take appropriate measures to safeguard your data and maintain its confidentiality. Your information is not sold or shared with third parties unless required by law."
                                            startContent={
                                                <FiShield
                                                    className={iconClasses}
                                                />
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
                                                        Your privacy is
                                                        important to us. We are
                                                        committed to protecting
                                                        your personal
                                                        information and ensuring
                                                        its confidentiality. Any
                                                        data collected through
                                                        this form will be used
                                                        solely for the purpose
                                                        stated and will not be
                                                        shared with third
                                                        parties without your
                                                        consent, except where
                                                        required by law.
                                                    </p>
                                                    <br />
                                                    <p>
                                                        Thank you for entrusting
                                                        us with your
                                                        information.
                                                    </p>
                                                </>
                                            }
                                        ></ListboxItem>
                                    </ListboxSection>
                                </Listbox>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
