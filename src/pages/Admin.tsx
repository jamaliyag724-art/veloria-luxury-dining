import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, LogOut } from "lucide-react";

export default function Admin() {
  const isAdmin = localStorage.getItem("veloria_admin");

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] p-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-semibold">
            Admin Dashboard
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("veloria_admin");
              window.location.href = "/";
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Reservations", value: 12, icon: Calendar },
            { label: "Today", value: 3, icon: Calendar },
            { label: "Guests", value: 28, icon: Users },
            { label: "Upcoming", value: 6, icon: Calendar },
          ].map((s) => (
            <div
              key={s.label}
              className="p-5 rounded-xl bg-[#faf7f2] flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <s.icon className="w-6 h-6 text-[#d4a24c]" />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Order ID</th>
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Email</th>
                <th className="py-3 text-left">Guests</th>
                <th className="py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 text-[#d4a24c] font-medium">
                  VLR-001
                </td>
                <td>James Anderson</td>
                <td>james@email.com</td>
                <td>4</td>
                <td>25 Jan, 7:30 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
