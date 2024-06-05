import { Head, Link } from "@inertiajs/react";
import {
    Button,
    Input,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Pagination,
    Select,
    SelectItem,
    Card,
} from "@nextui-org/react";
import { FaHome, FaSignInAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { Inertia } from "@inertiajs/inertia";
import { useEffect, useState } from "react";
import { SearchIcon } from "@/Components/Icons";

export default function CheckOut({ guestLogs }) {
    const [filterValue, setFilterValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(13);
    const [selectedInterval, setSelectedInterval] = useState("past24Hours");
    const [filteredLogs, setFilteredLogs] = useState([]);

    useEffect(() => {
        const filterLogsByInterval = () => {
            const now = new Date();
            let filterDate = null;

            switch (selectedInterval) {
                case "past24Hours":
                    filterDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case "past7Days":
                    filterDate = new Date(
                        now.getTime() - 7 * 24 * 60 * 60 * 1000
                    );
                    break;
                case "past30Days":
                    filterDate = new Date(
                        now.getTime() - 30 * 24 * 60 * 60 * 1000
                    );
                    break;
                default:
                    filterDate = null;
                    break;
            }

            if (filterDate) {
                const filteredLogs = guestLogs.filter(
                    (guestLog) => new Date(guestLog.check_in_time) >= filterDate
                );
                setFilteredLogs(filteredLogs);
            } else {
                setFilteredLogs(guestLogs);
            }
        };

        filterLogsByInterval();
    }, [selectedInterval, guestLogs]);

    const filteredGuestLogs = filteredLogs.filter((guestLog) =>
        guestLog.guest.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredGuestLogs.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleCheckOut = async (guestLogId) => {
        try {
            await Inertia.post(`/guest/log/check-out/${guestLogId}`);

            Swal.fire({
                icon: "success",
                title: "Guest checked out successfully!",
            });
        } catch (error) {
            console.error("Error checking out guest:", error);
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: "Please try again later.",
            });
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            Inertia.visit("/", { replace: true });
        }, 30000);

        const resetTimeout = () => {
            clearTimeout(timeout);
        };

        window.addEventListener("mousemove", resetTimeout);
        window.addEventListener("keydown", resetTimeout);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("mousemove", resetTimeout);
            window.removeEventListener("keydown", resetTimeout);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[url(/assets/images/bg.png)] bg-cover">
            <Head title="Check Out" />
            <div className="py-12 p-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="w-full p-4">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4 ">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary relative">
                                    Check Out
                                    <span className="absolute  left-1/2 transform -translate-x-1/2 -bottom-2 h-[3px] w-16 bg-[#2aefe6]"></span>
                                </span>
                            </h2>
                            <p className="text-sm font-light">
                                To check out a guest, click on the "Check Out"
                                button.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between gap-3 items-end mb-4">
                                <div className="flex gap-2">
                                    <Button
                                        as={Link}
                                        href={route("guestlog.create")}
                                        color="primary"
                                        variant="shadow"
                                        endContent={<FaSignInAlt />}
                                    >
                                        Check-In
                                    </Button>
                                    <Button
                                        isIconOnly
                                        color="secondary"
                                        variant="flat"
                                        startContent={<FaHome />}
                                        onClick={() => Inertia.visit("/")}
                                    ></Button>
                                </div>
                                <Input
                                    variant="bordered"
                                    placeholder="Search by guest name"
                                    className="w-full sm:max-w-[35%]"
                                    startContent={
                                        <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                                    }
                                    value={filterValue}
                                    onChange={(e) => {
                                        setFilterValue(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex gap-2">
                                    <Select
                                        size="sm"
                                        placeholder="Items Per Page"
                                        value={itemsPerPage.toString()}
                                        onChange={(e) =>
                                            setItemsPerPage(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-24"
                                    >
                                        <SelectItem value="5" key="5">
                                            5
                                        </SelectItem>
                                        <SelectItem value="10" key={"10"}>
                                            10
                                        </SelectItem>
                                        <SelectItem value="15" key={"15"}>
                                            15
                                        </SelectItem>
                                    </Select>
                                    <Select
                                        size="sm"
                                        placeholder="Past 24 Hours"
                                        value={selectedInterval}
                                        onChange={(e) =>
                                            setSelectedInterval(e.target.value)
                                        }
                                    >
                                        <SelectItem
                                            value="current"
                                            key="current"
                                        >
                                            All Time
                                        </SelectItem>
                                        <SelectItem
                                            value="past24Hours"
                                            key="past24Hours"
                                        >
                                            Past 24 Hours
                                        </SelectItem>
                                        <SelectItem
                                            value="past7Days"
                                            key="past7Days"
                                        >
                                            Past 7 Days
                                        </SelectItem>
                                        <SelectItem
                                            value="past30Days"
                                            key="past30Days"
                                        >
                                            Past 30 Days
                                        </SelectItem>
                                    </Select>
                                </div>

                                <p>
                                    Showing {indexOfFirstItem + 1} to{" "}
                                    {indexOfLastItem} of (
                                    {filteredGuestLogs.length})
                                </p>
                            </div>

                            <Table
                                selectionMode="single"
                                aria-label="Guests Table"
                            >
                                <TableHeader>
                                    <TableColumn>Guest ID</TableColumn>
                                    <TableColumn>Guest Name</TableColumn>
                                    <TableColumn>Meeting With</TableColumn>
                                    <TableColumn>Purpose of Visit</TableColumn>
                                    <TableColumn>Check In</TableColumn>
                                    <TableColumn>Check Out</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent={"No log for today."}>
                                    {currentItems
                                        .sort(
                                            (a, b) =>
                                                new Date(b.created_at) -
                                                new Date(a.created_at)
                                        )
                                        .map((guestLog) => (
                                            <TableRow key={guestLog.id}>
                                                <TableCell>
                                                    {guestLog.guest_id}
                                                </TableCell>
                                                <TableCell>
                                                    {guestLog.guest.name}
                                                </TableCell>
                                                <TableCell>
                                                    {guestLog.meeting_with}
                                                </TableCell>
                                                <TableCell>
                                                    {guestLog.purpose_of_visit}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        new Date(
                                                            guestLog.check_in_time
                                                        ).getTime() -
                                                            new Date(
                                                                guestLog.check_in_time
                                                            ).getTimezoneOffset() *
                                                                60000
                                                    ).toLocaleString([], {
                                                        year: "numeric",
                                                        month: "numeric",
                                                        day: "numeric",
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        hour12: true,
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    {guestLog.check_out_time ? (
                                                        new Date(
                                                            new Date(
                                                                guestLog.check_out_time
                                                            ).getTime() -
                                                                new Date(
                                                                    guestLog.check_out_time
                                                                ).getTimezoneOffset() *
                                                                    60000
                                                        ).toLocaleString([], {
                                                            year: "numeric",
                                                            month: "numeric",
                                                            day: "numeric",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                            hour12: true,
                                                        })
                                                    ) : (
                                                        <Button
                                                            onClick={() =>
                                                                handleCheckOut(
                                                                    guestLog.id
                                                                )
                                                            }
                                                            color="success"
                                                            size="sm"
                                                        >
                                                            Check Out
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <div className="flex w-full justify-center">
                                <Pagination
                                    color="primary"
                                    showShadow
                                    isCompact
                                    showControls
                                    total={Math.ceil(
                                        filteredGuestLogs.length / itemsPerPage
                                    )}
                                    page={currentPage}
                                    onChange={paginate}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
