// src/pages/ErrorPage.jsx
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const status = error?.status || 404;
  const message = error?.message || "Page not found";

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-100 px-4">
      <div className="max-w-lg bg-white shadow-md rounded-lg p-8">
        <h1 className="text-8xl font-extrabold text-red-600 mb-4">{status}</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-4">{message}</p>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the page you are looking for doesn&apos;t exist or an error occurred.
        </p>
        <button className="btn bg-red-500 text-white py-2 px-6 rounded-lg transition duration-300 hover:bg-red-600">
          <Link to="/" className="text-white no-underline">Go to Homepage</Link>
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
