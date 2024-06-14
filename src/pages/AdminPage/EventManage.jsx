import { useEffect, useState } from "react";
import EventManageRow from "../../components/Admin/EventManageRow";
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const EventManage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/events")
            .then(res => res.json())
            .then(data => setEvents(data))
    }, []);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:5000/events/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
    
                    if (response.ok) {
                        setEvents(prevEvents => prevEvents.filter(event => event._id !== id));
                        toast.success('Event deleted successfully!');
                        Swal.fire(
                            'Deleted!',
                            'The event has been deleted.',
                            'success'
                        );
                    } else {
                        toast.error('Failed to delete the event.');
                    }
                } catch (error) {
                    console.error("Error deleting event:", error);
                    toast.error('Error deleting the event.');
                }
            }
        });
    };
    return (
        <div className="w-full">
            <Toaster />
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Title</th>
                            <th>Ticket Info</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <EventManageRow
                                key={event?._id}
                                index={index}
                                event={event}
                                onDelete={handleDelete}
                            />
                        ))}
                    </tbody>
                    {/* foot */}
                    <tfoot>
                        <tr>
                            <th>Index</th>
                            <th>Title</th>
                            <th>Ticket Info</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default EventManage;
