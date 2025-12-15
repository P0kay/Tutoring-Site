'use client';

import { useState } from 'react';

export default function SignIn() {
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            }),
        });
        if (!res.ok) {
            let msg = 'Sign in failed';
            try {
                const data = await res.json();
                if (data?.message) msg = data.message;
            } catch { }
            setError(msg);
            return;
        }
        form.reset()
        window.location.href = '/';
    }

    return (
        <div className="h-min rounded-xl shadow-xl">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded-2xl shadow-md"
            >
                <h1 className="text-2xl font-semibold text-center text-gray-800">
                    Sign in
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

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    className="mt-2 rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition"
                >
                    Sign in
                </button>
            </form>
        </div>
    );
}
