import React from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, List, Users, FileText, Settings, LogOut } from "lucide-react";
import styles from "./admin.module.css";
import { logoutAdmin } from "@/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoWrap}>
          <Link href="/admin" className={styles.logo}>
            Kiddy<span>Admin</span>
          </Link>
        </div>
        
        <nav className={styles.navMenu}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/orders" className={styles.navLink}>
            <ShoppingBag size={20} />
            Comenzi
          </Link>
          <Link href="/admin/products" className={styles.navLink}>
            <List size={20} />
            Produse
          </Link>
          <Link href="/admin/categories" className={styles.navLink}>
            <FileText size={20} />
            Categorii
          </Link>
          <Link href="/admin/users" className={styles.navLink}>
            <Users size={20} />
            Clienți
          </Link>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <Link href="/admin/settings" className={styles.navLink}>
            <Settings size={20} />
            Setări
          </Link>
          <form action={logoutAdmin}>
            <button type="submit" className={styles.logoutBtn}>
              <LogOut size={20} />
              Deconectare
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h2>Panou Administrare</h2>
          </div>
          <div className={styles.topbarRight}>
            <Link href="/" className="btn btn-secondary" target="_blank">Vezi Magazinul</Link>
            <div className={styles.adminAvatar}>A</div>
          </div>
        </header>

        <div className={styles.contentWrap}>
          {children}
        </div>
      </main>
    </div>
  );
}
