import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, MailCheck, ArrowLeft } from "lucide-react";
import api from "../lib/api";
import AuthShell from "../components/AuthShell";
import { Button, Input } from "../components/ui";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setSentMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (sentMessage) {
    return (
      <AuthShell subtitle="ตรวจสอบอีเมลของคุณ" icon={MailCheck}>
        <div className="rounded-lg bg-emerald-50 text-emerald-700 text-sm p-3 leading-relaxed">{sentMessage}</div>
        <p className="text-xs text-slate-400 mt-3 text-center">ลิงก์มีอายุ 30 นาที และใช้ได้เพียงครั้งเดียว</p>
        <div className="mt-5 flex flex-col gap-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setSentMessage("");
            }}
          >
            ส่งอีกครั้ง / ใช้อีเมลอื่น
          </Button>
          <BackToLogin />
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell subtitle="ลืมรหัสผ่าน" icon={KeyRound}>
      <p className="text-sm text-slate-500 mb-4 text-center">
        กรอกอีเมลที่ใช้เข้าสู่ระบบ เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้
      </p>
      <form onSubmit={submit} className="space-y-3">
        <Input
          label="อีเมล"
          type="email"
          required
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "กำลังส่ง…" : "ส่งลิงก์ตั้งรหัสผ่านใหม่"}
        </Button>
      </form>
      <div className="mt-4">
        <BackToLogin />
      </div>
    </AuthShell>
  );
}

function BackToLogin() {
  return (
    <Link
      to="/login"
      className="flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-[var(--nt-primary)]"
    >
      <ArrowLeft size={14} /> กลับไปหน้าเข้าสู่ระบบ
    </Link>
  );
}
