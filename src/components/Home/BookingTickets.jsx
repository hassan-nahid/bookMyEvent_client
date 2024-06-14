import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase/firebase.config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BookingTickets = () => {
  const [user] = useAuthState(auth);
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/booking_tickets/${user?.email}`)
        .then((res) => res.json())
        .then((data) => setTickets(data))
        .catch((error) => console.error("Error fetching tickets:", error));
    }
  }, [user]);

  const handlePay = (ticket) => {
    const paymentData = {
      ticketId: ticket._id,
      paymentDetails: {
        email: user?.email,
        price: ticket.totalPrice,
        eventId: ticket.eventId,
        tickets: ticket.tickets,
      },
    };

    if (ticket.totalPrice === 0) {
      fetch(`http://localhost:5000/process_payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Error processing free ticket:", data.error);
          } else {
            toast.success("Free ticket processed successfully");
            // Remove the ticket from the state
            setTickets(tickets.filter((t) => t._id !== ticket._id));
          }
        })
        .catch((error) => console.error("Error processing free ticket:", error));
    } else {
      navigate(`/payment/${ticket._id}`);
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Title</th>
              <th>Tickets</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket?._id}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={ticket?.event?.image} alt={ticket?.event?.title} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{ticket?.event?.title}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <p>Quantity: {ticket?.tickets}</p>
                  <br />
                  <span className="badge badge-ghost badge-sm">Price: {ticket?.totalPrice}</span>
                </td>
                <td className="flex gap-1">
                  <button className="btn btn-success text-white btn-xs" onClick={() => handlePay(ticket)}>
                    Pay
                  </button>
                  <button className="btn btn-error text-white btn-xs">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Index</th>
              <th>Title</th>
              <th>Tickets</th>
              <th>Action</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BookingTickets;
