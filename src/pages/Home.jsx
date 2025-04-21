import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; // make sure this file is updated with new classnames
import logo from '../assets/lsb logo blck.png';


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
    <div className="userform-page">
      <button className="userform-logout-button" onClick={handleLogout}>Logout</button>

      <div className="userform-container">
        <img src={logo} alt="Logo" className="home-logo" />
        <h1 className="userform-title">User Profile Form</h1>

        <form className="userform-form" onSubmit={handleSubmit}>
          {/* First Name + Last Name */}
          <div className="userform-row">
            <div>
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} />
            </div>
            <div>
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} />
            </div>
          </div>

          {/* Sex + Age */}
          <div className="userform-row">
            <div>
              <label>Sex</label>
              <select name="sex" value={form.sex} onChange={handleChange}>
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label>Age</label>
              <input name="age" type="number" value={form.age} onChange={handleChange} />
            </div>
          </div>

          {/* Batch Year + Course */}
          <div className="userform-row">
            <div>
              <label>Batch Year</label>
              <select name="batchYear" value={form.batchYear} onChange={handleChange}>
                <option value="">Select Batch Year</option>
                {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => {
                  const year = 2000 + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
            <div>
              <label>Course</label>
              <select name="course" value={form.course} onChange={handleChange}>
                <option value="">Select Course</option>
                <option value="BSCS">BSCS</option>
                <option value="BSIT">BSIT</option>
                <option value="BSE">BSA</option>
                <option value="BSBA">BSBA</option>
                <option value="BSCA">BSCA</option>
                <option value="BSCOE">BSCOE</option>
                <option value="BSEE">BSEE</option>
                <option value="BSECE">BSECE</option>
                <option value="BSIE">BSIE</option>
                <option value="BSHRM">BSHRM</option>
                <option value="BSTRM">BSTRM</option>
                <option value="BSCRIM">BSCRIM</option>
                <option value="BSPSY">BSPSY</option>
                <option value="ACT">ACT</option>
                <option value="TESDA THRO">TESDA THRO</option>
                <option value="TESDA Caregiving">TESDA Caregiving</option>
                <option value="TESDA Health Care Services">TESDA Health Care Services</option>
                <option value="HUMSSS">HUMSSS</option>
                <option value="ABM">ABM</option>
                <option value="STEM">STEM</option>
              </select>
            </div>
          </div>

          {/* Employment Status */}
          <label>Employment Status</label>
          <select name="employmentStatus" value={form.employmentStatus} onChange={handleChange}>
            <option value="">Employment Status</option>
            <option value="employed">Employed</option>
            <option value="unemployed">Unemployed</option>
          </select>

          {form.employmentStatus === 'employed' && (
            <>
              <label>Salary</label>
              <input name="salary" value={form.salary} onChange={handleChange} />
            </>
          )}

          <label>Current Address</label>
          <input name="address" value={form.address} onChange={handleChange} />

          <label>Phone Number</label>
          <input name="phone" value={form.phone} onChange={handleChange} />

          <label>Contact Email</label>
          <input name="contactEmail" value={form.contactEmail} onChange={handleChange} />

          <button type="submit" className="userform-submit-button">
            {isExisting ? 'Update' : 'Submit'}
          </button>
        </form>

        <p className="userform-note">Your information will be kept confidential and will only be used for research purposes.</p>
      </div>
    </div>
  );
}
