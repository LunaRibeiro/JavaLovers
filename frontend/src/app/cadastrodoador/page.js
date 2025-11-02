"use client";
import React, { useState } from "react";
import MenuBar from "../components/menubar/menubar";
import Navegation from "../components/navegation/navegation";
import { useRouter } from "next/navigation";
import styles from "./cadastrodoador.module.css";
import apiService from "../../services/api";
import { mapDonorToBackend } from "../../services/dataMapper";
import { useApi } from "../../hooks/useApi";
import { validateCPForCNPJ, validateEmail, validatePhone } from "../../utils/validators";

const CadastroDoador = () => {
  const [form, setForm] = useState({
    nomeCompleto: "",
    telefoneCelular: "",
    email: "",
    cpf: "",
    endereco: "",
    bairro: "",
    numero: "",
    complemento: "",
    pontoReferencia: ""
  });
  const router = useRouter();
  const { loading, error, execute, clearError } = useApi();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();

    // Validação de CPF/CNPJ
    const cpfCnpjValidation = validateCPForCNPJ(form.cpf);
    if (!cpfCnpjValidation.valid) {
      setError(cpfCnpjValidation.message);
      return;
    }

    // Validação de email
    const emailValidation = validateEmail(form.email);
    if (!emailValidation.valid) {
      setError(emailValidation.message);
      return;
    }

    // Validação de telefone
    const phoneValidation = validatePhone(form.telefoneCelular);
    if (!phoneValidation.valid) {
      setError(phoneValidation.message);
      return;
    }

    try {
      // Prepara dados para o backend
      const donorData = mapDonorToBackend({
        ...form,
        cpf: cpfCnpjValidation.cleaned
      });

      // Chama a API
      await execute(() => apiService.createDonor(donorData));

      // Limpa o formulário
      setForm({
        nomeCompleto: "",
        telefoneCelular: "",
        email: "",
        cpf: "",
        endereco: "",
        bairro: "",
        numero: "",
        complemento: "",
        pontoReferencia: ""
      });

      alert("Doador cadastrado com sucesso!");
      router.push("/sucesso?tipo=doadores");
    } catch (err) {
      console.error("Erro ao cadastrar doador:", err);
    }
  }

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navegation />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>Cadastro de Doador</h1>
          <div className={styles.decoracao}></div>
          <form onSubmit={handleSubmit} className={styles.formulario}>
            <div className={styles.formGroup}>
              <label htmlFor="nomeCompleto"><b>Nome completo*</b></label>
              <input id="nomeCompleto" name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} required placeholder="Fulano da Silva" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email"><b>E-mail*</b></label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="fulano@gmail.com" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefoneCelular"><b>Telefone*</b></label>
              <input id="telefoneCelular" name="telefoneCelular" value={form.telefoneCelular} onChange={handleChange} required placeholder="(45) 9 9988-7766" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpf"><b>CPF*</b></label>
              <input id="cpf" name="cpf" type="text" pattern="[0-9]*" maxLength={11} value={form.cpf} onChange={e => { const onlyNums = e.target.value.replace(/\D/g, ""); setForm({ ...form, cpf: onlyNums }); }} placeholder="11122233355" required />
            </div>
            <hr className={styles.separador} />
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="endereco"><b>Endereço*</b></label>
              <input id="endereco" name="endereco" value={form.endereco} onChange={handleChange} required placeholder="Rua da Água" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="numero"><b>Número*</b></label>
              <input id="numero" name="numero" type="number" value={form.numero} onChange={handleChange} required placeholder="2015" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="complemento"><b>Complemento</b></label>
              <input id="complemento" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Ap 307" />
            </div>
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="bairro"><b>Bairro*</b></label>
              <input id="bairro" name="bairro" value={form.bairro} onChange={handleChange} required placeholder="Centro" />
            </div>
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="pontoReferencia"><b>Ponto de referência</b></label>
              <input id="pontoReferencia" name="pontoReferencia" value={form.pontoReferencia} onChange={handleChange} placeholder="Em frente ao parque" />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Doador"}
            </button>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroDoador; 