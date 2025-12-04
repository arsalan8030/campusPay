
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentPayments } from "../../data/mock";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  X,
  Bell,
  Search,
  User,
  LogOut,
  Menu,
  Download,
  Moon,
  Sun,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // filters / UI state
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const profileRef = useRef();
  const notifRef = useRef();
  const searchRef = useRef();

  // notifications (mocked)
  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Fee Deadline", body: "Tuition due in 5 days", time: "2h", read: false },
    { id: "n2", title: "Receipt Ready", body: "Receipt #342 available", time: "1d", read: false },
    { id: "n3", title: "New Notice", body: "Semester exam schedule published", time: "3d", read: true },
  ]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) {} // keep suggestions open only while focused
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 280);
    return () => clearTimeout(t);
  }, [query]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  // derived payment list: apply filter + search
  const displayedPayments = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return studentPayments
      .filter((p) => (filter === "All" ? true : p.status === filter))
      .filter((p) => {
        if (!q) return true;
        return (
          p.id.toString().toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.amount.toString().includes(q) ||
          (p.date || "").toLowerCase().includes(q)
        );
      });
  }, [filter, debouncedQuery]);

  const totalPayments = studentPayments.length;
  const paidCount = studentPayments.filter((p) => p.status === "Paid").length;
  const pendingCount = totalPayments - paidCount;
  const totalAmount = studentPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = studentPayments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = Math.max(0, totalAmount - paidAmount);
  const chartData = [{ name: "Paid", value: paidCount }, { name: "Pending", value: pendingCount }];
  const COLORS = ["#10B981", "#EF4444"];

  const handlePay = (payment) => {
    setSelectedPayment(payment);
    setPaymentSuccess(false);
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setPaymentSuccess(false);
  };

  const confirmPayment = () => {
    confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 }, colors: ["#22c55e", "#60a5fa", "#facc15", "#f43f5e", "#a78bfa"] });
    setPaymentSuccess(true);
    setTimeout(() => {
      closeModal();
      alert(`Payment for "${selectedPayment.description}" successful!`);
    }, 1100);
  };

  const exportCSV = () => {
    const rows = [["ID", "Description", "Amount", "Status", "Date"], ...studentPayments.map((p) => [p.id, p.description, p.amount, p.status, p.date || ""])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    if (typeof logout === "function") logout();
    try { localStorage.removeItem("user"); } catch (e) {}
    navigate("/");
  };

  const markNotifRead = useCallback((id) => {
    setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
  }, []);

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const toggleDark = () => setDarkMode((d) => !d);

  const paidPercent = totalAmount ? Math.round((paidAmount / totalAmount) * 100) : 0;

  return (
    <div className={darkMode ? "min-h-screen bg-gray-900 text-gray-100 p-6" : "min-h-screen bg-gray-50 p-6"}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className={darkMode ? "flex items-center justify-between gap-4 bg-gray-800 rounded-xl shadow p-4 mb-6" : "flex items-center justify-between gap-4 bg-white rounded-xl shadow p-4 mb-6"}>
          <div className="flex items-center gap-4">
            <button onClick={() => setNavOpen((s) => !s)} className="p-2 rounded-md hover:bg-gray-100/40">
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold" style={{ background: "linear-gradient(135deg,#4f46e5,#06b6d4)" }}>
                <span>ERP</span>
              </div>
              <div>
                <h1 className={darkMode ? "text-lg font-semibold text-gray-100" : "text-lg font-semibold text-gray-800"}>College ERP</h1>
                <p className={darkMode ? "text-sm text-gray-300" : "text-sm text-gray-500"}>Student Portal</p>
              </div>
            </div>
          </div>

          {/* Search with suggestions */}
          <div className="flex-1 mx-6 hidden lg:block relative" ref={searchRef}>
            <div className={darkMode ? "flex items-center bg-gray-700 rounded-full px-3 py-2 shadow-sm" : "flex items-center bg-gray-100 rounded-full px-3 py-2 shadow-sm"}>
              <Search size={18} className={darkMode ? "text-gray-300" : "text-gray-400"} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search payments, receipts, descriptions..."
                className={darkMode ? "bg-transparent outline-none text-sm text-gray-200 ml-3 w-full" : "bg-transparent outline-none text-sm text-gray-700 ml-3 w-full"}
              />
              {query ? (
                <button onClick={() => { setQuery(""); setDebouncedQuery(""); }} className="text-sm text-gray-500 px-2">Clear</button>
              ) : (
                <button className="text-sm text-indigo-600 font-medium px-3 py-1 rounded-md hover:bg-indigo-50">Search</button>
              )}
            </div>

            {/* suggestions dropdown */}
            <AnimatePresence>
              {query && debouncedQuery !== "" && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className={darkMode ? "absolute mt-2 w-full bg-gray-800 text-gray-100 rounded-lg shadow-lg z-30" : "absolute mt-2 w-full bg-white rounded-lg shadow-lg z-30"}>
                  <div className="p-3 text-xs text-gray-500">{displayedPayments.length} results</div>
                  <div className="max-h-52 overflow-auto divide-y">
                    {displayedPayments.slice(0, 6).map((p) => (
                      <button key={p.id} onClick={() => { setQuery(""); setDebouncedQuery(""); navigate(`/receipts/${p.id}`); }} className={darkMode ? "w-full text-left p-3 hover:bg-gray-700" : "w-full text-left p-3 hover:bg-gray-100"}>
                        <div className="flex justify-between">
                          <div className="font-medium">{p.description}</div>
                          <div className="text-sm">{p.date || "—"}</div>
                        </div>
                        <div className="text-xs text-gray-400">ID {p.id} • ₹{p.amount} • {p.status}</div>
                      </button>
                    ))}
                    {displayedPayments.length === 0 && <div className="p-3 text-sm text-gray-500">No matches</div>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            {/* notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen((s) => !s)} className={darkMode ? "p-2 rounded-md hover:bg-gray-700/60 relative" : "p-2 rounded-md hover:bg-gray-100 relative"} title="Notifications">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <motion.span layoutId="notif-badge" initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={darkMode ? "absolute right-0 mt-2 w-80 bg-gray-800 text-gray-100 rounded-lg shadow-lg z-40" : "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-40"}>
                    <div className="p-3 border-b flex items-center justify-between">
                      <div className="text-sm font-medium">Notifications</div>
                      <div className="flex items-center gap-2">
                        <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline">Mark all read</button>
                        <button onClick={() => setNotifications([])} className="text-xs text-red-500 hover:underline">Clear</button>
                      </div>
                    </div>
                    <div className="max-h-60 overflow-auto divide-y">
                      {notifications.length === 0 && <div className="p-4 text-sm text-gray-500">No notifications</div>}
                      {notifications.map((n) => (
                        <div key={n.id} className={n.read ? "p-3 text-sm" : "p-3 text-sm bg-indigo-50"}>
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <div className="font-medium">{n.title}</div>
                              <div className="text-xs text-gray-500">{n.body}</div>
                            </div>
                            <div className="text-xs text-gray-400">{n.time}</div>
                          </div>
                          {!n.read && <div className="mt-2"><button onClick={() => markNotifRead(n.id)} className="text-xs text-indigo-600 hover:underline">Mark read</button></div>}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* export / dark mode */}
            <div className="hidden md:flex items-center gap-2">
              <button onClick={exportCSV} className={darkMode ? "flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-md text-sm" : "flex items-center gap-2 bg-white border border-gray-200 px-3 py-1 rounded-md text-sm"}>
                <Download size={16} /> Export
              </button>
              <button onClick={toggleDark} className={darkMode ? "p-2 rounded-md hover:bg-gray-700/60" : "p-2 rounded-md hover:bg-gray-100"} title="Toggle theme">
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            {/* profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen((s) => !s)} className="flex items-center gap-3 px-3 py-1 rounded-full hover:bg-gray-100">
                <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{user?.name || "Student"}</div>
                  <div className="text-xs text-gray-500">{user?.role || "STUDENT"}</div>
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={darkMode ? "absolute right-0 mt-2 w-44 bg-gray-800 text-gray-100 rounded-lg shadow-lg z-40" : "absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg z-40"}>
                    <button onClick={() => { setProfileOpen(false); navigate("/profile"); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                      <User size={16} /> Profile
                    </button>
                    <button onClick={() => { setProfileOpen(false); navigate("/settings"); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                      <Menu size={16} /> Settings
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600">
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={darkMode ? "bg-gray-800 rounded-xl shadow p-4" : "bg-white rounded-xl shadow p-4"}>
            <p className="text-xs text-gray-400">Outstanding Amount</p>
            <div className="flex items-end justify-between">
              <div>
                <div className={darkMode ? "text-2xl font-semibold text-gray-100" : "text-2xl font-semibold text-gray-800"}>₹{pendingAmount}</div>
                <div className="text-sm text-gray-500 mt-1">Due across all fees</div>
              </div>
              <div className="text-green-500 font-semibold">{paidPercent}% Paid</div>
            </div>
          </div>

          <div className={darkMode ? "bg-gray-800 rounded-xl shadow p-4" : "bg-white rounded-xl shadow p-4"}>
            <p className="text-xs text-gray-400">Total Fees</p>
            <div className="flex items-end justify-between">
              <div>
                <div className={darkMode ? "text-2xl font-semibold text-gray-100" : "text-2xl font-semibold text-gray-800"}>₹{totalAmount}</div>
                <div className="text-sm text-gray-500 mt-1">{totalPayments} items</div>
              </div>
              <div className="text-indigo-600 font-semibold">{paidCount} Paid</div>
            </div>
          </div>

          <div className={darkMode ? "bg-gray-800 rounded-xl shadow p-4" : "bg-white rounded-xl shadow p-4"}>
            <p className="text-xs text-gray-400">Pending Payments</p>
            <div className="flex items-end justify-between">
              <div>
                <div className={darkMode ? "text-2xl font-semibold text-gray-100" : "text-2xl font-semibold text-gray-800"}>{pendingCount}</div>
                <div className="text-sm text-gray-500 mt-1">Require action</div>
              </div>
              <div className="text-red-500 font-semibold">₹{pendingAmount}</div>
            </div>
          </div>

          <div className={darkMode ? "bg-gray-800 rounded-xl shadow p-4" : "bg-white rounded-xl shadow p-4"}>
            <p className="text-xs text-gray-400">Quick Action</p>
            <div className="mt-2 flex flex-col gap-2">
              <button onClick={() => navigate("/payments/new")} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                <CreditCard size={16} /> Pay Fees
              </button>
              <button onClick={() => navigate("/receipts")} className={darkMode ? "w-full bg-gray-700 text-gray-100 border border-gray-600 py-2 rounded-lg hover:bg-gray-600 transition" : "w-full bg-white border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition"}>
                View Receipts
              </button>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Chart & stats */}
          <div className={darkMode ? "lg:col-span-2 bg-gray-800 rounded-xl shadow p-6" : "lg:col-span-2 bg-white rounded-xl shadow p-6"}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={darkMode ? "text-lg font-semibold text-gray-100" : "text-lg font-semibold text-gray-800"}>Payments Overview</h3>
              <div className="flex gap-2">
                {["All", "Paid", "Pending"].map((status) => (
                  <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1 rounded-full text-sm font-medium ${filter === status ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/3 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className={darkMode ? "bg-gray-900 rounded-lg p-3" : "bg-gray-50 rounded-lg p-3"}>
                    <p className="text-sm text-gray-400">Total</p>
                    <p className={darkMode ? "text-lg font-semibold text-gray-100" : "text-lg font-semibold text-gray-800"}>₹{totalAmount}</p>
                  </div>
                  <div className={darkMode ? "bg-gray-900 rounded-lg p-3" : "bg-gray-50 rounded-lg p-3"}>
                    <p className="text-sm text-gray-400">Paid</p>
                    <p className="text-lg font-semibold text-green-400">₹{paidAmount}</p>
                  </div>
                  <div className={darkMode ? "bg-gray-900 rounded-lg p-3" : "bg-gray-50 rounded-lg p-3"}>
                    <p className="text-sm text-gray-400">Pending</p>
                    <p className="text-lg font-semibold text-red-400">₹{pendingAmount}</p>
                  </div>
                </div>

                <div className={darkMode ? "bg-gray-700 rounded-lg p-3" : "bg-gray-100 rounded-lg p-3"}>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Progress</span>
                    <span className="font-medium">{paidPercent}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 mt-3">
                    <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${paidPercent}%` }} />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm text-gray-400 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {studentPayments.slice(-4).reverse().map((p) => (
                      <div key={p.id} className={darkMode ? "flex items-center justify-between bg-gray-700 border border-gray-600 rounded-lg p-3" : "flex items-center justify-between bg-white border rounded-lg p-3"}>
                        <div>
                          <div className="text-sm font-medium">{p.description}</div>
                          <div className="text-xs text-gray-400">ID {p.id} • {p.date || "—"}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">₹{p.amount}</div>
                          <div className={`text-xs ${p.status === "Paid" ? "text-green-400" : "text-red-400"}`}>{p.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Table / quick actions */}
          <aside className={darkMode ? "bg-gray-800 rounded-xl shadow p-6" : "bg-white rounded-xl shadow p-6"}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={darkMode ? "text-lg font-semibold text-gray-100" : "text-lg font-semibold text-gray-800"}>Payments</h3>
              <div className="text-sm text-gray-400">{displayedPayments.length} items</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Amount</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPayments.map((payment) => (
                    <tr key={payment.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{payment.id}</td>
                      <td className="p-2 font-medium">{payment.description}</td>
                      <td className="p-2 text-right">₹{payment.amount}</td>
                      <td className="p-2">
                        {payment.status === "Paid" ? (
                          <span className="inline-flex items-center gap-2 text-green-600 font-medium"><CheckCircle size={14} /> Paid</span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-red-600 font-medium"><XCircle size={14} /> Pending</span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        {payment.status === "Pending" ? (
                          <button onClick={() => handlePay(payment)} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700">Pay</button>
                        ) : (
                          <button onClick={() => navigate(`/receipts/${payment.id}`)} className="text-indigo-600 text-sm hover:underline">View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {displayedPayments.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No payments match your search / filter.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">Showing {displayedPayments.length} of {studentPayments.length}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setFilter("All"); setQuery(""); setDebouncedQuery(""); }} className="text-sm text-gray-600 hover:underline">Reset</button>
                <button onClick={exportCSV} className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-md text-sm"><Download size={14} /> Export CSV</button>
              </div>
            </div>
          </aside>
        </div>

        {/* Payment Modal */}
        <AnimatePresence>
          {selectedPayment && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="bg-white rounded-2xl shadow-xl w-11/12 sm:w-96 p-6 relative">
                <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"><X size={20} /></button>
                <h3 className="text-lg font-semibold mb-2">Pay ₹{selectedPayment.amount} — {selectedPayment.description}</h3>
                {!paymentSuccess ? (
                  <button onClick={confirmPayment} className="bg-indigo-600 text-white w-full py-2 rounded-lg hover:bg-indigo-700 transition">Confirm Payment</button>
                ) : (
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <CheckCircle size={40} className="text-green-600" />
                    <p className="font-semibold text-green-600">Payment Successful</p>
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
