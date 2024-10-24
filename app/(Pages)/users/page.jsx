'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUserList,
    deleteUser,
    selectUserList,
    selectLoadingStatus,
    selectErrorMessage,
} from '../../Redux/Reducer';
import '../../globals.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link'; // Import Link from next/link
import { Button, Modal } from 'flowbite-react'; // Import Modal from flowbite-react
import { HiOutlineExclamationCircle } from 'react-icons/hi'; // Import icon

const UsersPage = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);
    const loading = useSelector(selectLoadingStatus);
    const error = useSelector(selectErrorMessage);

    // State for controlling the modal
    const [openModal, setOpenModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null); // State to store user ID for deletion
    const [selectedUserName, setSelectedUserName] = useState(''); // State to store username for deletion

    useEffect(() => {
        dispatch(fetchUserList());
    }, [dispatch]);

    // Function to open the modal and set the selected user ID and name
    const confirmDelete = (user) => {
        setSelectedUserId(user._id);
        setSelectedUserName(user.first_name); // Assuming you want to show the first name
        setOpenModal(true);
    };

    // Function to handle the delete action
    const handleDelete = () => {
        dispatch(deleteUser(selectedUserId))
            .then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    toast.success(`User ${selectedUserName} deleted successfully!`, {
                        position: 'top-right',
                    });
                    setOpenModal(false); // Close the modal after successful delete
                }
            })
            .catch((error) => {
                toast.error('Error deleting user!', {
                    position: 'top-right',
                });
                setOpenModal(false); // Close the modal in case of error
            });
    };

    return (
        <div className="container-fluid py-4 lg:pt-5 main">
            <div className="shadow-md rounded-lg border border-gray-300">
                <div className="px-4 py-3 bg-gray-800 rounded-t-lg">
                    <Link href="/user/add" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded shadow-md">
                        Add New User [+]
                    </Link>
                </div>
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-center">
                            <thead>
                                <tr>
                                    <th className="py-2 px-2 border-b">Code</th>
                                    <th className="py-2 px-2 border-b">Name</th>
                                    <th className="py-2 px-2 border-b">Email</th>
                                    <th className="py-2 px-2 border-b">Phone</th>
                                    <th className="py-2 px-2 border-b">Role</th>
                                    <th className="py-2 px-2 border-b">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-4">Loading...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="6" className="py-4">Error: {error}</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id} className="border-b hover:bg-gray-500/20">
                                            <td className="py-2 px-2">{user.id}</td>
                                            <td className="py-2 px-2">{user.first_name}</td>
                                            <td className="py-2 px-2">{user.email}</td>
                                            <td className="py-2 px-2">{user.phone}</td>
                                            <td className="py-2 px-2">{user.role}</td>
                                            <td className="py-2 px-2 space-x-2">
                                                <Link href={`/edit/${user._id}`} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(user)} // Trigger modal on delete button click
                                                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal for delete confirmation */}
            <div className='h-screen w-screen flex items-center justify-center'>
                <Modal className='w-full  rounded shadow-md' show={openModal} size="2xl" onClose={() => setOpenModal(false)} popup>
                    <Modal.Header />
                    <Modal.Body className='flex flex-col items-center justify-center'>
                        <div className="text-center bg-white">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-red-400">
                                Are you sure you want to delete the user <span className='text-green-600 underline '>{selectedUserName}</span> ?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button className='text-red-700' color="red" onClick={handleDelete}>
                                    {"Yes, I'm sure"}
                                </Button>
                                <Button className='text-black' color="gray" onClick={() => setOpenModal(false)}>
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>

            <ToastContainer />
        </div>
    );
};

export default UsersPage;
