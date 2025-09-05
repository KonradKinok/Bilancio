import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Opcjonalny niestandardowy UI dla błędów
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Aktualizuj stan, aby wyświetlić fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Loguj błąd, np. do konsoli lub serwisu monitorowania
    console.error("Nieobsłużony błąd:", error, errorInfo);
    // Możesz wysłać błąd do zewnętrznego serwisu, np. Sentry
    // import * as Sentry from "@sentry/react";
    // Sentry.captureException(error, { extra: errorInfo });
  }
  handleRestart = () => {
    // Wysyła sygnał do głównego procesu Electron, aby zrestartować aplikację
    window.electron.restartApp();
  };
  render() {
    if (this.state.hasError) {
      // Domyślny fallback UI lub przekazany przez props
      return (
        this.props.fallback || (
          <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
            <h2>Wystąpił błąd</h2>
            <p>{this.state.error?.message || "Nieznany błąd"}</p>
            <button
              // onClick={() => this.setState({ hasError: false, error: null })}
              onClick={this.handleRestart}
            >
              Spróbuj ponownie
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Możesz użyć ErrorBoundary w swoim kodzie, np.:
// <ErrorBoundary fallback={<CustomErrorUI />}>
//   <YourComponent />
// </ErrorBoundary>
// Pamiętaj, aby dostosować fallback UI do swoich potrzeb lub pozostawić domyślny.
// Możesz również dodać dodatkowe metody lub logikę do ErrorBoundary, jeśli potrzebujesz.
// Powyższy kod tworzy komponent ErrorBoundary, który przechwytuje błędy w komponentach potomnych i renderuje niestandardowy UI w przypadku wystąpienia błędu.
