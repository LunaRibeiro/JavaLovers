"use client";
import { useState, useEffect } from 'react';
import Navigation from '../components/navegation/navegation';
import MenuBar from '../components/menubar/menubar';
import apiService from '../../services/api';
import { useNotification } from '../../components/notifications/NotificationProvider';
import { useApi } from '../../hooks/useApi';

export default function ConfiguracoesPage() {
  const { showNotification } = useNotification();
  const { loading, execute } = useApi();
  const [config, setConfig] = useState({
    monthlyItemLimit: 10,
    isActive: true
  });
  const [configId, setConfigId] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoadingConfig(true);
      const data = await apiService.getWithdrawalLimitConfig();
      setConfig({
        monthlyItemLimit: data.monthlyItemLimit,
        isActive: data.isActive
      });
      setConfigId(data.configId);
    } catch (err) {
      console.error("Erro ao carregar configuração:", err);
      showNotification("Erro ao carregar configuração", "error");
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!configId) {
      showNotification("Configuração não encontrada", "error");
      return;
    }

    try {
      await execute(() => apiService.updateWithdrawalLimitConfig(configId, config));
      showNotification("Configuração atualizada com sucesso!", "success");
    } catch (err) {
      showNotification(err.message || "Erro ao atualizar configuração", "error");
    }
  };

  return (
    <>
      <Navigation />
      <div style={{ minHeight: '100vh', background: '#fff', marginLeft: 220 }}>
        <MenuBar />
        <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: '#333', whiteSpace: 'normal', wordWrap: 'break-word', overflow: 'visible' }}>
            Configurações
          </h1>

          <div style={{
            background: '#f9f9f9',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid #e0e0e0',
            marginBottom: '30px'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#4CAF50', whiteSpace: 'normal', wordWrap: 'break-word', overflow: 'visible' }}>
              Limites de Retirada
            </h2>
            <p style={{ color: '#666', marginBottom: '20px', whiteSpace: 'normal', wordWrap: 'break-word', overflow: 'visible' }}>
              Configure o limite mensal de itens que cada beneficiário pode retirar.
            </p>

            {loadingConfig ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', whiteSpace: 'normal', wordWrap: 'break-word', overflow: 'visible' }}>
                    Limite Mensal de Itens
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.monthlyItemLimit}
                    onChange={(e) => setConfig({ ...config, monthlyItemLimit: parseInt(e.target.value) || 1 })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                  <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                    Número máximo de itens que um beneficiário pode retirar por mês.
                  </small>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.isActive}
                      onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span style={{ fontWeight: '600', color: '#333' }}>Ativar limite de retirada</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Salvando...' : 'Salvar Configuração'}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </>
  );
} 