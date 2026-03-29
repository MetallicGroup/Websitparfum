"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { loginCustomer } from "@/actions/customer-auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginCustomer(formData);

    if (result.success) {
      window.location.href = "/contul-meu";
    } else {
      setError(result.error || "Eroare la autentificare.");
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.loginPage}`}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Autentificare Client</h1>
        <p className={styles.subtitle}>
          Dacă ai făcut deja o comandă, contul tău a fost creat automat.
          Parola este numărul de telefon folosit la comandă (ex: <strong>USER-07xxxxxxxx</strong>).
        </p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>E-mail</label>
            <input type="email" name="email" required placeholder="exemplu@email.com" />
          </div>

          <div className={styles.inputGroup}>
            <label>Parolă (sau USER-telefon)</label>
            <input type="password" name="password" required placeholder="********" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Se autentifică..." : "Intră în cont"}
          </button>
        </form>

        <div className={styles.footerLinks}>
          <Link href="/shop">Înapoi la magazin</Link>
        </div>
      </div>
    </div>
  );
}
