import { Grid, Typography, styled } from "@mui/material";
import { cvConfig } from "config/cv";
import Image from "next/image";
import React from "react";

type StyleProps = { bgColor: string };
const PREFIX = "ServiceBox";
const classes = {
  serviceBox: `${PREFIX}-serviceBox`,
};
const Root = styled("div")<StyleProps>(({ bgColor }) => ({
  [`&.${classes.serviceBox}`]: {
    transform: "translateY(0)",
    transition: "all 0.3s ease-in-out",
    borderRadius: 20,
    cursor: "pointer",
    "&:after": {
      pointerEvents: "none",
      position: "absolute",
      zIndex: -1,
      content: '""',
      top: "100%",
      left: "5%",
      height: "10px",
      width: "90%",
      opacity: 0,
      background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.35) 0, transparent 80%)",
      transitionDuration: "0.35s",
      transitionProperty: "opacity, transform",
      WebkitTransitionProperty: "transform, opacity",
      transitionTimingFunction: "ease-out",
    },
    "& h3": {
      fontSize: "2rem",
    },
    "&:hover": {
      transform: "translateY(-10px)",
      "&:after": {
        opacity: 1,
        WebkitTransform: "translate(10px, 10px) rotate(0deg)",
        transform: "translate(10px, 10px) rotate(0deg)",
      },
    },
    backgroundColor: bgColor,
    boxShadow: `0px 5px 20px 0px ${bgColor}80`,
  },
}));

type ServiceBoxProps = {
  className: string;
  imgSrc: string;
  name: string;
  description: string;
  bgColor: string;
};
const ServiceBox = ({ className = "", name, description, imgSrc, bgColor }: ServiceBoxProps) => {
  return (
    <Grid item xs={12} sm={6} md={4} className="sanim">
      <Root bgColor={bgColor} className={`${classes.serviceBox} p-6 text-center ${className}`}>
        <Image
          src={imgSrc}
          alt={description}
          width={80}
          height={80}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <Typography variant="h3" className="mb-3">
          {name}
        </Typography>
        <p className="mb-0">{description}</p>
      </Root>
    </Grid>
  );
};

const SectionServices = () => {
  return (
    <section id="services">
      <div className="container">
        <Typography variant="h2" className="section-title sanim">
          Services
        </Typography>
        <Grid container spacing={3} alignItems={"self-end"}>
          {cvConfig.services.map((s) => (
            <ServiceBox key={s.name} {...s} />
          ))}
        </Grid>
        <div className="mt-5 text-center">
          <p className="mb-0">
            Looking for a custom job? <a href="#contact">Click here</a> to contact me! 👋
          </p>
        </div>
      </div>
    </section>
  );
};

export default React.memo(SectionServices);
