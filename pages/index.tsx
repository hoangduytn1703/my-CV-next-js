import { styled } from "@mui/material";
import { cvConfig } from "config/cv";
import config from "config/site";
import { drawerWidth } from "constants/app";
import { FbProfileRes } from "interfaces/response";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { EnvConfig } from "services/envConfig";

const SlideMenu = dynamic(() => import("components/SlideMenu"));
const SectionHome = dynamic(() => import("components/Section/Home"));
const SectionAbout = dynamic(() => import("components/Section/About"));
const SectionServices = dynamic(() => import("components/Section/Services"));
const SectionExperience = dynamic(() => import("components/Section/Experience"));
const SectionWorks = dynamic(() => import("components/Section/Works"));
// const SectionBlog = dynamic(() => import("components/Section/Blog"));
const SectionContact = dynamic(() => import("components/Section/Contact"));
const ReturnToTop = dynamic(() => import("components/ReturnToTop"), { ssr: false });

const PREFIX = "CV";
const classes = {
  content: `${PREFIX}-content`,
};
const Root = styled("main")(({ theme }) => ({
  [`&.${classes.content}`]: {
    flexGrow: 1,
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth,
    },
  },
}));

export const FbContext = React.createContext("");

const CV = () => {
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    import("scrollreveal").then((m) => {
      window.ScrollReveal = m.default;
      window.ScrollReveal().reveal(".sanim", {
        delay: 200,
        distance: "30px",
        origin: "bottom",
        duration: 1000,
        interval: 50,
      });
    });
    import("services/api").then((api) => {
      api.default
        .get<FbProfileRes>("/api/fb/profile", {
          params: { userID: EnvConfig.fbUserID },
        })
        .then((res) => {
          setProfileUrl(res.data?.url || "");
        });
    });
  }, []);

  return (
    <>
      <Head>
        <title>{`${cvConfig.title} - ${config.siteTitle}`}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={`${cvConfig.title} - ${config.siteTitle}`} />
        <meta property="og:description" content={cvConfig.description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`${process.env.PUBLIC_URL}/images/cv-thumbnail.jpg`} />
        <meta property="og:url" content={`${process.env.PUBLIC_URL}`} />
        <meta property="fb:app_id" content={config.siteFBAppID} />
        <meta name="image" content={`${process.env.PUBLIC_URL}/images/cv-thumbnail.jpg`} />
        <meta name="author" content={cvConfig.name} />
      </Head>
      <SlideMenu />
      <Root className={classes.content}>
        <FbContext.Provider value={profileUrl}>
          <SectionHome />
          <SectionAbout />
        </FbContext.Provider>
        <SectionServices />
        <SectionExperience />
        <SectionWorks />
        {/*        <SectionBlog /> */}
        <SectionContact />
      </Root>
      <ReturnToTop />
    </>
  );
};

export default CV;
