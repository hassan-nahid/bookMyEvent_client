import { useEffect, useState } from "react";
import { useDeleteUser } from "react-firebase-hooks/auth";
import auth from "../../firebase/firebase.config";

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [deleteUser] = useDeleteUser(auth);
    const token = localStorage.getItem("token")


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch("http://localhost:5000/all_user")
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(error => console.error("Error fetching users:", error));
    };

    const handleAdminClick = async (userId) => {
        try {
            await fetch(`http://localhost:5000/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: 'admin' })
            });
    
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? { ...user, role: 'admin' } : user
                )
            );
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };
    
    const handleDelete = async (userId) => {
        try {
            // Delete user from database
            await fetch(`http://localhost:5000/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            // Delete user from Firebase Authentication
            await deleteUser();
    
            // Remove user from UI
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    return (
        <div className="overflow-x-auto w-full">
            <table className="table table-zebra">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <th>{index + 1}</th>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td className="flex flex-wrap gap-1">
                                {user.role !== 'admin' ? (
                                    <button
                                        className="btn btn-warning btn-xs"
                                        onClick={() => handleAdminClick(user._id)}
                                    >
                                        Admin
                                    </button>
                                ) : (
                                    <span className="text-gray-500">Admin</span>
                                )}
                                <button
                                    className="btn btn-error btn-xs"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUser;
