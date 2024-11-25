'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserList, selectLoadingStatus } from '../Redux/userSlice';
import { fetchUserList } from '../Redux/userThunks';
import ClipLoader from 'react-spinners/ClipLoader'; // Import spinner
import 'react-toastify/dist/ReactToastify.css';

const UserDetails = () => {
    const params = useParams();
    const { id } = params;
    const userId = decodeURIComponent(id);
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);
    const loading = useSelector(selectLoadingStatus);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (users.length === 0) {
            dispatch(fetchUserList());
        }
    }, [dispatch, users]);

    useEffect(() => {
        if (userId && users.length > 0) {
            const foundUser = users.find((user) => user._id === userId);
            if (foundUser) {
                setUser(foundUser);
            }
        }
    }, [userId, users]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <ClipLoader color="#3498db" size={100} />
            </div>
        );
    }

    if (!user) {
        return <p className="mt-[130px] text-center text-red-500">No user found with the provided ID.</p>;
    }

    return (
        <div className="flex justify-center flex-col items-center bg-gradient-to-b from-[--background] to-gray-950 dark:from-gray-600 dark:to-[--background] min-h-screen py-10 px-4">
            <div className="w-full max-w-3xl bg-white dark:bg-[--card] shadow-xl rounded-xl p-6 lg:p-10">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-[--foreground] text-center tracking-widest mb-6">
                    User Details
                </h1>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    {user.image && (
                        <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg border-4 border-gray-300 dark:border-[--border] transform hover:scale-105 transition duration-300">
                            <img
                                src={user.image}
                                alt={`${user.first_name}'s profile`}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}
                    <div className="text-gray-700 dark:text-[--foreground] flex-1 space-y-4 text-lg">
                        <p><strong>Name:</strong> {user.first_name || 'N/A'}</p>
                        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                        <p><strong>Role:</strong> {user.role || 'N/A'}</p>
                        <p><strong>Status:</strong> {user.status || 'N/A'}</p>
                        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                        {user.dob && <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</p>}
                        {user.address && <p><strong>Address:</strong> {user.address}</p>}
                        {user.gender && <p><strong>Gender:</strong> {user.gender}</p>}
                        {user.blood_group && <p><strong>Blood Group:</strong> {user.blood_group}</p>}
                        {user.languages_known && Array.isArray(user.languages_known) && (
                            <p><strong>Languages Known:</strong> {user.languages_known.join(', ')}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
