"use client";

import React, { useState } from "react";
import { Trash2, Search, User as UserIcon, Calendar, Package } from "lucide-react";
import styles from "../admin.module.css";
import { deleteUser } from "@/actions/customer-auth";

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Ești sigur că vrei să ștergi utilizatorul "${email}"? Această acțiune va șterge și istoricul de comenzi (dacă există constrângeri în DB).`)) return;
    
    const result = await deleteUser(id);
    if (result.success) {
      setUsers(users.filter(u => u.id !== id));
    } else {
      alert("Eroare la ștergere.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Gestionare Clienți</h1>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div className={styles.searchWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Caută după nume sau email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Data Înscrierii</th>
              <th>Comenzi</th>
              <th className="text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-turquoise/10 flex items-center justify-center text-turquoise">
                      <UserIcon size={16} />
                    </div>
                    <span className="font-medium text-gray-800">{user.name || "Fără Nume"}</span>
                  </div>
                </td>
                <td className="text-gray-600">{user.email}</td>
                <td className="text-gray-500 text-sm">
                   <div className="flex items-center gap-1">
                     <Calendar size={14} className="opacity-50" />
                     {new Date(user.createdAt).toLocaleDateString('ro-RO')}
                   </div>
                </td>
                <td>
                   <div className="flex items-center gap-2">
                     <Package size={14} className="text-gray-400" />
                     <span className="font-bold">{user._count?.orders || 0}</span>
                   </div>
                </td>
                <td className="text-right">
                  <div className={styles.actionBtns}>
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => handleDelete(user.id, user.email)}
                      title="Șterge"
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">Nu au fost găsiți clienți.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
