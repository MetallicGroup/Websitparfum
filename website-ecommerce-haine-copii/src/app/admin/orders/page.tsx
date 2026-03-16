import React from "react";
import { prisma } from "@/lib/prisma/client";
import { Download, Eye, FileText } from "lucide-react";
import styles from "../admin.module.css";
import Link from "next/link";
import OrderStatusSelect from "./OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Comenzi</h1>
        <div className="flex gap-4">
          <button className="btn btn-secondary flex items-center gap-2">
            <Download size={18} />
            Export XLS
          </button>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <p className="text-sm text-gray-800 font-semibold">{orders.length} comenzi în sistem</p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Contact</th>
                <th>Dată</th>
                <th>Total</th>
                <th>Plată</th>
                <th>Livrare</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><strong>#{o.id.slice(-6).toUpperCase()}</strong></td>
                  <td>{o.customerName}</td>
                  <td className="text-sm color-text-muted">{o.customerPhone}<br/>{o.customerEmail}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString("ro-RO")}</td>
                  <td><strong>{o.total.toFixed(2)} Lei</strong></td>
                  <td>{o.paymentMethod === 'CARD' ? '💳 Stripe' : '💵 Ramburs'}</td>
                  <td>{o.deliveryMethod === 'SAMEDAY' ? 'Sameday' : o.deliveryMethod === 'EASYBOX' ? 'Easybox' : 'FanCourier'}</td>
                  <td>
                    <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <Link href={`/admin/orders/${o.id}`} className={styles.actionBtn} aria-label="Vezi Detalii"><Eye size={18} /></Link>
                      <button className={styles.actionBtn} aria-label="Generează Factură / AWB"><FileText size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                   <td colSpan={9} style={{textAlign: "center", padding: "3rem", color: "var(--color-text-muted)"}}>
                      Momentan nu aveți comenzi înregistrate.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
