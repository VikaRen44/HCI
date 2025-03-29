import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const navigate = useNavigate();

  const [filterOptions, setFilterOptions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'userDetails'));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleFilterTypeChange = (e) => {
    const selectedType = e.target.value;
    setFilterType(selectedType);
    setFilterValue(''); // reset value

    // Dynamically generate unique values for the selected filter type
    const uniqueValues = [
      ...new Set(users.map((user) => user[selectedType]?.toString()))
    ];
    setFilterOptions(uniqueValues.filter((v) => v)); // remove empty/null values
  };

  const handleFilter = () => {
    if (!filterType || !filterValue) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user[filterType]?.toString().toLowerCase() === filterValue.toLowerCase()
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Registered User Details</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* 🔽 Filter Controls */}
        <div style={{ marginTop: '10px' }}>
        <select onChange={(e) => setFilterType(e.target.value)} defaultValue="">
            <option value="" disabled>Select Filter</option>
            <option value="batchYear">Batch Year</option>
            <option value="course">Course</option>
            <option value="employmentStatus">Employment Status</option>
        </select>

        {/* Show corresponding dropdown based on selected filter */}
        {filterType === 'batchYear' && (
            <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
            <option value="">Select Year</option>
            {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => {
                const year = 2000 + i;
                return <option key={year} value={year}>{year}</option>;
            })}
            </select>
        )}

        {filterType === 'course' && (
            <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
            <option value="">Select Course</option>
            <option value="BSCS">BSCS</option>
            <option value="BSIT">BSIT</option>
            <option value="BSP">BSP</option>
            <option value="BSC">BSC</option>
            <option value="BSE">BSE</option>
            </select>
        )}

        {filterType === 'employmentStatus' && (
            <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
            <option value="">Select Status</option>
            <option value="employed">Employed</option>
            <option value="unemployed">Unemployed</option>
            </select>
        )}

        <button onClick={handleFilter}>Apply Filter</button>
        </div>

      {/* 🧾 Table */}
      <table border="1" cellPadding="8" style={{ marginTop: '15px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sex</th>
            <th>Age</th>
            <th>Batch Year</th>
            <th>Course</th>
            <th>Employment</th>
            <th>Salary</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.sex}</td>
              <td>{user.age}</td>
              <td>{user.batchYear}</td>
              <td>{user.course}</td>
              <td>{user.employmentStatus}</td>
              <td>{user.salary || '-'}</td>
              <td>{user.address}</td>
              <td>{user.phone}</td>
              <td>{user.contactEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
