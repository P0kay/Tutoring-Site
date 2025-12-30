'use client';

import { useState } from "react";

function SignUp() {
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        setError(null)
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const passwordConfirm = form.passwordConfirm.value;
        const type = form.type.value;
        const birth_date = form.birth_date.value;
        if (password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                type,
                birth_date,
            }),
        });
        if (res.status === 409) {
            setError('Email already exists');
            return;
        }

        if (!res.ok) {
            // If your API returns { message }, show it; otherwise a generic error
            let msg = 'Sign in failed';
            try {
                const data = await res.json();
                if (data?.message) msg = data.message;
            } catch { }
            setError(msg);
            return;
        }
        form.reset();
        window.location.href = '/signed-up';
    }
    return (
        <div className="h-min rounded-xl shadow-xl">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded-2xl shadow-md"
            >
                <h1 className="text-2xl font-semibold text-center text-gray-800">
                    Create account
                </h1>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    name="passwordConfirm"
                    placeholder="Repeat password"
                    required
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Account type</label>
                    <select
                        name="type"
                        required
                        className="rounded-lg border border-gray-300 px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select type</option>
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Birth date</label>
                    <input
                        type="date"
                        name="birth_date"
                        required
                        className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/40 cursor-pointer"
                >
                    Sign up
                </button>
            </form>
        </div>
    );
}

export default SignUp;