import { useState, PropsWithChildren, ReactNode } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import {
    Dropdown,
    DropdownTrigger,
    Avatar,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { Inertia } from "@inertiajs/inertia";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const handleLogout = () => {
        Inertia.post(route("logout"));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route("guest.index")}
                                    active={route().current("guest.index")}
                                >
                                    Guest
                                </NavLink>
                                <NavLink
                                    href={route("guest.log.index")}
                                    active={route().current("guest.log.index")}
                                >
                                    Logs
                                </NavLink>
                                <NavLink
                                    href={route("media.create")}
                                    active={route().current("media.create")}
                                >
                                    Upload
                                </NavLink>
                                <NavLink
                                    href={route("report.create")}
                                    active={route().current("report.create")}
                                >
                                    Reports
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Avatar
                                            size="md"
                                            showFallback
                                            className="transition-transform"
                                            src="https://images.unsplash.com/broken"
                                        />
                                    </DropdownTrigger>

                                    <DropdownMenu
                                        aria-label="User menu"
                                        variant="flat"
                                    >
                                        <DropdownItem
                                            key="profile"
                                            className="h-14 gap-2"
                                        >
                                            <p>Signed in as</p>
                                            <p className="font-semibold">
                                                {user.email}
                                            </p>
                                        </DropdownItem>
                                        <DropdownItem
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </DropdownItem>
                                        <DropdownItem onClick={handleLogout}>
                                            Log Out
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("guest.index")}
                            active={route().current("guest.index")}
                        >
                            Guest
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("guest.log.index")}
                            active={route().current("guest.log.index")}
                        >
                            Logs
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("media.create")}
                            active={route().current("media.create")}
                        >
                            Upload
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("report.create")}
                            active={route().current("report.create")}
                        >
                            Reports
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
