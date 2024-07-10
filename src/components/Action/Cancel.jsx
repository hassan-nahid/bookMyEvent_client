import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Payment Canceled</h1>
        <p className="text-gray-700 mb-4">Your payment has been canceled.</p>
        <p className="text-gray-500">If you have any questions, please contact support.</p>
        <div className="mt-6">
          <Link className="btn btn-primary" to={"/"}>Go to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
