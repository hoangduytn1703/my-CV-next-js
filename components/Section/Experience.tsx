import { Grid, Typography, styled } from "@mui/material";
import { cvConfig } from "config/cv";
import React from "react";

const PREFIX = "SectionExperience";
const classes = {
  content: `${PREFIX}-content`,
  timeline: `${PREFIX}-timeline`,
  timelineItem: `${PREFIX}-timelineItem`,
};
const Root = styled("div")(() => ({
  [`& .${classes.content}`]: {
    position: "relative",
    "& .time": {
      color: "var(--light-gray-text)",
      fontSize: "1.4rem",
    },
    "& h3": {
      fontSize: "2rem",
      margin: "10px 0",
    },
    "& p": {
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
  },
  [`& .${classes.timeline}`]: {
    position: "relative",
  },
  [`& .${classes.timelineItem}`]: {
    paddingLeft: "5rem",
    marginBottom: "5rem",
    position: "relative",
    backgroundColor: "inherit",
    width: "100%",
    boxSizing: "border-box",
    "&:last-of-type": {
      marginBottom: 0,
      "& .line": {
        bottom: 0,
      },
    },
    "&.edu:after": {
      content: `""`,
      fontFamily: "simple-line-icons",
      fontSize: 24,
      color: "var(--main-color)",
      position: "absolute",
      left: -7,
      top: 0,
      zIndex: 1,
    },
    "&.exp:after": {
      content: `""`,
      fontFamily: "simple-line-icons",
      fontSize: 24,
      color: "var(--main-color)",
      position: "absolute",
      left: -7,
      top: 0,
      zIndex: 1,
    },
    "& .line": {
      position: "absolute",
      width: 1,
      backgroundColor: "var(--main-color)",
      top: "3.5rem",
      bottom: "-5rem",
      left: "0.4rem",
    },
  },
}));

type TimelineProps = {
  time: string;
  title: string;
  company?: string;
  description: string;
  animDelay?: number;
  className: string;
};
const Timeline = ({ time, title, company, description, className }: TimelineProps) => {
  return (
    <div className={`${classes.timelineItem} sanim ${className}`}>
      <div className={classes.content}>
        <span className="time">{time}</span>
        <Typography variant="h2" className="title">
          {company}
        </Typography>
        <Typography variant="h3" className="title">
          {title}
        </Typography>
        <p>{description}</p>
      </div>
      <span className="line" />
    </div>
  );
};

const SectionExperience = () => {
  return (
    <section id="experience">
      <Root className="container">
        <Typography variant="h2" className="section-title sanim">
          Experiences
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <div className={`${classes.timeline} bg-primary rounded p-6 overflow-hidden`}>
              {cvConfig.experience.work.map((t) => (
                <Timeline className="exp" key={t.time} {...t} />
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={`${classes.timeline} bg-primary rounded p-6 overflow-hidden`}>
              {cvConfig.experience.education.map((t) => (
                <Timeline className="edu" key={t.time} {...t} />
              ))}
            </div>
          </Grid>
        </Grid>
      </Root>
    </section>
  );
};

export default React.memo(SectionExperience);
