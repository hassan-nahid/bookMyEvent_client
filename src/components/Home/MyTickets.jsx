import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase/firebase.config";

const MyTicket = () => {


    const [payments, setPayments] = useState([]);
    const [user] = useAuthState(auth);


    useEffect(() => {
        fetch(`http://localhost:5000/my_tickets/${user?.email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setPayments(data)
            })
    }, [user])

    return (
        <div className="w-full px-2">
            {payments?.length > 0 ? <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Payment Id</th>
                                <th>Event Name</th>
                                <th>Email</th>
                                <th>Payment Time & Date</th>
                                <th>Tickets</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments?.map((payment) =>
                                 <tr key={payment?._id} className="bg-base-200">
                                 <th>{payment?._id}</th>
                                 <td>{payment?.eventName}</td>
                                 <td>{payment?.email}</td>
                                 <td>{new Date(payment?.paymentDate).toLocaleString()}</td>
                                 <td>{payment?.tickets}</td>
                                 <td>{payment?.price}</td>
                             </tr>
                            )}
                           
                        </tbody>
                    </table>
                </div>
            </div> : <h1 className="text-3xl text-center">No Ticket Found</h1>}
        </div>
    );
};

export default MyTicket;