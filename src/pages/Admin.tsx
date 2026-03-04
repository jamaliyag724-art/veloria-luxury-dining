import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, CalendarDays, LogOut } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const Admin = () => {

  const { logout } = useAdmin();

  return (

    <div className="min-h-screen bg-background text-foreground">

      {/* NAVBAR */}

      <header className="admin-navbar sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center">

              <LayoutDashboard className="w-5 h-5 text-white"/>

            </div>

            <div>

              <h1 className="font-serif text-xl">Veloria Admin</h1>

              <p className="text-xs text-muted-foreground">
                Restaurant Management
              </p>

            </div>

          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500"
          >
            <LogOut className="w-4 h-4 inline mr-2"/>
            Logout
          </button>

        </div>

      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">

        {/* NAV TABS */}

        <div className="flex gap-3 mb-10">

          <Link to="/admin" className="admin-filter admin-filter-active flex gap-2">
            <LayoutDashboard className="w-4 h-4"/> Dashboard
          </Link>

          <Link to="/admin/orders" className="admin-filter flex gap-2">
            <ShoppingBag className="w-4 h-4"/> Orders
          </Link>

          <Link to="/admin/reservations" className="admin-filter flex gap-2">
            <CalendarDays className="w-4 h-4"/> Reservations
          </Link>

        </div>

        {/* DASHBOARD CARDS */}

        <div className="grid md:grid-cols-3 gap-8">

          <div className="admin-card">

            <p className="text-muted-foreground text-sm">
              Total Revenue
            </p>

            <h2 className="text-3xl font-serif mt-2">
              ₹52,363
            </h2>

          </div>

          <div className="admin-card">

            <p className="text-muted-foreground text-sm">
              Orders
            </p>

            <h2 className="text-3xl font-serif mt-2">
              26
            </h2>

          </div>

          <div className="admin-card">

            <p className="text-muted-foreground text-sm">
              Reservations
            </p>

            <h2 className="text-3xl font-serif mt-2">
              12
            </h2>

          </div>

        </div>

      </main>

    </div>

  );

};

export default Admin;
