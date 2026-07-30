import React, { useState } from 'react';
import UserServices from './UserServices'; // Make sure UserServices is in the same folder

function UserDashboard({ userId }) {
  const [user, setUser] = useState({ name: 'John Doe' }); // Replace with real user data

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4">Welcome, {user.name}!</h1>
        <p className="lead">Here are your booked services.</p>
      </div>
      <UserServices userId={userId} />
    </div>
  );
}

export default UserDashboard;
