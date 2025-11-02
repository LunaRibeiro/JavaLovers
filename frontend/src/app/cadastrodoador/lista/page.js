"use client";
import React, { useEffect, useState } from "react";
import MenuBar from "../../components/menubar/menubar";
import Navigation from "../../components/navegation/navegation";
import styles from "./lista.module.css";
import { useRouter } from "next/navigation";
import apiService from "../../../services/api";
import { mapDonorFromBackend } from "../../../services/dataMapper";
import { useApiList } from "../../../hooks/useApi";
import { FaPlus } from "react-icons/fa";

export default function ListaDoadores() {
  const router = useRouter();
  
  const {
    data: doadoresRaw,
    loading,
    error,
    loadData: loadDataRaw,
    removeItem,
    clearError
  } = useApiList((filters) => apiService.getDonors(filters));

  const doadores = Array.isArray(doadoresRaw) 
    ? doadoresRaw.map(mapDonorFromBackend)
    : [];

  useEffect(() => {
    loadDataRaw().catch(err => {
      console.error("Erro ao carregar doadores:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas na montagem do componente

  const handleEdit = (id) => {
    router.push(`/cadastrodoador/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este doador?")) return;
    
    try {
      await apiService.deleteDonor(id);
      await loadDataRaw();
      alert("Doador excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir doador:", err);
      alert("Erro ao excluir doador. Tente novamente.");
    }
  };


  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}>
        <div className={styles.listContainer}>
          <h1 className={styles.titulo}>Doadores Cadastrados</h1>
          <div className={styles.decoracao}></div>
          <div className={styles.actionsHeader}>
            <button
              className={styles.addButton}
              onClick={() => router.push("/cadastrodoador")}
              title="Adicionar Novo Doador"
            >
              <FaPlus />
            </button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.beneficiariosTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>NIF</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.loadingMessage}>Carregando...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className={styles.errorMessage}>{error}</td>
                  </tr>
                ) : doadores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.noDataMessage}>Nenhum doador cadastrado ainda.</td>
                  </tr>
                ) : (
                  doadores.map((d) => (
                    <tr key={d.id}>
                      <td>{d.nomeCompleto}</td>
                      <td>{d.email}</td>
                      <td>{d.telefoneCelular}</td>
                      <td>–</td>
                        <td className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(d.id)}
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(d.id)}
                          disabled={loading}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 