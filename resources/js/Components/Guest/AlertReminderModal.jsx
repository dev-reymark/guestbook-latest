import { formatLocalDateTime } from "@/utils/date";
import {
    Modal,
    ModalContent,
    ModalBody,
    Button,
    addToast,
} from "@heroui/react";
import { router } from "@inertiajs/react";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const REMINDER_DELAY_MINUTES = 30; // snooze length
const POLL_INTERVAL_MINUTES = 1; // how often we poll the server
const REMINDER_KEY = "lastDismissedReminderAt";

export default function AlertReminderModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentReminder, setCurrentReminder] = useState(null);
    const timeoutRef = useRef(null);

    const delayExpired = () => {
        const last = localStorage.getItem(REMINDER_KEY);
        return (
            !last ||
            Date.now() - Number(last) >= REMINDER_DELAY_MINUTES * 60_000
        );
    };

    const fetchOverdueGuests = useCallback(async () => {
        if (!delayExpired()) return; // still snoozing

        try {
            const { data } = await axios.get("/overdue-guests", {
                params: { threshold: 1 },
            });

            if (!data.length) {
                // nothing overdue
                setIsOpen(false);
                return;
            }

            // pick the guest who has waited the longest
            const mostOverdue = data.reduce((p, c) =>
                new Date(p.check_in_time) < new Date(c.check_in_time) ? p : c
            );
            const checkInTime = new Date(mostOverdue.check_in_time);
            const hoursOverdue = Math.floor(
                (Date.now() - checkInTime) / 3_600_000
            );

            setCurrentReminder({
                guest: mostOverdue.guest.name,
                checkInTime,
                hoursOverdue,
                logId: mostOverdue.id,
            });
            setIsOpen(true);
        } catch (err) {
            console.error("Failed to fetch overdue guests:", err);
        }
    }, []);

    /* ---------- poll the server every minute ---------- */
    useEffect(() => {
        fetchOverdueGuests(); // initial check
        const pollId = setInterval(
            fetchOverdueGuests,
            POLL_INTERVAL_MINUTES * 60_000
        );
        return () => clearInterval(pollId);
    }, [fetchOverdueGuests]);

    /* ---------- snooze / close ---------- */
    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem(REMINDER_KEY, Date.now().toString());

        // schedule one fetch right when the snooze ends
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
            fetchOverdueGuests,
            REMINDER_DELAY_MINUTES * 60_000
        );
    };

    /* ---------- checkout ---------- */
    const handleCheckOut = () => {
        if (!currentReminder?.logId) return;

        router.post(
            route("guest.log.checkout", currentReminder.logId),
            {},
            {
                onSuccess: () => {
                    addToast({
                        title: "Guest Checked Out",
                        description: `${currentReminder.guest} has been successfully checked out.`,
                        color: "success",
                    });
                    setIsOpen(false);
                    localStorage.removeItem(REMINDER_KEY); // reset snooze for next guest
                },
                onError: () =>
                    addToast({
                        title: "Checkout Failed",
                        description:
                            "An error occurred while checking out the guest.",
                        color: "danger",
                    }),
            }
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={
                handleClose
            }
            placement="center"
            backdrop="blur"
        >
            <ModalContent>
                <ModalBody className="p-6">
                    <div className="text-center">
                        <h3 className="text-lg font-bold mb-2">
                            Overdue Check‑out Reminder
                        </h3>

                        {currentReminder && (
                            <>
                                <p className="mb-4">
                                    <strong>{currentReminder.guest}</strong> has
                                    not checked out after&nbsp;
                                    <strong>
                                        {currentReminder.hoursOverdue} hour(s)
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

                        <div className="mt-6 flex justify-center gap-3">
                            <Button color="primary" onPress={handleCheckOut}>
                                Check Out Now
                            </Button>
                            <Button variant="flat" onPress={handleClose}>
                                Remind Me Later
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
