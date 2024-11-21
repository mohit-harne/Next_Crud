// blog/app/(Pages)/edit/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList, updateUser, selectUserList, selectLoadingStatus } from '../../../Redux/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarLoader } from 'react-spinners';

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
        status: '',
        image: '',  // Base64 image data
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
                    status: foundUser.status,
                    image: foundUser.image || '',
                });
            }
        }
    }, [id, users]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1]; // Remove the prefix
                setFormData((prevData) => ({
                    ...prevData,
                    image: base64String,  // Set only the base64 string
                }));
            };
            reader.readAsDataURL(file);  // Convert image to base64
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Form Data Before Submit:", formData);  // Check if image data is included
            await dispatch(updateUser({ id, ...formData })).unwrap();
            toast.success('User updated successfully!');
            router.push('/users');
        } catch (error) {
            toast.error('Error updating user');
        }
    };

    if (loading) {
        return  <div className='flex item-center justify-center mt-[300px]'>   <BarLoader
        color="#4bf003"
        height={8}
        width={200}
        
      /> </div>;
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
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="image">Upload Image:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border rounded p-2 w-full"
                        />
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
