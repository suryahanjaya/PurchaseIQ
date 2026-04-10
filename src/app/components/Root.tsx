import { Outlet } from "react-router";
import { NavBar } from "./NavBar";
import { WelcomeScreen } from "./WelcomeScreen";
import { MobileBottomNav } from "./MobileBottomNav";
import { useSession } from "../context/SessionContext";

function DashboardShell() {
  const { hasEntered } = useSession();

  if (!hasEntered) {
    return <WelcomeScreen />;
  }

  return (
    <div
      className="flex flex-col bg-slate-50"
      style={{ minHeight: "100vh", minWidth: "320px" }}
    >
      <NavBar />
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Outlet />
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function Root() {
  return <DashboardShell />;
}