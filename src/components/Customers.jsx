import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { 
  FaUser,FaBoxOpen,FaDatabase,FaCalculator,FaBullseye, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight, 
  FaEdit, FaTrash, FaSave, FaTimes, FaUserPlus, FaUsers 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [editError, setEditError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const snapshot = await getDocs(collection(db, `customers/${user.uid}/records`));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(data);
    } catch (err) {
      setError("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.uid) fetchCustomers();
    // eslint-disable-next-line
  }, [user]);

  // Handle form input
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  // Add customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.email || !form.phone || !form.address) {
      setFormError("All fields are required.");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, `customers/${user.uid}/records`), form);
      setForm({ name: "", email: "", phone: "", address: "" });
      fetchCustomers();
    } catch (err) {
      setFormError("Failed to add customer.");
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing
  const handleEdit = (customer) => {
    setEditId(customer.id);
    setEditForm({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address });
    setEditError("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm({ name: "", email: "", phone: "", address: "" });
    setEditError("");
  };

  // Save edit
  const handleSaveEdit = async (id) => {
    setEditError("");
    if (!editForm.name || !editForm.email || !editForm.phone || !editForm.address) {
      setEditError("All fields are required.");
      return;
    }
    try {
      const docRef = doc(db, `customers/${user.uid}/records`, id);
      await updateDoc(docRef, editForm);
      setEditId(null);
      setEditForm({ name: "", email: "", phone: "", address: "" });
      fetchCustomers();
    } catch (err) {
      setEditError("Failed to update customer.");
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      const docRef = doc(db, `customers/${user.uid}/records`, id);
      await deleteDoc(docRef);
      fetchCustomers();
    } catch (err) {
      setError("Failed to delete customer.");
    }
  };

  return (
    <div className="dark">
      <motion.div 
        className="p-4 min-h-screen bg-[var(--primary-bg)] text-[var(--text-primary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navigation Bar */}
        <motion.nav 
          className="flex justify-center items-center mb-8 p-4 bg-[var(--secondary-bg)] rounded-xl shadow border border-[var(--border)]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-4 items-center">
            <button onClick={() => navigate('/dashboard')} className="text-blue-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaBoxOpen /> <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button onClick={() => navigate('/business-data')} className="text-green-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaDatabase /> <span className="hidden sm:inline">Business Data</span>
            </button>
            <button onClick={() => navigate('/profit-loss')} className="text-purple-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaCalculator /> <span className="hidden sm:inline">Profit/Loss</span>
            </button>
            <button onClick={() => navigate('/goals')} className="text-orange-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaBullseye /> <span className="hidden sm:inline">Goals</span>
            </button>
            <button onClick={() => navigate('/customers')} className="text-pink-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaUsers /> <span className="hidden sm:inline">Customers</span>
            </button>
          </div>
        </motion.nav>

        {/* Main Content */}
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Welcome Section */}
          <motion.div 
            className="rounded-xl p-4 sm:p-6 mb-8 border relative overflow-hidden" 
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
          >
            {/* Parallax Background Elements */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-purple-800 rounded-full opacity-20"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-24 h-24 bg-pink-800 rounded-full opacity-20"
              animate={{ 
                y: [0, 15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: [0, 15, -15, 0]
                  }}
                >
                  <FaUsers className="text-2xl sm:text-3xl text-pink-400 flex-shrink-0" />
                </motion.div>
                <motion.h1 
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Customer Management
                </motion.h1>
              </div>
              <motion.p 
                className="text-[var(--text-primary)] mb-4 text-sm sm:text-base"
                whileHover={{ color: "var(--accent)" }}
              >
                Manage your customer records, track interactions, and analyze customer data.
              </motion.p>
            </div>
          </motion.div>

          {/* Add Customer Form */}
          <motion.div 
            className="rounded-xl shadow p-4 sm:p-6 mb-8 border" 
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaUserPlus className="text-xl sm:text-2xl text-pink-400" />
              <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Add New Customer
              </h2>
            </div>
            
            <form onSubmit={handleAddCustomer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Customer's full name"
                  value={form.name}
                  onChange={handleInput}
                  className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-green-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Customer's email"
                  value={form.email}
                  onChange={handleInput}
                  className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <FaPhone className="text-purple-400" />
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Customer's phone"
                  value={form.phone}
                  onChange={handleInput}
                  className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-400" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Customer's address"
                  value={form.address}
                  onChange={handleInput}
                  className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                />
              </div>
              
              <div className="sm:col-span-2 flex gap-4 items-center">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      Add Customer
                      <FaArrowRight />
                    </>
                  )}
                </motion.button>
                {formError && (
                  <div className="text-red-400 text-sm">
                    {formError}
                  </div>
                )}
              </div>
            </form>
          </motion.div>

          {/* Customers Table */}
          <motion.div 
            className="rounded-xl shadow p-4 sm:p-6 border" 
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaUsers className="text-xl sm:text-2xl text-pink-400" />
              <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Customer Records
              </h2>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading customers..." />
            ) : error ? (
              <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                No customer records found. Add your first customer above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--border)]">
                  <thead className="bg-[var(--secondary-bg)]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {customers.map((customer) => (
                      <motion.tr 
                        key={customer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-[var(--secondary-bg)]"
                      >
                        {editId === customer.id ? (
                          <>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full p-2 border border-[var(--border)] rounded text-[var(--text-primary)] bg-[var(--secondary-bg)]"
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <input
                                type="email"
                                value={editForm.email}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                className="w-full p-2 border border-[var(--border)] rounded text-[var(--text-primary)] bg-[var(--secondary-bg)]"
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={editForm.phone}
                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                className="w-full p-2 border border-[var(--border)] rounded text-[var(--text-primary)] bg-[var(--secondary-bg)]"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <input
                                type="text"
                                value={editForm.address}
                                onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                className="w-full p-2 border border-[var(--border)] rounded text-[var(--text-primary)] bg-[var(--secondary-bg)]"
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap flex gap-2">
                              <motion.button
                                className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                                onClick={() => handleSaveEdit(customer.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaSave /> Save
                              </motion.button>
                              <motion.button
                                className="bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                                onClick={handleCancelEdit}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaTimes /> Cancel
                              </motion.button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <FaUser className="text-blue-400" />
                                <span className="font-medium">{customer.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <FaEnvelope className="text-green-400" />
                                <span>{customer.email}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <FaPhone className="text-purple-400" />
                                <span>{customer.phone}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-orange-400" />
                                <span>{customer.address}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap flex gap-2">
                              <motion.button
                                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                                onClick={() => navigate(`/customer/${customer.id}`)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaArrowRight /> View
                              </motion.button>
                              <motion.button
                                className="bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                                onClick={() => handleEdit(customer)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaEdit /> Edit
                              </motion.button>
                              <motion.button
                                className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                                onClick={() => handleDelete(customer.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaTrash /> Delete
                              </motion.button>
                            </td>
                          </>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {editError && (
                  <div className="mt-4 bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                    {editError}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button
            onClick={() => document.getElementById('add-customer-form').scrollIntoView({ behavior: 'smooth' })}
            className="w-14 h-14 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white relative overflow-hidden"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.9 }}
          >
            <FaUserPlus className="text-xl" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Customers;