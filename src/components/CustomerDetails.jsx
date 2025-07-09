import React from "react";

const CustomerDetails = ({ customer }) => {
  if (!customer) {
    return (
      <div className="p-6 bg-white rounded shadow text-gray-700">
        <h2 className="text-xl font-bold mb-2">Customer Details</h2>
        <p>No customer selected.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow text-gray-700 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
      <div className="mb-2">
        <span className="font-semibold">Name:</span> {customer.name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Email:</span> {customer.email}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Phone:</span> {customer.phone}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Address:</span> {customer.address}
      </div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default CustomerDetails;
