import Link from "next/link";

function Verified() {
    return (
        <div className="flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center flex flex-col gap-6 max-w-sm w-full">
                <div className="text-5xl">✅</div>

                <h1 className="text-2xl font-semibold text-gray-800">
                    Email verified
                </h1>

                <p className="text-sm text-gray-500">
                    Your email address has been successfully verified.
                    You can now sign in to your account.
                </p>

                <Link
                    href="/signin"
                    className="mt-2 inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3
                 text-white font-medium transition
                 hover:bg-gray-800 focus:outline-none focus:ring-2
                 focus:ring-gray-900 focus:ring-offset-2"
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
}

export default Verified;