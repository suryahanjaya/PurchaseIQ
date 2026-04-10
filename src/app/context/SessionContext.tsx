import { createContext, useContext, useState, ReactNode } from "react";

type SessionPhase = "empty" | "loading" | "loaded";
type PredictionPhase = "empty" | "analyzing" | "done";
export type ViewMode = "business" | "technical";

interface SessionContextType {
  sessionPhase: SessionPhase;
  predictionPhase: PredictionPhase;
  animationPlayed: boolean;
  viewMode: ViewMode;
  hasEntered: boolean;
  loadSession: () => void;
  analyzeSession: () => void;
  markAnimationPlayed: () => void;
  resetAll: () => void;
  setViewMode: (mode: ViewMode) => void;
  enterDashboard: (mode: ViewMode) => void;
  exitDashboard: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>("empty");
  const [predictionPhase, setPredictionPhase] = useState<PredictionPhase>("empty");
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("business");
  const [hasEntered, setHasEntered] = useState(false);

  const loadSession = () => {
    setSessionPhase("loading");
    setTimeout(() => setSessionPhase("loaded"), 1200);
  };

  const analyzeSession = () => {
    setPredictionPhase("analyzing");
  };

  const markAnimationPlayed = () => {
    setPredictionPhase("done");
    setAnimationPlayed(true);
  };

  const resetAll = () => {
    setSessionPhase("empty");
    setPredictionPhase("empty");
    setAnimationPlayed(false);
  };

  const enterDashboard = (mode: ViewMode) => {
    setViewMode(mode);
    setHasEntered(true);
  };

  const exitDashboard = () => {
    setHasEntered(false);
    setSessionPhase("empty");
    setPredictionPhase("empty");
    setAnimationPlayed(false);
  };

  return (
    <SessionContext.Provider
      value={{
        sessionPhase,
        predictionPhase,
        animationPlayed,
        viewMode,
        hasEntered,
        loadSession,
        analyzeSession,
        markAnimationPlayed,
        resetAll,
        setViewMode,
        enterDashboard,
        exitDashboard,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
