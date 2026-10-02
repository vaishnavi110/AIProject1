import React from 'react';
import { ShoppingBag, Server, CheckCircle2, ShieldCheck } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold tracking-tight text-white">
              Mini E-Commerce <span className="text-indigo-400 text-sm font-semibold ml-1">MERN</span>
            </span>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Phase 1 Setup Ready
          </span>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
          <ShieldCheck className="w-4 h-4 text-indigo-400" /> Phase 1: Project Setup & Configuration
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
          Mini E-Commerce Storefront & Admin API
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Workspaces initialized successfully with React 19 + Vite, Tailwind CSS, and Node.js + Express backend.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-indigo-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Frontend Client</h3>
            <p className="text-sm text-slate-400">
              Vite dev server running on port 5173 with proxy forwarding <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">/api</code> requests to port 5000.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-indigo-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Backend Server</h3>
            <p className="text-sm text-slate-400">
              Express server listening on port 5000 with CORS, JSON body parser, Mongoose connection, and health-check route.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        Mini E-Commerce Project &bull; Built with MERN Stack
      </footer>
    </div>
  );
}

export default App;
