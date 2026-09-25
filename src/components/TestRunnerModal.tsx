import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, XCircle, Clock, ShieldCheck, Terminal } from 'lucide-react';
import { runAllAutomatedTests, TestSuiteSummary } from '../utils/testRunner';
import { HardwareListing } from '../types/marketplace';

interface TestRunnerModalProps {
  listings: HardwareListing[];
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ listings, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testSummary, setTestSummary] = useState<TestSuiteSummary | null>(null);

  const executeTests = async () => {
    setIsRunning(true);
    try {
      const summary = await runAllAutomatedTests(listings);
      setTestSummary(summary);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    executeTests();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Consola de Tests Automatizados</h2>
              <p className="text-xs text-neutral-400">Pruebas unitarias y de integración sobre funcionalidades críticas.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary Status Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-neutral-950 rounded-xl border border-neutral-800 gap-4">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{testSummary?.passed || 0} Pasadas</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                <XCircle className="w-4 h-4" />
                <span>{testSummary?.failed || 0} Falladas</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400 font-mono">
                <Clock className="w-4 h-4" />
                <span>{testSummary?.durationMs || 0} ms de ejecución</span>
              </div>
            </div>

            <button
              onClick={executeTests}
              disabled={isRunning}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Ejecutando...' : 'Reejecutar Suites'}</span>
            </button>
          </div>

          {/* Test Case Breakdown List */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Resultados de Aserciones por Módulo Crítico
            </h3>

            {testSummary ? (
              <div className="space-y-2">
                {testSummary.results.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      {t.status === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{t.name}</span>
                          <span className="text-[10px] uppercase font-mono text-neutral-400">
                            [{t.suite}]
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          {t.assertionDetails || t.message}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                      {t.durationMs}ms
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500">
                Iniciando pruebas automatizadas...
              </div>
            )}
          </div>

          {/* Python Pytest Note */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-1 text-neutral-400">
            <p className="font-semibold text-neutral-200">Pruebas Backend con Pytest:</p>
            <p>
              El archivo <code className="text-emerald-400 font-mono">backend/test_api.py</code> contiene las suites complementarias para validar endpoints HTTP REST, generación de tokens JWT y constraints de base de datos SQLite/PostgreSQL en memoria. Ejecutar con: <code className="text-white font-mono bg-neutral-900 px-1.5 py-0.5 rounded">pytest -v test_api.py</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
