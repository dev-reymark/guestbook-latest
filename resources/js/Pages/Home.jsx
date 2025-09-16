import { Head, Link } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    Divider,
    Image,
    Modal,
    ModalBody,
    ModalContent,
} from "@heroui/react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useEffect, useState, useRef } from "react";
import AlertReminderModal from "@/Components/Guest/AlertReminderModal";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { MdWifiOff } from "react-icons/md";
import FloatingSettingsButton from "@/Components/Guest/FloatingSettingsButton";

export default function Home({ mediaUrls = [] }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const audioRef = useRef(null);

    const isOnline = useNetworkStatus();

    // Handle audio playback
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error("Error playing audio:", error);
            });
        }
    }, []);

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Format time and date
    const formattedTime = currentTime.toLocaleTimeString([], {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const formattedDate = currentTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const isVideo = (url) => {
        return url.match(/\.(mp4)$/i);
    };

    return (
        <>
            <Head title="Home" />
            <AlertReminderModal />
            <FloatingSettingsButton />
            <audio
                ref={audioRef}
                src="/assets/audio/datalogic.mp3"
                autoPlay
                loop
                muted={false}
            />

            <div
                className="relative min-h-screen p-2 bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/images/bg.png')" }}
            >
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
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
                                        You are currently offline. Some features
                                        may be unavailable. Please reconnect to
                                        continue.
                                    </p>
                                </div>
                            </ModalBody>
                        </ModalContent>
                    </Modal>

                    <main className="mt-10 md:mt-20 grid gap-4 lg:grid-cols-2">
                        {/* Media Slider Card */}
                        <Card className="w-full h-full min-h-[300px] md:min-h-[500px] overflow-hidden bg-black">
                            <Swiper
                                slidesPerView={1}
                                modules={[Navigation, Autoplay]}
                                autoplay={{
                                    delay: 5000,
                                    disableOnInteraction: false,
                                }}
                                className="h-full w-full"
                            >
                                {mediaUrls.map((mediaUrl, index) => {
                                    const src = `/storage/${mediaUrl}`;
                                    return (
                                        <SwiperSlide
                                            key={index}
                                            className="h-full w-full"
                                        >
                                            <div className="flex items-center justify-center h-full w-full bg-black">
                                                {isVideo(mediaUrl) ? (
                                                    <video
                                                        src={src}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="object-contain w-full h-full"
                                                    />
                                                ) : (
                                                    <img
                                                        src={src}
                                                        alt={`Media ${index}`}
                                                        className="object-contain w-full h-full"
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null;
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </Card>

                        <div className="grid grid-cols-1 gap-4">
                            <Card className="p-2 text-center font-semibold text-gray-200 bg-transparent h-[120px] sm:h-[150px] flex flex-col justify-center">
                                <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                                    {formattedTime}
                                </p>
                                <p className="text-xl sm:text-2xl md:text-3xl font-light">
                                    {formattedDate}
                                </p>
                            </Card>

                            <div className="grid grid-cols-2 gap-4 h-[160px] sm:h-[200px]">
                                <Card
                                    as={Link}
                                    href={route("guest.checkin.create")}
                                    className="bg-success-50 hover:scale-[1.02] transition-transform"
                                >
                                    <div className="flex items-center justify-center h-full p-4">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex size-12 sm:size-16 items-center justify-center rounded-full bg-[#00C48C]/10">
                                                <FaSignInAlt className="h-8 w-8 text-primary" />
                                            </div>
                                            <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-white">
                                                Check-in
                                            </h2>
                                        </div>
                                    </div>
                                </Card>

                                <Card
                                    as={Link}
                                    isPressable
                                    href={route("guest.checkout.show")}
                                    className="bg-warning-50 hover:scale-[1.02] transition-transform"
                                >
                                    <div className="flex items-center justify-center h-full p-4">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex size-12 sm:size-16 items-center justify-center rounded-full bg-[#FF6B6B]/10">
                                                <FaSignOutAlt className="h-8 w-8 text-danger" />
                                            </div>
                                            <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-white">
                                                Check-out
                                            </h2>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <Card className="p-2 h-[250px] sm:h-[340px] flex flex-col">
                                <CardHeader className="text-center p-0 mb-2 sm:mb-3">
                                    <Image
                                        src="/assets/images/logo-new.png"
                                        alt="Company Logo"
                                        width="auto"
                                        height="16"
                                        className="mx-auto"
                                    />
                                </CardHeader>

                                <Divider />

                                <div className="flex-1 flex flex-col justify-between p-2 sm:p-4">
                                    <p className="text-xs sm:text-sm text-center sm:text-left">
                                        <span className="font-semibold">
                                            Privacy Notice:{" "}
                                        </span>
                                        This kiosk collects personal information
                                        from visitors and registers them as
                                        guest.
                                        <br className="hidden sm:block" />
                                        <br className="hidden sm:block" />
                                        We are committed to protecting your
                                        personal information and ensuring its
                                        confidentiality. Any data collected
                                        through this kiosk will be used solely
                                        for the purpose stated and will not be
                                        shared with third parties without your
                                        consent, except where required by law.
                                    </p>

                                    <div className="flex justify-end items-end mt-4">
                                        <p className="text-xs sm:text-sm italic text-gray-500">
                                            — By Management
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
