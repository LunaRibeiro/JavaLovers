"use client";
import MenuBar from '../components/menubar/menubar';
import Navigation from '../components/navegation/navegation';
import styles from './estoque.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../services/api';
import { mapItemFromBackend, mapItemToBackend } from '../../services/dataMapper';
import { useApiList } from '../../hooks/useApi';
import { FaPlus } from 'react-icons/fa';
import { useNotification } from '../../components/notifications/NotificationProvider';
import ConfirmationModal from '../../components/confirmation/ConfirmationModal';

export default function EstoquePage() {
  const { showNotification } = useNotification();
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [novoProduto, setNovoProduto] = useState({ nome: '', categoria: '', tamanho: '', quantidade: '' });
  const router = useRouter();

  const {
    data: itemsRaw,
    loading,
    error,
    loadData: loadDataRaw,
    addItem,
    updateItem,
    removeItem
  } = useApiList((filters) => apiService.getItems(filters));

  const mockEstoque = Array.isArray(itemsRaw) 
    ? itemsRaw.map(mapItemFromBackend)
    : [];

  useEffect(() => {
    loadDataRaw().catch(err => {
      console.error("Erro ao carregar itens:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas na montagem do componente

  async function handleAddProduto(e) {
    e.preventDefault();
    try {
      const itemData = mapItemToBackend({
        ...novoProduto,
        quantidade: Number(novoProduto.quantidade)
      });
      
      await apiService.createItem(itemData);
      await loadDataRaw();
      
      setNovoProduto({ nome: '', categoria: '', tamanho: '', quantidade: '' });
      setShowAddModal(false);
      showNotification("Produto adicionado com sucesso!", "success");
    } catch (err) {
      showNotification(err.message || "Erro ao adicionar produto", "error");
    }
  }

  async function handleDeleteProduto() {
    if (!itemToDelete) return;
    
    try {
      await apiService.deleteItem(itemToDelete.id);
      await loadDataRaw();
      setItemToDelete(null);
      showNotification("Produto excluído com sucesso!", "success");
    } catch (err) {
      showNotification(err.message || "Erro ao excluir produto", "error");
    }
  }

  function openDeleteModal(item) {
    setItemToDelete(item);
  }

  function handleEditProduto(item) {
    router.push(`/estoque/editar/${item.id}`);
  }

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}>
        <div className={styles.listContainer}>
          <h1 className={styles.titulo}>Controle de Estoque</h1>
          <div className={styles.decoracao}></div>

          <div className={styles.actionsHeader}>
            <button
              className={styles.addButton}
              onClick={() => setShowAddModal(true)}
              title="Adicionar Novo Produto"
            >
              <FaPlus />
            </button>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.beneficiariosTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Tamanho</th>
                  <th>Quantidade</th>
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
                ) : mockEstoque.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.noDataMessage}>Nenhum produto cadastrado ainda.</td>
                  </tr>
                ) : (
                  mockEstoque.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nome}</td>
                      <td>{item.categoria}</td>
                      <td>{item.tamanho || '–'}</td>
                      <td>{item.quantidade}</td>
                      <td className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditProduto(item)}
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => openDeleteModal(item)}
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

      {/* Modal Adicionar */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.titulo} style={{ fontSize: '1.3rem', marginBottom: 16 }}>Adicionar Produto</h2>
            <form className={styles.formulario} onSubmit={handleAddProduto}>
              <div className={styles.formGroup}>
                <label htmlFor="nome"><b>Nome*</b></label>
                <input 
                  id="nome"
                  className={styles.formInput} 
                  required 
                  value={novoProduto.nome} 
                  onChange={e => setNovoProduto({ ...novoProduto, nome: e.target.value })} 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="categoria"><b>Categoria*</b></label>
                <input 
                  id="categoria"
                  className={styles.formInput} 
                  required 
                  value={novoProduto.categoria} 
                  onChange={e => setNovoProduto({ ...novoProduto, categoria: e.target.value })} 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tamanho"><b>Tamanho*</b></label>
                <input 
                  id="tamanho"
                  className={styles.formInput} 
                  required 
                  value={novoProduto.tamanho} 
                  onChange={e => setNovoProduto({ ...novoProduto, tamanho: e.target.value })} 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="quantidade"><b>Quantidade*</b></label>
                <input 
                  id="quantidade"
                  className={styles.formInput} 
                  required 
                  type="number" 
                  min={1} 
                  value={novoProduto.quantidade} 
                  onChange={e => setNovoProduto({ ...novoProduto, quantidade: e.target.value })} 
                />
              </div>
              <div className={styles.modalButtonGroup}>
                <button 
                  type="button" 
                  className={styles.cancelButton} 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteProduto}
        title="Confirmar Exclusão"
        message={itemToDelete ? `Tem certeza que deseja excluir o produto "${itemToDelete.nome}"?` : ""}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}
