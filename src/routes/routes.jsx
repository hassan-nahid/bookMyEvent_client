import {
  createBrowserRouter,
} from "react-router-dom";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashHome from "../pages/Dashboard/DashHome";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import EventDetails from "../components/Home/EventDetails";
import AddEvent from "../pages/AdminPage/AddEvent";
import EventManage from "../pages/AdminPage/EventManage";
import ManageUser from "../pages/AdminPage/ManageUser";
import EditEvent from "../pages/AdminPage/EditEvent";
import BookingTickets from "../components/Home/BookingTickets";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <PrivateRoute><DashHome /></PrivateRoute>,
      },
      {
        path: "/profile_page",
        element: <PrivateRoute><ProfilePage /></PrivateRoute>,
      },
      {
        path: "/event/:id",
        element: <PrivateRoute><EventDetails /></PrivateRoute>,
        loader: ({ params }) => fetch(`http://localhost:5000/events/${params?.id}`),
      },
      {
        path: "/add_event",
        element: <PrivateRoute><AddEvent /></PrivateRoute>,
      },
      {
        path: "/event_manage",
        element: <PrivateRoute><EventManage /></PrivateRoute>,
      },
      {
        path: "/edit_event/:id",
        element: <PrivateRoute><EditEvent /></PrivateRoute>,
        loader: ({ params }) => fetch(`http://localhost:5000/events/${params?.id}`),
      },
      {
        path: "/manage_user",
        element: <PrivateRoute><ManageUser /></PrivateRoute>,
      },
      {
        path: "/booking_tickets",
        element: <PrivateRoute><BookingTickets /></PrivateRoute>,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
