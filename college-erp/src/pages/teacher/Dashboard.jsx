// components/dashboard/TeacherDashboard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { batches } from "../../data/mock";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Users, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TeacherDashboard() {
  const { user } = useAuth();

  const allStudents = batches.flatMap((b) => b.students);
  const total = allStudents.length;
  const paid = allStudents.filter((s) => s.status === "Paid").length;
  const pending = total - paid;

  const COLORS = ["#22c55e", "#ef4444"]; // green, red

  // Data for batch payment summary chart
  const batchSummaryData = batches.map((batch) => {
    const batchPaidAmount = batch.students
      .filter((s) => s.status === "Paid")
      .reduce((sum, s) => sum + (s.amount || 0), 0); // using amount property
    const batchPendingAmount = batch.students
      .filter((s) => s.status === "Pending")
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    return {
      batch: batch.name,
      Paid: batchPaidAmount,
      Pending: batchPendingAmount,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 p-4 sm:p-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl shadow-xl p-6 transform transition hover:scale-105 duration-300">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome, {user?.name || "Teacher"} 👨‍🏫
          </h1>
          <p className="text-sm sm:text-base text-green-100">
            Here’s a batch-wise overview of student fee submissions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { label: "Total Students", value: total, color: "text-blue-600" },
            { label: "Paid", value: paid, color: "text-green-600" },
            { label: "Pending", value: pending, color: "text-red-600" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg hover:scale-105 transition transform duration-300"
            >
              <div className="flex justify-center items-center gap-2 mb-1">
                <Users size={20} />
                <span className="font-medium">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Batch Payment Summary Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-2">Batch Payment Summary (₹)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={batchSummaryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="batch" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
              <Bar dataKey="Paid" fill="#22c55e" />
              <Bar dataKey="Pending" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Batch Tables */}
        {batches.map((batch) => {
          const batchTotal = batch.students.length;
          const batchPaid = batch.students.filter((s) => s.status === "Paid").length;
          const batchPending = batchTotal - batchPaid;
          const batchChartData = [
            { name: "Paid", value: batchPaid },
            { name: "Pending", value: batchPending },
          ];

          return (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 border-b">
                <h2 className="text-lg font-bold">{batch.name}</h2>
                <div className="flex gap-4 mt-2 sm:mt-0">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Total</p>
                    <p className="font-semibold">{batchTotal}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Paid</p>
                    <p className="font-semibold text-green-600">{batchPaid}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="font-semibold text-red-600">{batchPending}</p>
                  </div>
                </div>
              </div>

              {/* Pie Chart + Table */}
              <div className="flex flex-col sm:flex-row p-4 gap-4">
                {/* Pie Chart */}
                <div className="w-full sm:w-1/3 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={batchChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {batchChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Student Table */}
                <div className="w-full sm:w-2/3 overflow-x-auto">
                  <table className="w-full text-sm sm:text-base">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batch.students.map((student) => (
                        <tr
                          key={student.id}
                          className="border-t hover:bg-gray-50 transition transform hover:scale-105 duration-200"
                        >
                          <td className="p-3">{student.id}</td>
                          <td className="p-3 font-medium">{student.name}</td>
                          <td
                            className={`p-3 font-semibold flex items-center gap-1 ${
                              student.status === "Pending" ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {student.status === "Paid" ? <CheckCircle size={16} /> : <XCircle size={16} />}{" "}
                            {student.status}
                          </td>
                          <td className="p-3">₹{student.amount || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
