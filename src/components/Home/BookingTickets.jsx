import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase/firebase.config";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const BookingTickets = () => {
  const [user] = useAuthState(auth);
  const [tickets, setTickets] = useState([]);
  //   const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/booking_tickets/${user?.email}`)
        .then((res) => res.json())
        .then((data) => setTickets(data))
        .catch((error) => console.error("Error fetching tickets:", error));
    }
  }, [user]);

  const handlePayZero = (ticket) => {
    const paymentData = {
      ticketId: ticket?._id,
      paymentDetails: {
        email: user?.email,
        price: ticket.totalPrice,
        eventId: ticket?.eventId,
        tickets: ticket.tickets,
        image: ticket?.event?.image,
        eventName: ticket?.event?.title
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
    }
  };

  const handlePayment = async (ticket) => {
    const stripe = await loadStripe("pk_test_51NiwPhLDEkK5s6FtKfxtfRZHKWLqOxXiSVsj0fjZslBZlzdO4y5F7m4o8PdaTOtbc83uTFNF0bspJ8SslrbjwDod006vjI31HX");
    const paymentData = {
      ticketId: ticket?._id,
      paymentDetails: {
        email: user?.email,
        price: ticket.totalPrice,
        eventId: ticket?.eventId,
        tickets: ticket?.tickets,
        image: ticket?.event?.image,
        eventName: ticket?.event?.title
      },
    };
    
    fetch(`http://localhost:5000/checkout_session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(paymentData),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.sessionId) {
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
          
        stripe.redirectToCheckout({
          sessionId: data.sessionId
        }).then((result) => {
          if (result.error) {
            console.error("Error processing payment:", result.error);
          }
        });
      } else {
        console.error("Failed to create checkout session:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };
  




  const handleCancel = (id) => {
    fetch(`http://localhost:5000/booking_tickets/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }, }).then(res => res.json())
        .then(() => {
          setTickets(tickets.filter((ticket) => ticket._id !== id));
          toast.success("Booking Cancelled")
        })
  }
  return (
    <>
      {
        tickets?.length > 0 ? <div className="w-full">
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
                      {ticket?.totalPrice === 0 ? <button className="btn btn-success text-white btn-xs" onClick={() => handlePayZero(ticket)}>
                        Pay
                      </button>: <button className="btn btn-success text-white btn-xs" onClick={() => handlePayment(ticket)}>
                        Pay
                      </button>}
                      <button onClick={() => handleCancel(ticket?._id)} className="btn btn-error text-white btn-xs">Cancel</button>
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
        </div> : <div className="w-full h-[500px] flex justify-center items-center">No Tickets Booked</div>
      }
    </>
  );
};

export default BookingTickets;
