import { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, useForm } from "@inertiajs/react";
import { addToast, Input } from "@heroui/react";

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onSuccess: () => {
                addToast({
                    title: "Login Successful",
                    description: "You have been logged in successfully",
                    type: "success",
                    color: "success",
                    duration: 5000, // 5 seconds
                });
            },
            onError: (errors) => {
                if (errors.email || errors.password) {
                    addToast({
                        title: "Login Failed",
                        description: "Invalid email or password",
                        type: "error",
                        color: "danger",
                        duration: 5000,
                    });
                }
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Log in" />

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Sign in
                    </h2>
                    {status && (
                        <div className="mt-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </div>

                <form onSubmit={submit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <Input
                                variant="bordered"
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <Input
                                variant="bordered"
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 w-full"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div>
                        <PrimaryButton
                            className="w-full flex justify-center py-2"
                            disabled={processing}
                        >
                            {processing ? "Signing in..." : "Sign in"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
