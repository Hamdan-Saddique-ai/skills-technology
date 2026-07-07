import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { listContactMessages } from "@/server/admin";
import type { ContactMessage } from "@/lib/types";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessagesPage,
});

function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session.session?.access_token;
      if (!accessToken) {
        setLoading(false);
        return;
      }
      const data = await listContactMessages({ data: { accessToken } });
      setMessages(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Contact messages</h1>

      {loading ? (
        <p className="text-sm text-[var(--color-ink)]/50">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-[var(--color-ink)]/50">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="glass rounded-[var(--radius-card)] p-5">
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold">{m.name}</span>
                <span className="text-xs text-[var(--color-ink)]/50">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <a href={`mailto:${m.email}`} className="text-sm text-[var(--color-royal)]">
                {m.email}
              </a>
              <p className="mt-2 text-sm text-[var(--color-ink)]/75">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
