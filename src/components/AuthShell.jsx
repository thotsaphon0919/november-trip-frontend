import { Compass } from "lucide-react";
import { useTheme } from "../lib/themeContext";
import { Card } from "./ui";

/** Shared centered-card layout for the public auth pages
 *  (login, forgot password, reset password). */
export default function AuthShell({ subtitle, icon: Icon = Compass, children }) {
  const { settings } = useTheme();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--nt-primary-light)] to-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-7">
        <div className="flex flex-col items-center text-center mb-5">
          <span
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-3"
            style={{ backgroundColor: "var(--nt-primary)" }}
          >
            <Icon size={24} strokeWidth={2} />
          </span>
          <h1 className="text-xl font-bold text-slate-800">{settings?.companyName || "November Trip"}</h1>
          {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {children}
      </Card>
    </div>
  );
}
