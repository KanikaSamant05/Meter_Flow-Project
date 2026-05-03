import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FREE_LIMIT = 10;
const COST_PER_CALL = 1.00;

const TYPE_STYLES = {
  fire:     "bg-red-500/10 text-red-400 border-red-500/30",
  water:    "bg-blue-500/10 text-blue-400 border-blue-500/30",
  grass:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  electric: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  psychic:  "bg-pink-500/10 text-pink-400 border-pink-500/30",
  ice:      "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  dragon:   "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  dark:     "bg-gray-500/10 text-gray-400 border-gray-500/30",
  fairy:    "bg-pink-400/10 text-pink-300 border-pink-400/30",
  normal:   "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
  fighting: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  poison:   "bg-purple-500/10 text-purple-400 border-purple-500/30",
  ground:   "bg-amber-500/10 text-amber-400 border-amber-500/30",
  flying:   "bg-sky-500/10 text-sky-400 border-sky-500/30",
  bug:      "bg-lime-500/10 text-lime-400 border-lime-500/30",
  rock:     "bg-stone-500/10 text-stone-400 border-stone-500/30",
  ghost:    "bg-violet-500/10 text-violet-400 border-violet-500/30",
  steel:    "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

const EXAMPLES = ["pikachu", "charizard", "mewtwo", "eevee", "gengar", "snorlax", "lucario", "garchomp"];

export default function PokeAPIWidget() {
  const navigate = useNavigate();

  const [query, setQuery]               = useState("");
  const [pokemon, setPokemon]           = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [callCount, setCallCount]       = useState(0);
  const [totalCost, setTotalCost]       = useState(0);
  const [awaitConfirm, setAwaitConfirm] = useState(false);

  const isBillable = callCount >= FREE_LIMIT;
  const freeLeft   = Math.max(0, FREE_LIMIT - callCount);

  async function fetchPokemon(name) {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setPokemon(null);
    setAwaitConfirm(false);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase().trim()}`);
      if (!res.ok) throw new Error("Pokémon not found");
      const data = await res.json();
      const newCount = callCount + 1;
      setCallCount(newCount);
      if (newCount > FREE_LIMIT) setTotalCost(p => +(p + COST_PER_CALL).toFixed(2));
      setPokemon(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    if (!query.trim()) return;
    if (isBillable) { setAwaitConfirm(true); return; }
    fetchPokemon(query);
  }

  function handleConfirm() {
    navigate("/payment", {
      state: {
        cost: COST_PER_CALL,
        totalCost: totalCost + COST_PER_CALL,
        pokemonName: query,
      },
    });
  }

  const img = pokemon?.sprites?.other?.["official-artwork"]?.front_default
            || pokemon?.sprites?.front_default;

  return (
    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
          <span className="text-white text-sm font-medium tracking-tight">PokéAPI Demo</span>
          <span className="text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5 font-mono">LIVE</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className={freeLeft > 0 ? "text-green-400" : "text-white/30"}>
            {freeLeft > 0 ? `${freeLeft} free left` : "Free tier used"}
          </span>
          {totalCost > 0 && (
            <span className="text-red-400">${totalCost.toFixed(2)} billed</span>
          )}
        </div>
      </div>

      {/* Billing progress bar */}
      <div className="px-5 pt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-white/30 font-mono">API calls used</span>
          <span className="text-[10px] text-white/30 font-mono">{callCount} / {FREE_LIMIT} free</span>
        </div>
        <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${callCount > FREE_LIMIT ? "bg-red-500" : "bg-green-500"}`}
            style={{ width: `${Math.min(100, (callCount / FREE_LIMIT) * 100)}%` }}
          />
        </div>
        {callCount > FREE_LIMIT && (
          <p className="text-[10px] text-red-400/70 mt-1 font-mono">
            Billing active · ${COST_PER_CALL.toFixed(2)}/call
          </p>
        )}
      </div>

      {/* Search */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Enter Pokémon name or ID..."
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-green-500/40 font-mono transition-colors"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              loading
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : isBillable
                ? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
                : "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30"
            }`}
          >
            {loading ? "···" : isBillable ? "Charge & Search" : "Search"}
          </button>
        </div>

        {/* Quick picks */}
        <div className="flex flex-wrap gap-2 mt-2.5">
          <span className="text-[10px] text-white/20 font-mono self-center">try:</span>
          {EXAMPLES.map(name => (
            <button
              key={name}
              onClick={() => setQuery(name)}
              className="text-[11px] font-mono text-white/30 hover:text-green-400 transition-colors capitalize"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Charge confirmation */}
      {awaitConfirm && (
        <div className="mx-5 mb-3 flex items-center justify-between bg-red-500/[0.08] border border-red-500/20 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm text-red-400 font-medium">Confirm charge</p>
            <p className="text-[11px] text-red-400/60 font-mono mt-0.5">
              This call costs ${COST_PER_CALL.toFixed(2)} · Total will be ${(totalCost + COST_PER_CALL).toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2 ml-4 shrink-0">
            <button
              onClick={handleConfirm}
              className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all"
            >
              Confirm
            </button>
            <button
              onClick={() => setAwaitConfirm(false)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/40 rounded-lg text-xs hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-5 mb-4 px-4 py-3 bg-red-500/[0.08] border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400 font-mono">{error}</p>
          <p className="text-[11px] text-red-400/50 mt-0.5">Try: pikachu, bulbasaur, or a number like 25</p>
        </div>
      )}

      {/* Pokémon result card */}
      {pokemon && (
        <div className="mx-5 mb-5 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          {/* Top info */}
          <div className="flex items-center gap-4 p-4 border-b border-white/[0.05]">
            {img && (
              <img
                src={img}
                alt={pokemon.name}
                className="w-16 h-16 drop-shadow-lg"
                style={{ imageRendering: "pixelated" }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-white font-semibold capitalize text-base tracking-tight">{pokemon.name}</h3>
                <span className="text-white/20 font-mono text-xs">#{String(pokemon.id).padStart(3, "0")}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {pokemon.types.map(t => (
                  <span
                    key={t.type.name}
                    className={`text-[10px] px-2 py-0.5 rounded-full border capitalize font-medium ${TYPE_STYLES[t.type.name] || "bg-white/5 text-white/40 border-white/10"}`}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-white/20 font-mono">height</p>
              <p className="text-white text-sm font-mono">{(pokemon.height / 10).toFixed(1)}m</p>
              <p className="text-[10px] text-white/20 font-mono mt-1">weight</p>
              <p className="text-white text-sm font-mono">{(pokemon.weight / 10).toFixed(1)}kg</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {pokemon.stats.map(s => {
              const pct   = Math.min(100, Math.round((s.base_stat / 255) * 100));
              const color = pct > 66 ? "bg-green-500" : pct > 33 ? "bg-yellow-500" : "bg-red-500";
              return (
                <div key={s.stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-white/30 capitalize font-mono">
                      {s.stat.name.replace("special-", "sp.").replace("-", " ")}
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">{s.base_stat}</span>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Abilities */}
          <div className="px-4 pb-4">
            <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest mb-2">Abilities</p>
            <div className="flex gap-1.5 flex-wrap">
              {pokemon.abilities.map(a => (
                <span
                  key={a.ability.name}
                  className="text-[11px] px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/50 capitalize font-mono"
                >
                  {a.ability.name}
                  {a.is_hidden && <span className="text-yellow-500/70 ml-1 text-[9px]">hidden</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!pokemon && !error && !loading && (
        <div className="px-5 pb-6 text-center">
          <p className="text-white/10 text-xs font-mono">Search any Pokémon to make a live API call</p>
        </div>
      )}
    </div>
  );
}