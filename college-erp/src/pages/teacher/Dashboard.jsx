import React from "react";
import { useAuth } from "../../context/AuthContext";
import { batches } from "../../data/mock";

export default function TeacherDashboard() {
  const { user } = useAuth();

  const allStudents = batches.flatMap((b) => b.students);
  const total = allStudents.length;
  const paid = allStudents.filter((s) => s.status === "Paid").length;
  const pending = total - paid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.name || "Teacher"} 👨‍🏫</h1>
          <p className="text-sm text-green-100">Here’s a batch-wise overview of student fee submissions.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-blue-600">{total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500">Paid</p>
            <p className="text-2xl font-bold text-green-600">{paid}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-red-600">{pending}</p>
          </div>
        </div>

        {/* Batch Tables */}
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <h2 className="text-lg font-bold px-4 py-3 bg-gray-100 border-b">{batch.name}</h2>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {batch.students.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{student.id}</td>
                    <td className="p-3 font-medium">{student.name}</td>
                    <td className={`p-3 font-semibold ${student.status === "Pending" ? "text-red-600" : "text-green-600"}`}>
                      {student.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
