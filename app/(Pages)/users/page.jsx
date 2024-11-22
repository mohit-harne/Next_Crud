'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList, deleteUser } from '../../Redux/userThunks';
import { bulkDeleteUsers } from '../../Redux/userThunks';
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

    useEffect(() => {
        console.log('Users from Redux state:', users);
    }, [users]);

    const handleDelete = async (userId) => {
        try {
            await dispatch(deleteUser(userId)).unwrap();
            toast.success('User deleted successfully');
            setOpenDeleteModal(false); // Close the modal after successful delete
        } catch (error) {
            toast.error('Error deleting user: ' + error.message);
        }
    };

    const handleBulkDelete = async () => {
        try {
            // Dispatch the bulkDeleteUsers action and unwrap the result
            await dispatch(bulkDeleteUsers(users)).unwrap();
            
            // Show a success toast notification
            toast.success('Selected users deleted successfully');
            
            // Clear the selected users and close the modal
            setSelectedUsers([]);
            setOpenBulkDeleteModal(false); // Close bulk delete modal after successful delete
        } catch (error) {
            // Error handling: check for a custom error message or fallback to a generic one
            const errorMessage = error?.message || 'Error deleting users';
            toast.error(errorMessage);
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
        <div className="container mt-[100px] mx-auto px-4 py-6 max-w-7xl ">
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
                        <div key={user._id} className="bg-white border-3 border-yellow-500 hover:scale-[98%] hover:border-red-700 transition-all duration-300 dark:bg-gray-800  dark:border-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg">
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
                                            <span className="text-xl text-black dark:text-black">
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
                                            setUserToDelete(user); // Set the user to delete
                                            setOpenDeleteModal(true); // Open the modal
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p className="font-semibold text-black">{user.first_name} {user.last_name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Toast Notification */}
            <ToastContainer />

            {/* Delete User Modal */}
            <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <Modal.Header>Confirm Deletion</Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={() => setOpenDeleteModal(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleDelete(userToDelete?._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Delete
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Bulk Delete Modal */}
            <Modal show={openBulkDeleteModal} onClose={() => setOpenBulkDeleteModal(false)}>
                <Modal.Header>Confirm Bulk Deletion</Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the selected users?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={() => setOpenBulkDeleteModal(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBulkDelete}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Delete Selected
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UsersPage;
