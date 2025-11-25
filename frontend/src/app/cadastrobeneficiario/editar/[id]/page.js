"use client";
import React, { useState, useEffect } from "react";
import MenuBar from "../../../components/menubar/menubar";
import Navigation from "../../../components/navegation/navegation";
import { useRouter, useParams } from "next/navigation";
import styles from "../../cadastrobeneficiario.module.css";
import apiService from "../../../../services/api";
import { mapBeneficiaryFromBackend } from "../../../../services/dataMapper";
import { useApi } from "../../../../hooks/useApi";
import { useNotification } from "../../../../components/notifications/NotificationProvider";
import { FaIdCard, FaPrint, FaPlus } from "react-icons/fa";

const EditarBeneficiario = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { loading, error, execute, clearError } = useApi();
  const { showNotification } = useNotification();
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("dados");
  const [card, setCard] = useState(null);
  const [loadingCard, setLoadingCard] = useState(false);
  
  const [form, setForm] = useState({
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
    status: "PENDING"
  });

  useEffect(() => {
    const loadBeneficiary = async () => {
      try {
        setLoadingData(true);
        const beneficiary = await apiService.getBeneficiary(id);
        const mappedBeneficiary = mapBeneficiaryFromBackend(beneficiary);
        setForm({
          nomeCompleto: mappedBeneficiary.nomeCompleto || "",
          telefoneCelular: mappedBeneficiary.telefoneCelular || "",
          email: mappedBeneficiary.email || "",
          cpfCrnm: mappedBeneficiary.cpfCrnm || "",
          nif: mappedBeneficiary.nif || "",
          endereco: mappedBeneficiary.endereco || "",
          bairro: mappedBeneficiary.bairro || "",
          numero: mappedBeneficiary.numero || "",
          complemento: mappedBeneficiary.complemento || "",
          pontoReferencia: mappedBeneficiary.pontoReferencia || "",
          status: mappedBeneficiary.status || "PENDING"
        });
      } catch (err) {
        console.error("Erro ao carregar beneficiário:", err);
        showNotification(err.message || "Erro ao carregar beneficiário", "error");
        setTimeout(() => router.push("/cadastrobeneficiario/lista"), 2000);
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      loadBeneficiary();
      loadCard();
    }
  }, [id, router]);

  const loadCard = async () => {
    try {
      setLoadingCard(true);
      const cardData = await apiService.getCardByBeneficiaryId(id);
      setCard(cardData);
    } catch (err) {
      console.error("Erro ao carregar cartão:", err);
      setCard(null);
    } finally {
      setLoadingCard(false);
    }
  };

  const handleGenerateCard = async () => {
    try {
      setLoadingCard(true);
      const newCard = await apiService.generateCardForBeneficiary(id);
      setCard(newCard);
      showNotification("Cartão gerado com sucesso!", "success");
    } catch (err) {
      showNotification(err.message || "Erro ao gerar cartão", "error");
    } finally {
      setLoadingCard(false);
    }
  };

  const handlePrintCard = () => {
    if (!card) return;
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cartão de Identificação - ${form.nomeCompleto}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .card { border: 2px solid #000; padding: 30px; max-width: 400px; margin: 0 auto; }
            .card-header { text-align: center; margin-bottom: 20px; }
            .card-number { font-size: 24px; font-weight: bold; margin: 20px 0; }
            .card-info { margin: 10px 0; }
            .card-footer { margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="card-header">
              <h2>CARTÃO DE IDENTIFICAÇÃO</h2>
              <h3>SANEM</h3>
            </div>
            <div class="card-info">
              <strong>Nome:</strong> ${form.nomeCompleto}
            </div>
            <div class="card-info">
              <strong>CPF/CRNM:</strong> ${form.cpfCrnm || form.nif || 'N/A'}
            </div>
            <div class="card-number">
              Número: ${card.uniqueNumber}
            </div>
            <div class="card-footer">
              <div>Data de Emissão: ${card.issueDate ? new Date(card.issueDate).toLocaleDateString('pt-BR') : 'N/A'}</div>
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    
    // Validação: pelo menos um dos campos (CPF/CRNM ou NIF) deve ser preenchido
    const cpfCrnmLimpo = form.cpfCrnm.replace(/\D/g, "");
    const nifLimpo = form.nif.replace(/\D/g, "");
    
    if (cpfCrnmLimpo.length === 0 && nifLimpo.length === 0) {
      setError("É obrigatório preencher pelo menos um dos campos: CPF/CRNM ou NIF.");
      return;
    }
    
    // Se CPF/CRNM foi preenchido, validar formato (11 dígitos para CPF)
    if (cpfCrnmLimpo.length > 0 && cpfCrnmLimpo.length !== 11) {
      setError("CPF/CRNM deve conter 11 dígitos numéricos.");
      return;
    }

    // Validação de telefone
    const telefoneLimpo = form.telefoneCelular.replace(/\D/g, "");
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setError("Telefone deve conter entre 10 e 11 dígitos (incluindo DDD).");
      return;
    }

    // Validação de email (regex simples)
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      // Preparar dados para o backend
      const beneficiaryData = {
        fullName: form.nomeCompleto,
        cpf: cpfCrnmLimpo || nifLimpo,
        phone: telefoneLimpo,
        socioeconomicData: JSON.stringify({
          endereco: form.endereco,
          bairro: form.bairro,
          numero: form.numero,
          complemento: form.complemento,
          pontoReferencia: form.pontoReferencia,
        }),
        beneficiaryStatus: form.status || 'PENDING'
      };

      // Chama a API de atualização
      await execute(() => apiService.updateBeneficiary(id, beneficiaryData));
      
      showNotification("Beneficiário atualizado com sucesso!", "success");
      setTimeout(() => router.push("/cadastrobeneficiario/lista"), 1000);
    } catch (err) {
      showNotification(err.message || "Erro ao atualizar beneficiário", "error");
    }
  }

  if (loadingData) {
    return (
      <div className={styles.containerGeral}>
        <MenuBar />
        <Navigation />
        <div className={styles.formWrapper}>
          <div className={styles.formContainer}>
            <h1 className={styles.titulo}>Carregando...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>Editar Beneficiário</h1>
          <div className={styles.decoracao}></div>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
            <button
              type="button"
              onClick={() => setActiveTab("dados")}
              style={{
                padding: '10px 20px',
                background: activeTab === "dados" ? '#4CAF50' : 'transparent',
                color: activeTab === "dados" ? '#fff' : '#333',
                border: 'none',
                borderBottom: activeTab === "dados" ? '3px solid #4CAF50' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Dados
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cartao")}
              style={{
                padding: '10px 20px',
                background: activeTab === "cartao" ? '#4CAF50' : 'transparent',
                color: activeTab === "cartao" ? '#fff' : '#333',
                border: 'none',
                borderBottom: activeTab === "cartao" ? '3px solid #4CAF50' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              <FaIdCard style={{ marginRight: '8px', display: 'inline' }} />
              Cartão
            </button>
          </div>

          {activeTab === "dados" && (
            <form onSubmit={handleSubmit} className={styles.formulario}>
            {/* Linha Nome e E-mail */}
            <div className={styles.formGroup}>
              <label htmlFor="nomeCompleto"><b>Nome completo*</b></label>
              <input 
                id="nomeCompleto"
                name="nomeCompleto" 
                value={form.nomeCompleto} 
                onChange={handleChange} 
                required 
                placeholder="Fulano da Silva" 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email"><b>E-mail*</b></label>
              <input 
                id="email"
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange} 
                required 
                placeholder="fulano@gmail.com" 
              />
            </div>

            {/* Linha Telefone, CPF/CRNM, NIF */}
            <div className={styles.formGroup}>
              <label htmlFor="telefoneCelular"><b>Telefone*</b></label>
              <input 
                id="telefoneCelular"
                name="telefoneCelular" 
                value={form.telefoneCelular} 
                onChange={handleChange} 
                required 
                placeholder="(45) 9 9988-7766" 
                type="tel" 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpfCrnm"><b>CPF/CRNM (opcional se NIF for preenchido)</b></label>
              <input 
                id="cpfCrnm"
                name="cpfCrnm" 
                type="text" 
                pattern="[0-9]*"
                maxLength={11} 
                value={form.cpfCrnm} 
                onChange={e => { 
                  const onlyNums = e.target.value.replace(/\D/g, ""); 
                  setForm({ ...form, cpfCrnm: onlyNums }); 
                }} 
                placeholder="11122233355" 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="nif"><b>NIF (opcional se CPF/CRNM for preenchido)</b></label>
              <input 
                id="nif"
                name="nif" 
                type="text" 
                pattern="[0-9]*"
                value={form.nif} 
                onChange={e => { 
                  const onlyNums = e.target.value.replace(/\D/g, ""); 
                  setForm({ ...form, nif: onlyNums }); 
                }} 
                placeholder="123456789" 
              />
            </div>

            <hr className={styles.separador} />

            {/* Linha Endereço, Número, Complemento */}
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="endereco"><b>Endereço*</b></label>
              <input 
                id="endereco"
                name="endereco" 
                value={form.endereco} 
                onChange={handleChange} 
                required 
                placeholder="Rua da Água" 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="numero"><b>Número*</b></label>
              <input 
                id="numero"
                name="numero" 
                type="number" 
                value={form.numero} 
                onChange={handleChange} 
                required 
                placeholder="2015" 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="complemento"><b>Complemento</b></label>
              <input 
                id="complemento"
                name="complemento" 
                value={form.complemento} 
                onChange={handleChange} 
                placeholder="Ap 307" 
              />
            </div>

            {/* Linha Bairro, Ponto de Referência */}
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="bairro"><b>Bairro*</b></label>
              <input 
                id="bairro"
                name="bairro" 
                value={form.bairro} 
                onChange={handleChange} 
                required 
                placeholder="Centro" 
              />
            </div>
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="pontoReferencia"><b>Ponto de referência</b></label>
              <input 
                id="pontoReferencia"
                name="pontoReferencia" 
                value={form.pontoReferencia} 
                onChange={handleChange} 
                placeholder="Em frente ao parque" 
              />
            </div>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                type="button" 
                onClick={() => router.push("/cadastrobeneficiario/lista")}
                style={{ 
                  background: '#aaa', 
                  color: '#fff',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Cancelar
              </button>
              <button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
          )}

          {activeTab === "cartao" && (
            <div style={{ padding: '20px' }}>
              {loadingCard ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Carregando informações do cartão...</div>
              ) : card ? (
                <div style={{ 
                  border: '2px solid #4CAF50', 
                  borderRadius: '12px', 
                  padding: '30px',
                  background: '#f9f9f9'
                }}>
                  <h2 style={{ marginBottom: '20px', color: '#4CAF50' }}>Informações do Cartão</h2>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Número do Cartão:</strong>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '5px', color: '#333' }}>
                      {card.uniqueNumber}
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Data de Emissão:</strong>
                    <div style={{ marginTop: '5px', color: '#666' }}>
                      {card.issueDate ? new Date(card.issueDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </div>
                  </div>
                  <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handlePrintCard}
                      style={{
                        background: '#2196F3',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <FaPrint /> Imprimir Cartão
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  border: '2px dashed #ccc', 
                  borderRadius: '12px', 
                  padding: '40px',
                  textAlign: 'center',
                  background: '#f9f9f9'
                }}>
                  <FaIdCard style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }} />
                  <h3 style={{ marginBottom: '10px' }}>Nenhum cartão encontrado</h3>
                  <p style={{ color: '#666', marginBottom: '30px' }}>
                    Este beneficiário ainda não possui um cartão de identificação.
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateCard}
                    disabled={loadingCard}
                    style={{
                      background: '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: loadingCard ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '0 auto'
                    }}
                  >
                    <FaPlus /> {loadingCard ? 'Gerando...' : 'Gerar Cartão'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditarBeneficiario;

