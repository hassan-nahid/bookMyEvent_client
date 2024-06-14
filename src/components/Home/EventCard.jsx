import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
 

    return (
        <div className="card max-w-96 bg-base-100 shadow-xl image-full cursor-pointer">
            <figure>
                <img src={event?.image} alt={event?.title} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{event?.title}</h2>
                <p>{event?.description}</p>
                <p>Location: {event?.location}</p>
                <p>Date: {new Date(event?.date).toLocaleString()}</p>
                <div className="card-actions justify-end">
                    <Link to={`/event/${event?._id}`} className="btn btn-primary text-white">Event Details (${event?.tickets?.price})</Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
