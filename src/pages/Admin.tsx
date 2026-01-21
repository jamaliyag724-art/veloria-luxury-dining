import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useReservations } from '@/context/ReservationContext';

const Admin: React.FC = () => {
  const { reservations } = useReservations();
  const [search, setSearch] = useState('');

  const filtered = reservations.filter(r =>
    r.fullName.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => {}} />
      <main className="pt-32 pb-24">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage reservations</p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="luxury-input pl-10"
              />
            </div>
          </motion.div>

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    {['Order ID', 'Name', 'Email', 'Mobile', 'Location', 'Guests', 'Date & Time'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-sm font-medium text-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-t border-border hover:bg-secondary/30"
                    >
                      <td className="px-4 py-3 font-medium text-primary">{r.id}</td>
                      <td className="px-4 py-3">{r.fullName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                      <td className="px-4 py-3">{r.mobile}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.location}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-4 h-4" /> {r.guests}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {r.date} {r.time}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
