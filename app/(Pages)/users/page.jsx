'use client';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList, selectUserList, deleteUser, selectLoadingStatus, selectErrorMessage } from '../../Redux/Reducer';
import '../../globals.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { Modal } from 'flowbite-react';
import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { columns } from "./data";
import { useRouter } from 'next/navigation'; // Correct import for App Router

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

    useEffect(() => {
        dispatch(fetchUserList());
    }, [dispatch]);

    const handleDelete = () => {
        if (!selectedUserId) {
            console.error("User ID is missing!");
            toast.error("User ID is missing!");
            return;
        }
    
        dispatch(deleteUser(selectedUserId))
            .then(() => {
                toast.success("User deleted successfully!");
                // Fetch updated list
                dispatch(fetchUserList())
                    .then(() => {
                        console.log("Updated user list:", users); // Check if users are updated
                        setOpenModal(false); // Close modal
                    })
                    .catch((error) => {
                        console.error("Error fetching users:", error);
                    });
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user. Please try again.");
            });
    };
    

    const router = useRouter();
    

    const openDeleteModal = (userId, userName) => {
        setSelectedUserId(userId);
        setSelectedUserName(userName);
        setOpenModal(true); // Open modal
    };

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "name":
                return (<div className='flex items-center gap-6'>
                    <img src={user.image} alt='M' className='size-14 rounded-full' />
                    <div>
                        <h1 className='text-xl font-bold tracking-wide'>{user.first_name}</h1>
                        <h3 className='text-sm'>{user.email}</h3>
                    </div>                  
</div>

                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{user.role}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize p-3" color={statusColorMap[user.status]} size="sm" variant="flat">
                        {user.status}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-4">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon />
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <Link href={`/edit/${user._id}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon />
                            </Link>
                        </Tooltip>
                        <Tooltip className='px-1' color="danger" content="Delete user">
                            <span onClick={() => openDeleteModal(user._id, user.first_name)}
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                            >
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
      <div className="py-4 pt-5 main">
        <div className="shadow-md rounded-lg border border-gray-300">
            <div className="px-4 py-3 bg-gray-800 rounded-t-lg">
                <Link href="#" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded shadow-md">
                    Add New User [+]
                </Link>
            </div>
            <div className="p-4" style={{ minHeight: '400px' }}>
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500">Error: {error}</div>
                ) : (
                    <Table aria-label="User Table" className="overflow-x-auto">
                        <TableHeader>
                            {columns.map((column) => (
                                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className='text-left tracking-widest text-xl'>
                                    {column.name}
                                </TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
      
        <Modal
    className="w-1/2 mx-auto my-auto h-fit bg-transparent"
    
    show={openModal}
    position="center"
    onClose={() => setOpenModal(false)}
>
    <Modal.Header className="text-black text-center">Confirm Delete</Modal.Header>
    <Modal.Body className="text-black text-center">
        Are you sure you want to delete profile of <span className='font-bold'>{selectedUserName}</span> ?
    </Modal.Body>
    <Modal.Footer className="flex justify-center gap-8">
        <button onClick={handleDelete} className="bg-red-500 py-2 px-4 rounded-2xl shadow-lg text-white hover:scale-105 transition-all duration-300">Delete</button>
        <button
            color="gray"
            onClick={() => setOpenModal(false)}
            className="text-black py-2 px-4 rounded-2xl border-2 border-green-500 hover:scale-105 transition-all duration-300 shadow-lg"
        >
            Cancel
        </button>
    </Modal.Footer>
</Modal>


       </div>
     
    );
};

export default UsersPage;
