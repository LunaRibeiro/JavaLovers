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

export default function ListaBeneficiarios() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [approvingId, setApprovingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: "", title: "" });
  
  const {
    data: beneficiariosRaw,
    loading,
    error,
    loadData: loadDataRaw,
    removeItem,
    clearError
  } = useApiList((filters) => apiService.getBeneficiaries(filters));

  // Mapear os dados do backend para o formato do frontend
  const beneficiarios = Array.isArray(beneficiariosRaw) 
    ? beneficiariosRaw.map(mapBeneficiaryFromBackend)
    : [];

  useEffect(() => {
    // Verificar se o usuário é administrador
    const user = authService.getUser();
    if (user && user.role) {
      // O role vem do nome do perfil (profile.getName())
      // Perfis possíveis: 'Administrator', 'Attendant', 'Evaluator'
      const roleLower = user.role.toLowerCase();
      setIsAdmin(roleLower === 'administrator');
    }
  }, []);

  useEffect(() => {
    loadDataRaw().catch(err => {
      console.error("Erro ao carregar beneficiários:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas na montagem do componente

  const handleEdit = (id) => {
    router.push(`/cadastrobeneficiario/editar/${id}`);
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      action: async () => {
        try {
          await apiService.deleteBeneficiary(id);
          await loadDataRaw();
          showNotification("Beneficiário excluído com sucesso!", "success");
        } catch (err) {
          showNotification(err.message || "Erro ao excluir beneficiário", "error");
        }
      },
      message: "Tem certeza que deseja excluir este beneficiário?",
      title: "Confirmar Exclusão"
    });
  };

  const handleApprove = (id) => {
    setConfirmModal({
      isOpen: true,
      action: async () => {
        setApprovingId(id);
        try {
          await apiService.approveBeneficiary(id, 'APPROVED');
          await loadDataRaw();
          showNotification("Beneficiário aprovado com sucesso!", "success");
        } catch (err) {
          showNotification(err.message || "Erro ao aprovar beneficiário", "error");
        } finally {
          setApprovingId(null);
        }
      },
      message: "Tem certeza que deseja aprovar este beneficiário?",
      title: "Confirmar Aprovação",
      type: "success"
    });
  };

  const handleReject = (id) => {
    setConfirmModal({
      isOpen: true,
      action: async () => {
        setApprovingId(id);
        try {
          await apiService.approveBeneficiary(id, 'REJECTED');
          await loadDataRaw();
          showNotification("Beneficiário reprovado com sucesso!", "success");
        } catch (err) {
          showNotification(err.message || "Erro ao reprovar beneficiário", "error");
        } finally {
          setApprovingId(null);
        }
      },
      message: "Tem certeza que deseja reprovar este beneficiário?",
      title: "Confirmar Reprovação",
      type: "danger"
    });
  };

  const handleConfirm = async () => {
    if (confirmModal.action) {
      await confirmModal.action();
    }
    setConfirmModal({ isOpen: false, action: null, message: "", title: "" });
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': { label: 'Pendente', color: '#ff9800' },
      'APPROVED': { label: 'Aprovado', color: '#4caf50' },
      'REJECTED': { label: 'Reprovado', color: '#f44336' }
    };
    return statusMap[status] || { label: status, color: '#666' };
  };


  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}> {/* Novo wrapper para centralização e largura */}
        <div className={styles.listContainer}> {/* Usando listContainer para diferenciar do formContainer */}
          <h1 className={styles.titulo}>Beneficiários Cadastrados</h1>
          <div className={styles.decoracao}></div> {/* Linha decorativa */}

          <div className={styles.actionsHeader}>
            <button
              className={styles.addButton}
              onClick={() => router.push("/cadastrobeneficiario")}
              title="Adicionar Novo Beneficiário"
            >
              <FaPlus />
            </button>
          </div>
          <div className={styles.tableWrapper}> {/* Para permitir rolagem em telas pequenas */}
            <table className={styles.beneficiariosTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>NIF</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className={styles.loadingMessage}>Carregando...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className={styles.errorMessage}>{error}</td>
                  </tr>
                ) : beneficiarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.noDataMessage}>Nenhum beneficiário cadastrado ainda.</td>
                  </tr>
                ) : (
                  beneficiarios.map((b) => {
                    const statusInfo = getStatusLabel(b.status || 'PENDING');
                    return (
                      <tr key={b.id}>
                        <td>{b.nomeCompleto}</td>
                        <td>{b.email}</td>
                        <td>{b.telefoneCelular}</td>
                        <td>{b.nif || '–'}</td>
                        <td>
                          <span 
                            style={{ 
                              padding: '4px 12px', 
                              borderRadius: '12px', 
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              backgroundColor: `${statusInfo.color}20`,
                              color: statusInfo.color
                            }}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className={styles.actionButtons}>
                          {isAdmin && (b.status === 'PENDING' || !b.status) && (
                            <>
                              <button 
                                className={styles.approveButton} 
                                onClick={() => handleApprove(b.id)}
                                disabled={loading || approvingId === b.id}
                                title="Aprovar Beneficiário"
                              >
                                <FaCheck /> Aprovar
                              </button>
                              <button 
                                className={styles.rejectButton} 
                                onClick={() => handleReject(b.id)}
                                disabled={loading || approvingId === b.id}
                                title="Reprovar Beneficiário"
                              >
                                <FaTimes /> Reprovar
                              </button>
                            </>
                          )}
                          <button 
                            className={styles.editButton} 
                            onClick={() => handleEdit(b.id)}
                            disabled={loading}
                          >
                            Editar
                          </button>
                          <button 
                            className={styles.deleteButton} 
                            onClick={() => handleDelete(b.id)}
                            disabled={loading}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
        type={confirmModal.type || "danger"}
      />
    </div>
  );
}