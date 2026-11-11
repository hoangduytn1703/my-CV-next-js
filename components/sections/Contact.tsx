import { burstConfetti } from "components/fx/confetti";
import avatar from "assets/images/avatar2.jpg";
import { ArrowUpRight, Check, Copy, MapPin, Send } from "components/fx/icons";
import { Magnetic } from "components/fx/Magnetic";
import { EASE_OUT } from "components/fx/motion";
import { Reveal } from "components/fx/Reveal";
import { TiltCard, trackPointer } from "components/fx/TiltCard";
import SectionHeading from "components/sections/SectionHeading";
import { cvConfig } from "config/cv";
import config from "config/site";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChangeEvent, CSSProperties, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { cx } from "utils/common";
import s from "./Contact.module.scss";

const email = config.socialLinks.find((l) => /^mailto:/i.test(l.url))?.url.replace(/^mailto:\s*/i, "") ?? "";
const phone = config.socialLinks.find((l) => /^tel:/i.test(l.url))?.url.replace(/^tel:\s*/i, "") ?? "";
const socials = config.socialLinks.filter((l) => l.url.startsWith("http"));

const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.location)}`;
const BRAND_COLORS: Record<string, string> = { Facebook: "#1877f2", Linkedin: "#0a66c2" };

/** 0798889162 → 0798 889 162 */
const formatPhone = (p: string) => p.replace(/\s+/g, "").replace(/^(\d{4})(\d{3})(\d+)$/, "$1 $2 $3");

/** Live clock in Vietnam time — handy for clients in other time zones. Rendered client-side only. */
const LocalTime = () => {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);

    return () => clearInterval(id);
  }, []);

  return (
    <span className={s.clock} data-cursor-label="Local time" title="Local time in Ho Chi Minh City">
      <span className={s.clockDot} aria-hidden />
      {time}
      <small>GMT+7</small>
    </span>
  );
};

const ContactRow = ({
  icon,
  label,
  value,
  href,
  delay,
  children,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  delay: number;
  children?: ReactNode;
}) => (
  <motion.li
    className={s.infoRow}
    initial={{ opacity: 0, x: -18 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    transition={{ duration: 0.6, ease: EASE_OUT, delay }}
  >
    <span className={s.rowIcon}>{icon}</span>
    <div className={s.rowText}>
      <span className={s.rowLabel}>{label}</span>
      {href ? (
        <a href={href} className={s.rowValue}>
          {value}
        </a>
      ) : (
        <span className={s.rowValue}>{value}</span>
      )}
    </div>
    <div className={s.rowActions}>{children}</div>
  </motion.li>
);

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
              <TiltCard className={cx(s.card, "glass spotlight")} max={4}>
                <span className={s.cardBorder} aria-hidden />
                <span className={s.cardAura} aria-hidden />

                <div className={s.cardHead}>
                  <span className={s.avatar}>
                    <Image
                      src={cvConfig.avatar || avatar}
                      alt={cvConfig.name}
                      fill
                      sizes="56px"
                      placeholder={cvConfig.avatar ? "empty" : "blur"}
                    />
                  </span>
                  <div className={s.who}>
                    <strong>{cvConfig.name}</strong>
                    <span>{cvConfig.mainJob[0]}</span>
                  </div>
                  <LocalTime />
                </div>

                <ul className={s.rows}>
                  <ContactRow
                    icon={<i className="icon-envelope" />}
                    label="Email"
                    value={email}
                    href={`mailto:${email}`}
                    delay={0.1}
                  >
                    <button
                      className={s.action}
                      onClick={copyEmail}
                      aria-label="Copy email address"
                      data-cursor-label={copied ? "Copied" : "Copy"}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={copied ? "check" : "copy"}
                          className={s.actionIcon}
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          {copied ? <Check /> : <Copy />}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                    <a
                      className={s.action}
                      href={`mailto:${email}`}
                      aria-label="Write an email"
                      data-cursor-label="Write"
                    >
                      <Send />
                    </a>
                  </ContactRow>

                  {phone && (
                    <ContactRow
                      icon={<i className="icon-phone" />}
                      label="Phone"
                      value={formatPhone(phone)}
                      href={`tel:${phone}`}
                      delay={0.18}
                    >
                      <a className={s.action} href={`tel:${phone}`} aria-label="Call" data-cursor-label="Call">
                        <i className="icon-call-out" />
                      </a>
                    </ContactRow>
                  )}

                  <ContactRow icon={<MapPin />} label="Location" value={config.location} delay={0.26}>
                    <a
                      className={s.action}
                      href={MAP_URL}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open in Google Maps"
                      data-cursor-label="Map"
                    >
                      <ArrowUpRight />
                    </a>
                  </ContactRow>
                </ul>

                <div className={s.socials}>
                  {socials.map((l) => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className={s.social}
                      style={{ "--brand": BRAND_COLORS[l.label] ?? "var(--accent-1)" } as CSSProperties}
                    >
                      <span className={s.socialIcon}>
                        <i className={l.iconClassName} />
                      </span>
                      <span className={s.socialName}>{l.label === "Linkedin" ? "LinkedIn" : l.label}</span>
                      <ArrowUpRight className={s.socialArrow} />
                    </a>
                  ))}
                </div>
              </TiltCard>
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
