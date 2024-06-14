import { useEffect, useState } from "react";
import EventCard from "../../components/Home/EventCard";

const DashHome = () => {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/events")
        .then(res => res.json())
        .then(data => setEvents(data))
    }, [])
    
    return (
        <div className="flex justify-center items-center mx-2">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 my-2 ">
            {
                events?.map((event) => <EventCard key={event?._id} event={event}/> )
            }
        </div>
        </div>
    );
};

export default DashHome;