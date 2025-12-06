import { Grid, Typography, Paper, styled } from "@mui/material";
import { useEffect, useRef } from "react";
import { useCountUp } from "react-countup";

const PREFIX = "FactItem";
const classes = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
  details: `${PREFIX}-details`,
};
const Root = styled(Paper)(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: "2.5rem",
    borderRadius: "12px",
    background: "var(--primary-bg)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    textAlign: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    },
    [theme.breakpoints.down("md")]: {
      padding: "2rem",
    },
  },
  [`& .${classes.icon}`]: {
    fontSize: "4rem",
    color: "var(--active-text)",
    marginBottom: "1.5rem",
    display: "block",
  },
  [`& .${classes.details}`]: {
    "& .number": {
      fontSize: "3.5rem",
      fontWeight: 700,
      color: "var(--primary-text)",
      marginBottom: "0.5rem",
      lineHeight: 1,
    },
    "& p": {
      fontSize: "1.4rem",
      color: "var(--light-gray-text)",
      margin: 0,
      fontWeight: 500,
    },
  },
}));

type Props = {
  icon: string;
  name: string;
  count: number;
};
const FactItem = ({ icon, name, count }: Props) => {
  const countUpRef = useRef<HTMLElement>(null);

  const { start } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: count,
    duration: 1.5,
  });

  useEffect(() => {
    const countUp = countUpRef.current;
    if (!countUp) return;
    const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(countUp);
          observer.disconnect();
          start();
        }
      });
    };
    const observer = new IntersectionObserver(callback);
    observer.observe(countUp);
  }, [start]);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Root className={classes.root} elevation={0}>
        <span className={`${classes.icon} icon ${icon}`}></span>
        <div className={classes.details}>
          <Typography variant="h3" className="number">
            <em ref={countUpRef} className="count" />
          </Typography>
          <Typography component="p">{name}</Typography>
        </div>
      </Root>
    </Grid>
  );
};

export default FactItem;
