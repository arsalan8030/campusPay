// components/dashboard/StudentDashboard.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentPayments } from "../../data/mock";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CreditCard, CheckCircle, XCircle, X } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const filteredPayments =
    filter === "All"
      ? studentPayments
      : studentPayments.filter((p) => p.status === filter);

  const totalPayments = studentPayments.length;
  const paidCount = studentPayments.filter((p) => p.status === "Paid").length;
  const pendingCount = totalPayments - paidCount;
  const totalAmount = studentPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = studentPayments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  const chartData = [
    { name: "Paid", value: paidCount },
    { name: "Pending", value: pendingCount },
  ];
  const COLORS = ["#22c55e", "#ef4444"];

  const handlePay = (payment) => {
    setSelectedPayment(payment);
    setPaymentSuccess(false);
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setPaymentSuccess(false);
  };

  const confirmPayment = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#60a5fa", "#facc15", "#f43f5e", "#a78bfa"],
    });

    setPaymentSuccess(true);

    setTimeout(() => {
      closeModal();
      alert(`Payment for "${selectedPayment.description}" successful!`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl shadow-xl p-6 transform transition hover:scale-105 duration-300">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome, {user?.name || "Student"} 🎓
          </h1>
          <p className="text-sm sm:text-base text-indigo-100">
            Track your fee payments and financial progress.
          </p>
        </div>

        {/* Recent Payments */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Recent Payments</h2>
          <div className="flex gap-4 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {studentPayments
              .slice(-5)
              .reverse()
              .map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="min-w-[220px] bg-white rounded-2xl shadow-md p-4 flex flex-col space-y-2 hover:shadow-lg transition transform hover:scale-105"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{payment.description}</span>
                    <span
                      className={`font-semibold text-sm ${
                        payment.status === "Pending" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>ID: {payment.id}</span>
                    <span>₹{payment.amount}</span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {payment.date || "Date not set"}
                  </span>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { label: "Total Payments", value: totalPayments, color: "text-blue-600" },
            { label: "Paid", value: paidCount, color: "text-green-600" },
            { label: "Pending", value: pendingCount, color: "text-red-600" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg hover:scale-105 transition transform duration-300"
            >
              <p className="text-gray-500 text-sm sm:text-base">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Financial Progress Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col space-y-2 transform transition hover:scale-105 duration-300">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard size={20} /> Financial Progress
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(paidAmount / totalAmount) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Paid: ₹{paidAmount}</span>
            <span>Pending: ₹{pendingAmount}</span>
          </div>
        </div>

        {/* Chart + Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 transform transition hover:scale-105 duration-300">
          <div className="w-full sm:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full sm:w-1/2 flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Filter Payments:</h3>
            <div className="flex gap-2 flex-wrap">
              {["All", "Paid", "Pending"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition transform hover:scale-105 ${
                    filter === status
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payments Table / Cards */}
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <AnimatePresence>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="border-t hover:bg-gray-50 transition transform hover:scale-105 duration-200"
                    >
                      <td className="p-3">{payment.id}</td>
                      <td className="p-3 font-medium">{payment.description}</td>
                      <td className="p-3">₹{payment.amount}</td>
                      <td
                        className={`p-3 font-semibold ${
                          payment.status === "Pending" ? "text-red-600" : "text-green-600"
                        } flex items-center gap-1`}
                      >
                        {payment.status === "Paid" ? <CheckCircle size={16} /> : <XCircle size={16} />}{" "}
                        {payment.status}
                      </td>
                      <td className="p-3">
                        {payment.status === "Pending" ? (
                          <button
                            onClick={() => handlePay(payment)}
                            className="bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-gray-500">Completed</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </AnimatePresence>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            <AnimatePresence>
              {filteredPayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col space-y-2 hover:shadow-lg transition transform hover:scale-105 duration-200"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{payment.description}</span>
                    <span
                      className={`font-semibold ${
                        payment.status === "Pending" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {payment.status === "Paid" ? <CheckCircle size={16} /> : <XCircle size={16} />}{" "}
                      {payment.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>ID: {payment.id}</span>
                    <span>₹{payment.amount}</span>
                  </div>
                  {payment.status === "Pending" && (
                    <button
                      onClick={() => handlePay(payment)}
                      className="bg-indigo-600 text-white w-full py-2 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
                    >
                      Pay Now
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Payment Modal */}
        <AnimatePresence>
          {selectedPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white rounded-2xl shadow-xl w-11/12 sm:w-96 p-6 relative"
              >
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
                <h3 className="text-lg font-semibold mb-2">
                  Pay ₹{selectedPayment.amount} for {selectedPayment.description}
                </h3>
                {!paymentSuccess ? (
                  <button
                    onClick={confirmPayment}
                    className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Confirm Payment
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <CheckCircle size={40} className="text-green-600" />
                    <p className="font-semibold text-green-600">Payment Successful!</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
