import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">Payment Successful</h1>
        <p className="text-gray-700 mb-4">Thank you for your purchase!</p>
        <p className="text-gray-500">Your payment has been processed successfully.</p>
        <div className="mt-6">
          <Link to="/" className="btn btn-primary">Go to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
