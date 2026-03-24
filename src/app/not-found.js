function NotFound() {
    return (
        <div className="flex items-center justify-center bg-gray-50 h-full">
            <div className="text-center">
                <h1 className="text-5xl font-semibold text-gray-800 mb-4">
                    404
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                    Not Found
                </p>
                <p className="text-sm text-gray-500">
                    The page you are looking for doesn’t exist or may have been moved.
                </p>
            </div>
        </div>
    );
}

export default NotFound;