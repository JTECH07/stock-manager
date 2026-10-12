import React, { useState, useEffect } from 'react';
import { api, UserPayload } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../components/Table';

export const UsersManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal création d'utilisateur
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const loadUsers = () => {
    setLoading(true);
    api.users
      .list()
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        console.error('Erreur chargement utilisateurs:', err);
        setError(err.message || 'Impossible de charger la liste des utilisateurs');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await api.users.updateRole(userId, newRole);
      setSuccess(`Rôle mis à jour avec succès`);
      loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erreur mise à jour rôle:', err);
      setError(err.message || 'Erreur lors de la mise à jour du rôle');
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (userId === currentUser?.id) {
      setError('Vous ne pouvez pas supprimer votre propre compte administrateur');
      return;
    }
    if (!window.confirm(`Confirmez-vous la suppression du compte "${userName}" ?`)) {
      return;
    }
    try {
      await api.users.remove(userId);
      setSuccess(`Utilisateur "${userName}" supprimé`);
      loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erreur suppression:', err);
      setError(err.message || 'Erreur lors de la suppression');
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.auth.register(newUserForm);
      setSuccess(`Utilisateur "${newUserForm.name}" créé avec succès`);
      setIsModalOpen(false);
      setNewUserForm({ name: '', email: '', password: '', role: 'USER' });
      loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erreur création:', err);
      setError(err.message || 'Erreur lors de la création');
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#2B2D42' }}>
            Gestion des Utilisateurs & Permissions
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
            Administration des comptes d'accès, affectation des rôles (ADMIN, MANAGER, USER)
          </p>
        </div>

        <Button variant="accent" onClick={() => setIsModalOpen(true)}>
          Créer un Utilisateur
        </Button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #F77F00',
            color: '#92400E',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
          }}
        >
          {success}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
          Chargement des utilisateurs...
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell isHeader align="center">ID</TableCell>
              <TableCell isHeader>Nom & Prénom</TableCell>
              <TableCell isHeader>Email</TableCell>
              <TableCell isHeader align="center">Rôle Assigné</TableCell>
              <TableCell isHeader align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => {
              const isSelf = u.id === currentUser?.id;
              return (
                <TableRow key={u.id}>
                  <TableCell align="center">#{u.id}</TableCell>
                  <TableCell style={{ fontWeight: 600, color: '#2B2D42' }}>
                    {u.name} {isSelf && '(Vous)'}
                  </TableCell>
                  <TableCell style={{ color: '#64748B' }}>{u.email}</TableCell>
                  <TableCell align="center">
                    <select
                      value={u.role}
                      disabled={isSelf}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#F8F9FA',
                        fontWeight: 700,
                        color:
                          u.role === 'ADMIN'
                            ? '#D90429'
                            : u.role === 'MANAGER'
                            ? '#F77F00'
                            : '#2B2D42',
                        cursor: isSelf ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <option value="USER">USER (Opérateur)</option>
                      <option value="MANAGER">MANAGER (Responsable)</option>
                      <option value="ADMIN">ADMIN (Plein accès)</option>
                    </select>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="danger"
                      disabled={isSelf}
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      onClick={() => handleDeleteUser(u.id, u.name)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Modal Création Utilisateur */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(43, 45, 66, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <h2
              style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#2B2D42',
                marginBottom: '16px',
              }}
            >
              Ajouter un Nouvel Utilisateur
            </h2>

            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8F9FA',
                  }}
                  placeholder="Ex: Jean Dupont"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Adresse Email *
                </label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8F9FA',
                  }}
                  placeholder="jean.dupont@entreprise.com"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Mot de passe provisoire *
                </label>
                <input
                  type="password"
                  required
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8F9FA',
                  }}
                  placeholder="••••••••"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Rôle initial
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8F9FA',
                  }}
                >
                  <option value="USER">USER (Opérateur)</option>
                  <option value="MANAGER">MANAGER (Responsable)</option>
                  <option value="ADMIN">ADMIN (Administrateur)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button variant="accent" type="submit">
                  Créer l'utilisateur
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

