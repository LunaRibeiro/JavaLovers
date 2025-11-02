"use client";
import React, { useState, useEffect } from "react";
import MenuBar from "../../../components/menubar/menubar";
import Navigation from "../../../components/navegation/navegation";
import { useRouter, useParams } from "next/navigation";
import styles from "../../cadastrobeneficiario.module.css";
import apiService from "../../../../services/api";
import { mapBeneficiaryFromBackend } from "../../../../services/dataMapper";
import { useApi } from "../../../../hooks/useApi";

const EditarBeneficiario = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { loading, error, execute, clearError } = useApi();
  const [loadingData, setLoadingData] = useState(true);
  
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
        alert("Erro ao carregar beneficiário. Redirecionando...");
        router.push("/cadastrobeneficiario/lista");
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      loadBeneficiary();
    }
  }, [id, router]);

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
      
      alert("Beneficiário atualizado com sucesso!");
      router.push("/cadastrobeneficiario/lista");
    } catch (err) {
      console.error("Erro ao atualizar beneficiário:", err);
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
        </div>
      </div>
    </div>
  );
};

export default EditarBeneficiario;

