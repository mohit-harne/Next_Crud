// blog/app/(Pages)/user/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList, selectUserList, selectLoadingStatus } from '../../../Redux/userSlice';
import 'react-toastify/dist/ReactToastify.css';

const UserDetails = () => {
    const params = useParams();
    const { id } = params; // Get user ID from route parameters
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
        if (id && users.length > 0) {
            const foundUser = users.find((user) => user._id === id);
            if (foundUser) {
                setUser(foundUser);
            }
        }
    }, [id, users]);

    if (loading) {
        return <p className='mt-[130px] text-2xl text-center'>Loading user data...</p>;
    }

    if (!user) {
        return <p>No user found with the provided ID.</p>;
    }

    return (
        <div className='flex justify-center flex-col items-center'>
            <div className='mt-[100px] w-1/2'>
                <h1 className='text-[30px] font-bold tracking-wider underline-offset-8 underline'>User Details</h1>
                <div className=" border p-4 shadow-md rounded-xl flex items-start justify-between mt-[50px]">
                   <div className='flex flex-col gap-[20px] text-lg'>
                   <p><strong>Name :</strong> {user.first_name}</p>
                    <p><strong>Email :</strong> {user.email}</p>
                    <p><strong>Role :</strong> {user.role}</p>
                    <p><strong>Status :</strong> {user.status}</p>
                    <p><strong>Phone :</strong> {user.phone}</p>
                   </div>
                    {user.image && (
                        <div className='p-3 border-2  border-white rounded-xl shadow-md'>
                            <img src={`data:image/png;base64,${user.image}`} alt={`${user.first_name}'s profile`} className="mt-2 w-32 h-32 rounded-full" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
