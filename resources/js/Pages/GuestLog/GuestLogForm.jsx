import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import {
    Avatar,
    Button,
    Input,
    Select,
    SelectItem,
    Spacer,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import GuestRegisterForm from "../Guest/GuestRegisterForm";
import { DeleteIcon, SearchIcon } from "@/Components/Icons";

const meetingWithOptions = [
    {
        value: "Ricardo Yap",
        label: "Ricardo Yap",
        position: "President/CEO",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
        value: "Edwin Yap",
        label: "Edwin Yap",
        position: "General Manager",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
        value: "Noel Flores",
        label: "Noel Flores",
        position: "IT/Operations Manager",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
        value: "Cecille Batiller",
        label: "Cecille Batiller",
        position: "Finance/Accounting Head",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    },
    {
        value: "Emily Planas",
        label: "Emily Planas",
        position: "HR/Administration",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    },
    {
        value: "Cris Seguenial",
        label: "Cris Seguenial",
        position: "Software Developent Head",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    },
    {
        value: "Cecille Lopez",
        label: "Cecille Lopez",
        position: "Senior Software Developer",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    },
    {
        value: "Allan Paraiso",
        label: "Allan Paraiso",
        position: "Customer Support/Head Division 1",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
        value: "Jumarie Batiller",
        label: "Jumarie Batiller",
        position: "Customer Support/Head Division 2",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
        value: "Evelyn Mendoza",
        label: "Evelyn Mendoza",
        position: "Customer Support/Head Division 3",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    },
    {
        value: "Marlon Bariud",
        label: "Marlon Bariud",
        position: "IT/Operations/DPO",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
        value: "Fritz Roto Paraiso",
        label: "Fritz Roto Paraiso",
        position: "Operations Administrator",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    },
    {
        value: "Romeo Tolledo",
        label: "Romeo Tolledo",
        position: "Warehouse/Workshop Repair",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
        value: "Frankie Olesco",
        label: "Frankie Olesco",
        position: "Operations Supervisor Retail",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
];

const purposeOfVisitOptions = [
    { value: "Business Meeting", label: "Business Meeting" },
    { value: "Job Interview", label: "Job Interview" },
    { value: "Delivery", label: "Delivery" },
    { value: "Pickup", label: "Pickup" },
    { value: "Conference", label: "Conference" },
    { value: "Training", label: "Training" },
    { value: "Seminar", label: "Seminar" },
    { value: "Meeting", label: "Meeting" },
    { value: "Company Event", label: "Company Event" },
];

export default function GuestLogForm({ guests }) {
    const [selectedGuestId, setSelectedGuestId] = useState("");
    const [guestItemsState, setGuestItemsState] = useState([
        { item_name: "", quantity: 1, remarks: "" },
    ]);
    const [searchValue, setSearchValue] = useState("");
    const [values, setValues] = useState({
        meeting_with: "",
        purpose_of_visit: "",
        check_in_time: "",
        check_out_time: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleGuestChange = (e) => {
        setSelectedGuestId(e.target.value);
    };

    const handleGuestItemChange = (index, field, value) => {
        const updatedGuestItems = [...guestItemsState];
        updatedGuestItems[index][field] = String(value);
        setGuestItemsState(updatedGuestItems);
    };

    const handleAddGuestItem = () => {
        setGuestItemsState([
            ...guestItemsState,
            { item_name: "", quantity: 1, remarks: "" },
        ]);
    };

    const handleRemoveGuestItem = (index) => {
        const updatedGuestItems = [...guestItemsState];
        updatedGuestItems.splice(index, 1);
        setGuestItemsState(updatedGuestItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const guestItemsFormData = new FormData();
        guestItemsState.forEach((item, index) => {
            guestItemsFormData.append(
                `guest_items[${index}][item_name]`,
                item.item_name
            );
            guestItemsFormData.append(
                `guest_items[${index}][quantity]`,
                item.quantity.toString()
            );
            guestItemsFormData.append(
                `guest_items[${index}][remarks]`,
                item.remarks
            );
        });

        const formData = {
            ...values,
            check_in_time: new Date(values.check_in_time).toISOString(),
            check_out_time: values.check_out_time
                ? new Date(values.check_out_time).toISOString()
                : null,
            guest_items: guestItemsState,
        };

        Inertia.post(`/guest/log/new/${selectedGuestId}`, formData);

        Swal.fire({
            title: "Success!",
            text: "Your log for today has been created successfully!",
            icon: "success",
            confirmButtonText: "OK",
        });
        Inertia.visit(route("guest.log.show"));
    };

    const handleCheckIn = () => {
        const today = new Date();
        const timezoneOffsetInMs = today.getTimezoneOffset() * 60000;
        const localDateTime = new Date(today.getTime() - timezoneOffsetInMs);
        const localIsoDateTime = localDateTime.toISOString().slice(0, 16);
        setValues((prevValues) => ({
            ...prevValues,
            check_in_time: localIsoDateTime,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const filteredGuests = guests
        .filter((guest) =>
            guest.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));

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
            <Head title="Log Guest" />
            <div className="py-12 p-4 flex justify-center items-center">
                <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg py-5">
                    <div className="text-center  mb-5">
                        <h2 className="text-3xl font-bold mb-4 ">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary relative">
                                Guest Log Form
                                <span className="absolute  left-1/2 transform -translate-x-1/2 -bottom-2 h-[3px] w-16 bg-[#2aefe6]"></span>
                            </span>
                        </h2>
                        <p className="text-sm font-light">
                            Please fill out the form below to log your visit
                            today.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-3 mb-4">
                            <Select
                                label="Guest Name"
                                labelPlacement="outside"
                                placeholder="Select Guest Name"
                                description="If you don't see your name here, please register."
                                value={selectedGuestId}
                                onChange={handleGuestChange}
                                isRequired
                            >
                                {filteredGuests.length > 0 ? (
                                    filteredGuests.map((guest) => (
                                        <SelectItem
                                            key={guest.id}
                                            value={guest.id}
                                        >
                                            {guest.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="" key={""}>
                                        No matching name available
                                    </SelectItem>
                                )}
                            </Select>
                            <Input
                                variant="bordered"
                                placeholder="Search by name"
                                className="w-full sm:max-w-[35%] mt-6"
                                startContent={
                                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                                }
                                value={searchValue}
                                onChange={handleSearchChange}
                                onClear={() => setSearchValue("")}
                            />

                            <GuestRegisterForm />
                        </div>
                        <Spacer y={2} />
                        <div className="mb-4">
                            <Select
                                label="Meeting With"
                                labelPlacement="outside"
                                placeholder="Select"
                                value={values.meeting_with}
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        meeting_with: e.target.value,
                                    })
                                }
                                isRequired
                            >
                                {meetingWithOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <Spacer y={2} />
                        <div className="mb-4">
                            <Select
                                label="Purpose of Visit"
                                labelPlacement="outside"
                                placeholder="Select Purpose"
                                value={values.purpose_of_visit}
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        purpose_of_visit: e.target.value,
                                    })
                                }
                                isRequired
                            >
                                {purposeOfVisitOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <Spacer y={2} />
                        <div className="flex gap-4 mb-4">
                            <Input
                                label="Check In"
                                placeholder="Check In"
                                description="Please enter your check in time or click the button to check in."
                                labelPlacement="outside"
                                type="datetime-local"
                                name="check_in_time"
                                value={values.check_in_time}
                                onChange={handleChange}
                                isRequired
                                onClear={() =>
                                    setValues({ ...values, check_in_time: "" })
                                }
                            />
                            <div className="flex items-center text-sm text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6">
                                Or
                            </div>
                            <Button
                                color="primary"
                                variant="shadow"
                                onClick={handleCheckIn}
                                className="mt-6 "
                            >
                                Check In
                            </Button>
                        </div>
                        <Spacer y={7} />
                        <p className="mb-4">Guest Belongings</p>
                        <Table className="mb-4">
                            <TableHeader>
                                <TableColumn>No.</TableColumn>
                                <TableColumn>Items</TableColumn>
                                <TableColumn>Quantity</TableColumn>
                                <TableColumn>Remarks</TableColumn>
                                <TableColumn>Action</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {guestItemsState.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Input
                                                labelPlacement="outside"
                                                placeholder="e.g. Smartphone"
                                                type="text"
                                                value={item.item_name}
                                                onChange={(e) =>
                                                    handleGuestItemChange(
                                                        index,
                                                        "item_name",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                labelPlacement="outside"
                                                placeholder="Quantity"
                                                type="number"
                                                value={item.quantity.toString()}
                                                onChange={(e) =>
                                                    handleGuestItemChange(
                                                        index,
                                                        "quantity",
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        )
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                labelPlacement="outside"
                                                placeholder="Owner will collect from reception"
                                                type="text"
                                                value={item.remarks}
                                                onChange={(e) =>
                                                    handleGuestItemChange(
                                                        index,
                                                        "remarks",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <DeleteIcon
                                                className="text-danger text-lg cursor-pointer"
                                                onClick={() =>
                                                    handleRemoveGuestItem(index)
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Button onClick={handleAddGuestItem}>Add Item</Button>
                        <div className="flex justify-end gap-2">
                            <Button size="lg" color="primary" type="submit">
                                Submit
                            </Button>
                            <Button
                                size="lg"
                                color="danger"
                                variant="flat"
                                onClick={() => Inertia.visit("/")}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
