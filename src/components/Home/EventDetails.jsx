import { useLoaderData } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useState } from 'react';
import auth from '../../firebase/firebase.config';
import toast from 'react-hot-toast';

const EventDetails = () => {
    const event = useLoaderData();
    const [user] = useAuthState(auth);
    const [tickets, setTickets] = useState(1);

    const handleBooking = async () => {
        const booking = {
            eventId: event?._id,
            email: user?.email, // Assuming you have userId in the decoded token
            tickets: tickets,
            totalPrice: event.tickets.price * tickets,
            createdAt: new Date(),
        };

        const response = await fetch('http://localhost:5000/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(booking),
        });
        const data = await response.json();
        if (data.acknowledged) {
            toast.success('Tickets booked successfully!');
        }

    }


    return (
        <div className="container mx-auto p-4">
            <div className="card bg-base-100 shadow-xl">
                <figure>
                    <img src={event?.image} alt={event?.title} className="h-96 w-full object-cover" />
                </figure>
                <div className="card-body">
                    <h1 className="card-title text-3xl font-bold mb-4">{event?.title}</h1>
                    <p className="text-lg mb-2">{event?.description}</p>
                    <p className="text-lg mb-2">Location: {event?.location}</p>
                    <p className="text-lg mb-2">Date: {new Date(event?.date).toLocaleString()}</p>
                    <p className="text-lg mb-2">Tickets Total: {event?.tickets?.total}</p>
                    <p className="text-lg mb-2">Tickets Available: {event?.tickets?.available}</p>
                    <p className="text-lg mb-2">Price: ${event?.tickets?.price}</p>
                    <div className="card-actions flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md mt-4">
                        <div className="flex items-center space-x-4">
                            <label htmlFor="ticketCount" className="font-semibold">Number of Tickets:</label>
                            <input
                                id="ticketCount"
                                name='tickets'
                                type="number"
                                min="1"
                                max={event?.tickets?.available}
                                value={tickets}
                                onChange={(e) => setTickets(e.target.value)}
                                className="input input-bordered w-20 text-center border-2 border-blue-500 rounded-lg"
                            />
                        </div>
                        {
                            event?.tickets?.available <= 1 ? <button disabled onClick={handleBooking} className="btn btn-primary text-lg font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300">
                                Book Tickets (${event?.tickets?.price * tickets})
                            </button> : <button onClick={handleBooking} className="btn btn-primary text-lg font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300">
                                Book Tickets (${event?.tickets?.price * tickets})
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
