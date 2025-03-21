import { Button, Grid, Snackbar, Typography, keyframes, styled } from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import clsx from "clsx";
import React, { FormEvent, useEffect, useRef, useState } from "react";

const PREFIX = "SectionContact";
const classes = {
  info: `${PREFIX}-info`,
  input: `${PREFIX}-input`,
  recaptcha: `${PREFIX}-recaptcha`,
  btnSubmit: `${PREFIX}-btnSubmit`,
};
const progressIndefiniteAnim = keyframes`
    0% {
        background-position: 0% 0%;
    }
    100% {
        background-position: 100% 0%;
    }
`;
const Root = styled("div")(() => ({
  [`& .${classes.info}`]: {
    minHeight: 200,
    "& h3": {
      fontSize: "2.3rem",
      margin: "0 0 10px",
    },
    "&.visible": {
      backgroundImage: `url(images/map.webp)`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
    },
  },
  [`& .${classes.input}`]: {
    display: "block",
    borderRadius: "2.5rem",
    width: "100%",
    height: "5rem",
    padding: "1rem 2.5rem",
    fontSize: "1.6rem",
    color: "var(--primary-text)",
    backgroundColor: "var(--primary-bg)",
    transition: "background-color 0.5s",
    border: 0,
    boxShadow: "0px 5px 20px 0px var(--shadow-border)",
    boxSizing: "border-box",
    "&:focus": {
      outline: 0,
    },
    "&:placeholder": {
      color: "var(--gray-text)",
    },
  },
  [`& .${classes.recaptcha}`]: {
    fontSize: "1.3rem",
    color: "var(--light-gray-text)",
  },
  [`& .${classes.btnSubmit}`]: {
    "& .MuiButton-label": {
      zIndex: 2,
    },
    "& .MuiTouchRipple-root": {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      background: `url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'50'%20height%3D'100'%20viewBox%3D'0%200%205%2010'%3E%0A%09%3Crect%20width%3D'110%25'%20x%3D'-5%25'%20y%3D'-5%25'%20height%3D'110%25'%20fill%3D'transparent'%2F%3E%0A%09%3Cline%20x1%3D'-2'%20y1%3D'1'%20x2%3D'7'%20y2%3D'10'%20stroke%3D'%23bdb9b9'%20stroke-width%3D'2'%2F%3E%0A%09%3Cline%20x1%3D'-2'%20y1%3D'6'%20x2%3D'7'%20y2%3D'15'%20stroke%3D'%23bdb9b9'%20stroke-width%3D'2'%2F%3E%0A%09%3Cline%20x1%3D'-2'%20y1%3D'-4'%20x2%3D'7'%20y2%3D'5'%20stroke%3D'%23bdb9b9'%20stroke-width%3D'2'%2F%3E%0A%3C%2Fsvg%3E")`,
      animation: `${progressIndefiniteAnim} 1s infinite linear 0s`,
    },
  },
}));

const SectionContact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    severity: AlertColor;
  }>({
    show: false,
    message: "",
    severity: "success",
  });

  // const onSubmit = useCallback(
  //   async (ev: FormEvent<HTMLFormElement>) => {
  //     ev.preventDefault();
  //     if (running) return;
  //     setRunning(true);
  //     const load = (await import("recaptcha-v3")).load;
  //     // const recaptcha = await load(EnvConfig.recaptchaKey);
  //     // const token = await recaptcha.execute("submit");
  //     // if (!token) {
  //     //   setToast({
  //     //     show: true,
  //     //     message: `Execute recaptcha fail`,
  //     //     severity: "error",
  //     //   });
  //     //   setRunning(false);

  //     //   return;
  //     // }
  //     // logDev("token", token);
  //     const data = {
  //       name,
  //       email,
  //       subject,
  //       message,
  //     };
  //     logDev("onSubmit", data);
  //     const res = await api.post<BaseResponse>("/api/contact", data);
  //     if (res.errorCode) {
  //       setToast({
  //         show: true,
  //         message: `${res.message}`,
  //         severity: "error",
  //       });
  //     } else {
  //       setToast({
  //         show: true,
  //         message: "Send success!",
  //         severity: "success",
  //       });
  //     }
  //     setRunning(false);
  //   },
  //   [email, message, name, running, subject]
  // );
  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (running) return;
    setRunning(true);
    const data = {
      name,
      email,
      subject,
      message,
    };

    // Sử dụng fetch API để gửi dữ liệu
    try {
      const response = await fetch("api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setToast({ show: true, message: result.message, severity: "success" });
        // TODO: ???
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      setToast({ show: true, message: error.message, severity: "error" });
    } finally {
      setRunning(false);
    }
  };
  useEffect(() => {
    const contactInfo = infoRef.current;
    if (!contactInfo) return;
    const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(contactInfo);
          observer.disconnect();
          entry.target.classList.add("visible");
        }
      });
    };
    const observer = new IntersectionObserver(callback);
    observer.observe(contactInfo);
  }, []);

  return (
    <section id="contact">
      <Root className="container">
        <Typography variant="h2" className="section-title sanim">
          Get In Touch
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} ref={infoRef} className={classes.info}>
            <Typography variant="h3" className="sanim">
              {"Let's talk about everything!"}
            </Typography>
            <p className="sanim">
              {"Don't like forms? Send me an "}
              <a href="mailto:hoangduytn1703@gmail.com">email</a>. 👋
            </p>
          </Grid>
          <Grid item xs={12} md={8}>
            <form onSubmit={onSubmit}>
              <Grid container item spacing={3}>
                <Grid item xs={12} md={6}>
                  <input
                    id="input-name"
                    type="text"
                    className={classes.input}
                    placeholder="Your name"
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <input
                    id="input-email"
                    type="email"
                    className={classes.input}
                    placeholder="Email address"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="text"
                    className={classes.input}
                    placeholder="Subject"
                    required
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <textarea
                    className={classes.input}
                    rows={5}
                    placeholder="Message"
                    required
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Grid>
              </Grid>
              <br />
              <small className={classes.recaptcha}>
                {`This site is protected by reCAPTCHA and the Google `}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>
                {` and `}
                <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
                  Terms of Service
                </a>
                {` apply.`}
              </small>
              <br />
              <Button
                variant="contained"
                color="primary"
                className={clsx(running ? classes.btnSubmit : "", "btn-radius mt-8 mb-10")}
                type="submit"
              >
                Send Message
              </Button>
            </form>
            <Snackbar
              open={toast.show}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              autoHideDuration={2000}
              onClose={() => setToast((s) => ({ ...s, show: false }))}
            >
              <MuiAlert elevation={6} variant="filled" severity={toast.severity}>
                {toast.message}
              </MuiAlert>
            </Snackbar>
          </Grid>
        </Grid>
      </Root>
    </section>
  );
};

export default React.memo(SectionContact);
