import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--accent-light)]/20 bg-[var(--card)]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-[var(--text)]">
            Mental Coach
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            A supportive space to reflect and grow
          </p>
        </div>
      </header>

      {/* Chat container */}
      <div className="flex-1 max-w-2xl w-full mx-auto flex flex-col px-4 py-6">
        <div className="flex-1 bg-[var(--card)] rounded-2xl border border-[var(--accent-light)]/20 shadow-sm overflow-hidden min-h-[400px]">
          <Chat />
        </div>
      </div>
    </main>
  );
}
