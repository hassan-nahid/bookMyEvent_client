import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase/firebase.config";

const useAdmin = () => {
    const [user, loading] = useAuthState(auth);
    const [axiosSecure] = useAxiosSecure();

    const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
        queryKey: ['isAdmin', user?.email],
        enabled: !loading && !!user?.email, // Ensure user is authenticated and email is available
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/admin/${user?.email}`);
            return res.data.admin; // Assuming the response has a property `admin` indicating admin status
        }
    });

    return [isAdmin, isAdminLoading];
};

export default useAdmin;
