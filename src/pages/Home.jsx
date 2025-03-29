import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    age: '',
    batchYear: '',
    course: '',
    employmentStatus: '',
    salary: '',
    address: '',
    phone: '',
    contactEmail: ''
  });

  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'userDetails', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setForm(docSnap.data());
          setIsExisting(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, 'userDetails', user.uid), {
        ...form,
        uid: user.uid,
        email: user.email
      });

      alert(isExisting ? 'Details updated!' : 'Details submitted successfully!');
      setIsExisting(true);
    } catch (error) {
      alert('Error submitting form: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>User Form</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name</label><br />
        <input name="firstName" value={form.firstName} onChange={handleChange} /><br />

        <label>Last Name</label><br />
        <input name="lastName" value={form.lastName} onChange={handleChange} /><br />

        <label>Sex</label><br />
        <select name="sex" value={form.sex} onChange={handleChange}>
          <option value="">Select Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select><br />

        <label>Age</label><br />
        <input name="age" type="number" value={form.age} onChange={handleChange} /><br />

        <label>Batch Year</label><br />
        <select name="batchYear" value={form.batchYear} onChange={handleChange}>
          <option value="">Select Batch Year</option>
          {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => {
            const year = 2000 + i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select><br />

        <label>Course</label><br />
        <select name="course" value={form.course} onChange={handleChange}>
          <option value="">Select Course</option>
          <option value="BSCS">BSCS</option>
          <option value="BSIT">BSIT</option>
          <option value="BSP">BSP</option>
          <option value="BSC">BSC</option>
          <option value="BSE">BSE</option>
        </select><br />

        <label>Employment Status</label><br />
        <select name="employmentStatus" value={form.employmentStatus} onChange={handleChange}>
          <option value="">Employment Status</option>
          <option value="employed">Employed</option>
          <option value="unemployed">Unemployed</option>
        </select><br />

        {form.employmentStatus === 'employed' && (
          <>
            <label>Salary</label><br />
            <input name="salary" value={form.salary} onChange={handleChange} /><br />
          </>
        )}

        <label>Current Address</label><br />
        <input name="address" value={form.address} onChange={handleChange} /><br />

        <label>Phone Number</label><br />
        <input name="phone" value={form.phone} onChange={handleChange} /><br />

        <label>Contact Email</label><br />
        <input name="contactEmail" value={form.contactEmail} onChange={handleChange} /><br />

        <button type="submit">{isExisting ? 'Update' : 'Submit'}</button>
      </form>
    </div>
  );
}
