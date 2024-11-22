'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserList, selectLoadingStatus } from '../../../Redux/userSlice';
import { fetchUserList } from '../../../Redux/userThunks';
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
        return <p className="mt-[130px] text-2xl text-center">Loading user data...</p>;
    }

    if (!user) {
        return <p className="mt-[130px] text-center text-red-500">No user found with the provided ID.</p>;
    }

    return (
        <div className="flex justify-center flex-col items-center">
            <div className="mt-[100px] w-full max-w-2xl px-4 lg:w-1/2">
                <h1 className="text-[30px] font-bold tracking-wider underline-offset-8 underline">User Details</h1>
                <div className="border p-4 shadow-md rounded-xl flex flex-col lg:flex-row items-start gap-4 justify-between mt-[50px]">
                    <div className="flex flex-col gap-4 text-lg w-full">
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
                    {user.image && (
                        <div className="p-3 border-2 border-white rounded-xl shadow-md hover:scale-110 transition-all duration-300 hover:border-red-500">
                            <img
                                src={user.image}  // Base64 image is already in correct format
                                alt={`${user.first_name}'s profile`}
                                className="mt-2 w-32 h-32 rounded-full object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;