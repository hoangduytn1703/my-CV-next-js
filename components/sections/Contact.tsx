import { burstConfetti } from "components/fx/confetti";
import { Check, Copy, MapPin, Send } from "components/fx/icons";
import { Magnetic } from "components/fx/Magnetic";
import { Reveal } from "components/fx/Reveal";
import { trackPointer } from "components/fx/TiltCard";
import SectionHeading from "components/sections/SectionHeading";
import config from "config/site";
import { AnimatePresence, motion } from "framer-motion";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { cx } from "utils/common";
import s from "./Contact.module.scss";

const email = config.socialLinks.find((l) => /^mailto:/i.test(l.url))?.url.replace(/^mailto:\s*/i, "") ?? "";
const phone = config.socialLinks.find((l) => /^tel:/i.test(l.url))?.url.replace(/^tel:\s*/i, "") ?? "";
const socials = config.socialLinks.filter((l) => l.url.startsWith("http"));

type Status = "idle" | "sending" | "sent" | "error";
type FormState = { name: string; email: string; subject: string; message: string };
const EMPTY: FormState = { name: "", email: "", subject: "", message: "" };

const STATUS_LABEL: Record<Status, string> = {
  idle: "Send message",
  sending: "Sending…",
  sent: "Message sent!",
  error: "Try again",
};

interface FieldProps {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}

/** Input with a floating label and an animated focus underline. */
const Field = ({ label, name, value, onChange, type = "text", textarea, autoComplete }: FieldProps) => (
  <label className={cx(s.field, textarea && s.fieldArea)}>
    {textarea ? (
      <textarea name={name} value={value} onChange={onChange} rows={5} placeholder=" " required />
    ) : (
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoComplete={autoComplete}
        required
      />
    )}
    <span className={s.label}>{label}</span>
    <span className={s.underline} aria-hidden />
  </label>
);

const Contact = () => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);

    return () => clearTimeout(t);
  }, [toast]);

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to send email");
      setStatus("sent");
      setForm(EMPTY);
      setToast({ type: "success", text: data.message || "Email sent successfully" });
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setToast({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeading index="05" eyebrow="Contact" title="Let's talk about everything!" highlight="everything!" />

        <div className={s.grid}>
          <div className={s.info}>
            <Reveal>
              <p className={s.intro}>
                Don&apos;t like forms? Send me an <a href={`mailto:${email}`}>email</a>. 👋
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className={cx(s.item, "glass spotlight")} onPointerMove={trackPointer}>
                <span className={s.itemIcon}>
                  <i className="icon-envelope" />
                </span>
                <div className={s.itemText}>
                  <span className={s.itemLabel}>Email</span>
                  <a href={`mailto:${email}`} className={s.itemValue}>
                    {email}
                  </a>
                </div>
                <button
                  className={s.copy}
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  data-cursor-label={copied ? "Copied" : "Copy"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "check" : "copy"}
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      {copied ? <Check /> : <Copy />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </Reveal>

            {phone && (
              <Reveal delay={0.16}>
                <a href={`tel:${phone}`} className={cx(s.item, "glass spotlight")} onPointerMove={trackPointer}>
                  <span className={s.itemIcon}>
                    <i className="icon-phone" />
                  </span>
                  <div className={s.itemText}>
                    <span className={s.itemLabel}>Phone</span>
                    <span className={s.itemValue}>{phone}</span>
                  </div>
                </a>
              </Reveal>
            )}

            <Reveal delay={0.2}>
              <div className={cx(s.item, "glass spotlight")} onPointerMove={trackPointer}>
                <span className={s.itemIcon}>
                  <MapPin />
                </span>
                <div className={s.itemText}>
                  <span className={s.itemLabel}>Location</span>
                  <span className={s.itemValue}>{config.location}</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className={s.socials}>
                {socials.map((l) => (
                  <Magnetic key={l.label} strength={0.3}>
                    <a href={l.url} target="_blank" rel="noreferrer" className={s.social}>
                      <i className={l.iconClassName} />
                      {l.label}
                    </a>
                  </Magnetic>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form className={cx(s.form, "glass spotlight")} onSubmit={onSubmit} onPointerMove={trackPointer}>
              <div className={s.row}>
                <Field label="Your name" name="name" value={form.name} onChange={update("name")} autoComplete="name" />
                <Field
                  label="Email address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  autoComplete="email"
                />
              </div>
              <Field label="Subject" name="subject" value={form.subject} onChange={update("subject")} />
              <Field label="Message" name="message" value={form.message} onChange={update("message")} textarea />
              <div className={s.actions}>
                <Magnetic strength={0.2}>
                  <button
                    ref={buttonRef}
                    type="submit"
                    className={cx("btn btn-primary", s.submit, status === "error" && s.submitError)}
                    disabled={status === "sending"}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={status}
                        className={s.submitInner}
                        initial={{ y: 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -24, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {STATUS_LABEL[status]}
                        {status === "sending" && <span className={s.spinner} aria-hidden />}
                        {status === "idle" && <Send />}
                        {status === "sent" && <Check />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </Magnetic>
              </div>
            </form>
          </Reveal>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className={cx(s.toast, toast.type === "error" && s.toastError)}
            role="status"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            {toast.type === "success" ? <Check /> : "!"}
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;
