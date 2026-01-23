import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CalendarDays, 
  UtensilsCrossed,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  LogOut
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useOrders } from '@/context/OrderContext';
import { useReservations } from '@/context/ReservationContext';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();
  const { orders, getTotalRevenue, getOrdersCount } = useOrders();
  const { reservations, getReservationsCount } = useReservations();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const orderStats = getOrdersCount();
  const reservationStats = getReservationsCount();
  const totalRevenue = getTotalRevenue();

  // Calculate today's orders
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today).length;
  const todayReservations = reservations.filter(r => new Date(r.createdAt).toDateString() === today).length;

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      trend: '+12%',
    },
    {
      title: 'Total Orders',
      value: orderStats.total.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
      subtext: `${todayOrders} today`,
    },
    {
      title: 'Active Orders',
      value: (orderStats.pending + orderStats.preparing).toString(),
      icon: Clock,
      color: 'bg-amber-100 text-amber-600',
      subtext: 'Pending/Preparing',
    },
    {
      title: 'Reservations',
      value: reservationStats.total.toString(),
      icon: CalendarDays,
      color: 'bg-purple-100 text-purple-600',
      subtext: `${todayReservations} today`,
    },
  ];

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin', active: true },
    { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'Reservations', icon: CalendarDays, path: '/admin/reservations' },
    { name: 'Menu', icon: UtensilsCrossed, path: '/admin/menu', disabled: true },
  ];

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
              <p className="text-xs text-muted-foreground">Restaurant Management</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-border/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.trend && (
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {stat.trend}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              {stat.subtext && (
                <p className="text-xs text-primary mt-1">{stat.subtext}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-soft border border-border/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold">Recent Orders</h2>
              <Link to="/admin/orders" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
            {orders.slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.orderId}
                    className="flex items-center justify-between p-3 bg-ivory rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-sm">{order.orderId}</p>
                      <p className="text-xs text-muted-foreground">{order.fullName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-semibold text-primary">₹{order.totalAmount.toFixed(0)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.orderStatus === 'Completed' ? 'bg-green-100 text-green-600' :
                        order.orderStatus === 'Preparing' ? 'bg-amber-100 text-amber-600' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>
            )}
          </motion.div>

          {/* Recent Reservations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-soft border border-border/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold">Recent Reservations</h2>
              <Link to="/admin/reservations" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
            {reservations.slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {reservations.slice(0, 5).map((res) => (
                  <div
                    key={res.reservationId}
                    className="flex items-center justify-between p-3 bg-ivory rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-sm">{res.reservationId}</p>
                      <p className="text-xs text-muted-foreground">{res.fullName} • {res.guests} guests</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(res.date).toLocaleDateString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        res.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                        res.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                        res.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No reservations yet</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
