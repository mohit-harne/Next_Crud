'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList, selectUserList, selectLoadingStatus, selectErrorMessage } from '../../Redux/Reducer';
import '../../globals.css'

const UsersPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUserList);
  const loading = useSelector(selectLoadingStatus);
  const error = useSelector(selectErrorMessage);

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  console.log(users); // Add this to check the data

  return (
    <div className="container py-4 mt-5 pt-5 main">
      <div className=" shadow-md rounded-lg border border-gray-300">
        <div className="px-4 py-3 bg-gray-800  rounded-t-lg">
          
            <a href="/user/add" className="bg-green-500 hover:bg-green-600  px-4 py-2 rounded shadow-md">
              Add New User [+]
            </a>
          
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-center">
              <thead className="bg-gray-900 ">
                <tr>
                  <th className="py-2 px-4 border-b">Code</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Role</th>
                  <th className="py-2 px-4 border-b">Action</th>
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
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{user.id}</td>
                      <td className="py-2 px-4">{user.first_name}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">{user.phone}</td>
                      <td className="py-2 px-4">{user.role}</td>
                      <td className="py-2 px-4 space-x-2">
                       
                          <a href={`/user/edit/${user._id}`} className="bg-blue-500 hover:bg-blue-600  px-4 py-2 rounded">
                            Edit
                          </a>
                        
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 hover:bg-red-600  px-4 py-2 rounded"
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
    </div>
  );
};

export default UsersPage;
