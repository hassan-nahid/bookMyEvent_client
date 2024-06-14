import { Link, Outlet } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdOutlinePostAdd, MdOutlineManageSearch } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";

import { FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import auth from "../firebase/firebase.config";
import useAdmin from "../hooks/useAdmin";


const DashboardLayout = () => {
    const [signOut] = useSignOut(auth);
    const [user] = useAuthState(auth);
    const [isAdmin] = useAdmin()


    const handleLogout = async () => {
        const success = await signOut()
        if (success) {
            toast.success("Logout Successful");
        }
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">
                <label htmlFor="my-drawer-2" className="btn drawer-button lg:hidden my-4 bg-green-600 hover:bg-green-400 text-white font-semibold">Open Menu</label>
                <Outlet className="w-full" />

            </div>
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col justify-between">
                    {/* Sidebar content here */}
                    <div>
                        <li className="text-black font-semibold text-2xl" to={"/"}>BookMyEvent</li>
                        <div className="divider h-2 bg-black"/>
                        <li><Link className="text-blue-400 font-semibold" to={"/"}><FaHome />Home</Link></li>
                        <li><Link className="text-blue-400 font-semibold" to={"/booking_tickets"}><FaHome />Booking Tickets</Link></li>
                        {
                            isAdmin ? <li><Link className="text-blue-400 font-semibold" to={"/add_event"}><MdOutlinePostAdd />Add Event</Link></li> : ""
                        }
                        {
                            isAdmin ? <li><Link className="text-blue-400 font-semibold" to={"/manage_event"}><MdOutlineManageSearch />Manage Event</Link></li> : ""
                        }
                        {
                            isAdmin ? <li><Link className="text-blue-400 font-semibold" to={"/manage_user"}><FaUserCog />Manage User</Link></li> : ""
                        }
                    </div>
                    <div className="flex gap-1">
                        {user && user.photoURL === null ?
                            <Link to="/profile_page" className="w-12">
                                <img title={user?.email} className="rounded-full" src={"https://i.ibb.co/kg6fMYC/placeholder.jpg"} />
                            </Link> :
                            <Link to="/profile_page" className="w-12">
                                <img title={user?.email} className="rounded-full" src={user?.photoURL} />
                            </Link>}
                        {user ? <button onClick={handleLogout} className="btn bg-red-500 w-[80%] hover:bg-red-400 text-white font-semibold">Logout<FiLogOut/> </button> :
                            <Link to="/login" className="btn bg-blue-400 hover:bg-blue-500 text-white font-semibold">Login</Link>}
                    </div>

                </ul>

            </div>
        </div>
    );
};

export default DashboardLayout;