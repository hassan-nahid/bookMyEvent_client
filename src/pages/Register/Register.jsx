import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthState, useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { updateProfile } from "firebase/auth";
import auth from "../../firebase/firebase.config";

const MySwal = withReactContent(Swal);

const Register = () => {
    const location = useLocation();
    const from = location?.state?.from?.pathname || "/";
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const [
        createUserWithEmailAndPassword,
        ,
        ,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);
    const [passMatch, setPassMatch] = useState(false);

    // Register component
    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirm_password = form.confirm_password.value;

        if (password === confirm_password) {
            try {
                const userCredential = await createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                if (user) {
                    // Update the user's profile with their name
                    await updateProfile(user, {
                        displayName: name || "Anonymous"
                    });

                    MySwal.fire({
                        title: 'Registration Successful!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    const userData = {
                        email: user.email,
                        name: user.displayName,
                        uid: user.uid
                    };

                    const response = await fetch('http://localhost:5000/user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });

                    const data = await response.json();
                    localStorage.setItem("token", data?.token);
                }
            } catch (error) {
                console.error("Error during registration:", error);
            }
        } else {
            setPassMatch(true);
            return;
        }
        setPassMatch(false);
    };

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [from, navigate, user]);

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-blue-400">Welcome to BookMyEvent App Register Now!</h1>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleRegister} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input type="text" name="name" placeholder="name" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name="email" placeholder="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input type="password" name="confirm_password" placeholder="confirm password" className="input input-bordered" required />
                        </div>
                        {passMatch && <div><p className="text-red-500">Password does not match</p></div>}
                        <label className="label">
                            <p>Already have an account?<Link to="/Login" className="link text-blue-400">Login Now</Link></p>
                        </label>
                        {error && <div><p className="text-red-500">{error?.message}</p></div>}
                        <div className="form-control mt-6">
                            <button className="btn bg-blue-400 hover:bg-blue-500 text-white font-semibold">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
