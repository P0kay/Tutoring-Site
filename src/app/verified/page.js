import Link from "next/link";

function Verified() {
    return (
        <div className="h-min flex items-center justify-center flex-col gap-10">
            <h1 className="text-xl font-semibold">
                ✅ Your email has been verified
            </h1>
            <Link href='/signin' className="text-xl font-semibold border-2 rounded-xl p-2">Sign In Now</Link>
        </div>
    );
}

export default Verified;