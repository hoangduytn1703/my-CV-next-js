import { Button, Grid, Typography, styled } from "@mui/material";
import ImgSkeleton from "components/ImgSkeleton";
import { cvConfig } from "config/cv";
// import { FbContext } from "pages";
import avatar from "assets/images/avatar2.jpg"; // Import ảnh avatar

import React from "react";
import FactItem from "./FactItem";
import SkillItem from "./SkillItem";

const onDownloadCV = () => {
  window.open(cvConfig.cvDownloadLink);
};

const PREFIX = "SectionAbout";
const classes = {
  wrapper: `${PREFIX}-wrapper`,
  content: `${PREFIX}-content`,
};
const Root = styled("div")(({ theme }) => ({
  [`& .${classes.wrapper}`]: {
    "& .MuiGrid-item": {
      padding: 12,
    },
    "& img": {
      height: "auto",
    },
  },
  [`& .${classes.content}`]: {
    position: "relative",
    "&:before": {
      content: '""',
      width: 0,
      height: 0,
      position: "absolute",
      borderLeft: "10px solid transparent",
      borderRight: "10px solid transparent",
      borderBottom: "10px solid var(--primary-bg)",
      left: "50%",
      top: 2,
      transform: "translateX(-7.5px)",
      transition: "all 0.5s",
      [theme.breakpoints.up("md")]: {
        borderTop: "10px solid transparent",
        borderBottom: "10px solid transparent",
        borderRight: "15px solid var(--primary-bg)",
        left: -4,
        top: "20%",
      },
    },
    "& .MuiGrid-item": {
      padding: 16,
    },
  },
}));

const SectionAbout = () => {
  return (
    <section id="about">
      <Root className="container">
        <Typography variant="h2" className="section-title sanim">
          About Me
        </Typography>
        <Grid container className={classes.wrapper}>
          <Grid item xs={12} md={3} className="flex justify-content-center">
            {/* <FbContext.Consumer>
              {(profileUrl) => (
                <ImgSkeleton src={profileUrl} className="circle" alt="avatar" width={150} height={150} />
              )}
            </FbContext.Consumer> */}
            <ImgSkeleton alt="avatar" src={avatar.src} className="circle" width={150} height={150} />
          </Grid>
          <Grid container item xs={12} md={9} className={classes.content}>
            <Grid container item className="rounded bg-primary p-4 m-0">
              <Grid item xs={12} sm={6}>
                <p>{cvConfig.about}</p>
                <Button variant="contained" color="primary" className="mt-3 mb-5 btn-radius" onClick={onDownloadCV}>
                  Download CV
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                {cvConfig.skills.map((item) => (
                  <SkillItem key={item.name} {...item} />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className="mt-10">
          {cvConfig.facts.map((item) => (
            <FactItem key={item.name} {...item} />
          ))}
        </Grid>
      </Root>
    </section>
  );
};

export default React.memo(SectionAbout);
