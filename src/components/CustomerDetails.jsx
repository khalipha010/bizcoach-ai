import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AuthContext from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const CustomerDetails = ({ customer }) => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerData, setCustomerData] = useState(customer || null);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!customer && user && id) {
        setLoading(true);
        setError("");
        try {
          const docRef = doc(db, `customers/${user.uid}/records`, id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCustomerData({ id: docSnap.id, ...docSnap.data() });
          } else {
            setError("Customer not found.");
          }
        } catch (err) {
          setError("Failed to fetch customer details.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCustomer();
  }, [customer, user, id]);

  if (loading) return <LoadingSpinner text="Loading customer..." />;
  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow text-red-600 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-2">Customer Details</h2>
        <p>{error}</p>
      </div>
    );
  }
  if (!customerData) {
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
        <span className="font-semibold">Name:</span> {customerData.name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Email:</span> {customerData.email}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Phone:</span> {customerData.phone}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Address:</span> {customerData.address}
      </div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default CustomerDetails;
