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
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { columns } from "./data"; // Assuming column structure is predefined here

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const UsersPage = () => {
    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={user.first_name}
                    >
                        {user.email}
                    </User>
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
                        Active
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2 ">
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
                        <Tooltip color="danger" content="Delete user">
                            <span
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => confirmDelete(user)}
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

    const dispatch = useDispatch();
    const users = useSelector(selectUserList); // Data from Redux
    const loading = useSelector(selectLoadingStatus);
    const error = useSelector(selectErrorMessage);

    // Modal and selected user state
    const [openModal, setOpenModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState('');

    useEffect(() => {
        dispatch(fetchUserList());
    }, [dispatch]);

    const confirmDelete = (user) => {
        setSelectedUserId(user._id);
        setSelectedUserName(user.first_name);
        setOpenModal(true);
    };

    const handleDelete = () => {
        dispatch(deleteUser(selectedUserId))
            .then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    toast.success(`User ${selectedUserName} deleted successfully!`, {
                        position: 'top-right',
                    });
                    setOpenModal(false);
                }
            })
            .catch((error) => {
                toast.error('Error deleting user!', {
                    position: 'top-right',
                });
                setOpenModal(false);
            });
    };

    return (
        <div className="py-4 pt-5 main">
  <div className="shadow-md rounded-lg border border-gray-300">
    <div className="px-4 py-3 bg-gray-800 rounded-t-lg">
      <Link href="/user/add" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded shadow-md">
        Add New User [+]
      </Link>
    </div>
    
    {/* Add min-height to the table container */}
    <div className="p-4" style={{ minHeight: '400px' }}>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">Error: {error}</div>
      ) : (
        <Table aria-label="Example table with custom cells" className="overflow-x-auto">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className='text-left tracking-widest text-xl'>
                {column.name}
              </TableColumn>
            ))}
          </TableHeader>
          
          {/* Apply overflow to the table body */}
          <TableBody className="overflow-y-auto" style={{ maxHeight: '300px' }}>
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
  
  {/* Delete Confirmation Modal */}
  <Modal
    className="bg-gray-300 bg-opacity-0 backdrop-blur-md pt-[200px] transition-all ease-out duration-300 transform animate-popup"
    show={openModal}
    size="2xl"
    onClose={() => setOpenModal(false)}
    popup
  >
    <Modal.Header />
    <Modal.Body>
      <div className="text-center bg-gray-100 py-3">
        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
        <h3 className="mb-5 text-lg font-normal text-gray-500">
          Are you sure you want to delete user <span className="text-green-600">{selectedUserName}</span>?
        </h3>
        <div className="flex justify-center gap-4">
          <Button className='text-red-600' color="red" onClick={handleDelete}>
            Yes I am sure
          </Button>
          <Button className='text-black' color="gray" onClick={() => setOpenModal(false)}>
            No cancel
          </Button>
        </div>
      </div>
    </Modal.Body>
  </Modal>

  <ToastContainer />
</div>

    );
};

export default UsersPage;
