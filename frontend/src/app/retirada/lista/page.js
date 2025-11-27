"use client";
import React, { useState, useEffect } from "react";
import MenuBar from "../../components/menubar/menubar";
import Navigation from "../../components/navegation/navegation";
import { useRouter } from "next/navigation";
import styles from "./lista.module.css";
import apiService from "../../../services/api";
import { useNotification } from "../../../components/notifications/NotificationProvider";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../../components/confirmation/ConfirmationModal";

export default function ListaRetiradasPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: "", title: "" });

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWithdrawals();
      setWithdrawals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar retiradas:", err);
      showNotification(err.message || "Erro ao carregar retiradas", "error");
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      action: async () => {
        try {
          await apiService.deleteWithdrawal(id);
          showNotification("Retirada excluída com sucesso!", "success");
          loadWithdrawals();
        } catch (err) {
          console.error("Erro ao excluir retirada:", err);
          showNotification(err.message || "Erro ao excluir retirada", "error");
        } finally {
          setConfirmModal({ isOpen: false, action: null, message: "", title: "" });
        }
      },
      message: "Tem certeza que deseja excluir esta retirada? Esta ação não pode ser desfeita.",
      title: "Confirmar Exclusão"
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${day}/${month}/${year}, ${hours}:${minutes}`;
    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return 'N/A';
    }
  };

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}>
        <div className={styles.listContainer}>
          <h1 className={styles.titulo}>Retiradas Registradas</h1>
          <div className={styles.decoracao}></div>
          <div className={styles.actionsHeader}>
            <button
              className={styles.addButton}
              onClick={() => router.push("/retirada/registrar")}
              title="Registrar Nova Retirada"
            >
              <FaPlus />
            </button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.beneficiariosTable}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Beneficiário</th>
                  <th>Atendente</th>
                  <th>Itens</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.loadingMessage}>Carregando...</td>
                  </tr>
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.noDataMessage}>
                      Nenhuma retirada registrada ainda.
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.withdrawalId}>
                      <td>{formatDate(withdrawal.withdrawalDate)}</td>
                      <td>{withdrawal.beneficiary?.fullName || withdrawal.beneficiary?.name || 'N/A'}</td>
                      <td>{withdrawal.appUser?.name || withdrawal.appUser?.login || 'N/A'}</td>
                      <td>
                        {withdrawal.items && withdrawal.items.length > 0 ? (
                          <div>
                            {withdrawal.items.map((item, idx) => (
                              <span key={item.itemWithdrawnId || idx} style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>
                                {item.itemDTO?.description || item.itemDTO?.name || 'Item'} - Qtd: {item.quantity || 0}
                              </span>
                            ))}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(withdrawal.withdrawalId)}
                            title="Excluir"
                          >
                            <FaTrash />
                          </button>
                        </div>
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
        onConfirm={confirmModal.action}
        message={confirmModal.message}
        title={confirmModal.title}
      />
    </div>
  );
}


