"use client";

import { useState, useEffect, useCallback } from "react";

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  from: string;
  to: string;
  date: string;
  type: string;
  notes: string;
  status: "new" | "approved" | "rejected" | "sent";
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  sent: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Novo",
  approved: "Aprovado",
  rejected: "Rejeitado",
  sent: "Enviado",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const headers = useCallback(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${password}`,
    }),
    [password],
  );

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.status === 401) {
        setAuthed(false);
        setError("Password incorreta");
        return;
      }
      const data = await res.json();
      setQuotes(data.quotes || []);
      setError("");
    } catch {
      setError("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }, [password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthed(true);
    await fetchQuotes();
  };

  const handleAction = async (id: string, action: string) => {
    setActionLoading(id + action);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) await fetchQuotes();
      else setError("Ação falhou");
    } catch {
      setError("Erro de rede");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (authed) fetchQuotes();
  }, [authed, fetchQuotes]);

  const filtered =
    filter === "all" ? quotes : quotes.filter((q) => q.status === filter);

  // ─── Login screen ───
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm"
        >
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-1">
            123cheguei Admin
          </h1>
          <p className="text-sm text-gray-400 text-center mb-6">
            Painel de orçamentos
          </p>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 mb-4"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-[#1E3A5F] hover:bg-[#162d4a] text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // ─── Dashboard ───
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              123cheguei Admin
            </h1>
            <p className="text-xs text-gray-400">{quotes.length} pedidos</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchQuotes}
              disabled={loading}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {loading ? "A carregar..." : "↻ Atualizar"}
            </button>
            <button
              onClick={() => {
                setAuthed(false);
                setPassword("");
              }}
              className="text-sm text-red-400 hover:text-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "new", "approved", "rejected", "sent"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${filter === f ? "bg-[#1E3A5F] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`}
            >
              {f === "all" ? "Todos" : STATUS_LABELS[f]} (
              {f === "all"
                ? quotes.length
                : quotes.filter((q) => q.status === f).length}
              )
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Quotes list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Sem pedidos</p>
            <p className="text-sm mt-1">Os pedidos do website aparecem aqui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 truncate">
                        {q.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[q.status]}`}
                      >
                        {STATUS_LABELS[q.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">{q.from}</span> →{" "}
                      <span className="font-medium">{q.to}</span>
                      {q.date && (
                        <span className="ml-2 text-gray-400">· {q.date}</span>
                      )}
                      {q.type && (
                        <span className="ml-2 text-gray-400">· {q.type}</span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <a
                        href={`tel:${q.phone}`}
                        className="hover:text-[#5A9E2F] transition-colors"
                      >
                        {q.phone}
                      </a>
                      {q.email && (
                        <a
                          href={`mailto:${q.email}`}
                          className="hover:text-[#5A9E2F] transition-colors"
                        >
                          {q.email}
                        </a>
                      )}
                      <span>
                        {new Date(q.createdAt).toLocaleString("pt-PT", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {q.notes && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {q.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {q.status === "new" && (
                      <>
                        <button
                          onClick={() => handleAction(q.id, "approve")}
                          disabled={actionLoading === q.id + "approve"}
                          className="text-xs font-semibold px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          ✓ Aprovar
                        </button>
                        <button
                          onClick={() => handleAction(q.id, "reject")}
                          disabled={actionLoading === q.id + "reject"}
                          className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          ✕ Rejeitar
                        </button>
                      </>
                    )}
                    {q.status === "approved" && (
                      <button
                        onClick={() => handleAction(q.id, "send")}
                        disabled={actionLoading === q.id + "send"}
                        className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                      >
                        📧 Enviar Email
                      </button>
                    )}
                    {q.status === "sent" && (
                      <span className="text-xs text-gray-400">✓ Enviado</span>
                    )}
                    <button
                      onClick={() => handleAction(q.id, "delete")}
                      disabled={actionLoading === q.id + "delete"}
                      className="text-xs px-2 py-1.5 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Apagar"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
