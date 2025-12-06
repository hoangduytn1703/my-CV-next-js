import { Button, Box, Grid, Typography, Chip, styled, Paper } from "@mui/material";
import { cvConfig } from "config/cv";
import React from "react";
import FactItem from "./FactItem";

const onDownloadCV = () => {
  window.open(cvConfig.cvDownloadLink);
};

const PREFIX = "SectionAbout";
const classes = {
  root: `${PREFIX}-root`,
  contentWrapper: `${PREFIX}-contentWrapper`,
  mainContainer: `${PREFIX}-mainContainer`,
  aboutCard: `${PREFIX}-aboutCard`,
  skillsSection: `${PREFIX}-skillsSection`,
  skillChip: `${PREFIX}-skillChip`,
  skillGroup: `${PREFIX}-skillGroup`,
  skillGroupTitle: `${PREFIX}-skillGroupTitle`,
  awardsSection: `${PREFIX}-awardsSection`,
  awardCard: `${PREFIX}-awardCard`,
  subsection: `${PREFIX}-subsection`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: "6rem 0",
    [theme.breakpoints.down("md")]: {
      padding: "4rem 0",
    },
  },
  [`& .${classes.contentWrapper}`]: {
    marginTop: "4rem",
  },
  [`& .${classes.mainContainer}`]: {
    background: "var(--primary-bg)",
    borderRadius: "16px",
    padding: "4rem",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    [theme.breakpoints.down("md")]: {
      padding: "2.5rem",
    },
  },
  [`& .${classes.aboutCard}`]: {
    padding: 0,
    background: "transparent",
    boxShadow: "none",
    marginBottom: "4rem",
    "& .about-text": {
      fontSize: "1.7rem",
      lineHeight: "1.9",
      color: "var(--primary-text)",
      marginBottom: "3rem",
      fontWeight: 400,
      textAlign: "center",
      maxWidth: "900px",
      margin: "0 auto 3rem",
    },
  },
  [`& .${classes.subsection}`]: {
    marginTop: "4rem",
    paddingTop: "3rem",
    borderTop: "2px solid rgba(0, 0, 0, 0.08)",
    "&:first-of-type": {
      marginTop: 0,
      paddingTop: 0,
      borderTop: "none",
    },
    "& .section-subtitle": {
      fontSize: "1.8rem",
      fontWeight: 600,
      marginBottom: "2.5rem",
      color: "var(--primary-text)",
      position: "relative",
      paddingLeft: "1.5rem",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "4px",
        height: "2.4rem",
        background: "var(--active-text)",
        borderRadius: "2px",
      },
    },
  },
  [`& .${classes.skillsSection}`]: {
    "& .section-subtitle": {
      fontSize: "1.8rem",
      fontWeight: 600,
      marginBottom: "2.5rem",
      color: "var(--primary-text)",
      position: "relative",
      paddingLeft: "1.5rem",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "4px",
        height: "2.4rem",
        background: "var(--active-text)",
        borderRadius: "2px",
      },
    },
  },
  [`& .${classes.skillGroup}`]: {
    marginBottom: "3rem",
    paddingLeft: "2rem",
    "&:last-child": {
      marginBottom: 0,
    },
    [theme.breakpoints.down("md")]: {
      paddingLeft: "1rem",
    },
  },
  [`& .${classes.skillGroupTitle}`]: {
    fontSize: "1.3rem",
    fontWeight: 600,
    marginBottom: "1.5rem",
    color: "var(--active-text)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  [`& .${classes.skillChip}`]: {
    height: "auto",
    padding: "1rem 2rem",
    fontSize: "1.4rem",
    fontWeight: 500,
    borderRadius: "10px",
    margin: "0.5rem",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
    },
  },
  [`& .${classes.awardsSection}`]: {
    "& .section-subtitle": {
      fontSize: "1.8rem",
      fontWeight: 600,
      marginBottom: "2.5rem",
      color: "var(--primary-text)",
      position: "relative",
      paddingLeft: "1.5rem",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "4px",
        height: "2.4rem",
        background: "var(--active-text)",
        borderRadius: "2px",
      },
    },
  },
  [`& .${classes.awardCard}`]: {
    padding: "2.5rem",
    borderRadius: "12px",
    background: "linear-gradient(135deg, rgba(106, 171, 128, 0.05) 0%, rgba(106, 171, 128, 0.15) 100%)",
    border: "2px solid rgba(106, 171, 128, 0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 24px rgba(106, 171, 128, 0.2)",
      borderColor: "rgba(106, 171, 128, 0.4)",
    },
    "& .award-year": {
      fontSize: "1.3rem",
      fontWeight: 600,
      color: "var(--active-text)",
      marginBottom: "0.8rem",
      display: "inline-block",
      padding: "0.4rem 1rem",
      background: "rgba(106, 171, 128, 0.1)",
      borderRadius: "6px",
    },
    "& .award-title": {
      fontSize: "1.7rem",
      fontWeight: 600,
      color: "var(--primary-text)",
      marginBottom: "0.8rem",
      lineHeight: 1.4,
    },
    "& .award-company": {
      fontSize: "1.4rem",
      color: "var(--light-gray-text)",
      fontWeight: 500,
    },
  },
}));

const SectionAbout = () => {
  // Group skills by category for better organization
  const skillGroups = [
    {
      title: "Core Technologies",
      skills: cvConfig.skills.filter((s) => ["JavaScript (ES6+) / TypeScript", "HTML5 / CSS3 / SCSS"].includes(s.name)),
    },
    {
      title: "Frameworks & Libraries",
      skills: cvConfig.skills.filter((s) => ["Vue.js (Vue 2/3) / Nuxt.js", "React / Next.js"].includes(s.name)),
    },
    {
      title: "Tools & Others",
      skills: cvConfig.skills.filter((s) =>
        ["Tailwind CSS / MUI / Bootstrap", "Testing (Jest, Appium, CodeceptJS)"].includes(s.name)
      ),
    },
  ];

  return (
    <section id="about">
      <Root className={`${classes.root} container`}>
        <Typography variant="h2" className="section-title sanim">
          About Me
        </Typography>

        <Box className={classes.contentWrapper}>
          {/* Main Container - Groups all About Me content */}
          <Paper className={classes.mainContainer} elevation={0}>
            {/* About Text Section */}
            <Box className={classes.aboutCard}>
              <Typography className="about-text">{cvConfig.about}</Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className="btn-radius"
                  onClick={onDownloadCV}
                  sx={{
                    padding: "1.2rem 3rem",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Download CV
                </Button>
              </Box>
            </Box>

            {/* Technical Skills Section - Subsection of About Me */}
            <Box className={`${classes.skillsSection} ${classes.subsection}`}>
              <Typography variant="h3" className="section-subtitle sanim">
                Technical Skills
              </Typography>
              {skillGroups.map((group, idx) => (
                <Box key={idx} className={classes.skillGroup}>
                  <Typography className={classes.skillGroupTitle}>{group.title}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {group.skills.map((skill) => (
                      <Chip
                        key={skill.name}
                        label={skill.name}
                        className={classes.skillChip}
                        sx={{
                          backgroundColor: skill.bgColor,
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Honors & Awards Section - Subsection of About Me */}
            {cvConfig.awards && cvConfig.awards.length > 0 && (
              <Box className={`${classes.awardsSection} ${classes.subsection}`}>
                <Typography variant="h3" className="section-subtitle sanim">
                  Honors & Awards
                </Typography>
                <Grid container spacing={3}>
                  {cvConfig.awards.map((award, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Paper className={classes.awardCard} elevation={0}>
                        <Typography className="award-year">{award.year}</Typography>
                        <Typography className="award-title">{award.title}</Typography>
                        <Typography className="award-company">{award.company}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>

          {/* Key Achievements Section - Separate from About Me */}
          <Box sx={{ marginTop: "4rem" }}>
            <Typography variant="h3" className="section-title sanim" sx={{ marginBottom: "2rem" }}>
              Key Achievements
            </Typography>
            <Grid container spacing={3}>
              {cvConfig.facts.map((item) => (
                <FactItem key={item.name} {...item} />
              ))}
            </Grid>
          </Box>
        </Box>
      </Root>
    </section>
  );
};

export default React.memo(SectionAbout);
