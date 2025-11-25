"use client";
import React, { useEffect, useState } from "react";
import MenuBar from "../../components/menubar/menubar";
import Navigation from "../../components/navegation/navegation";
// Importar o CSS Modules específico para a lista
import styles from "./lista.module.css";
// Se você mantiver o formContainer no styles de cadastrobeneficiario, importe-o também
// import formStyles from "../cadastrobeneficiario.module.css";
import { useRouter } from "next/navigation";
import apiService from "../../../services/api";
import { mapBeneficiaryFromBackend } from "../../../services/dataMapper";
import { useApiList } from "../../../hooks/useApi";
import { FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import authService from "../../../services/authService";
import { useNotification } from "../../../components/notifications/NotificationProvider";
import ConfirmationModal from "../../../components/confirmation/ConfirmationModal";
import { validateCPF, validateEmail, validatePhone } from "../../../utils/validators";

export default function ListaBeneficiarios() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [approvingId, setApprovingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: "", title: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null); // objeto do beneficiário a editar
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const {
    data: beneficiariosRaw,
    loading,
    error,
    loadData: loadDataRaw,
    removeItem,
    clearError
  } = useApiList((filters) => apiService.getBeneficiaries(filters));

  const beneficiarios = Array.isArray(beneficiariosRaw)
    ? beneficiariosRaw.map(mapBeneficiaryFromBackend)
    : [];

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = authService.getUser();
        setIsAdmin(user?.role === "ADMIN");
      } catch (err) {
        console.error("Erro ao verificar permissões:", err);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    loadDataRaw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (id) => {
    router.push(`/cadastrobeneficiario/editar/${id}`);
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      action: async () => {
        try {
          await removeItem(id);
          showNotification("Beneficiário excluído com sucesso!", "success");
        } catch (err) {
          showNotification("Erro ao excluir beneficiário", "error");
        }
      },
      message: "Tem certeza que deseja excluir este beneficiário?",
      title: "Confirmar Exclusão"
    });
  };

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      const user = authService.getUser();
      if (!user || !user.id) {
        showNotification("Erro: usuário não autenticado", "error");
        return;
      }
      await apiService.approveBeneficiary(id, "APPROVED", user.id);
      showNotification("Beneficiário aprovado com sucesso!", "success");
      loadDataRaw();
    } catch (err) {
      showNotification("Erro ao aprovar beneficiário", "error");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id) => {
    setConfirmModal({
      isOpen: true,
      action: async () => {
        setApprovingId(id);
        try {
          const user = authService.getUser();
          if (!user || !user.id) {
            showNotification("Erro: usuário não autenticado", "error");
            return;
          }
          await apiService.approveBeneficiary(id, "REJECTED", user.id);
          showNotification("Beneficiário rejeitado com sucesso!", "success");
          loadDataRaw();
        } catch (err) {
          showNotification("Erro ao rejeitar beneficiário", "error");
        } finally {
          setApprovingId(null);
        }
      },
      message: "Tem certeza que deseja rejeitar este beneficiário?",
      title: "Confirmar Rejeição"
    });
  };

  const handleConfirm = async () => {
    if (confirmModal.action) {
      await confirmModal.action();
    }
    setConfirmModal({ isOpen: false, action: null, message: "", title: "" });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Pendente";
      case "APPROVED":
        return "Aprovado";
      case "REJECTED":
        return "Rejeitado";
      default:
        return status || "N/A";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return styles.statusPending;
      case "APPROVED":
        return styles.statusApproved;
      case "REJECTED":
        return styles.statusRejected;
      default:
        return "";
    }
  };

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}>
        <div className={styles.listContainer}>
          <h1 className={styles.titulo}>Beneficiários Cadastrados</h1>
          <div className={styles.decoracao}></div>
          <div className={styles.actionsHeader}>
            <button
              className={styles.addButton}
              onClick={() => router.push("/cadastrobeneficiario")}
              title="Adicionar Novo Beneficiário"
            >
              <FaPlus />
            </button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.beneficiariosTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF/CRNM</th>
                  <th>Telefone</th>
                  <th>Status</th>
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
                ) : beneficiarios.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.noDataMessage}>Nenhum beneficiário cadastrado ainda.</td>
                  </tr>
                ) : (
                  beneficiarios.map((b) => (
                    <tr key={b.id}>
                      <td>{b.nomeCompleto}</td>
                      <td>{b.cpfCrnm}</td>
                      <td>{b.telefoneCelular}</td>
                      <td>
                        <span className={getStatusClass(b.status)}>
                          {getStatusLabel(b.status)}
                        </span>
                      </td>
                      <td className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(b.id)}
                          disabled={loading}
                        >
                          Editar
                        </button>
                        {isAdmin && b.status === "PENDING" && (
                          <>
                            <button
                              className={styles.approveButton}
                              onClick={() => handleApprove(b.id)}
                              disabled={loading || approvingId === b.id}
                              title="Aprovar Beneficiário"
                            >
                              <FaCheck />
                            </button>
                            <button
                              className={styles.rejectButton}
                              onClick={() => handleReject(b.id)}
                              disabled={loading || approvingId === b.id}
                              title="Rejeitar Beneficiário"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(b.id)}
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