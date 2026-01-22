import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("veloria_admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-gray-800">
          Veloria Admin Panel 👑
        </h1>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-medium mb-2">Orders</h2>
          <p className="text-gray-600">Manage customer orders</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-medium mb-2">Reservations</h2>
          <p className="text-gray-600">View table bookings</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-medium mb-2">Menu</h2>
          <p className="text-gray-600">Edit food & pricing</p>
        </div>
      </div>
    </div>
  );
}
