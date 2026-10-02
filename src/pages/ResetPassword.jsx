import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LockKeyhole, CircleCheck, CircleAlert } from "lucide-react";
import api from "../lib/api";
import AuthShell from "../components/AuthShell";
import { Button, PasswordInput } from "../components/ui";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();

  // "checking" | "valid" | "invalid" | "done"
  const [status, setStatus] = useState(token ? "checking" : "invalid");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api
      .post("/auth/reset-password/verify", { token })
      .then(({ data }) => {
        if (cancelled) return;
        setEmail(data.email);
        setStatus("valid");
      })
      .catch(() => !cancelled && setStatus("invalid"));
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
    if (password !== confirm) return setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
    setBusy(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setStatus("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (status === "checking") {
    return (
      <AuthShell subtitle="ตั้งรหัสผ่านใหม่" icon={LockKeyhole}>
        <p className="text-center text-sm text-slate-400">กำลังตรวจสอบลิงก์…</p>
      </AuthShell>
    );
  }

  if (status === "invalid") {
    return (
      <AuthShell subtitle="ลิงก์ใช้งานไม่ได้" icon={CircleAlert}>
        <div className="rounded-lg bg-red-50 text-red-600 text-sm p-3 leading-relaxed">
          ลิงก์ตั้งรหัสผ่านใหม่ไม่ถูกต้อง หมดอายุ หรือถูกใช้ไปแล้ว กรุณาขอลิงก์ใหม่อีกครั้ง
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <Button className="w-full" onClick={() => navigate("/forgot-password")}>
            ขอลิงก์ใหม่
          </Button>
          <Link to="/login" className="text-center text-sm text-slate-500 hover:text-[var(--nt-primary)]">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (status === "done") {
    return (
      <AuthShell subtitle="เปลี่ยนรหัสผ่านสำเร็จ" icon={CircleCheck}>
        <div className="rounded-lg bg-emerald-50 text-emerald-700 text-sm p-3 leading-relaxed text-center">
          ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที
        </div>
        <Button className="w-full mt-5" onClick={() => navigate("/login", { state: { email } })}>
          ไปหน้าเข้าสู่ระบบ
        </Button>
      </AuthShell>
    );
  }

  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <AuthShell subtitle="ตั้งรหัสผ่านใหม่" icon={LockKeyhole}>
      {email && (
        <p className="text-sm text-slate-500 mb-4 text-center">
          สำหรับบัญชี <span className="font-medium text-slate-700">{email}</span>
        </p>
      )}
      <form onSubmit={submit} className="space-y-3">
        {/* hidden username field helps password managers save the new password */}
        <input type="email" name="username" value={email} autoComplete="username" readOnly hidden />
        <PasswordInput
          label="รหัสผ่านใหม่"
          required
          minLength={8}
          autoFocus
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className={`text-xs ${password.length >= 8 ? "text-emerald-600" : "text-slate-400"}`}>
          อย่างน้อย 8 ตัวอักษร
        </p>
        <PasswordInput
          label="ยืนยันรหัสผ่านใหม่"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {mismatch && <p className="text-xs text-red-500">รหัสผ่านไม่ตรงกัน</p>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={busy || mismatch}>
          {busy ? "กำลังบันทึก…" : "บันทึกรหัสผ่านใหม่"}
        </Button>
      </form>
    </AuthShell>
  );
}
