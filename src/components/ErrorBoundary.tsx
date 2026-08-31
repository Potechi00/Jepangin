import React from 'react';
import { RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('JEPANGIN ErrorBoundary caught an unhandled exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    try {
      window.location.reload();
    } catch {
      window.location.href = window.location.href;
    }
  };

  handleResetToGuest = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('jepangin_current_session_user_v1');
      }
    } catch {
      // Ignore
    }
    this.handleReload();
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'Terjadi kesalahan tidak terduga pada runtime.';
      const componentStack = this.state.errorInfo?.componentStack || '';

      return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-center space-y-5">
            {/* JEPANGIN Logo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-rose-600/30">
              <span className="text-3xl sm:text-4xl font-black">日</span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  JEPANGIN
                </h1>
                <span className="text-xs bg-rose-500/25 text-rose-300 font-extrabold px-2 py-0.5 rounded-full border border-rose-400/30">
                  ID
                </span>
              </div>
              <h2 className="text-lg font-bold text-rose-200 mt-2">
                Terjadi masalah saat memuat aplikasi
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed">
                Jangan khawatir, catatan dan progress belajarmu tetap aman di perangkat ini.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                id="btn-error-reload"
                onClick={this.handleReload}
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-sm sm:text-base shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Coba Lagi</span>
              </button>

              <button
                id="btn-error-reset"
                onClick={this.handleResetToGuest}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Muat Ulang Sesi (Mode Tamu)
              </button>
            </div>

            {/* Error Details (Toggleable Debug Info) */}
            <div className="pt-2 text-left">
              <button
                onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                className="flex items-center justify-between w-full text-[11px] text-neutral-400 hover:text-neutral-200 py-1 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Info Teknis / Debug
                </span>
                {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-3 bg-black/40 border border-white/10 rounded-xl text-[10px] font-mono text-rose-300 overflow-x-auto max-h-40 break-all leading-tight">
                  <p className="font-bold text-white mb-1">Pesan Error:</p>
                  <p className="text-rose-400 mb-2">{errorMessage}</p>
                  {componentStack && (
                    <>
                      <p className="font-bold text-white mb-1">Stack Trace:</p>
                      <pre className="text-neutral-400 whitespace-pre-wrap">{componentStack}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
