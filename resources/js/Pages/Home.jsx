import Header from "@/Components/Header";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Image,
    Link,
} from "@nextui-org/react";
import { FaRegUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { HiArrowTrendingDown, HiArrowTrendingUp } from "react-icons/hi2";

export default function Home({ auth, mediaUrls = [] }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [totalRegisteredGuest, setTotalRegisteredGuest] = useState(null);
    const [avgLogsInPast7Days, setAvgLogsInPast7Days] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error("Error playing audio:", error);
            });
        }
    }, []);
    useEffect(() => {
        fetchGuestData();
    }, []);

    const fetchGuestData = async () => {
        try {
            const response = await axios.get("/fetch-guest-data");
            const data = response.data;
            setTotalRegisteredGuest(data.totalRegisteredGuest);
            setAvgLogsInPast7Days(data.avgLogsInPast7Days);
        } catch (error) {
            console.error("Error fetching guest data:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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

    const calculatePercentageChange = (currentValue, previousValue) => {
        if (
            currentValue !== null &&
            previousValue !== null &&
            previousValue !== 0
        ) {
            return ((currentValue - previousValue) / previousValue) * 100;
        }
        return null;
    };

    return (
        <>
            <Head title="Home" />
            <audio ref={audioRef} src="/assets/audio/datalogic.mp3" autoPlay loop></audio>
            <div className="relative min-h-screen p-5">
                <img
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    src="/assets/images/bg.png"
                />

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* <Header auth={auth} /> */}

                    <main
                        className="mt-20 grid gap-4 lg:grid-cols-2"
                        style={{ height: "600px" }}
                    >
                        <Card className="w-full">
                            <div className="h-full">
                                <Swiper
                                    slidesPerView={1}
                                    modules={[Navigation, Autoplay]}
                                    autoplay={{
                                        delay: 5000,
                                        disableOnInteraction: false,
                                    }}
                                    onSlideChangeTransitionEnd={(swiper) => {
                                        const activeSlide =
                                            swiper.slides[swiper.activeIndex];
                                        const video =
                                            activeSlide.querySelector("video");
                                        if (video) {
                                            video.play();
                                            swiper.autoplay.stop();
                                            video.addEventListener(
                                                "ended",
                                                () => {
                                                    swiper.autoplay.start();
                                                    swiper.slideNext();
                                                }
                                            );
                                        }
                                    }}
                                    style={{ width: "100%", height: "100%" }} // Ensure the Swiper fills the entire card
                                >
                                    {mediaUrls.map((mediaUrl, index) => (
                                        <SwiperSlide key={index}>
                                            {mediaUrl.endsWith(".mp4") ? (
                                                <video
                                                    autoPlay
                                                    className="w-full h-full object-cover"
                                                >
                                                    <source
                                                        src={mediaUrl}
                                                        type="video/mp4"
                                                    />
                                                    Your browser does not
                                                    support the video tag.
                                                </video>
                                            ) : (
                                                <Image
                                                    src={mediaUrl}
                                                    height={1000}
                                                    width={1000}
                                                    alt={`Media ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 gap-4 items-center">
                            <Card
                                className="p-2 text-center font-semibold text-gray-200 bg-transparent"
                                style={{ height: "150px" }}
                            >
                                <p className="text-7xl">{formattedTime}</p>
                                <p className="text-3xl font-light">
                                    {formattedDate}
                                </p>
                            </Card>

                            <div
                                className="grid grid-cols-2 gap-4"
                                style={{ height: "200px" }}
                            >
                                <Card as={Link} href={route("guestlog.create")}>
                                    <div className="flex items-start gap-4 p-5 py-14">
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#00C48C]/10 sm:size-16">
                                            <FaSignInAlt className="h-6 w-6 text-primary" />
                                        </div>

                                        <div className="pt-3 sm:pt-5">
                                            <h2 className="text-2xl font-semibold text-black dark:text-white">
                                                Check-in
                                            </h2>
                                        </div>
                                    </div>
                                </Card>

                                <Card as={Link} href={route("guest.log.show")}>
                                    <div className="flex items-start gap-4 p-5 py-14">
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF6B6B]/10 sm:size-16">
                                            <FaSignOutAlt className="h-6 w-6 text-danger" />
                                        </div>
                                        <div className="pt-3 sm:pt-5">
                                            <h2 className="text-2xl font-semibold text-black dark:text-white">
                                                Check-out
                                            </h2>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* <Card className="w-full mx-auto p-2 bg-slate-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="flex flex-col">
                                        <div className="p-4 md:p-5 flex gap-x-4">
                                            <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
                                                <FaRegUser />
                                            </div>
                                            <div className="grow">
                                                <div className="flex items-center gap-x-2">
                                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                                        Total Guest Registered
                                                    </p>
                                                </div>
                                                <div className="mt-1 flex items-center gap-x-2">
                                                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                                        {totalRegisteredGuest ??
                                                            "-"}
                                                    </h3>
                                                    {totalRegisteredGuest !==
                                                        null &&
                                                        avgLogsInPast7Days !==
                                                            null && (
                                                            <span
                                                                className={`inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full ${
                                                                    calculatePercentageChange(
                                                                        totalRegisteredGuest,
                                                                        avgLogsInPast7Days
                                                                    ) ?? 0 > 0
                                                                        ? "bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100"
                                                                        : "bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100"
                                                                }`}
                                                            >
                                                                {calculatePercentageChange(
                                                                    totalRegisteredGuest,
                                                                    avgLogsInPast7Days
                                                                ) ?? 0 > 0 ? (
                                                                    <HiArrowTrendingUp />
                                                                ) : (
                                                                    <HiArrowTrendingDown />
                                                                )}
                                                                <span className="inline-block text-xs font-medium">
                                                                    {calculatePercentageChange(
                                                                        totalRegisteredGuest,
                                                                        avgLogsInPast7Days
                                                                    ) !== null
                                                                        ? `${Math.abs(
                                                                              calculatePercentageChange(
                                                                                  totalRegisteredGuest,
                                                                                  avgLogsInPast7Days
                                                                              )
                                                                          ).toFixed(
                                                                              1
                                                                          )}%`
                                                                        : "-"}
                                                                </span>
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="flex flex-col">
                                        <div className="p-4 md:p-5 flex gap-x-4">
                                            <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
                                                <svg
                                                    className="flex-shrink-0 size-5 text-gray-600 dark:text-neutral-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
                                                    <path d="m12 12 4 10 1.7-4.3L22 16Z" />
                                                </svg>
                                            </div>

                                            <div className="grow">
                                                <div className="flex items-center gap-x-2">
                                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                                        Avg Logs in Past 7 days
                                                    </p>
                                                </div>
                                                <div className="mt-1 flex items-center gap-x-2">
                                                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                                        {avgLogsInPast7Days ??
                                                            "-"}
                                                    </h3>
                                                    {totalRegisteredGuest !==
                                                        null &&
                                                        avgLogsInPast7Days !==
                                                            null && (
                                                            <span
                                                                className={`inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full ${
                                                                    calculatePercentageChange(
                                                                        avgLogsInPast7Days,
                                                                        totalRegisteredGuest
                                                                    ) ?? 0 > 0
                                                                        ? "bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100"
                                                                        : "bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100"
                                                                }`}
                                                            >
                                                                {calculatePercentageChange(
                                                                    avgLogsInPast7Days,
                                                                    totalRegisteredGuest
                                                                ) ?? 0 > 0 ? (
                                                                    <HiArrowTrendingUp />
                                                                ) : (
                                                                    <HiArrowTrendingDown />
                                                                )}
                                                                <span className="inline-block text-xs font-medium">
                                                                    {calculatePercentageChange(
                                                                        avgLogsInPast7Days,
                                                                        totalRegisteredGuest
                                                                    ) !== null
                                                                        ? `${Math.abs(
                                                                              calculatePercentageChange(
                                                                                  avgLogsInPast7Days,
                                                                                  totalRegisteredGuest
                                                                              )
                                                                          ).toFixed(
                                                                              1
                                                                          )}%`
                                                                        : "-"}
                                                                </span>
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </Card> */}

                            <Card className="p-2" style={{ height: "290px" }}>
                                <CardHeader className="text-center p-0 mb-3">
                                    <Image
                                        src="/assets/images/logo-new.png"
                                        alt=""
                                        width="auto"
                                        height="16"
                                    />
                                </CardHeader>
                                <Divider />
                                <CardFooter>
                                    <p className="text-sm">
                                        <span className="font-bold text-md">
                                            Privacy Notice: {"  "}
                                        </span>
                                        This kiosk collects personal information
                                        from visitors and registers them as
                                        guest. <br />
                                        <br />
                                        We are committed to protecting your
                                        personal information and ensuring its
                                        confidentiality. Any data collected
                                        through this kiosk will be used solely
                                        for the purpose stated and will not be
                                        shared with third parties without your
                                        consent, except where required by law.
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
