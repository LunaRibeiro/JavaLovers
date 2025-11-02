"use client";
import React, { useEffect, useState } from "react";
import MenuBar from "../../components/menubar/menubar";
import Navigation from "../../components/navegation/navegation";
import styles from "./lista.module.css";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { useNotification } from "../../../components/notifications/NotificationProvider";
import ConfirmationModal from "../../../components/confirmation/ConfirmationModal";

export default function ListaVoluntarios() {
  const { showNotification } = useNotification();
  const [voluntarios, setVoluntarios] = useState([]); // [{id, nomeCompleto, email, telefoneCelular, ...}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: "", title: "" });

  useEffect(() => {
    setLoading(true);
    setError("");
    try {
      const mock = JSON.parse(localStorage.getItem('mockVoluntarios') || '[]');
      setVoluntarios(mock);
    } catch (err) {
      setError("Erro ao carregar voluntários do mock");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = (id) => {
    router.push(`/cadastrovoluntario/editar/${id}`);
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      action: () => {
        setLoading(true);
        setError("");
        try {
          const novos = voluntarios.filter((v) => v.id !== id);
          setVoluntarios(novos);
          localStorage.setItem('mockVoluntarios', JSON.stringify(novos));
          showNotification("Voluntário excluído com sucesso!", "success");
        } catch (err) {
          showNotification("Erro ao excluir voluntário", "error");
          setError("Erro ao excluir voluntário");
        } finally {
          setLoading(false);
        }
      },
      message: "Tem certeza que deseja excluir este voluntário?",
      title: "Confirmar Exclusão"
    });
  };

  const handleConfirm = async () => {
    if (confirmModal.action) {
      await confirmModal.action();
    }
    setConfirmModal({ isOpen: false, action: null, message: "", title: "" });
  };


  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}>
        <div className={styles.listContainer}>
          <h1 className={styles.titulo}>Voluntários Cadastrados</h1>
          <div className={styles.decoracao}></div>
          <div className={styles.actionsHeader}>
            <button
              className={styles.addButton}
              onClick={() => router.push("/cadastrovoluntario")}
              title="Adicionar Novo Voluntário"
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
                ) : voluntarios.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.noDataMessage}>Nenhum voluntário cadastrado ainda.</td>
                  </tr>
                ) : (
                  voluntarios.map((v) => (
                    <tr key={v.id}>
                      <td>{v.nomeCompleto}</td>
                      <td>{v.email}</td>
                      <td>{v.telefoneCelular}</td>
                      <td>–</td>
                      <td className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(v.id)}
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(v.id)}
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
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, message: "", title: "" })}
        onConfirm={handleConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Confirmar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
} 