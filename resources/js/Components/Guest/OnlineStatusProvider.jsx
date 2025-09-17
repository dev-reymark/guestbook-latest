import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { MdWifiOff } from "react-icons/md";

// Custom hook for network status
export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
}

// Online Status Modal Component
function OnlineStatusModal({ isOnline }) {
    return (
        <Modal
            isOpen={!isOnline}
            hideCloseButton
            placement="center"
            backdrop="blur"
            isDismissable={false}
        >
            <ModalContent>
                <ModalBody className="p-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <MdWifiOff className="text-red-500 text-5xl" />
                        <h2 className="text-xl font-bold text-red-600">
                            Offline Mode
                        </h2>
                        <p className="text-sm text-gray-600">
                            You are currently offline. Some features may be
                            unavailable. Please reconnect to continue.
                        </p>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

// Main Provider Component
export default function OnlineStatusProvider({ children }) {
    const isOnline = useNetworkStatus();

    return (
        <>
            {children}
            <OnlineStatusModal isOnline={isOnline} />
        </>
    );
}
