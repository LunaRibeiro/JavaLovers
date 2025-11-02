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
import { useNotification } from "../../../components/notifications/NotificationProvider";
import ConfirmationModal from "../../../components/confirmation/ConfirmationModal";
import { validateCPForCNPJ, validateEmail } from "../../../utils/validators";

export default function ListaDoadores() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: "", title: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null); // objeto do doador a editar
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

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
    loadDataRaw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (id) => {
    router.push(`/cadastrodoador/editar/${id}`);
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      action: async () => {
        try {
          await removeItem(id);
          showNotification("Doador excluído com sucesso!", "success");
        } catch (err) {
          showNotification("Erro ao excluir doador", "error");
        }
      },
      message: "Tem certeza que deseja excluir este doador?",
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
                  <th>CPF/CNPJ</th>
                  <th>Telefone</th>
                  <th>Email</th>
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
                      <td>{d.cpf}</td>
                      <td>{d.telefoneCelular}</td>
                      <td>{d.email}</td>
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