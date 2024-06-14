import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthState, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import auth from "../../firebase/firebase.config";

const MySwal = withReactContent(Swal);

const Login = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [signInWithEmailAndPassword, , , error] = useSignInWithEmailAndPassword(auth);
    const location = useLocation();
    const from = location?.state?.from?.pathname || "/";

    // Login component
    const handleLogin = async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const userCredential = await signInWithEmailAndPassword(email, password);
            if (userCredential) {
                MySwal.fire({
                    title: 'Login Successful!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });

                const user = {
                    email: userCredential?.user?.email,
                    name: userCredential?.user?.displayName || "Anonymous",
                    uid: userCredential?.user?.uid
                };

                const response = await fetch('http://localhost:5000/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });

                const data = await response.json();
                localStorage.setItem("token", data?.token);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-blue-400">Welcome to BookMyEvent App Login Now!</h1>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleLogin} className="card-body">
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
                        <label className="label">
                            <p>Don&apos;t have an account?<Link to="/register" className="link text-blue-400"> Register Now</Link></p>
                        </label>
                        {error && <div><p className="text-red-500">{error?.message}</p></div>}
                        <div className="form-control mt-6">
                            <button className="btn bg-blue-400 hover:bg-blue-500 text-white font-semibold">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
