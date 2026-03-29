import React from "react";
import { prisma } from "@/lib/prisma/client";
import { getSessionUser, logoutCustomer } from "@/actions/customer-auth";
import { redirect } from "next/navigation";
import styles from "./account.module.css";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className={`container ${styles.accountPage}`}>
      <div className={styles.header}>
        <div className={styles.userIcon}>
          {user.name?.charAt(0) || "U"}
        </div>
        <div className={styles.userInfo}>
           <h1>Bună, {user.name}</h1>
           <p>{user.email}</p>
        </div>
        <form action={logoutCustomer}>
          <button type="submit" className={styles.logoutBtn}>Deconectare</button>
        </form>
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Comenzile Mele</h2>
        
        {orders.length === 0 ? (
          <div className={styles.emptyOrders}>
            <p>Nu ai nicio comandă plasată încă.</p>
            <Link href="/shop" className="btn btn-primary">Începe Cumpărăturile</Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHead}>
                  <div>
                    <span className={styles.orderLabel}>Comandă:</span>
                    <span className={styles.orderId}>#{order.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('ro-RO')}</span>
                  </div>
                  <div className={styles.orderStatusWrap}>
                    {order.status === 'PENDING' && <span className={styles.statusPending}><Clock size={14} /> În Procesare</span>}
                    {order.status === 'SHIPPED' && <span className={styles.statusShipped}><Truck size={14} /> Expediată</span>}
                    {order.status === 'DELIVERED' && <span className={styles.statusDelivered}><CheckCircle size={14} /> Livrată</span>}
                    {order.status === 'CANCELLED' && <span className={styles.statusCancelled}>Anulată</span>}
                  </div>
                </div>
                
                <div className={styles.orderItems}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQty}>x{item.quantity}</span>
                      <span className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} Lei</span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.totalRow}>
                    <span>Total:</span>
                    <span className={styles.totalAmount}>{order.total.toFixed(2)} Lei</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
