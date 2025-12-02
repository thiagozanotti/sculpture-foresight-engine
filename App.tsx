import React, { useEffect, useState } from 'react';
import { generateForesightReport } from './services/geminiService';
import { WatchtowerReport, ViewMode } from './types';
import PressureGauge from './components/PressureGauge';
import SignalCard from './components/SignalCard';
import CategoryChart from './components/CategoryChart';
import OracleChat from './components/OracleChat';
import { LayoutGrid, Radar, Terminal, RefreshCw, Box } from 'lucide-react';

const App: React.FC = () => {
  const [report, setReport] = useState<WatchtowerReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('dashboard');
  const [apiKeyError, setApiKeyError] = useState(false);

  const fetchData = async () => {
    if (!process.env.API_KEY) {
        setApiKeyError(true);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const data = await generateForesightReport();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (apiKeyError) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-400 p-6">
              <div className="max-w-md text-center">
                  <Box size={48} className="mx-auto mb-4 text-bronze-500" />
                  <h1 className="text-xl font-serif text-white mb-2">API Key Required</h1>
                  <p>This Foresight Engine requires a Google Gemini API Key to function. Please ensure the environment is configured correctly.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar / Navbar */}
      <nav className="w-full md:w-20 lg:w-64 bg-stone-900 border-b md:border-b-0 md:border-r border-stone-800 flex flex-row md:flex-col justify-between p-4 sticky top-0 z-20 h-auto md:h-screen">
        <div className="flex flex-row md:flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2 mb-0 md:mb-8">
                <Box className="text-bronze-500 w-8 h-8" />
                <span className="hidden lg:block font-serif font-bold text-xl tracking-tight text-white">
                    Foresight<br/><span className="text-stone-500 text-sm font-sans font-normal">Engine v1.0</span>
                </span>
            </div>

            <div className="flex flex-row md:flex-col gap-2 w-full">
                <button 
                    onClick={() => setView('dashboard')}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all w-full ${view === 'dashboard' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900'}`}
                >
                    <LayoutGrid size={20} />
                    <span className="hidden lg:inline">Dashboard</span>
                </button>
                <button 
                    onClick={() => setView('signals')}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all w-full ${view === 'signals' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900'}`}
                >
                    <Radar size={20} />
                    <span className="hidden lg:inline">Raw Signals</span>
                </button>
                <button 
                    onClick={() => setView('oracle')}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all w-full ${view === 'oracle' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900'}`}
                >
                    <Terminal size={20} />
                    <span className="hidden lg:inline">Oracle</span>
                </button>
            </div>
        </div>

        <div className="hidden md:block text-xs text-stone-600">
            <p>System Status: Online</p>
            <p className="mt-1">Latency: 24ms</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto h-screen">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
                    {view === 'dashboard' && 'Executive Overview'}
                    {view === 'signals' && 'Signal Feed'}
                    {view === 'oracle' && 'Foresight Oracle'}
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    {loading ? 'Ingesting global feeds...' : `Last scan: ${report ? new Date(report.timestamp).toLocaleTimeString() : 'N/A'}`}
                </p>
            </div>
            <button 
                onClick={fetchData}
                disabled={loading}
                className="p-2 bg-stone-900 border border-stone-800 rounded-full hover:bg-stone-800 hover:text-bronze-400 transition-all disabled:opacity-50"
            >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
        </header>

        {loading && !report ? (
            <div className="h-96 flex flex-col items-center justify-center text-stone-500 animate-pulse">
                <Box size={48} className="mb-4 text-stone-700" />
                <p className="font-mono text-sm">Initializing Neural Sensors...</p>
                <p className="font-mono text-xs mt-2 text-stone-700">Scraping RSS / Parsing Materials / Calibrating Weights</p>
            </div>
        ) : (
            <div className="max-w-7xl mx-auto animate-fadeIn">
                
                {/* Dashboard View */}
                {view === 'dashboard' && report && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* KPI Cards */}
                        <div className="md:col-span-1 bg-stone-900 border border-stone-800 rounded-xl p-6 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Radar size={100} />
                             </div>
                            <h2 className="text-stone-400 uppercase text-xs tracking-widest font-semibold mb-4">Innovation Pressure</h2>
                            <PressureGauge value={report.pressure_index} />
                            <p className="text-center text-sm text-stone-500 mt-2 px-4">
                                {report.pressure_index > 0.7 ? "High volatility detected. Major shifts in fabrication tech impending." : "Steady state. Incremental material improvements observed."}
                            </p>
                        </div>

                        <div className="md:col-span-2 bg-stone-900 border border-stone-800 rounded-xl p-6">
                            <h2 className="text-stone-400 uppercase text-xs tracking-widest font-semibold mb-4">Signal Distribution</h2>
                            <CategoryChart signals={report.signals} />
                        </div>

                        {/* Recent High Impact Signals */}
                        <div className="md:col-span-3">
                             <h2 className="text-stone-400 uppercase text-xs tracking-widest font-semibold mb-4 mt-4">High Impact Vectors</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {report.signals.slice(0, 4).map((s, i) => (
                                    <SignalCard key={i} signal={s} />
                                ))}
                             </div>
                        </div>
                    </div>
                )}

                {/* Signals View */}
                {view === 'signals' && report && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {report.signals.map((s, i) => (
                            <SignalCard key={i} signal={s} />
                        ))}
                    </div>
                )}

                {/* Oracle View */}
                {view === 'oracle' && report && (
                    <div className="h-[calc(100vh-200px)]">
                        <OracleChat signals={report.signals} />
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default App;