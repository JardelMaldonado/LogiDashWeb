"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { listarUsuarios, criarUsuario, editarUsuario, alterarStatusUsuario } from "../../lib/api";
import { RotaAdmin } from "@/src/components/layout/RotaAdmin";

import { UsuarioResponse, UsuarioRequest, ModalProps } from "../../types";
import { UserPlus, Pencil, ToggleLeft, ToggleRight, X, Shield, User } from "lucide-react";

const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all";
const labelClass = "text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block";



function Modal({ usuario, onSalvar, onFechar, loading }: Readonly<ModalProps>) {
  const [nome, setNome] = useState(usuario?.nome || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState(usuario?.role || "USER");

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-black text-lg">{usuario ? "Editar Usuário" : "Novo Usuário"}</h2>
          <button onClick={onFechar} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="input-nome" className={labelClass}>Nome</label>
            <input id="input-nome" type="text" value={nome} onChange={e => setNome(e.target.value)} className={inputClass} placeholder="Nome completo" />
          </div>
          <div>
            <label htmlFor="input-email" className={labelClass}>Email</label>
            <input id="input-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="email@exemplo.com" />
          </div>
          <div>
            <label htmlFor="input-senha" className={labelClass}>{usuario ? "Nova senha (deixe em branco para manter)" : "Senha"}</label>
            <input id="input-senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} className={inputClass} placeholder="••••••••" />
          </div>
          <div>
            <label htmlFor="input-role" className={labelClass}>Perfil</label>
            <select id="input-role" value={role} onChange={e => setRole(e.target.value)} className={inputClass}>
              <option value="USER" className="bg-slate-800">Usuário</option>
              <option value="ADMIN" className="bg-slate-800">Administrador</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onFechar} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => onSalvar({ nome, email, senha: senha || undefined, role })}
            disabled={loading || !nome || !email || (!usuario && !senha)}
            className="flex-1 px-4 py-2.5 text-sm font-bold bg-sky-500 hover:bg-sky-600 disabled:bg-sky-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<UsuarioResponse | undefined>();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const data = await listarUsuarios();
        if (ativo) setUsuarios(data);
      } catch {
        if (ativo) setErro("Erro ao carregar usuários");
      } finally {
        if (ativo) setLoading(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  async function handleSalvar(data: UsuarioRequest) {
    setSalvando(true);
    try {
      if (usuarioEditando) {
        const atualizado = await editarUsuario(usuarioEditando.id, data);
        setUsuarios(prev => prev.map(u => u.id === atualizado.id ? atualizado : u));
      } else {
        const novo = await criarUsuario(data);
        setUsuarios(prev => [...prev, novo]);
      }
      setModalAberto(false);
      setUsuarioEditando(undefined);
    } catch {
      setErro("Erro ao salvar usuário");
    } finally {
      setSalvando(false);
    }
  }

  async function handleAlterarStatus(id: number) {
    try {
      const atualizado = await alterarStatusUsuario(id);
      setUsuarios(prev => prev.map(u => u.id === atualizado.id ? atualizado : u));
    } catch {
      setErro("Erro ao alterar status");
    }
  }

  return (
    <RotaAdmin>
      <div className="min-h-screen bg-[#0F172A]">
        <Sidebar />
        <main className="ml-60 pt-8 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-white">Usuários</h1>
              <p className="text-slate-400 text-sm mt-1">Gerencie o acesso ao LogiDash</p>
            </div>
            <button
              onClick={() => { setUsuarioEditando(undefined); setModalAberto(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-sky-500/20"
            >
              <UserPlus size={16} /> Novo Usuário
            </button>
          </div>

          {erro && <p className="text-rose-400 text-sm mb-4">{erro}</p>}

          {loading ? (
            <div className="flex justify-center pt-20">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Perfil</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
                            {u.role === "ADMIN" ? <Shield size={14} className="text-sky-400" /> : <User size={14} className="text-slate-400" />}
                          </div>
                          <span className="text-sm font-bold text-white">{u.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.role === "ADMIN" ? "bg-sky-500/20 text-sky-400" : "bg-slate-700 text-slate-400"}`}>
                          {u.role === "ADMIN" ? "Admin" : "Usuário"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.ativo ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                          {u.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setUsuarioEditando(u); setModalAberto(true); }}
                            className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleAlterarStatus(u.id)}
                            className={`p-2 rounded-lg transition-colors ${u.ativo ? "text-emerald-400 hover:bg-emerald-500/10" : "text-rose-400 hover:bg-rose-500/10"}`}
                          >
                            {u.ativo ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {modalAberto && (
          <Modal
            usuario={usuarioEditando}
            onSalvar={handleSalvar}
            onFechar={() => { setModalAberto(false); setUsuarioEditando(undefined); }}
            loading={salvando}
          />
        )}
      </div>
    </RotaAdmin>
  );
}