'use client';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList, deleteUser } from '../../Redux/userThunks';
import { selectUserList, selectLoadingStatus, selectErrorMessage } from '../../Redux/userSlice';
import '../../globals.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { Modal } from 'flowbite-react';
import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { columns } from "./data";
import { useRouter } from 'next/navigation';
import { BarLoader } from 'react-spinners';

const statusColorMap = {
    Active: "success",
    Inactive: "danger",
    vacation: "warning",
};

const UsersPage = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);
    const loading = useSelector(selectLoadingStatus);
    const error = useSelector(selectErrorMessage);
    const [openModal, setOpenModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [reload, setReload] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchUserList())
            .then((response) => {
                console.log("Fetched users:", response.payload);
            })
            .catch((error) => console.error("Error fetching users:", error));
    }, [dispatch, reload]);

    const handleDelete = async () => {
        if (!selectedUserId) {
            toast.error("User ID is missing!");
            return;
        }
    
        try {
            await dispatch(deleteUser(selectedUserId));
            dispatch(fetchUserList());
            toast.success("User deleted successfully!");
            setReload(prev => !prev);
            setOpenModal(false);
            setSelectedUserId(null);
            setSelectedUserName('');
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user. Please try again.");
        }
    };

    const handleBulkDelete = async () => {
        try {
            for (const userId of selectedUsers) {
                await dispatch(deleteUser(userId));
            }
            dispatch(fetchUserList());
            toast.success("Users deleted successfully!");
            setSelectedUsers([]);
            setOpenBulkDeleteModal(false);
            setReload(prev => !prev);
        } catch (error) {
            console.error("Error deleting users:", error);
            toast.error("Failed to delete users. Please try again.");
        }
    };

    const openDeleteModal = (userId, userName) => {
        setSelectedUserId(userId);
        setSelectedUserName(userName);
        setOpenModal(true);
    };

    const toggleSelectUser = (userId) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "name":
                return (
                    <div className='flex items-center gap-6 hover:scale-105 transition-all duration-250'>
                        <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => toggleSelectUser(user._id)}
                            className="mr-4"
                        />
                        {user.image ? (
                            <img 
                                src={user.image}
                                alt={`${user.first_name}'s profile`}
                                className='size-14 rounded-full object-cover'
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'fallback-avatar.png'; // You can add a fallback image
                                }}
                            />
                        ) : (
                            <div className='size-14 rounded-full bg-gray-200 flex items-center justify-center'>
                                <span className='text-gray-500 text-xl'>
                                    {user.first_name?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div>
                            <h1 className='text-xl font-bold tracking-wide'>{user.first_name}</h1>
                            <h3 className='text-sm'>{user.email}</h3>
                        </div>
                    </div>
                );
            case "role":
                return (
                    <div className="flex flex-col hover:scale-105 transition-all duration-250">
                        <p className="text-bold text-sm capitalize">{user.role}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize p-3 hover:scale-105 transition-all duration-250" 
                          color={statusColorMap[user.status]} 
                          size="sm" 
                          variant="flat">
                        {user.status}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-4">
                        <Tooltip content="Details">
                            <button
                                onClick={() => router.push(`/details/${user._id}`)}
                                className="text-lg text-default-400 cursor-pointer active:opacity-50 hover:scale-105 transition-all duration-250">
                                <EyeIcon className="size-[30px]"/>
                            </button>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <Link href={`/edit/${user._id}`} 
                                  className="text-lg text-default-400 cursor-pointer active:opacity-50 hover:scale-105 transition-all duration-250">
                                <EditIcon className="size-[30px]" />
                            </Link>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user" className='px-2'>
                            <span onClick={() => openDeleteModal(user._id, user.first_name)}
                                  className="text-lg text-danger cursor-pointer active:opacity-50 hover:scale-105 transition-all duration-250">
                                <DeleteIcon className="size-[30px]"/>
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [router, selectedUsers]);

    return (
        <div className="py-4 pt-5 main">
            <div className="shadow-md rounded-lg border border-gray-300">
                <div className="px-4 py-3 bg-gray-800 rounded-t-lg">
                    <Link href="/add" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded shadow-md">
                        Add New User [+]
                    </Link>
                    {selectedUsers.length > 0 && (
                        <button
                            onClick={() => setOpenBulkDeleteModal(true)}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow-md text-white ml-4"
                        >
                            Delete Selected Users
                        </button>
                    )}
                </div>
                <div className="p-4" style={{ minHeight: '400px' }}>
                    {loading ? (
                        <div className='flex item-center justify-center mt-[100px]'>
                            <BarLoader color="#4bf003" height={8} width={200} />
                        </div>
                    ) : error ? (
                        <div className="text-center py-4 text-red-500">Error: {error}</div>
                    ) : (
                        <Table aria-label="User Table" className="overflow-x-auto transition-all duration-400">
                            <TableHeader>
                                {columns.map((column) => (
                                    <TableColumn 
                                        key={column.uid} 
                                        align={column.uid === "actions" ? "center" : "start"}
                                        className='text-left tracking-widest text-xl'>
                                        {column.name}
                                    </TableColumn>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        {columns.map((column) => (
                                            <TableCell key={column.uid}>
                                                {renderCell(user, column.uid)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
            
            <ToastContainer className="z-50 mt-[100px]" />
            
            {/* Bulk Delete Modal */}
            <Modal
                className="w-1/2 mx-auto my-auto h-fit"
                show={openBulkDeleteModal}
                position="center"
                onClose={() => setOpenBulkDeleteModal(false)}
            >
                <div className='bg-gray-600 rounded-xl border-4 border-yellow-500'>
                    <Modal.Header className="text-white text-center">
                        Confirm Bulk Delete
                    </Modal.Header>
                    <Modal.Body className="text-white text-center">
                        Are you sure you want to delete the selected users?
                    </Modal.Body>
                    <Modal.Footer className="flex justify-center gap-8">
                        <button onClick={handleBulkDelete} 
                                className="bg-red-600 px-4 py-2 rounded text-white">
                            Yes, Delete
                        </button>
                        <button onClick={() => setOpenBulkDeleteModal(false)} 
                                className="bg-gray-300 px-4 py-2 rounded text-black">
                            Cancel
                        </button>
                    </Modal.Footer>
                </div>
            </Modal>
            
            {/* Single Delete Modal */}
            <Modal
                show={openModal}
                size="sm"
                onClose={() => setOpenModal(false)}
                className="w-1/2 mx-auto my-auto h-fit"
            >
                <div className='bg-gray-600 rounded-xl border-4 border-yellow-500'>
                    <Modal.Header className='text-white'>
                        Are you sure you want to delete this user?
                    </Modal.Header>
                    <Modal.Body className='text-white'>
                        <h1 className='text-2xl tracking-wider'>{selectedUserName}</h1>
                    </Modal.Body>
                    <Modal.Footer className="flex justify-center gap-8">
                        <button
                            onClick={handleDelete}
                            className="text-white bg-red-500 hover:bg-red-700 rounded px-4 py-2"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setOpenModal(false)}
                            className="bg-gray-300 text-black rounded px-4 py-2"
                        >
                            Cancel
                        </button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

export default UsersPage;