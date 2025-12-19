function Unauthorized() {
    return (
        <div className="flex items-center justify-center bg-gray-50 h-full">
            <div className="text-center">
                <h1 className="text-5xl font-semibold text-gray-800 mb-4">
                    401
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                    Unauthorized
                </p>
                <p className="text-sm text-gray-500">
                    Please log in to continue
                </p>
            </div>
        </div>
    );
}

export default Unauthorized;