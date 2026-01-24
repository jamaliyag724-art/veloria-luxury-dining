
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CalendarDays, 
  UtensilsCrossed,
  Search,
  Filter,
  LogOut,
  ChevronDown,
  Users,
  MessageSquare
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useReservations, ReservationStatus } from '@/context/ReservationContext';

const AdminReservations: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();
  const { reservations, updateReservationStatus, loading } = useReservations();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.reservationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.mobile.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'Reservations', icon: CalendarDays, path: '/admin/reservations', active: true },
    { name: 'Menu', icon: UtensilsCrossed, path: '/admin/menu', disabled: true },
  ];

  const statusOptions: (ReservationStatus | 'all')[] = ['all', 'Pending', 'Confirmed', 'Waiting', 'Rejected'];

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Waiting': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">Veloria Admin</h1>
              <p className="text-xs text-muted-foreground">Reservation Management</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.disabled ? '#' : item.path}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                item.active
                  ? 'bg-primary text-primary-foreground shadow-gold'
                  : item.disabled
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  : 'bg-white text-foreground hover:bg-secondary border border-border'
              }`}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Reservation ID, Name, or Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | 'all')}
              className="pl-12 pr-10 py-3 bg-white rounded-xl border border-border focus:border-primary outline-none appearance-none cursor-pointer min-w-[180px]"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Reservations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-soft border border-border/50 overflow-hidden"
        >
          {filteredReservations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-ivory border-b border-border">
                    <th className="text-left px-6 py-4 font-medium text-sm text-muted-foreground">Reservation ID</th>
                    <th className="text-left px-6 py-4 font-medium text-sm text-muted-foreground">Customer</th>
                    <th className="text-left px-6 py-4 font-medium text-sm text-muted-foreground">Mobile</th>
                    <th className="text-left px-6 py-4 font-medium text-sm text-muted-foreground">Guests</th>
                    <th className="text-left px-6 py-4 font-medium text-sm text-muted-foreground">Date & Time</th>
                    <th className="text-left px-6 py-4 font-medium text-sm text-muted-foreground">Status</th>
                    <th className="text-left px-6 py-4 font-medium text-sm text-muted-foreground">Special Request</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((res, index) => (
                    <motion.tr
                      key={res.reservationId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-ivory/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-primary">{res.reservationId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{res.fullName}</p>
                          <p className="text-xs text-muted-foreground">{res.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{res.mobile}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{res.guests}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{new Date(res.date).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">{res.time}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={res.status}
                          onChange={(e) => updateReservationStatus(res.reservationId, e.target.value as ReservationStatus)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-0 outline-none ${getStatusColor(res.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Waiting">Waiting</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {res.specialRequest ? (
                          <button
                            onClick={() => setExpandedId(expandedId === res.reservationId ? null : res.reservationId)}
                            className="flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            <MessageSquare className="w-4 h-4" />
                            View
                          </button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <CalendarDays className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No reservations found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary text-sm mt-2 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Special Request Modal */}
        {expandedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setExpandedId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="font-serif text-lg font-semibold mb-4">Special Request</h3>
              <p className="text-muted-foreground">
                {reservations.find(r => r.reservationId === expandedId)?.specialRequest}
              </p>
              <button
                onClick={() => setExpandedId(null)}
                className="btn-gold w-full mt-6"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Summary */}
        <div className="mt-4 text-sm text-muted-foreground text-right">
          Showing {filteredReservations.length} of {reservations.length} reservations
        </div>
      </div>
    </div>
  );
};

export default AdminReservations;
