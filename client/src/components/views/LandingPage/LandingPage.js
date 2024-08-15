import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import React from 'react'

function LandingPage() {
  const navigate = useNavigate(); 

  const onClickHandler = (e) => {
    axios.get('/api/users/logout')
      .then(response => {
        if (response.data.success) {
          navigate('/login'); 
        } else {
          alert('Failed to log out');
        }
      })
      .catch(error => {
        console.error('There was an error logging out!', error);
      });
  };

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <h1>LandingPage</h1>
        <button
          type="button"
          onClick={onClickHandler}
          className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default LandingPage