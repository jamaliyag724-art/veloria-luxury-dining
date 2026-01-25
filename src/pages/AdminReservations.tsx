import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Search,
  Filter,
  LogOut,
  ChevronDown,
  Users,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useReservations, ReservationStatus } from '@/context/ReservationContext';

const AdminReservations: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();
  const { reservations, updateReservationStatus } = useReservations();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<ReservationStatus | 'all'>('all');
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
    const matchesStatus =
      statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Waiting':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold">
                Veloria Admin
              </h1>
              <p className="text-xs text-muted-foreground">
                Reservation Management
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
            <input
              placeholder="Search by Reservation ID, Name, or Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as ReservationStatus | 'all'
                )
              }
              className="pl-12 pr-10 py-3 rounded-xl border"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Waiting">Waiting</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
          </div>
        </div>

        {/* RESERVATION CARDS */}
        <div className="space-y-6">
          {filteredReservations.map((res) => (
            <motion.div
              key={res.reservationId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border p-6 shadow-sm"
            >
              {/* TOP */}
              <div className="flex justify-between gap-6">
                <div>
                  <p className="font-mono text-primary font-semibold">
                    {res.reservationId}
                  </p>
                  <p className="font-medium">{res.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {res.email} · {res.mobile}
                  </p>
                </div>

                <div className="text-right text-sm">
                  <div className="flex items-center gap-1 justify-end">
                    <Users className="w-4 h-4" />
                    <span>{res.guests} Guests</span>
                  </div>
                  <p className="mt-1 font-medium">
                    {new Date(res.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {res.time}
                  </p>
                </div>
              </div>

              {/* CREATED AT */}
              {res.createdAt && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Booked on{' '}
                  {new Date(res.createdAt).toLocaleString()}
                </div>
              )}

              {/* STATUS + NOTES */}
              <div className="mt-4 flex justify-between items-center">
                <select
                  value={res.status}
                  onChange={(e) =>
                    updateReservationStatus(
                      res.reservationId,
                      e.target.value as ReservationStatus
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                    res.status
                  )}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {res.specialRequest && (
                  <button
                    onClick={() => setExpandedId(res.reservationId)}
                    className="flex items-center gap-1 text-primary text-sm hover:underline"
                  >
                    <MessageSquare className="w-4 h-4" />
                    View Request
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-sm text-muted-foreground text-right">
          Showing {filteredReservations.length} of{' '}
          {reservations.length} reservations
        </div>
      </div>

      {/* SPECIAL REQUEST MODAL */}
      {expandedId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedId(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="font-serif text-lg font-semibold mb-4">
              Special Request
            </h3>
            <p className="text-muted-foreground">
              {
                reservations.find(
                  r => r.reservationId === expandedId
                )?.specialRequest
              }
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
    </div>
  );
};

export default AdminReservations;
