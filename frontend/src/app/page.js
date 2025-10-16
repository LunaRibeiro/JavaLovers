"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import authService from "../services/authService";
import { useApi } from "../hooks/useApi";


export default function Login() {
  const [error, setError] = useState("");
  const { loading, execute, clearError } = useApi();

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    
    const form = e.target;
    const username = form[0].value;
    const password = form[1].value;

    if (!username || !password) {
      setError("Usuário e senha são obrigatórios.");
      return;
    }

    try {
      await execute(() => authService.login(username, password));
      alert("Login realizado com sucesso!");
      window.location.href = "/home";
    } catch (err) {
      setError("Usuário ou senha incorretos.");
    }
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.loginBox}>
          <div className={styles.logoContainer}>
            <Image src="/logo-sanem.svg" alt="Logo SANEM" width={120} height={120} className={styles.logo} />
          </div>
          <h2 className={styles.loginTitle}>Login</h2>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <input type="text" placeholder="Usuário" className={styles.input} />
            <input type="password" placeholder="Senha" className={styles.input} />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Entrando...' : 'Login'}
            </button>
          </form>
          {error && <div className={styles.errorMsg}>{error}</div>}
          <a href="#" className={styles.forgot}>Esqueci minha senha</a>
        </div>
      </div>
    </>
  );
}
