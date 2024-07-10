import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AddEvent = () => {
    const [event, setEvent] = useState({
        title: "",
        description: "",
        date: "",
        image: "",
        location: "",
        tickets: {
            total: 0,
            available: 0,
            price: 0.00
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("tickets")) {
            const ticketField = name.split(".")[1];
            setEvent(prevState => ({
                ...prevState,
                tickets: {
                    ...prevState.tickets,
                    [ticketField]: ticketField === "price" ? parseFloat(value) : parseInt(value)
                }
            }));
        } else {
            setEvent(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(event),
            });

            if (response.ok) {
                MySwal.fire({
                    title: 'Event Added Successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                setEvent({
                    title: "",
                    description: "",
                    date: "",
                    image: "",
                    location: "",
                    tickets: {
                        total: 0,
                        available: 0,
                        price: 0.00
                    }
                });
            } else {
                MySwal.fire({
                    title: 'Error Adding Event!',
                    icon: 'error',
                    showConfirmButton: true,
                });
            }
        } catch (error) {
            MySwal.fire({
                title: 'Error Adding Event!',
                icon: 'error',
                showConfirmButton: true,
            });
            console.error("Error adding event:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-2">Add New Event</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={event.title}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea
                                name="description"
                                value={event.description}
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
                                value={event.date}
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
                                value={event.image}
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
                                value={event.location}
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
                                value={event.tickets.total}
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
                                value={event.tickets.available}
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
                                value={event.tickets.price}
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
                                Add Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEvent;
