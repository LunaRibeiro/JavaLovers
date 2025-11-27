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
import { mapBeneficiaryToBackend } from "../../../services/dataMapper";

export default function ListaBeneficiarios() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [approvingId, setApprovingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: "", title: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    telefoneCelular: "",
    email: "",
    cpfCrnm: "",
    nif: "",
    endereco: "",
    bairro: "",
    numero: "",
    complemento: "",
    pontoReferencia: "",
    withdrawalLimit: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
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

  const handleAdd = () => {
    setFormData({
      nomeCompleto: "",
      telefoneCelular: "",
      email: "",
      cpfCrnm: "",
      nif: "",
      endereco: "",
      bairro: "",
      numero: "",
      complemento: "",
      pontoReferencia: "",
      withdrawalLimit: ""
    });
    setFormErrors({});
    setFieldErrors({});
    setShowAddModal(true);
  };

  const validateField = (name, value) => {
    let validation = { valid: true, message: "" };

    switch (name) {
      case "email":
        validation = validateEmail(value);
        break;
      case "telefoneCelular":
        validation = validatePhone(value);
        break;
      case "cpfCrnm":
        if (value) {
          validation = validateCPF(value);
        }
        break;
      case "nif":
        if (value && !/^\d+$/.test(value.replace(/\D/g, ""))) {
          validation = { valid: false, message: "NIF deve conter apenas números" };
        }
        break;
      default:
        validation = { valid: true };
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: validation.valid ? "" : validation.message
    }));

    return validation.valid;
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "email" || name === "telefoneCelular" || name === "cpfCrnm" || name === "nif") {
      if (value.length > 0 || fieldErrors[name] !== undefined) {
        validateField(name, value);
      }
    }
  };

  const handleFieldBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nomeCompleto.trim()) errors.nomeCompleto = "Nome completo é obrigatório";
    if (!formData.email.trim()) errors.email = "Email é obrigatório";
    else if (!validateEmail(formData.email).valid) errors.email = validateEmail(formData.email).message;
    if (!formData.telefoneCelular.trim()) errors.telefoneCelular = "Telefone é obrigatório";
    else if (!validatePhone(formData.telefoneCelular).valid) errors.telefoneCelular = validatePhone(formData.telefoneCelular).message;
    
    const cpfCrnmLimpo = formData.cpfCrnm.replace(/\D/g, "");
    const nifLimpo = formData.nif.replace(/\D/g, "");
    
    if (cpfCrnmLimpo.length === 0 && nifLimpo.length === 0) {
      errors.cpfCrnm = "É obrigatório preencher pelo menos um dos campos: CPF/CRNM ou NIF";
    } else if (cpfCrnmLimpo.length > 0 && !validateCPF(formData.cpfCrnm).valid) {
      errors.cpfCrnm = validateCPF(formData.cpfCrnm).message;
    }
    
    if (!formData.endereco.trim()) errors.endereco = "Endereço é obrigatório";
    if (!formData.bairro.trim()) errors.bairro = "Bairro é obrigatório";
    if (!formData.numero.trim()) errors.numero = "Número é obrigatório";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const cpfCrnmLimpo = formData.cpfCrnm.replace(/\D/g, "");
      const nifLimpo = formData.nif.replace(/\D/g, "");
      const phoneValidation = validatePhone(formData.telefoneCelular);
      
      const beneficiaryData = mapBeneficiaryToBackend({
        ...formData,
        cpfCrnm: cpfCrnmLimpo.length > 0 ? cpfCrnmLimpo : null,
        nif: nifLimpo.length > 0 ? nifLimpo : null,
        telefoneCelular: phoneValidation.cleaned
      });

      await apiService.createBeneficiary(beneficiaryData);
      showNotification("Beneficiário cadastrado com sucesso!", "success");
      setShowAddModal(false);
      setFormData({
        nomeCompleto: "",
        telefoneCelular: "",
        email: "",
        cpfCrnm: "",
        nif: "",
        endereco: "",
        bairro: "",
        numero: "",
        complemento: "",
        pontoReferencia: "",
        withdrawalLimit: ""
      });
      loadDataRaw();
    } catch (err) {
      console.error("Erro ao criar beneficiário:", err);
      showNotification(err.message || "Erro ao criar beneficiário", "error");
    }
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
              onClick={handleAdd}
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
      {/* Modal de Adicionar Beneficiário */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Criar Novo Beneficiário</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nome Completo *</label>
                <input
                  type="text"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleFieldChange}
                  className={formErrors.nomeCompleto ? styles.inputError : ''}
                />
                {formErrors.nomeCompleto && <span className={styles.errorText}>{formErrors.nomeCompleto}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={formErrors.email || fieldErrors.email ? styles.inputError : ''}
                />
                {(formErrors.email || fieldErrors.email) && <span className={styles.errorText}>{formErrors.email || fieldErrors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Telefone *</label>
                <input
                  type="text"
                  name="telefoneCelular"
                  value={formData.telefoneCelular}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  placeholder="(45) 9 9988-7766"
                  className={formErrors.telefoneCelular || fieldErrors.telefoneCelular ? styles.inputError : ''}
                />
                {(formErrors.telefoneCelular || fieldErrors.telefoneCelular) && <span className={styles.errorText}>{formErrors.telefoneCelular || fieldErrors.telefoneCelular}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>CPF/CRNM</label>
                <input
                  type="text"
                  name="cpfCrnm"
                  value={formData.cpfCrnm}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, cpfCrnm: onlyNums });
                    if (fieldErrors.cpfCrnm !== undefined || onlyNums.length > 0) {
                      validateField("cpfCrnm", onlyNums);
                    }
                  }}
                  onBlur={handleFieldBlur}
                  placeholder="11122233355"
                  className={formErrors.cpfCrnm || fieldErrors.cpfCrnm ? styles.inputError : ''}
                />
                {(formErrors.cpfCrnm || fieldErrors.cpfCrnm) && <span className={styles.errorText}>{formErrors.cpfCrnm || fieldErrors.cpfCrnm}</span>}
                <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '4px' }}>
                  Preencha CPF/CRNM ou NIF (pelo menos um é obrigatório)
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>NIF</label>
                <input
                  type="text"
                  name="nif"
                  value={formData.nif}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, nif: onlyNums });
                    if (fieldErrors.nif !== undefined || onlyNums.length > 0) {
                      validateField("nif", onlyNums);
                    }
                  }}
                  onBlur={handleFieldBlur}
                  placeholder="123456789"
                  className={formErrors.nif || fieldErrors.nif ? styles.inputError : ''}
                />
                {(formErrors.nif || fieldErrors.nif) && <span className={styles.errorText}>{formErrors.nif || fieldErrors.nif}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Endereço *</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleFieldChange}
                  className={formErrors.endereco ? styles.inputError : ''}
                />
                {formErrors.endereco && <span className={styles.errorText}>{formErrors.endereco}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Número *</label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleFieldChange}
                  className={formErrors.numero ? styles.inputError : ''}
                />
                {formErrors.numero && <span className={styles.errorText}>{formErrors.numero}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleFieldChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Bairro *</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleFieldChange}
                  className={formErrors.bairro ? styles.inputError : ''}
                />
                {formErrors.bairro && <span className={styles.errorText}>{formErrors.bairro}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Ponto de Referência</label>
                <input
                  type="text"
                  name="pontoReferencia"
                  value={formData.pontoReferencia}
                  onChange={handleFieldChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Limite de Retiradas Mensais (opcional)</label>
                <input
                  type="number"
                  name="withdrawalLimit"
                  min="0"
                  value={formData.withdrawalLimit}
                  onChange={handleFieldChange}
                  placeholder="Ex: 10"
                />
                <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '4px' }}>
                  Deixe em branco para usar o limite global do sistema
                </small>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? "Criando..." : "Criar Beneficiário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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