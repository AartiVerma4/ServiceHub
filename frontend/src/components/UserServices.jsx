import React, { useEffect, useState } from 'react';

function UserServices({ userId }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch(`/?userId=${userId}`)
      .then(res => res.json())
      .then(data => setServices(data));
  }, [userId]);

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Your Booked Services</h2>
      {services.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2">
          {services.map(s => (
            <li key={s._id} className="text-lg text-gray-700">
              {s.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No services booked yet.</p>
      )}
    </div>
  );
}

export default UserServices;
