"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fuel } from "lucide-react";
import { login } from "@/src/lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  

  async function handleLogin() {
    setLoading(true);
    setErro("");
    try {
      const data = await login(email, senha);
      localStorage.setItem('token', data.token);
      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      localStorage.setItem('nome', data.nome);
      localStorage.setItem('role', data.role);
      router.push("/");
      router.refresh();
    } catch {
      setErro("Email ou senha incorretos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
            <Fuel size={24} color="white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">LogiDash</h1>
          <p className="text-slate-500 text-sm">Gestão de Frota</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErro(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => { setSenha(e.target.value); setErro(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${erro ? "border-red-400" : "border-slate-200"}`}
          />
          {erro && <p className="text-red-500 text-xs">{erro}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}