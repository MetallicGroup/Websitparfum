import React from "react";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import styles from "./admin.module.css";
import { prisma } from "@/lib/prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  
  // Basic Stats Calculation
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Latest Orders
  const latestOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true
    }
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Privire de ansamblu</h1>
      </div>

      <div className={styles.dashboardStats}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.sales}`}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Vânzări Totale</span>
            <span className={styles.statValue}>12,450 Lei</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.orders}`}>
            <ShoppingBag size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Comenzi Noi</span>
            <span className={styles.statValue}>-</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.products}`}>
            <Package size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Produse Total</span>
            <span className={styles.statValue}>{productsCount} / 1000+</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.users}`}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Clienți</span>
            <span className={styles.statValue}>{usersCount}</span>
          </div>
        </div>
      </div>

      {/* Recente Orders Section */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Ultimele Comenzi</h3>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID Comandă</th>
              <th>Client</th>
              <th>Dată</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {latestOrders.length > 0 ? (
              latestOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(-6).toUpperCase()}</td>
                  <td>{order.customerName}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString("ro-RO")}</td>
                  <td>
                    <span className={`${styles.badgeStatus} 
                      ${order.status === 'PENDING' ? styles.statusPending : 
                        order.status === 'PROCESSING' ? styles.statusProcessing : 
                        order.status === 'SHIPPED' ? styles.statusShipped : styles.statusCancelled}`}>
                      {order.status}
                    </span>
                  </td>
                  <td><strong>{order.total.toFixed(2)} Lei</strong></td>
                </tr>
              ))
            ) : (
               <tr>
                  <td colSpan={5} style={{textAlign: "center", padding: "2rem", color: "var(--color-text-muted)"}}>
                    Nu există nicio comandă încă.
                  </td>
               </tr>
            )}
            
            {latestOrders.length === 0 && null}
          </tbody>
        </table>
      </div>

    </div>
  );
}
