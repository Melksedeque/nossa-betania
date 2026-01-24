'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminGetUsers, adminToggleUserStatus, adminCreateUser, adminUpdateUser, deleteUser } from '@/app/lib/actions';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useToast } from '@/components/Toast';

// Types
type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN';
  situation: 'ATIVO' | 'EXILADO';
  createdAt: string;
};

type Pagination = {
  total: number;
  totalPages: number;
  currentPage: number;
};

type UserModalMode = 'CREATE' | 'EDIT';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: UserModalMode;
  user?: User | null;
}

// User Modal Component
function UserModal({ isOpen, onClose, onSuccess, mode, user }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [situation, setSituation] = useState<'ATIVO' | 'EXILADO'>('ATIVO');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      if (mode === 'EDIT' && user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setRole(user.role);
        setSituation(user.situation);
        setPassword('');
        setConfirmPassword('');
      } else {
        setName('');
        setEmail('');
        setRole('USER');
        setSituation('ATIVO');
        setPassword('');
        setConfirmPassword('');
      }
    }
  }, [isOpen, mode, user]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (mode === 'CREATE') {
      if (password !== confirmPassword) {
        addToast('As senhas não coincidem.', 'error');
        setLoading(false);
        return;
      }
    } else {
      // In EDIT, if password is filled, check match
      if (password && password !== confirmPassword) {
        addToast('As senhas não coincidem.', 'error');
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('role', role);
    formData.append('situation', situation);
    
    if (password) {
      formData.append('password', password);
    }

    try {
      let result;
      if (mode === 'CREATE') {
        result = await adminCreateUser(formData);
      } else {
        if (user) {
          formData.append('userId', user.id);
          result = await adminUpdateUser(formData);
        } else {
          result = { success: false, message: 'Usuário não identificado.' };
        }
      }

      if (result.success) {
        addToast(result.message, 'success');
        onSuccess();
        onClose();
      } else {
        addToast(result.message, 'error');
      }
    } catch (error) {
      addToast('Erro inesperado.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg border-slate-700 bg-slate-900 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          {mode === 'CREATE' ? 'Novo Usuário' : 'Editar Usuário'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">E-mail</label>
              <input
                type="email"
                required
                disabled={mode === 'EDIT'} // Usually email change requires more validation, but admin can override? Let's keep editable or not? Requirements say "Email". Let's assume editable for admin.
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Função</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="USER">Usuário</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Situação</label>
              <select
                value={situation}
                onChange={(e) => setSituation(e.target.value as 'ATIVO' | 'EXILADO')}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="ATIVO">Ativo</option>
                <option value="EXILADO">Exilado</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Segurança</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">
                  {mode === 'CREATE' ? 'Senha' : 'Nova Senha (opcional)'}
                </label>
                <input
                  type="password"
                  required={mode === 'CREATE'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Confirmar Senha</label>
                <input
                  type="password"
                  required={mode === 'CREATE' || !!password}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            {mode === 'CREATE' && (
              <p className="text-[10px] text-slate-500 mt-2">
                * A senha deve ter no mínimo 8 caracteres, contendo letras e números.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// Main Component
export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, totalPages: 0, currentPage: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const { addToast } = useToast();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<UserModalMode>('CREATE');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminGetUsers(page, 10, search, statusFilter);
      if (result.success && result.data) {
        setUsers(result.data.users as User[]);
        setPagination({
          total: result.data.total,
          totalPages: result.data.totalPages,
          currentPage: result.data.currentPage,
        });
      } else {
        addToast(result.message || 'Erro ao carregar usuários', 'error');
      }
    } catch (error) {
      addToast('Erro de conexão', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, addToast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setModalMode('CREATE');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setModalMode('EDIT');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (userId: string) => {
    if (!confirm('Tem certeza que deseja alterar o status deste usuário?')) return;
    
    try {
      const result = await adminToggleUserStatus(userId);
      if (result.success) {
        addToast(result.message, 'success');
        fetchUsers();
      } else {
        addToast(result.message, 'error');
      }
    } catch (error) {
      addToast('Erro ao alterar status', 'error');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Tem certeza que deseja EXCLUIR PERMANENTEMENTE este usuário? Esta ação não pode ser desfeita.')) return;

    try {
      const result = await deleteUser(userId);
      if (result.success) {
        addToast(result.message, 'success');
        fetchUsers();
      } else {
        addToast(result.message, 'error');
      }
    } catch (error) {
      addToast('Erro ao excluir usuário', 'error');
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Gerenciamento de Usuários</h2>
          <p className="text-xs text-slate-400 mt-1">
            Administre os usuários da plataforma, crie contas e gerencie permissões.
          </p>
        </div>
        <Button 
          onClick={handleOpenCreate}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm"
        >
          + Novo Usuário
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset page on search
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ATIVO">Ativos</option>
            <option value="EXILADO">Exilados</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900/80 text-slate-200 uppercase font-medium text-xs">
            <tr>
              <th className="px-4 py-3">Nome / Email</th>
              <th className="px-4 py-3 text-center">Função</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Data Criação</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 bg-slate-900/20">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Carregando usuários...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-medium">{user.name || 'Sem nome'}</span>
                      <span className="text-slate-500 text-xs">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      user.situation === 'ATIVO'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {user.situation}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(user)}
                      className="text-slate-400 hover:text-white transition-colors p-1"
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`transition-colors p-1 ${
                        user.situation === 'ATIVO' 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-emerald-400 hover:text-emerald-300'
                      }`}
                      title={user.situation === 'ATIVO' ? 'Exilar' : 'Ativar'}
                    >
                      {user.situation === 'ATIVO' ? '🚫' : '✅'}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-400 transition-colors p-1"
                      title="Excluir Permanentemente"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-xs text-slate-400">
          <span>
            Mostrando {(pagination.currentPage - 1) * 10 + 1} a {Math.min(pagination.currentPage * 10, pagination.total)} de {pagination.total} usuários
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="px-2 py-1 flex items-center">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
        mode={modalMode}
        user={selectedUser}
      />
    </div>
  );
}
