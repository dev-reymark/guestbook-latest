import { formatLocalDateTime } from "@/utils/date";
import {
    Modal,
    ModalContent,
    ModalBody,
    Button,
    addToast,
} from "@heroui/react";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function AlertReminderModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentReminder, setCurrentReminder] = useState(null);
    const [intervalDuration] = useState(5); // in minutes

    useEffect(() => {
        const fetchOverdueGuests = async () => {
            try {
                const response = await axios.get("/overdue-guests", {
                    params: { threshold: 30 }, // overdue threshold
                });

                const guests = response.data;


                if (guests.length > 0) {
                    const mostOverdue = guests.reduce((prev, curr) =>
                        new Date(prev.check_in_time) <
                        new Date(curr.check_in_time)
                            ? prev
                            : curr
                    );

                    const checkInTime = new Date(mostOverdue.check_in_time);
                    const hoursOverdue = Math.floor(
                        (Date.now() - checkInTime.getTime()) / (60 * 60 * 1000)
                    );

                    setCurrentReminder({
                        guest: mostOverdue.guest.name,
                        checkInTime,
                        hoursOverdue,
                        logId: mostOverdue.id,
                    });
                    setIsOpen(true);
                } else {
                    setIsOpen(false);
                }
            } catch (error) {
                console.error("Failed to fetch overdue guests:", error);
            }
        };

        fetchOverdueGuests();
        const interval = setInterval(
            fetchOverdueGuests,
            intervalDuration * 60 * 1000
        );
        return () => clearInterval(interval);
    }, [intervalDuration]);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => setIsOpen(true), 10 * 60 * 1000); // re-show after 10 mins
    };

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
                        color: success,
                    });
                    setIsOpen(false);
                },
                onError: () => {
                    addToast({
                        title: "Checkout Failed",
                        description:
                            "An error occurred while checking out the guest.",
                        color: danger,
                    });
                },
            }
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement="center"
            backdrop="blur"
        >
            <ModalContent>
                <ModalBody className="p-6">
                    <div className="text-center">
                        <h3 className="text-lg font-bold mb-2">
                            Overdue Check-out Reminder
                        </h3>
                        {currentReminder && (
                            <>
                                <p className="mb-4">
                                    <strong>{currentReminder.guest}</strong> has
                                    not checked out after{" "}
                                    <strong>
                                        {currentReminder.hoursOverdue} hour(s)
                                    </strong>
                                    .
                                </p>
                                <p>
                                    Checked in at:{" "}
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
