function SignedUp() {
  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center flex flex-col gap-6 max-w-sm w-full">
        <div className="text-5xl">📧</div>

        <h1 className="text-2xl font-semibold text-gray-800">
          Verify your email
        </h1>

        <p className="text-sm text-gray-500">
          You’ve successfully signed up.
          We’ve sent a verification link to your email address.
          Please check your inbox to activate your account.
        </p>

        <p className="text-xs text-gray-400">
          Didn’t receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
}

export default SignedUp;
