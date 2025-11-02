"use client";
import React, { useState } from "react";
import MenuBar from "../components/menubar/menubar";
import Navegation from "../components/navegation/navegation";
import { useRouter } from "next/navigation";
import styles from "./cadastrobeneficiario.module.css";
import apiService from "../../services/api";
import { mapBeneficiaryToBackend } from "../../services/dataMapper";
import { useApi } from "../../hooks/useApi";
import { validateCPF, validateEmail, validatePhone } from "../../utils/validators";

const CadastroBeneficiario = () => {
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
    pontoReferencia: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const router = useRouter();
  const { loading, error, execute, clearError } = useApi();

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
        // Validação básica de NIF (apenas números)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validação em tempo real para campos críticos (email, telefone, CPF) assim que começam a digitar
    // Para outros campos, valida apenas se já foi tocado ou tem conteúdo
    if (name === "email" || name === "telefoneCelular" || name === "cpfCrnm" || name === "nif") {
      if (value.length > 0 || fieldErrors[name] !== undefined) {
        validateField(name, value);
      }
    } else if (fieldErrors[name] !== undefined || value.length > 0) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    // Valida quando o usuário sai do campo
    validateField(e.target.name, e.target.value);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();

    // Valida todos os campos antes de submeter
    const emailValid = validateField("email", form.email);
    const phoneValid = validateField("telefoneCelular", form.telefoneCelular);
    
    const cpfCrnmLimpo = form.cpfCrnm.replace(/\D/g, "");
    const nifLimpo = form.nif.replace(/\D/g, "");
    
    let cpfValid = true;
    if (cpfCrnmLimpo.length > 0) {
      cpfValid = validateField("cpfCrnm", form.cpfCrnm);
    }

    // Validação: pelo menos um dos campos (CPF/CRNM ou NIF) deve ser preenchido
    if (cpfCrnmLimpo.length === 0 && nifLimpo.length === 0) {
      setError("É obrigatório preencher pelo menos um dos campos: CPF/CRNM ou NIF.");
      return;
    }

    // Verifica se há erros de validação
    if (!emailValid || !phoneValid || !cpfValid) {
      setError("Por favor, corrija os erros nos campos antes de enviar.");
      return;
    }

    try {
      // Prepara dados para o backend (phone precisa ser apenas números)
      const phoneValidation = validatePhone(form.telefoneCelular);
      const phoneCleaned = phoneValidation.cleaned;
      const beneficiaryData = mapBeneficiaryToBackend({
        ...form,
        cpfCrnm: cpfCrnmLimpo.length > 0 ? cpfCrnmLimpo : null,
        nif: nifLimpo.length > 0 ? nifLimpo : null,
        telefoneCelular: phoneCleaned
      });

      // Chama a API
      await execute(() => apiService.createBeneficiary(beneficiaryData));

      // Limpa o formulário
      setForm({
        nomeCompleto: "",
        telefoneCelular: "",
        email: "",
        cpfCrnm: "",
        nif: "",
        endereco: "",
        bairro: "",
        numero: "",
        complemento: "",
        pontoReferencia: ""
      });
      setFieldErrors({});

      alert("Beneficiário cadastrado com sucesso!");
      router.push("/sucesso?tipo=beneficiarios");
    } catch (err) {
      console.error("Erro ao cadastrar beneficiário:", err);
    }
  }

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navegation />
      <div className={styles.formWrapper}> {/* Novo wrapper para centralização e largura */}
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>Cadastro de Beneficiário</h1>
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
                type="email" // Usar type="email" para validação básica de navegador
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="fulano@gmail.com"
                className={fieldErrors.email ? styles.inputError : ""}
              />
              {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
            </div>

            {/* Linha Telefone, CPF/CRNM, NIF */}
            <div className={styles.formGroup}>
              <label htmlFor="telefoneCelular"><b>Telefone*</b></label>
              <input
                id="telefoneCelular"
                name="telefoneCelular"
                value={form.telefoneCelular}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="(45) 9 9988-7766"
                type="tel"
                className={fieldErrors.telefoneCelular ? styles.inputError : ""}
              />
              {fieldErrors.telefoneCelular && <span className={styles.fieldError}>{fieldErrors.telefoneCelular}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpfCrnm"><b>CPF/CRNM (opcional se NIF for preenchido)</b></label>
              <input
                id="cpfCrnm"
                name="cpfCrnm"
                type="text"
                pattern="[0-9]*" // Permite apenas números
                maxLength={11}
                value={form.cpfCrnm}
                onChange={e => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, cpfCrnm: onlyNums });
                  if (fieldErrors.cpfCrnm !== undefined || onlyNums.length > 0) {
                    validateField("cpfCrnm", onlyNums);
                  }
                }}
                onBlur={handleBlur}
                placeholder="11122233355"
                className={fieldErrors.cpfCrnm ? styles.inputError : ""}
              />
              {fieldErrors.cpfCrnm && <span className={styles.fieldError}>{fieldErrors.cpfCrnm}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="nif"><b>NIF (opcional se CPF/CRNM for preenchido)</b></label>
              <input
                id="nif"
                name="nif"
                type="text"
                pattern="[0-9]*" // Permite apenas números
                value={form.nif}
                onChange={e => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, nif: onlyNums });
                  if (fieldErrors.nif !== undefined || onlyNums.length > 0) {
                    validateField("nif", onlyNums);
                  }
                }}
                onBlur={handleBlur}
                placeholder="123456789"
                className={fieldErrors.nif ? styles.inputError : ""}
              />
              {fieldErrors.nif && <span className={styles.fieldError}>{fieldErrors.nif}</span>}
            </div>

            <hr className={styles.separador} />

            {/* Linha Endereço, Número, Complemento */}
            <div className={styles.formGroupFullWidth}> {/* Ocupa a largura total da linha */}
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
              <label htmlFor="complemento"><b>Complemento</b></label> {/* Tornando Complemento opcional */}
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
              <label htmlFor="pontoReferencia"><b>Ponto de referência</b></label> {/* Tornando Ponto de Referência opcional */}
              <input
                id="pontoReferencia"
                name="pontoReferencia"
                value={form.pontoReferencia}
                onChange={handleChange}
                placeholder="Em frente ao parque"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Beneficiário"}
            </button>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroBeneficiario;