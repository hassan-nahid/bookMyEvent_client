import { useState } from "react";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase/firebase.config";
import Loading from "../../components/Loading";

const ProfilePage = () => {
    const [user, loading, error] = useAuthState(auth);
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
    const [newPassword, setNewPassword] = useState("");

    const handleUpdateProfile = async () => {
        try {
            if (user) {
                await updateProfile(user, {
                    displayName: displayName,
                    photoURL: photoURL
                });
                if (user.email !== email) {
                    await updateEmail(user, email);
                }
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    const handleChangePassword = async () => {
        try {
            if (user) {
                await updatePassword(user, newPassword);
                toast.success("Password updated successfully!");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Failed to update password.");
        }
    };

    if (loading) {
        return <Loading/>
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="card w-full lg:w-1/2 mx-auto bg-base-100 shadow-xl">
                <figure className="px-10 pt-10">
                    <img
                        className="rounded-full w-32 h-32 object-cover"
                        src={photoURL || "https://i.ibb.co/kg6fMYC/placeholder.jpg"}
                        alt="Profile"
                    />
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Profile</h2>
                    <div className="w-full">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />

                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            className="input input-bordered w-full"
                            value={email}
                            // disabled
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label className="label">
                            <span className="label-text">Profile Picture URL</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                        />

                        <button
                            className="btn btn-primary w-full mt-4"
                            onClick={handleUpdateProfile}
                        >
                            Update Profile
                        </button>
                    </div>

                    {user?.providerData[0]?.providerId === "password" && (
                        <div className="w-full mt-6">
                            <h3 className="card-title">Change Password</h3>
                            <label className="label">
                                <span className="label-text">New Password</span>
                            </label>
                            <input
                                type="password"
                                className="input input-bordered w-full"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                className="btn btn-secondary w-full mt-4"
                                onClick={handleChangePassword}
                            >
                                Change Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
