import React, { useState } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
} from "@nextui-org/react";
import ApplicationLogo from "./ApplicationLogo";

export default function Header({ auth }) {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [adminClicked, setAdminClicked] = useState(false);

    const handleAdminClick = () => {
        setShowLogin(true);
        setShowRegister(true);
        setAdminClicked(true);
    };
    return (
        <Navbar position="static" maxWidth="xl" className="bg-transparent">
            <NavbarBrand>
                <ApplicationLogo />
            </NavbarBrand>

            <NavbarContent justify="end">
                <NavbarItem>
                    {auth.user ? (
                        <Button
                            color="primary"
                            as={Link}
                            href={route("dashboard")}
                        >
                            Dashboard
                        </Button>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                {!adminClicked && (
                                    <Button
                                        color="primary"
                                        variant="shadow"
                                        onClick={handleAdminClick}
                                    >
                                        Admin
                                    </Button>
                                )}
                                {showLogin && (
                                    <Button
                                        color="primary"
                                        variant="shadow"
                                        as={Link}
                                        href={route("login")}
                                    >
                                        Log in
                                    </Button>
                                )}
                                {showRegister && (
                                    <Button
                                        color="primary"
                                        variant="ghost"
                                        as={Link}
                                        href={route("register")}
                                    >
                                        Register
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
