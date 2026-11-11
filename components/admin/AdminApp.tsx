/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fields } from "components/admin/fields";
import { IconExternal, IconEye, IconKey, IconLogout, IconSave, IconUndo } from "components/admin/icons";
import { SECTIONS } from "components/admin/schema";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Mode = "local" | "github" | "readonly";

const api = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || `Request failed (${res.status})`), { status: res.status });

  return data as T;
};

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });

const MODE_INFO: Record<Mode, { label: string; color: "success" | "info" | "warning"; hint: string }> = {
  local: {
    label: "Local",
    color: "success",
    hint: "Saves straight to config/content.json — the site updates instantly.",
  },
  github: {
    label: "GitHub",
    color: "info",
    hint: "Each save is committed to GitHub; the live site updates in about a minute.",
  },
  readonly: {
    label: "Read-only",
    color: "warning",
    hint: "Saving is not configured on this deployment (GITHUB_TOKEN missing).",
  },
};

/* ------------------------------ password field ------------------------------ */

const PasswordField = ({ label, value, onChange, autoFocus, autoComplete }: any) => {
  const [show, setShow] = useState(false);

  return (
    <TextField
      label={label}
      type={show ? "text" : "password"}
      value={value}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow((s) => !s)}
              edge="end"
              aria-label={show ? "Hide password" : "Show password"}
            >
              <IconEye off={show} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

/* ------------------------------ login ------------------------------ */

const Login = ({ onDone }: { onDone: (username: string) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api<{ username: string }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      onDone(res.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper
        component="form"
        onSubmit={submit}
        className="admin-glass"
        sx={{ width: "min(420px, 100%)", p: { xs: 3, sm: 4 } }}
      >
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box className="admin-logo">D</Box>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "var(--font-display)" }}>
                Content manager
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to edit your website
              </Typography>
            </Box>
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
          />
          <PasswordField label="Password" value={password} onChange={setPassword} autoComplete="current-password" />
          <Button type="submit" variant="contained" size="large" disabled={busy}>
            {busy ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

/* ------------------------------ change password ------------------------------ */

const PasswordDialog = ({
  open,
  username,
  onClose,
  onChanged,
}: {
  open: boolean;
  username: string;
  onClose: () => void;
  onChanged: (username: string, mode: Mode) => void;
}) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [user, setUser] = useState(username);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCurrent("");
      setNext("");
      setConfirm("");
      setUser(username);
      setError("");
    }
  }, [open, username]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (next.length < 8) return setError("New password must be at least 8 characters.");
    if (next !== confirm) return setError("The two new passwords do not match.");
    setBusy(true);
    setError("");
    try {
      const res = await api<{ username: string }>("/api/admin/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: current, newPassword: next, username: user }),
      });
      const session = await api<{ mode: Mode }>("/api/admin/session");
      onChanged(res.username, session.mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change the password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ component: "form", onSubmit: submit } as any}
    >
      <DialogTitle>Account</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Username" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" />
          <PasswordField
            label="Current password"
            value={current}
            onChange={setCurrent}
            autoFocus
            autoComplete="current-password"
          />
          <PasswordField
            label="New password (min. 8 characters)"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
          />
          <PasswordField
            label="Repeat new password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={busy || !current || !next}>
          {busy ? "Saving…" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ------------------------------ editor ------------------------------ */

const Editor = ({
  username,
  onLogout,
  onUsername,
}: {
  username: string;
  onLogout: () => void;
  onUsername: (u: string) => void;
}) => {
  const [content, setContent] = useState<any>(null);
  const [saved, setSaved] = useState<string>("");
  const [mode, setMode] = useState<Mode>("local");
  const [section, setSection] = useState(SECTIONS[0].id);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const res = await api<{ content: any; mode: Mode }>("/api/admin/content");
    setContent(res.content);
    setSaved(JSON.stringify(res.content));
    setMode(res.mode);
  }, []);

  useEffect(() => {
    load().catch((err) => setToast({ type: "error", text: err.message }));
  }, [load]);

  const dirty = useMemo(() => !!content && JSON.stringify(content) !== saved, [content, saved]);

  const save = useCallback(async () => {
    if (!content || busy) return;
    setBusy(true);
    try {
      const res = await api<{ content: any; mode: Mode }>("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ content }),
      });
      setContent(res.content);
      setSaved(JSON.stringify(res.content));
      setMode(res.mode);
      setToast({
        type: "success",
        text:
          res.mode === "github"
            ? "Saved & committed — the live site updates in about a minute."
            : "Saved — the site is updated.",
      });
    } catch (err: any) {
      if (err.status === 401) onLogout();
      setToast({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  }, [content, busy, onLogout]);

  // Ctrl/Cmd + S saves; warn before leaving with unsaved changes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [save, dirty]);

  const upload = useCallback(async (file: File) => {
    if (file.size > 3 * 1024 * 1024) throw new Error("File is larger than 3 MB.");
    const res = await api<{ path: string }>("/api/admin/upload", {
      method: "POST",
      body: JSON.stringify({ name: file.name, type: file.type, data: await toBase64(file) }),
    });
    const preview = URL.createObjectURL(file);
    setPreviews((p) => ({ ...p, [res.path]: preview }));

    return { path: res.path, preview };
  }, []);

  const logout = async () => {
    if (dirty && !window.confirm("You have unsaved changes. Sign out anyway?")) return;
    await api("/api/admin/logout", { method: "POST", body: "{}" }).catch(() => undefined);
    onLogout();
  };

  const current = SECTIONS.find((s) => s.id === section)!;
  const info = MODE_INFO[mode];

  if (!content) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="admin-shell">
      <Box component="header" className="admin-topbar">
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Box className="admin-logo">D</Box>
          <Box sx={{ minWidth: 0, display: { xs: "none", sm: "block" } }}>
            <Typography fontWeight={700} sx={{ fontFamily: "var(--font-display)" }} noWrap>
              Content manager
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="div">
              Signed in as {username}
            </Typography>
          </Box>
          <Tooltip title={info.hint}>
            <Chip size="small" color={info.color} variant="outlined" label={info.label} />
          </Tooltip>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {dirty && (
            <Typography variant="body2" color="warning.main" sx={{ display: { xs: "none", md: "block" } }}>
              ● Unsaved changes
            </Typography>
          )}
          <Tooltip title="Discard unsaved changes">
            <span>
              <IconButton disabled={!dirty || busy} onClick={() => setContent(JSON.parse(saved))}>
                <IconUndo />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={busy ? <CircularProgress size={16} color="inherit" /> : <IconSave />}
            disabled={!dirty || busy || mode === "readonly"}
            onClick={save}
          >
            Save
          </Button>
          <Tooltip title="Open the website">
            <IconButton href="/" target="_blank" rel="noreferrer">
              <IconExternal />
            </IconButton>
          </Tooltip>
          <Tooltip title="Account & password">
            <IconButton onClick={() => setAccountOpen(true)}>
              <IconKey />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton onClick={logout}>
              <IconLogout />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Box className="admin-body">
        <Box component="nav" className="admin-nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <button key={s.id} className={s.id === section ? "active" : ""} onClick={() => setSection(s.id)}>
              {s.title}
            </button>
          ))}
        </Box>

        <Box component="main" className="admin-main">
          {mode === "readonly" && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {info.hint}
            </Alert>
          )}
          <Typography variant="h5" fontWeight={700} sx={{ fontFamily: "var(--font-display)" }}>
            {current.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {current.description}
          </Typography>
          <Paper className="admin-glass" sx={{ p: { xs: 2, sm: 3 } }}>
            <Fields fields={current.fields} value={content} onChange={setContent} upload={upload} previews={previews} />
          </Paper>
        </Box>
      </Box>

      <PasswordDialog
        open={accountOpen}
        username={username}
        onClose={() => setAccountOpen(false)}
        onChanged={(u, m) => {
          setAccountOpen(false);
          onUsername(u);
          setToast({
            type: "success",
            text:
              m === "github" ? "Account updated (committed — takes effect after the next deploy)." : "Account updated.",
          });
        }}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={5000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? (
          <Alert severity={toast.type} variant="filled" onClose={() => setToast(null)}>
            {toast.text}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

/* ------------------------------ root ------------------------------ */

const AdminApp = () => {
  const [state, setState] = useState<{ loading: boolean; username: string | null; error?: string }>({
    loading: true,
    username: null,
  });

  useEffect(() => {
    api<{ username: string | null }>("/api/admin/session")
      .then((s) => setState({ loading: false, username: s.username }))
      .catch((err) => setState({ loading: false, username: null, error: err.message }));
  }, []);

  if (state.loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!state.username) {
    return <Login onDone={(username) => setState({ loading: false, username })} />;
  }

  return (
    <Editor
      username={state.username}
      onLogout={() => setState({ loading: false, username: null })}
      onUsername={(username) => setState((s) => ({ ...s, username }))}
    />
  );
};

export default AdminApp;
