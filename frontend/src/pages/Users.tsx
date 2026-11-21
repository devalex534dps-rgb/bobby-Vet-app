import React, { useEffect, useState, useCallback } from "react";
import { Plus, Search, Trash2, Loader2, AlertCircle, X, ShieldCheck } from "lucide-react";
import { StyledSelect } from "@/components/ui/StyledSelect";
import { bobbyApi, type BackendUserDto } from "@/services/bobbyApi";
import { confirmDeleteAlert, showToast } from "@/lib/sweetalert";
import {
  validateEmail,
  validatePasswordComplexity,
  validateRequired,
} from "@/lib/formValidation";

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<BackendUserDto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("VETERINARIO");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [modalError, setModalError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bobbyApi.getUsers({ q, role: roleFilter, page, size: 8 });
      setUsers(res.items);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando usuarios.");
    } finally {
      setLoading(false);
    }
  }, [q, roleFilter, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    const nextErrs = {
      fullName: validateRequired(fullName, "El nombre"),
      email: validateEmail(email),
      password: validatePasswordComplexity(password),
    };
    setFieldErrors(nextErrs);
    if (Object.values(nextErrs).some(Boolean)) return;

    setSaving(true);
    try {
      await bobbyApi.createUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        roleName,
      });
      setShowModal(false);
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      showToast("success", "Usuario creado correctamente");
      loadUsers();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "No se pudo crear el usuario.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (u: BackendUserDto) => {
    const confirmed = await confirmDeleteAlert(`al usuario ${u.fullName}`);
    if (!confirmed) return;
    try {
      await bobbyApi.deleteUser(u.id);
      showToast("success", "Usuario desactivado");
      loadUsers();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error al desactivar");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-on-surface-variant">
            Administra cuentas y niveles de acceso ({totalItems} registrados).
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFieldErrors({});
            setModalError(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setPage(0);
              setQ(e.target.value);
            }}
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
          />
        </div>
        <StyledSelect
          value={roleFilter}
          onChange={(val) => {
            setPage(0);
            setRoleFilter(val);
          }}
          icon={<ShieldCheck className="w-3.5 h-3.5" />}
          className="min-w-[170px]"
          options={[
            { value: "", label: "Rol: Todos" },
            { value: "ADMIN", label: "ADMIN" },
            { value: "VETERINARIO", label: "VETERINARIO" },
            { value: "CLIENTE", label: "CLIENTE" },
          ]}
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error-container/40 text-error text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-x-auto">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase text-on-surface-variant">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-semibold text-on-surface">{u.fullName}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      <ShieldCheck className="w-3 h-3" /> {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {u.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.active && (
                      <button
                        type="button"
                        onClick={() => handleDeactivate(u)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 cursor-pointer"
                        title="Desactivar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Server-side pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50 cursor-pointer"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50 cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface">Nuevo Usuario</h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            {modalError && (
              <div className="p-3 rounded-xl bg-error-container/40 text-error text-xs">{modalError}</div>
            )}
            <form onSubmit={handleCreate} className="space-y-3" noValidate>
              <div>
                <label className="block text-xs font-semibold mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setFieldErrors((p) => ({ ...p, fullName: validateRequired(e.target.value, "El nombre") }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
                {fieldErrors.fullName && <p className="text-xs text-error mt-1">{fieldErrors.fullName}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
                {fieldErrors.email && <p className="text-xs text-error mt-1">{fieldErrors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rol</label>
                <StyledSelect
                  value={roleName}
                  onChange={setRoleName}
                  icon={<ShieldCheck className="w-4 h-4" />}
                  options={[
                    { value: "ADMIN", label: "ADMIN" },
                    { value: "VETERINARIO", label: "VETERINARIO" },
                    { value: "CLIENTE", label: "CLIENTE" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((p) => ({
                      ...p,
                      password: validatePasswordComplexity(e.target.value),
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
                {fieldErrors.password && <p className="text-xs text-error mt-1">{fieldErrors.password}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
