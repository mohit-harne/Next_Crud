'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../Redux/userThunks';
import { setUploadProgress } from '../../Redux/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import UploadProgress from '../../components/UploadProgress';
import 'react-toastify/dist/ReactToastify.css';

const AddUser = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const uploadProgress = useSelector(state => state.users.uploadProgress);
    const [formData, setFormData] = useState({
        first_name: '',
        email: '',
        role: '',
        status: '',
        phone: '',
        dob: '',
        address: '',
        gender: '',
        blood_group: '',
        languages_known: [],
        image: '',
    });
    const [previewImage, setPreviewImage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'languages_known') {
            const languagesArray = value.split(',').map(lang => lang.trim()).filter(lang => lang !== '');
            setFormData(prev => ({
                ...prev,
                [name]: languagesArray
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            dispatch(setUploadProgress(0)); // Reset progress

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setFormData(prev => ({
                    ...prev,
                    image: base64String
                }));
                setPreviewImage(base64String);
                dispatch(setUploadProgress(100)); // Complete progress
            };

            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    dispatch(setUploadProgress(progress)); // Dispatch progress
                }
            };

            reader.onerror = () => {
                toast.error('Error reading file');
                dispatch(setUploadProgress(0));
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.first_name || !formData.email) {
            toast.error('Name and Email are required fields');
            return;
        }

        try {
            const userData = {
                ...formData,
                languages_known: Array.isArray(formData.languages_known) 
                    ? formData.languages_known 
                    : formData.languages_known.split(',').map(lang => lang.trim()).filter(lang => lang !== '')
            };

            await dispatch(addUser(userData)).unwrap();
            toast.success('User added successfully!');
            router.push('/users');
        } catch (error) {
            // Check for duplicate email error
            if (error.message.includes('duplicate key error')) {
                toast.warn('A user with this email already exists. Please use a different email.');
            } else {
                toast.error('Error adding user: ' + (error.message || 'Unknown error occurred'));
            }
        }
    };

    return (
        <div className='flex justify-center flex-col items-center'>
            <div className='mt-[100px] w-full max-w-2xl px-4'>
                <h1 className="text-3xl font-bold mb-6">Add New User</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Basic Information */}
                        <div>
                            <label htmlFor="first_name" className="block mb-1">Name:</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-1">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block mb-1">Role:</label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block mb-1">Status:</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        
                        {/* Additional Information */}
                        <div>
                            <label htmlFor="phone" className="block mb-1">Phone:</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="dob" className="block mb-1">Date of Birth:</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block mb-1">Gender:</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="blood_group" className="block mb-1">Blood Group:</label>
                            <select
                                id="blood_group"
                                name="blood_group"
                                value={formData.blood_group}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                    </div>

                    {/* Full Width Fields */}
                    <div>
                        <label htmlFor="address" className="block mb-1">Address:</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label htmlFor="languages_known" className="block mb-1">Languages Known (comma-separated):</label>
                        <input
                            type="text"
                            id="languages_known"
                            name="languages_known"
                            value={Array.isArray(formData.languages_known) ? formData.languages_known.join(', ') : ''}
                            onChange={handleInputChange}
                            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="English, Hindi, Spanish"
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-2">
                        <label htmlFor="image" className="block mb-1">Profile Image:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <UploadProgress progress={uploadProgress} />
                        )}
                        {previewImage && (
                            <div className="mt-2">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.push('/users')}
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
                        >
                            Add User
                        </button>
                    </div>
                </form>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default AddUser;