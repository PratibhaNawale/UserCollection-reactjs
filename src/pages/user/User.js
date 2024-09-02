import React, { useState, useEffect } from 'react';
import AddUser from '../../component/adduser/AddUser';
import Update from '../../component/updateuser/Update';
import ReactPaginate from 'react-paginate';
import SkeletonLoader from '../../component/skeleton/SkeletonLoader';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./User.css";
import DarkMode from '../../component/theme/DarkMode';
import { useTranslation } from 'react-i18next';

function App() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAddUser, setOpenAddUser] = useState(false);
    const [openEditUser, setOpenEditUser] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0); 
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [select, setSelect] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleClose = () => {
        setOpenAddUser(false);
        setOpenEditUser(false);
    };

    const fetchUsers = () => {
        setLoading(true);
        fetch(`http://localhost:5000/api/user/fetch?page=${currentPage}&limit=10&name=${searchName}&email=${searchEmail}`)
            .then(response => response.json())
            .then(data => {
                setUsers(data.users || []);
                setTotalPages(data.totalPages || 0);
                setTotalUsers(data.totalUsers || 0);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchName, searchEmail]);

    const handleDelete = (id) => {
        setUserToDelete(id);
        setShowDeletePopup(true);
    };

    const deleteCustomerRequests = () => {
        fetch(`http://localhost:5000/api/user/delete/${userToDelete}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    toast.success("User deleted successfully!", {
                        style: {
                            backgroundColor: "red",
                            color: "white",
                            height: "50px",
                        },
                    });
                    fetchUsers();
                } else {
                    toast.error("Failed to delete user.");
                }
            })
            .catch(() => {
                toast.error("Error deleting user.");
            })
            .finally(() => {
                setShowDeletePopup(false);
                setUserToDelete(null);
            });
    };

    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1;
        setCurrentPage(selectedPage);
    };

    const handleEdit = (user) => {
        setSelect(user);
        setOpenEditUser(true);
    };

    const closeDeletePopup = () => {
        setShowDeletePopup(false);
        setUserToDelete(null);
    };

    return (
        <div className='main'>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="#F5F5FC"
                toastStyle={{ color: "black" }}
            />
            <div className='main-padding'>
                <div className='d-flex'>
                    <div>
                        <b className='font16'>Your Account, Your Way</b>
                        <p className='font14'>Customize, Manage, and Optimize Your User Experience</p>
                    </div>

                    <div>
                        <input
                            className='search font14'
                            type="text"
                            placeholder="Search by name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <input
                            className='search ml-4 font14'
                            type="text"
                            placeholder="Search by email"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                        <button onClick={() => setOpenAddUser(!openAddUser)} className='add-btn ml-4 cursor'>Add User</button>
                        {openAddUser && (
                            <AddUser handleClose={handleClose} fetchUsers={fetchUsers} setOpenAddUser={setOpenAddUser} />
                        )}
                        <b className='ml-4'>Theme
                            <DarkMode></DarkMode> </b>

                    </div>


                </div>

                <div>
                    <div className="card">
                        <p className='mt-1 font14'> Total Users</p>
                        <b className='font14'> {totalUsers}</b>
                    </div>
                    {loading ? (
                        <div className="responsive-scroll-bar table-scroll-sr">
                            <table className='table mt-2'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Password</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {[...Array(10)].map((_, index) => (
                                                <SkeletonLoader key={index} />
                                            ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : error ? (
                        <p>Error loading data.</p>
                    ) : (
                        <>
                            <div className="responsive-scroll-bar table-scroll-sr">
                                <table className='table mt-2 font14'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Password</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(users) && users.length > 0 ? (
                                            users.map(user => (
                                                <tr key={user._id}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{<h3>{'.'.repeat(user.password.length)}</h3>}</td>
                                                    <td>
                                                        <i className="fa-solid fa-pen-to-square cursor" onClick={() => handleEdit(user)}></i>
                                                        <i className="fa-solid fa-trash ml-3 cursor" onClick={() => handleDelete(user._id)}></i>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <div className='text-center'>
                                                <img src='./no-data.png' className='no-data' alt='No data'></img>
                                            </div>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                pageCount={totalPages}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                            />
                        </>
                    )}
                </div>

                {openEditUser && select && (
                    <Update
                        handleClose={handleClose}
                        select={select}
                        userId={select._id}
                        fetchUsers={fetchUsers}
                        setOpenEditUser={setOpenEditUser}
                    />
                )}

                {showDeletePopup && (
                    <div className="popup-box">
                        <div className="cust-box">
                            <p className="text-center">Are you sure you want to delete this User?</p>
                            <button onClick={deleteCustomerRequests} className="cust-yes">Yes</button>
                            <button onClick={closeDeletePopup} className="cust-no">No</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default App;
