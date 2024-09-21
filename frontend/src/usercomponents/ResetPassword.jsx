import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();
   const { id, token } = useParams();

   const serverURL = 'http://localhost:5550';

   // axios.defaults.withCredentials = true;

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!password) {
         setError('Password cannot be empty');
         return;
      }
      axios.put(`${serverURL}/api/users/resetpassword/${id}/${token}`, { password })
         .then(response => {
            console.log("response",response);
            
            if (response.data.Status === "Success") {
               console.log("Password reset successfully");
               alert("Password reset is successful")
               navigate('/'); // Redirect to login or another page
            } else {
               setError(response.data.message || 'An error occurred');
            }
         })
         .catch(error => {
            console.error('Error during password reset:', error);
            setError('An error occurred while resetting the password');
         });
   };
   

   return (
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
         <div className="bg-white p-3 rounded w-25">
            <h4>Reset Password</h4>
            <form onSubmit={handleSubmit}>
               <div className="mb-3">
                  <label htmlFor="password">
                     <strong>New Password</strong>
                  </label>
                  <input
                     type="password"
                     placeholder="Enter Password"
                     autoComplete="off"
                     name="password"
                     className="form-control rounded-0"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </div>
               {error && <div className="alert alert-danger">{error}</div>}
               <button type="submit" className="btn btn-success w-100 rounded-0">
                  Update
               </button>
            </form>
         </div>
      </div>
   );
}

export default ResetPassword;
