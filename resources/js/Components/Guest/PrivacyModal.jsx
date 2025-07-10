import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Listbox,
    ListboxItem,
    ListboxSection,
    Checkbox,
    Button,
} from "@heroui/react";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLock, FiCheckCircle, FiShield } from "react-icons/fi";

export default function PrivacyModal({
    isOpen,
    onOpenChange,
    isChecked,
    onCheckboxChange,
    onAgree,
}) {
    const iconClasses =
        "text-xl text-default-500 pointer-events-none flex-shrink-0";

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            size="xl"
            placement="center"
            isDismissable={false}
            isKeyboardDismissDisabled
            hideCloseButton
        >
            <ModalContent>
                <ModalHeader className="flex flex-col items-center">
                    <h2 className="text-2xl font-extrabold">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary relative">
                            Guestbook Kiosk Privacy Notice
                            <span className="absolute  left-1/2 transform -translate-x-1/2 -bottom-2 h-[3px] w-16 bg-[#2aefe6]"></span>
                        </span>
                    </h2>
                </ModalHeader>
                <ModalBody>
                    <Listbox aria-label="Guest Consent">
                        <ListboxSection title="" showDivider>
                            <ListboxItem
                                key="header"
                                description={
                                    <>
                                        <p>
                                            This section outlines how we
                                            collect, use, and protect your
                                            personal and non-personal
                                            information. We are committed to
                                            safeguarding your privacy and
                                            ensuring a secure online experience
                                            with our guest logbook.
                                        </p>
                                    </>
                                }
                            ></ListboxItem>
                            <ListboxItem
                                key="information-collection"
                                description={
                                    <>
                                        <p>
                                            We may collect personal details such
                                            as your name, email address, and
                                            phone number when you complete the
                                            registration form. This information
                                            allows us to effectively manage
                                            guest entries and ensure a
                                            personalized experience.
                                        </p>
                                    </>
                                }
                                startContent={
                                    <FaRegUserCircle className={iconClasses} />
                                }
                            >
                                Information Collection
                            </ListboxItem>
                            <ListboxItem
                                key="use-of-information"
                                description={
                                    <>
                                        <p>
                                            Your personal information is
                                            utilized for enhancing our guest
                                            logbook services, facilitating
                                            communication with you, and
                                            improving our overall user
                                            experience. We do not engage in any
                                            form of unauthorized marketing or
                                            sharing of your data.
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
                                key="data-protection"
                                description="We take appropriate measures to safeguard your data and maintain its confidentiality. Your information is not sold or shared with third parties unless required by law."
                                startContent={
                                    <FiShield className={iconClasses} />
                                }
                            >
                                Data Protection
                            </ListboxItem>
                            <ListboxItem
                                key="consent"
                                description="By using our guest logbook and submitting information through the form, you consent to the terms outlined in this privacy policy."
                                startContent={
                                    <FiCheckCircle className={iconClasses} />
                                }
                            >
                                Consent
                            </ListboxItem>
                        </ListboxSection>

                        <ListboxSection>
                            <ListboxItem
                                key="changes-to-privacy-notice"
                                description={
                                    <>
                                        <p>
                                            We may update this privacy notice
                                            from time to time. We will post the
                                            updated notice on the Kiosk.
                                        </p>
                                    </>
                                }
                            >
                                Changes to this Privacy Notice
                            </ListboxItem>
                        </ListboxSection>
                        <ListboxSection>
                            <ListboxItem
                                key="contact-us"
                                description={
                                    <>
                                        <p>
                                            If you have any questions about this
                                            privacy notice, please contact us at{" "}
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
                                key="footer"
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
                        onChange={onCheckboxChange}
                    >
                        <span className="text-xs">
                            I have read and agreed to the privacy notice stated
                            above and I understand that I can revoke my consent
                            at any time.
                        </span>
                    </Checkbox>
                </div>
                <ModalFooter>
                    <Button
                        color="primary"
                        onPress={onAgree}
                        isDisabled={!isChecked}
                    >
                        Continue
                    </Button>
                    <Button
                        color="danger"
                        variant="flat"
                        onPress={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}