import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const Dashboard = ({ token }) => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [branch, setBranch] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        branch: '',
        amount_paid: '',
        top_up: '',
        balance: '',
        nationality_number: '',
        phone_number: '',
        status: '',
        date_amount_paid_updated: '',
        date_top_up_updated: '',
        date_balance_updated: '',
    });

    // Decode the token and extract the role and branch
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.sub && decodedToken.sub.role?.toLowerCase();
                const assignedBranch = decodedToken.sub && decodedToken.sub.branch_name?.toLowerCase();

                if (role) {
                    setUserRole(role);
                    setBranch(assignedBranch || null);
                } else {
                    console.error("Role not found in the token");
                    setUserRole(null);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                setUserRole(null);
            }
        }
    }, [token]);

    // Fetch students data if the user is CEO or Branch CEO
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const url = userRole === 'ceo'
                    ? 'https://lifestyle.boogiecoin.com/students/all'
                    : `https://lifestyle.boogiecoin.com/students/branch?branch=${branch}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error("Response:", text);
                    throw new Error('Error fetching students data');
                }

                const data = await response.json();
                setStudents(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (userRole === 'ceo' || (userRole === 'branch ceo' && branch)) {
            fetchStudents();
        }
    }, [token, userRole, branch]);

    // Handle edit button click
    const handleEditClick = (student) => {
        setEditingId(student.id);
        setFormData({
            name: student.name,
            email: student.email,
            branch: student.branch,
            amount_paid: student.amount_paid,
            top_up: student.top_up,
            balance: student.balance,
            nationality_number: student.nationality_number,
            phone_number: student.phone_number || '',
            status: student.status,
            date_amount_paid_updated: student.date_amount_paid_updated || '',
            date_top_up_updated: student.date_top_up_updated || '',
            date_balance_updated: student.date_balance_updated || '',
        });
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle save button click
    const handleSaveClick = async (studentId) => {
        try {
            const response = await fetch(`https://lifestyle.boogiecoin.com/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error updating student info');
            }

            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === studentId
                        ? { ...student, ...formData }
                        : student
                )
            );

            setEditingId(null);
            alert("Student updated successfully!");
        } catch (error) {
            setError(error.message);
        }
    };

    // Handle delete button click
    const handleDeleteClick = async (studentId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this student?');

        if (!isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`https://lifestyle.boogiecoin.com/students/${studentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error deleting student');
            }

            setStudents((prevStudents) =>
                prevStudents.filter((student) => student.id !== studentId)
            );

            alert("Student deleted successfully!");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>{userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard` : 'Dashboard'}</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {loading ? <p>Loading students...</p> : null}

            {userRole === 'ceo' || userRole === 'branch ceo' ? (
                <div>
                    <h3> Students</h3>
                    <div className="table-container">
                        <table className="student-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Branch</th>
                                    <th>ID Number</th>
                                    <th>Contact</th>
                                    <th>Registration Fee Paid</th>
                                    <th>Date Registration Fee Paid Updated</th>
                                    <th>Top-Up</th>
                                    <th>Date Top-Up Updated</th>
                                    <th>Clearance</th>
                                    <th>Date Clearance Updated</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map((student) => (
                                        <tr key={student.id}>
                                            <td>{editingId === student.id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                student.name
                                            )}
                                            </td>
                                            <td>{editingId === student.id ? (
                                                <input
                                                    type="text"
                                                    name="branch"
                                                    value={formData.branch}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                student.branch
                                            )}
                                            </td>
                                            <td>{student.nationality_number}</td>
                                            <td>{editingId === student.id ? (
                                                <input
                                                    type="text"
                                                    name="phone_number"
                                                    value={formData.phone_number}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                student.phone_number
                                            )}
                                            </td>
                                            <td>{editingId === student.id ? (
                                                <input
                                                    type="number"
                                                    name="amount_paid"
                                                    value={formData.amount_paid}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                student.amount_paid
                                            )}
                                            </td>
                                            <td>{editingId === student.id ? (
                                                <input
                                                    type="date"
                                                    name="date_amount_paid_updated"
                                                    value={formData.date_amount_paid_updated || ''}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                student.date_amount_paid_updated ? student.date_amount_paid_updated : 'N/A'
                                            )}
                                            </td>
                                            <td>{editingId === student.id ? (
                                                <input
                                                    type="number"
                                                    name="top_up"
                                                    value={formData.top_up}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                student.top_up
                                            )}
                                            </td>
                                            <td>{editingId === student.id ? (
                                                <input
                                                    type="date"
                                                    name="date_top_up_updated"
                                                    value={formData.date_top_up_updated || ''}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                student.date_top_up_updated ? student.date_top_up_updated : 'N/A'
                                            )}
                                            </td>
                                            <td>{editingId === student.id ? (
                                                <input
                                                    type="text"
                                                    name="balance"
                                                    value={formData.balance}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                student.balance
                                            )}
                                            </td>
                                            <td>{editingId === student.id ? (
                                                <input
                                                    type="date"
                                                    name="date_balance_updated"
                                                    value={formData.date_balance_updated || ''}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                student.date_balance_updated ? student.date_balance_updated : 'N/A'
                                            )}
                                            </td>
                                            <td>{editingId === student.id ? (
                                                <input
                                                    type="text"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                student.status
                                            )}
                                            </td>
                                            <td>
                                                {editingId === student.id ? (
                                                    <>
                                                        <button onClick={() => handleSaveClick(student.id)}>Save</button>
                                                        <button onClick={() => setEditingId(null)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleEditClick(student)}>Edit</button>
                                                        <button onClick={() => handleDeleteClick(student.id)}>Delete</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12">No students found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>You do not have access to view students.</p>
            )}
        </div>
    );
};

export default Dashboard;
