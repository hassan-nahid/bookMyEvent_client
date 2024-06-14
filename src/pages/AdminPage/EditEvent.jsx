import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EditEvent = () => {
    const loadedEvent = useLoaderData();
    const [event, setEvent] = useState(loadedEvent);
    const token = localStorage.getItem("token")

    useEffect(() => {
        setEvent(loadedEvent);
    }, [loadedEvent]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("tickets")) {
            const ticketField = name.split(".")[1];
            setEvent(prevState => ({
                ...prevState,
                tickets: {
                    ...prevState.tickets,
                    [ticketField]: value
                }
            }));
        } else {
            setEvent(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { _id, ...updatedEvent } = event;

        try {
            const response = await fetch(`http://localhost:5000/events/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedEvent),
            });

            if (response.ok) {
                MySwal.fire({
                    title: 'Event Updated Successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                MySwal.fire({
                    title: 'Error Updating Event!',
                    icon: 'error',
                    showConfirmButton: true,
                });
            }
        } catch (error) {
            MySwal.fire({
                title: 'Error Updating Event!',
                icon: 'error',
                text: 'Failed to connect to server. Please try again later.',
                showConfirmButton: true,
            });
            console.error("Error updating event:", error);
        }
    };

    if (!event) {
        return <div>Event not found</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-2">Edit Event</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={event?.title || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea
                                name="description"
                                value={event?.description || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={new Date(event?.date).toISOString().slice(0, 16)}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={event?.image || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={event?.location || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Total Tickets</label>
                            <input
                                type="number"
                                name="tickets.total"
                                value={event?.tickets?.total || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Available Tickets</label>
                            <input
                                type="number"
                                name="tickets.available"
                                value={event?.tickets?.available || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Ticket Price</label>
                            <input
                                type="number"
                                step="0.01"
                                name="tickets.price"
                                value={event?.tickets?.price || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;
