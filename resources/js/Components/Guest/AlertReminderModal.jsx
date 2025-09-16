import { formatLocalDateTime } from "@/utils/date";
import {
    Modal,
    ModalContent,
    ModalBody,
    Button,
    addToast,
    Input,
    Spinner,
} from "@heroui/react";
import { router } from "@inertiajs/react";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const REMINDER_DELAY_MINUTES = 30; // snooze length
const POLL_INTERVAL_MINUTES = 1; // how often we poll the server
const REMINDER_KEY = "lastDismissedReminderAt";
const INACTIVITY_TIMEOUT_SECONDS = 90; // Auto-close after 60 seconds inactivity
const REOPEN_DELAY_SECONDS = 90; // Show again after 60 seconds
const HARDCODED_VERIFICATION_CODE = "123"; // Simple verification code

export default function AlertReminderModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentReminder, setCurrentReminder] = useState(null);
    const [countdown, setCountdown] = useState(INACTIVITY_TIMEOUT_SECONDS);
    const [verificationStep, setVerificationStep] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef(null);
    const inactivityTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    const resetInactivityTimer = useCallback(() => {
        // Reset countdown
        setCountdown(INACTIVITY_TIMEOUT_SECONDS);

        // Clear existing timeout
        clearTimeout(inactivityTimeoutRef.current);
        clearInterval(countdownIntervalRef.current);

        if (isOpen) {
            // Start countdown timer
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Set timeout to close modal
            inactivityTimeoutRef.current = setTimeout(() => {
                handleAutoClose();
            }, INACTIVITY_TIMEOUT_SECONDS * 1000);
        }
    }, [isOpen]);

    const handleAutoClose = () => {
        setIsOpen(false);
        setVerificationStep(false);
        setVerificationCode("");
        clearInterval(countdownIntervalRef.current);

        // Show again after delay
        timeoutRef.current = setTimeout(
            fetchOverdueGuests,
            REOPEN_DELAY_SECONDS * 1000
        );
    };

    useEffect(() => {
        if (isOpen) {
            const events = [
                "mousedown",
                "mousemove",
                "keypress",
                "scroll",
                "touchstart",
            ];
            events.forEach((event) => {
                window.addEventListener(event, resetInactivityTimer);
            });

            resetInactivityTimer();

            return () => {
                events.forEach((event) => {
                    window.removeEventListener(event, resetInactivityTimer);
                });
                clearTimeout(inactivityTimeoutRef.current);
                clearInterval(countdownIntervalRef.current);
            };
        } else {
            clearInterval(countdownIntervalRef.current);
        }
    }, [isOpen, resetInactivityTimer]);

    const delayExpired = () => {
        const last = localStorage.getItem(REMINDER_KEY);
        return (
            !last ||
            Date.now() - Number(last) >= REMINDER_DELAY_MINUTES * 60_000
        );
    };

    const fetchOverdueGuests = useCallback(async () => {
        if (!delayExpired()) return;

        try {
            const { data } = await axios.get("/overdue-guests", {
                params: { threshold: 30 },
            });

            // console.log("Overdue guests:", data);

            if (!data.length) {
                setIsOpen(false);
                return;
            }

            const mostOverdue = data.reduce((p, c) =>
                new Date(p.check_in_time) < new Date(c.check_in_time) ? p : c
            );
            const checkInTime = new Date(mostOverdue.check_in_time);
            const hoursOverdue = Math.floor(
                (Date.now() - checkInTime) / 3_600_000
            );

            // console.log("Most overdue guest:", mostOverdue);
            // console.log("Hours overdue:", hoursOverdue);

            setCurrentReminder({
                guest: mostOverdue.guest.name,
                checkInTime,
                hoursOverdue,
                logId: mostOverdue.id,
                guestId: mostOverdue.guest.id_number, // ID number (may be null)
                guest_id: mostOverdue.guest_id,
            });
            setIsOpen(true);
            setVerificationStep(false);
            setVerificationCode("");
        } catch (err) {
            console.error("Failed to fetch overdue guests:", err);
        }
    }, []);

    useEffect(() => {
        fetchOverdueGuests();
        const pollId = setInterval(
            fetchOverdueGuests,
            POLL_INTERVAL_MINUTES * 60_000
        );
        return () => clearInterval(pollId);
    }, [fetchOverdueGuests]);

    const handleClose = () => {
        setIsOpen(false);
        setVerificationStep(false);
        setVerificationCode("");
        localStorage.setItem(REMINDER_KEY, Date.now().toString());
        clearTimeout(inactivityTimeoutRef.current);
        clearInterval(countdownIntervalRef.current);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
            fetchOverdueGuests,
            REMINDER_DELAY_MINUTES * 60_000
        );
    };

    const handleCheckOut = () => {
        resetInactivityTimer();
        if (!currentReminder?.logId) return;

        // First show verification step
        setVerificationStep(true);
    };

    const handleVerification = () => {
        resetInactivityTimer();

        // Check if verification code matches either the guest's ID number or the hardcoded code
        const isValid =
            verificationCode === currentReminder.guestId ||
            verificationCode === currentReminder.guest_id.toString() ||
            verificationCode === HARDCODED_VERIFICATION_CODE;

        console.log(
            "Verification code:",
            verificationCode,
            "is valid:",
            isValid
        );

        if (!isValid) {
            addToast({
                title: "Verification Failed",
                description: "The verification code you entered is incorrect.",
                color: "danger",
            });
            return;
        }

        // Proceed with checkout
        setIsLoading(true);

        router.post(
            route("guest.checkout", currentReminder.logId),
            {},
            {
                onSuccess: () => {
                    addToast({
                        title: "Guest Checked Out",
                        description: `${currentReminder.guest} has been successfully checked out.`,
                        color: "success",
                    });
                    setIsOpen(false);
                    setVerificationStep(false);
                    setVerificationCode("");
                    localStorage.removeItem(REMINDER_KEY);
                    clearTimeout(inactivityTimeoutRef.current);
                    clearInterval(countdownIntervalRef.current);
                    setIsLoading(false);
                },
                onError: (errors) => {
                    resetInactivityTimer();
                    let errorMessage =
                        "An unexpected error occurred during checkout";
                    if (errors?.errors)
                        errorMessage = Object.values(errors.errors)[0][0];
                    else if (errors?.response?.data?.message)
                        errorMessage = errors.response.data.message;
                    else if (errors?.message) errorMessage = errors.message;
                    else if (typeof errors === "string") errorMessage = errors;

                    addToast({
                        title: "Checkout Failed",
                        description: errorMessage,
                        color: "danger",
                    });
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            placement="center"
            backdrop="blur"
            size="xl"
            isDismissable={false}
        >
            <ModalContent>
                <ModalBody className="p-6">
                    <div className="text-center">
                        {!verificationStep ? (
                            <>
                                <h3 className="text-lg font-bold mb-2">
                                    Overdue Check‑out Reminder
                                </h3>

                                {currentReminder && (
                                    <>
                                        <p className="mb-4">
                                            <strong>
                                                {currentReminder.guest}
                                            </strong>{" "}
                                            has not checked out after&nbsp;
                                            <strong>
                                                {currentReminder.hoursOverdue}{" "}
                                                hour(s)
                                            </strong>
                                            .
                                        </p>
                                        <p>
                                            Checked in at:&nbsp;
                                            {formatLocalDateTime(
                                                currentReminder.checkInTime
                                            )}
                                        </p>
                                    </>
                                )}

                                <div className="mt-4 text-sm text-danger-500">
                                    Auto-closing in {countdown} seconds...
                                </div>

                                <div className="mt-6 flex justify-center gap-3">
                                    <Button
                                        color="primary"
                                        onPress={handleCheckOut}
                                    >
                                        Check Out Now
                                    </Button>
                                    <Button
                                        variant="flat"
                                        onPress={handleClose}
                                    >
                                        Remind Me Later
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold mb-2">
                                    Verify Checkout
                                </h3>

                                <p className="mb-4">
                                    Please enter{" "}
                                    <strong>{currentReminder.guest}'s</strong>{" "}
                                    ID number to verify checkout.
                                </p>

                                <div className="flex flex-col items-center gap-4">
                                    <Input
                                        type="text"
                                        placeholder="Enter ID number"
                                        value={verificationCode}
                                        onChange={(e) =>
                                            setVerificationCode(e.target.value)
                                        }
                                        className="max-w-xs"
                                        autoFocus
                                    />

                                    <div className="flex justify-center gap-3">
                                        <Button
                                            color="primary"
                                            onPress={handleVerification}
                                            isDisabled={
                                                !verificationCode || isLoading
                                            }
                                            isLoading={isLoading}
                                        >
                                            {isLoading
                                                ? "Please wait..."
                                                : "Verify & Check Out"}
                                        </Button>
                                        <Button
                                            variant="flat"
                                            onPress={() => {
                                                setVerificationStep(false);
                                                setVerificationCode("");
                                            }}
                                            isDisabled={isLoading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
