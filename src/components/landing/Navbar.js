"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Stethoscope, Menu, X, Calendar, AlertCircle } from "lucide-react";
import { computeClinicStatus } from "@/lib/clinicSchedule";

export default function Navbar({ clinicInfo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const status = computeClinicStatus(clinicInfo);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Layanan", href: "#layanan" },
    { label: "Jadwal", href: "#jadwal" },
    { label: "Lokasi", href: "#lokasi" },
    { label: "Tentang", href: "#tentang" },
    { label: "Testimoni", href: "#testimoni" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      {/* Top Announcement Bar if clinic has an alert */}
      {clinicInfo?.announcement && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-inner z-50 relative">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{clinicInfo.announcement}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo & Name */}
            <a href="#home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight block leading-tight">
                  Klinik drg. Hetty
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium block">
                  Dokter Gigi Profesional Jember
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Status Badge & CTA Button */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Dynamic Status Indicator */}
              <div suppressHydrationWarning className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200/70">
                <span
                  suppressHydrationWarning
                  className={`w-2 h-2 rounded-full ${status.dotColor} ${
                    status.isOpen ? "animate-pulse" : ""
                  }`}
                />
                <span suppressHydrationWarning className={status.isOpen ? "text-emerald-700" : "text-slate-700"}>
                  {status.detailLabel}
                </span>
              </div>

              {/* Book Appointment CTA Button */}
              <a
                href="#buat-janji"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-200 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Buat Janji Temu</span>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center gap-2">
              <a
                href="#buat-janji"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Buat Janji
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-800" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Status Praktik:</span>
              <span
                suppressHydrationWarning
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${status.badgeBg}`}
              >
                {status.detailLabel}
              </span>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
