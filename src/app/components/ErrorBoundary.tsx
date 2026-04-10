import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertCircle, Home } from "lucide-react";

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Unexpected Application Error";
  let message = "Something went wrong. Please try again later.";
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "404 Not Found";
      message = "The page you are looking for does not exist.";
    } else {
      title = `${error.status} ${error.statusText}`;
      if (error.data) {
        message = error.data;
      }
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="mb-6 p-6 bg-red-100 rounded-full shadow-inner border break-inside-avoid border-red-200">
        <AlertCircle className="w-16 h-16 text-red-500" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 mb-4">{title}</h1>
      <p className="text-lg text-slate-600 mb-8 max-w-md text-center">
        {message}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <Home className="w-5 h-5" />
        Return to Dashboard
      </Link>
    </div>
  );
}
