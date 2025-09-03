import React from "react";
import { useAuth } from "../../context/AuthContext";
import { studentPayments } from "../../data/mock";

export default function StudentDashboard() {
  const { user } = useAuth();

  const total = studentPayments.reduce((sum, p) => sum + p.amount, 0);
  const paid = studentPayments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const pending = total - paid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.name || "Student"} 👋</h1>
          <p className="text-sm text-indigo-100">Here’s an overview of your fees and fines.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500">Total Fees</p>
            <p className="text-2xl font-bold text-indigo-600">₹{total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500">Paid</p>
            <p className="text-2xl font-bold text-green-600">₹{paid}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-red-600">₹{pending}</p>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentPayments.map((p, idx) => (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-medium">{p.type}</td>
                  <td className="p-3">₹{p.amount}</td>
                  <td className={`p-3 font-semibold ${p.status === "Pending" ? "text-red-600" : "text-green-600"}`}>
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
