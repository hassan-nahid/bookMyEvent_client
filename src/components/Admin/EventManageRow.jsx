import { Link } from "react-router-dom";

const EventManageRow = ({ event, index, onDelete }) => {
    console.log(event)
    return (
        <tr>
            <th>{index + 1}</th>
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <img src={event?.image} alt={event?.title} />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{event?.title}</div>
                        <div className="text-sm opacity-50">{event?.location}</div>
                    </div>
                </div>
            </td>
            <td>
                <span>Total Tickets: {event?.tickets?.total}</span>
                <br />
                <span className="badge badge-ghost badge-sm">Available Tickets: {event?.tickets?.available}</span>
            </td>
            <td>{event?.tickets?.price} $</td>
            <th className="flex flex-wrap gap-1">
                <Link to={`/event/${event?._id}`} className="btn btn-primary btn-xs">Details</Link>
                <Link to={`/edit_event/${event?._id}`} className="btn btn-warning btn-xs">Edit</Link>
                <button onClick={() => onDelete(event._id)} className="btn btn-error btn-xs">Delete</button>
            </th>
        </tr>
    );
};

export default EventManageRow;
