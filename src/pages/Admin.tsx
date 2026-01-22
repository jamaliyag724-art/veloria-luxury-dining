import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Users, LogOut, Eye, Trash2, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useReservations } from '@/context/ReservationContext';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';

const AdminLogin: React.FC<{ onLogin: (email: string, password: string) => boolean }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = onLogin(email, password);
    if (!success) {
      setError('Invalid email or password');
      toast.error('Invalid credentials');
    } else {
      toast.success('Welcome back, Admin!');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-medium text-foreground mb-2">
              Admin Login
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="luxury-input"
                placeholder="admin@veloria.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="luxury-input"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="btn-gold w-full py-3"
            >
              {isLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Demo credentials: admin@veloria.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Admin: React.FC = () => {
  const { reservations, deleteReservation } = useReservations();
  const { isAuthenticated, login, logout } = useAdmin();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesDate = !dateFilter || r.date === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      deleteReservation(id);
      toast.success('Reservation deleted');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => {}} />
      
      <main className="pt-24 pb-24">
        <div className="section-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage reservations and view analytics
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Total Reservations', value: reservations.length, icon: Calendar },
              { label: 'Today\'s Bookings', value: reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length, icon: Users },
              { label: 'This Week', value: reservations.filter(r => {
                const date = new Date(r.date);
                const today = new Date();
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                return date >= weekAgo && date <= today;
              }).length, icon: Calendar },
              { label: 'Total Guests', value: reservations.reduce((sum, r) => sum + r.guests, 0), icon: Users },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="font-serif text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="luxury-input pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="luxury-input pl-10 pr-4"
              />
            </div>
            {dateFilter && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setDateFilter('')}
                className="px-4 py-2 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors"
              >
                Clear Filter
              </motion.button>
            )}
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    {['Order ID', 'Name', 'Email', 'Mobile', 'Location', 'Guests', 'Date & Time', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-4 text-left text-sm font-medium text-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((r, i) => (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-t border-border hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <span className="font-medium text-primary">{r.id}</span>
                        </td>
                        <td className="px-4 py-4 font-medium">{r.fullName}</td>
                        <td className="px-4 py-4 text-muted-foreground">{r.email}</td>
                        <td className="px-4 py-4">{r.mobile}</td>
                        <td className="px-4 py-4 text-muted-foreground">{r.location}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            <Users className="w-3.5 h-3.5" />
                            {r.guests}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {r.date} at {r.time}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedReservation(selectedReservation === r.id ? null : r.id)}
                              className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(r.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete reservation"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reservations found</p>
              </div>
            )}
          </motion.div>

          {/* Selected Reservation Details */}
          <AnimatePresence>
            {selectedReservation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-6 glass-card p-6"
              >
                {(() => {
                  const r = reservations.find((res) => res.id === selectedReservation);
                  if (!r) return null;
                  return (
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                        Reservation Details - {r.id}
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Full Name</p>
                          <p className="font-medium">{r.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{r.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Mobile</p>
                          <p className="font-medium">{r.mobile}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-medium">{r.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{r.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pincode</p>
                          <p className="font-medium">{r.pincode}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Guests</p>
                          <p className="font-medium">{r.guests}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date & Time</p>
                          <p className="font-medium">{r.date} at {r.time}</p>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <p className="text-sm text-muted-foreground">Special Request</p>
                          <p className="font-medium">{r.specialRequest || 'None'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Admin;
