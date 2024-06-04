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
import { FiLock, FiCheckCircle, FiShield, FiInfo, FiShare } from "react-icons/fi";

export default function PrivacyAndTermsModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const iconClasses =
        "text-xl text-default-500 pointer-events-none flex-shrink-0";

    return (
        <>
            <Link onPress={onOpen}>privacy notice.</Link>
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
                                        Guestbook Kiosk Privacy Notice
                                    </h2>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <Listbox
                                    variant="shadow"
                                    aria-label="Privacy Policy"
                                >
                                    <ListboxSection title="" showDivider>
                                        <ListboxItem
                                            key=""
                                            description={
                                                <>
                                                    <p>
                                                        This privacy notice
                                                        discloses the privacy
                                                        practices for the
                                                        Guestbook Kiosk (the
                                                        "Kiosk"). This Kiosk is
                                                        provided by Datalogic
                                                        Systems Corporation
                                                        ("we," "us," or "our").
                                                        This notice applies to
                                                        information collected
                                                        through the Kiosk.
                                                    </p>
                                                </>
                                            }
                                        ></ListboxItem>
                                        <ListboxItem
                                            key=""
                                            description={
                                                <>
                                                    <p>
                                                        The Kiosk may collect
                                                        the following
                                                        information from you:
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
                                                        We use the information
                                                        collected through the
                                                        Kiosk to: <br />
                                                        {/* Display your message and
                                                        signature in the
                                                        Guestbook. <br /> */}
                                                        Potentially contact you
                                                        if necessary (e.g., to
                                                        clarify a message).
                                                    </p>
                                                </>
                                            }
                                            startContent={
                                                <FiInfo
                                                    className={iconClasses}
                                                />
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
                                                        information with any
                                                        third party without your
                                                        consent, except: <br />{" "}
                                                        To comply with legal
                                                        obligations or law
                                                        enforcement requests.{" "}
                                                        <br /> To protect our
                                                        rights or the safety of
                                                        others.
                                                    </p>
                                                </>
                                            }
                                            startContent={
                                                <FiShare
                                                    className={iconClasses}
                                                />
                                            }
                                        >
                                            Information Sharing
                                        </ListboxItem>
                                        <ListboxItem
                                            key=""
                                            description="We will retain the information collected through the Kiosk for as long as necessary to fulfill the purposes outlined in this privacy notice, unless a longer retention period is required or permitted by law."
                                            startContent={
                                                <FiShield
                                                    className={iconClasses}
                                                />
                                            }
                                        >
                                            Data Retention
                                        </ListboxItem>
                                        <ListboxItem
                                            key=""
                                            description={
                                                <>
                                                    <p>
                                                        You have the following
                                                        choices regarding your
                                                        information: <br />
                                                        You can choose not to
                                                        enter any information
                                                        into the Kiosk. <br />{" "}
                                                        You can review and edit
                                                        your message before
                                                        submitting it.
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
                                                <FiLock
                                                    className={iconClasses}
                                                />
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
                                                        We may update this
                                                        privacy notice from time
                                                        to time. We will post
                                                        the updated notice on
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
                                                        If you have any
                                                        questions about this
                                                        privacy notice, please
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
