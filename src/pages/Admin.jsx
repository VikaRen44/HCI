import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);
  const navigate = useNavigate();

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
    setFilterValue('');

    const uniqueValues = [
      ...new Set(users.map((user) => user[selectedType]))
    ].filter(Boolean);

    setFilterOptions(uniqueValues);
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
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">Registered User Details</p>
        </div>
        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </div>

      <div className="admin-controls">
        <input
          className="admin-search"
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <select
          className="admin-filter-type"
          value={filterType}
          onChange={handleFilterTypeChange}
        >
          <option value="" disabled>Select Filter</option>
          <option value="batchYear">Batch Year</option>
          <option value="course">Course</option>
          <option value="employmentStatus">Employment Status</option>
        </select>

        {filterType && (
          <select
            className="admin-filter-value"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="">Select {filterType}</option>
            {filterOptions.map((value, idx) => (
              <option key={idx} value={value}>{value}</option>
            ))}
          </select>
        )}

        <button className="admin-apply-filter" onClick={handleFilter}>
          Apply Filter
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Age</th>
              <th>Batch</th>
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
    </div>
  );
}
