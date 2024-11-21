'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList, deleteUser, bulkDeleteUsers } from '../../Redux/userThunks';
import { selectUserList, selectLoadingStatus } from '../../Redux/userSlice';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import UploadProgress from '../../components/UploadProgress';
import { Modal } from 'flowbite-react'; // Ensure this is the correct import
import 'react-toastify/dist/ReactToastify.css';

const UsersPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);
    const loading = useSelector(selectLoadingStatus);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(fetchUserList());
    }, [dispatch]);

    const handleDelete = async (userId) => {
        try {
            await dispatch(deleteUser(userId)).unwrap();
            toast.success('User deleted successfully');
            setOpenDeleteModal(false);
        } catch (error) {
            toast.error('Error deleting user: ' + error.message);
        }
    };

    const handleBulkDelete = async () => {
        try {
            await dispatch(bulkDeleteUsers(selectedUsers)).unwrap();
            toast.success('Selected users deleted successfully');
            setSelectedUsers([]);
            setOpenBulkDeleteModal(false);
        } catch (error) {
            toast.error('Error deleting users: ' + error.message);
        }
    };

    const handleCheckboxChange = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <div className="container mt-[100px] mx-auto px-4 py-6 max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Users List</h1>
                <button
                    onClick={() => router.push('/add')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg 
                             flex items-center gap-2 transition-all duration-300 shadow-md w-full sm:w-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New User
                </button>
            </div>

            {/* Bulk Delete Button */}
            {selectedUsers.length > 0 && (
                <div className="mb-4">
                    <button
                        onClick={() => setOpenBulkDeleteModal(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg 
                                 flex items-center gap-2 transition-all duration-300 w-full sm:w-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Selected ({selectedUsers.length})
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="w-full max-w-md">
                        <UploadProgress isLoading={true} message="Loading users..." />
                    </div>
                </div>
            ) : (
                /* Users Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(user => (
                        <div key={user._id} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user._id)}
                                        onChange={() => handleCheckboxChange(user._id)}
                                        className="w-4 h-4"
                                    />
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.first_name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-xl text-gray-500">
                                                {user.first_name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/details/${user._id}`)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => router.push(`/edit/${user._id}`)}
                                        className="text-yellow-500 hover:text-yellow-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setUserToDelete(user);
                                            setOpenDeleteModal(true);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{user.first_name || 'N/A'}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email || 'N/A'}</p>
                                <p className="text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.status || 'N/A'}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.role || 'N/A'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Modal */}
            <Modal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                title="Delete User"
            >
                <div className="p-6">
                    <p>Are you sure you want to delete {userToDelete?.first_name}?</p>
                    <div className="mt-4 flex justify-end gap-4">
                        <button
                            onClick={() => setOpenDeleteModal(false)}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleDelete(userToDelete?._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Bulk Delete Modal */}
            <Modal
                isOpen={openBulkDeleteModal}
                onClose={() => setOpenBulkDeleteModal(false)}
                title="Delete Selected Users"
            >
                <div className="p-6">
                    <p>Are you sure you want to delete {selectedUsers.length} users?</p>
                    <div className="mt-4 flex justify-end gap-4">
                        <button
                            onClick={() => setOpenBulkDeleteModal(false)}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Delete All
                        </button>
                    </div>
                </div>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default UsersPage;