// blog/app/(Pages)/edit/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList, updateUser, selectUserList, selectLoadingStatus } from '../../../Redux/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateUser = () => {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);
    const loading = useSelector(selectLoadingStatus);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        email: '',
        role: '',
        status: ''
    });

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
                setFormData({
                    first_name: foundUser.first_name,
                    email: foundUser.email,
                    role: foundUser.role,
                    status: foundUser.status
                });
            }
        }
    }, [id, users]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Form Data Before Submit:", formData); // Check if status is included
            await dispatch(updateUser({ id, ...formData })).unwrap();
            toast.success('User updated successfully!');
            router.push('/users');
        } catch (error) {
            toast.error('Error updating user');
        }
    };
    

    if (loading) {
        return <p className='mt-[130px] text-2xl text-center'>Loading user data...</p>;
    }

    if (!user) {
        return <p>No user found with the provided ID.</p>;
    }

    return (
        <div className='flex justify-center flex-col items-center'>
        <div className='mt-[100px] w-1/2 '>
            <h1>Update User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="first_name">Name:</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="role">Role:</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="status">Status:</label>
                    <select
                       id="status"
                       name="status"
                       value={formData.status}
                       onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    >
                        <option >Active</option>
                        <option >Inactive</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Update User
                </button>
            </form>
            <ToastContainer />
        </div>
        </div>
    );
};

export default UpdateUser;
