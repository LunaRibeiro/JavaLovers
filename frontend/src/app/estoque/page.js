"use client";
import MenuBar from '../components/menubar/menubar';
import Navigation from '../components/navegation/navegation';
import styles from './estoque.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../services/api';
import { mapItemFromBackend, mapItemToBackend } from '../../services/dataMapper';
import { useApiList } from '../../hooks/useApi';

export default function EstoquePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [novoProduto, setNovoProduto] = useState({ nome: '', categoria: '', tamanho: '', quantidade: '' });
  const [editId, setEditId] = useState(null);
  const [editProduto, setEditProduto] = useState({ nome: '', categoria: '', tamanho: '', quantidade: '' });
  const router = useRouter();
  const hasNotification = false;

  const {
    data: mockEstoque,
    loading,
    error,
    loadData,
    addItem,
    updateItem,
    removeItem
  } = useApiList(apiService.getItems);

  useEffect(() => {
    loadData().catch(err => {
      console.error("Erro ao carregar itens:", err);
    });
  }, [loadData]);

  async function handleAddProduto(e) {
    e.preventDefault();
    try {
      const itemData = mapItemToBackend({
        ...novoProduto,
        quantidade: Number(novoProduto.quantidade)
      });
      
      const newItem = await apiService.createItem(itemData);
      addItem(mapItemFromBackend(newItem));
      
      setNovoProduto({ nome: '', categoria: '', tamanho: '', quantidade: '' });
      setShowAddModal(false);
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      alert("Erro ao adicionar produto. Tente novamente.");
    }
  }

  async function handleDeleteProduto() {
    try {
      await apiService.deleteItem(itemToDelete.id);
      removeItem(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Erro ao excluir produto. Tente novamente.");
    }
  }

  function openDeleteModal(item) {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }

  function startEditProduto(item) {
    setEditId(item.id);
    setEditProduto({
      nome: item.nome,
      categoria: item.categoria,
      tamanho: item.tamanho,
      quantidade: item.quantidade
    });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditProduto(prev => ({ ...prev, [name]: name === 'quantidade' ? Number(value) : value }));
  }

  async function saveEditProduto(id) {
    try {
      const itemData = mapItemToBackend({
        ...editProduto,
        quantidade: Number(editProduto.quantidade)
      });
      
      await apiService.updateItem(id, itemData);
      updateItem(id, editProduto);
      
      setEditId(null);
      setEditProduto({ nome: '', categoria: '', tamanho: '', quantidade: '' });
    } catch (err) {
      console.error("Erro ao editar produto:", err);
      alert("Erro ao editar produto. Tente novamente.");
    }
  }

  function cancelEditProduto() {
    setEditId(null);
    setEditProduto({ nome: '', categoria: '', tamanho: '', quantidade: '' });
  }

  function handleEditProduto(item) {
    router.push(`/estoque/editar/${item.id}`);
  }

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <MenuBar hasNotification={hasNotification} />
        <main className={styles.main}>
          <h1 className={styles.titulo}>Controle de Estoque</h1>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <button className={`${styles.btn} ${styles.btnAdicionar}`} onClick={() => setShowAddModal(true)}>
              + Adicionar Produto
            </button>
          </div>
          <table className={styles.tabela}>
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
              {mockEstoque.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  {editId === item.id ? (
                    <>
                      <td><input className={styles.formInput} name="nome" value={editProduto.nome} onChange={handleEditChange} /></td>
                      <td><input className={styles.formInput} name="categoria" value={editProduto.categoria} onChange={handleEditChange} /></td>
                      <td><input className={styles.formInput} name="tamanho" value={editProduto.tamanho} onChange={handleEditChange} /></td>
                      <td><input className={styles.formInput} name="quantidade" type="number" min={1} value={editProduto.quantidade} onChange={handleEditChange} /></td>
                      <td>
                        <button className={`${styles.btn} ${styles.btnAdicionar}`} onClick={() => saveEditProduto(item.id)}>Salvar</button>
                        <button className={`${styles.btn} ${styles.btnExcluir}`} onClick={cancelEditProduto}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.nome}</td>
                      <td>{item.categoria}</td>
                      <td>{item.tamanho}</td>
                      <td>{item.quantidade}</td>
                      <td>
                        <button className={`${styles.btn} ${styles.btnEditar}`} onClick={() => startEditProduto(item)}>
                          Editar
                        </button>
                        <button className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => openDeleteModal(item)}>
                          Excluir
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal Adicionar */}
          {showAddModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.titulo} style={{ fontSize: '1.3rem', marginBottom: 16 }}>Adicionar Produto</h2>
                <form className={styles.formulario} onSubmit={handleAddProduto}>
                  <label className={styles.formLabel}>Nome
                    <input className={styles.formInput} required value={novoProduto.nome} onChange={e => setNovoProduto({ ...novoProduto, nome: e.target.value })} />
                  </label>
                  <label className={styles.formLabel}>Categoria
                    <input className={styles.formInput} required value={novoProduto.categoria} onChange={e => setNovoProduto({ ...novoProduto, categoria: e.target.value })} />
                  </label>
                  <label className={styles.formLabel}>Tamanho
                    <input className={styles.formInput} required value={novoProduto.tamanho} onChange={e => setNovoProduto({ ...novoProduto, tamanho: e.target.value })} />
                  </label>
                  <label className={styles.formLabel}>Quantidade
                    <input className={styles.formInput} required type="number" min={1} value={novoProduto.quantidade} onChange={e => setNovoProduto({ ...novoProduto, quantidade: e.target.value })} />
                  </label>
                  <div className={styles.modalBotoes}>
                    <button type="button" className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => setShowAddModal(false)}>Cancelar</button>
                    <button type="submit" className={`${styles.btn} ${styles.btnAdicionar}`}>Adicionar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Modal Excluir */}
          {showDeleteModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.titulo} style={{ fontSize: '1.3rem', marginBottom: 16 }}>Confirmar Exclusão</h2>
                <p>Tem certeza que deseja excluir o produto <b>{itemToDelete?.nome}</b>?</p>
                <div className={styles.modalBotoes}>
                  <button className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => setShowDeleteModal(false)}>Não</button>
                  <button className={`${styles.btn} ${styles.btnAdicionar}`} onClick={handleDeleteProduto}>Sim</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
} 