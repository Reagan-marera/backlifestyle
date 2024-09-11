import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import for jwt-decode

const Dashboard = ({ token }) => {
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState(null); // For student-specific data
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    amount_paid: '',
    top_up: '',
    balance: '',
    nationality_number: '',
    phone_number: '',  // Added phone number
    status: '',
    date_amount_paid_updated: '',
    date_top_up_updated: '',
    date_balance_updated: '',
  });

  // Decode the token and extract the role
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const role = decodedToken.sub && decodedToken.sub.role.toLowerCase();
        if (role) {
          setUserRole(role);
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

  // Fetch students data if the user is CEO
  useEffect(() => {
    if (userRole === 'ceo') {
      const fetchStudents = async () => {
        try {
          const response = await fetch('http://localhost:5000/students', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Please logout and login again');
          }

          const data = await response.json();
          setStudents(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchStudents();
    }
  }, [token, userRole]);

  // Fetch student data if the user is a student
  useEffect(() => {
    if (userRole === 'student') {
      const fetchStudentData = async () => {
        try {
          const response = await fetch('http://localhost:5000/student', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Please logout and login again');
          }

          const data = await response.json();
          setStudentData(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchStudentData();
    }
  }, [token, userRole]);

  // Handle edit button click to start editing
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
      phone_number: student.phone_number || '', // Handle phone number
      status: student.status,
      date_amount_paid_updated: student.date_amount_paid_updated || '',
      date_top_up_updated: student.date_top_up_updated || '',
      date_balance_updated: student.date_balance_updated || '',
    });
  };

  // Handle input changes for the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle save button click to update the student info
  const handleSaveClick = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/students/${studentId}`, {
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

      // Update the student list with the new data
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId
            ? { ...student, ...formData }
            : student
        )
      );

      setEditingId(null); // Exit edit mode
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle delete button click to delete a student
const handleDeleteClick = async (studentId) => {
  // Confirm deletion
  const isConfirmed = window.confirm('Are you sure you want to delete this student?');

  if (!isConfirmed) {
    return; // Exit if the user cancels
  }

  try {
    const response = await fetch(`http://localhost:5000/students/${studentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error deleting student');
    }

    // Remove the student from the list
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== studentId)
    );
  } catch (error) {
    setError(error.message);
  }
};


  return (
    <div>
      <h1>{userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard` : 'Dashboard'}</h1>

      {userRole === 'ceo' ? (
        <div>
          <h3>All Students</h3>
          {error && <p>Error: {error}</p>}

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
                      )}</td>
                    <td>{editingId === student.id ? (
                        <input
                          type="text"
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                        />
                      ) : (
                        student.branch
                      )}</td>
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
                      )}</td>
                    <td>{editingId === student.id ? (
                        <input
                          type="number"
                          name="amount_paid"
                          value={formData.amount_paid}
                          onChange={handleInputChange}
                        />
                      ) : (
                        student.amount_paid
                      )}</td>
                    <td>{editingId === student.id ? (
                        <input
                          type="date"
                          name="date_amount_paid_updated"
                          value={formData.date_amount_paid_updated}
                          onChange={handleInputChange}
                        />
                      ) : (
                        student.date_amount_paid_updated
                      )}</td>
                    <td>{editingId === student.id ? (
                        <input
                          type="number"
                          name="top_up"
                          value={formData.top_up}
                          onChange={handleInputChange}
                        />
                      ) : (
                        student.top_up
                      )}</td>
                    <td>{editingId === student.id ? (
                        <input
                          type="date"
                          name="date_top_up_updated"
                          value={formData.date_top_up_updated}
                          onChange={handleInputChange}
                        />
                      ) : (
                        student.date_top_up_updated
                      )}</td>
                    <td>{editingId === student.id ? (
                        <input
                          type="text"
                          name="balance"
                          value={formData.balance}
                          onChange={handleInputChange}
                        />
                      ) : (
                        student.balance
                      )}</td>
                    <td>{editingId === student.id ? (
                        <input
                          type="date"
                          name="date_balance_updated"
                          value={formData.date_balance_updated}
                          onChange={handleInputChange}
                        />
                      ) : (
                        student.date_balance_updated
                      )}</td>
                    <td>{editingId === student.id ? (
                        <input
                          type="text"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        />
                      ) : (
                        student.status
                      )}</td>
                    <td>
                      {editingId === student.id ? (
                        <>
                          <button onClick={() => handleSaveClick(student.id)}>Save</button>
                          <button onClick={() => setEditingId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className='button-edit 'onClick={() => handleEditClick(student)}>Edit</button>
                          <button className='button-delete'onClick={() => handleDeleteClick(student.id)}>Delete</button>
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
      ) : userRole === 'student' ? (
        <div>
          {error && <p>Error: {error}</p>}
          <h3>My Details</h3>
          {studentData ? (
            <table className="student-table">
              <tbody>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>{studentData.name}</td>
                </tr>
                <tr>
                  <td><strong>Branch:</strong></td>
                  <td>{studentData.branch}</td>
                </tr>
                <tr>
                  <td><strong>Amount Paid:</strong></td>
                  <td>{studentData.amount_paid}</td>
                </tr>
                <tr>
                  <td><strong>Remaining Balance:</strong></td>
                  <td>{studentData.balance}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>Loading student data...</p>
          )}
        </div>
      ) : (
        <p>Unauthorized: Invalid role</p>
      )}
    </div>
  );
};

export default Dashboard;
