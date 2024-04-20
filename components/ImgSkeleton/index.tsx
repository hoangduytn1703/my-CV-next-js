/* eslint-disable jsx-a11y/alt-text */
import { Skeleton, styled } from "@mui/material";
import { useCallback, useState } from "react";

/* eslint-disable @next/next/no-img-element */
interface Props {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
}

const PREFIX = "ImgSkeleton";
const classes = {
  root: `${PREFIX}-root`,
  s: `${PREFIX}-s`,
};
type StyleProps = {
  width: number;
  height: number;
};
const Root = styled("div")<StyleProps>((props) => ({
  [`&.${classes.root}`]: {
    position: "relative",
    width: props.width,
    height: props.height,
    "& .MuiSkeleton-root": {
      margin: "0 auto",
      zIndex: 102,
    },
    "& img": {
      margin: "0 auto",
      position: "relative",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "all .3s ease-out",
      zIndex: 102,
    },
    "&:after": {
      content: '""',
      border: "15px solid rgba(2, 59, 47, .9)",
      borderRadius: "50%",
      top: "-15px",
      left: "-15px",
      width: "100%",
      height: "100%",
      position: "absolute",
      animation: "pulsate 1.6s ease-out",
      animationIterationCount: "infinite",
      webkitAnimation: "pulsate 1.6s ease-out",
      opacity: 0,
      zIndex: 99,
      "-webkit-animation": "pulsate 1.6s ease-out",
      "-webkit-animation-iteration-count": "infinite",
    },
  },
  [`& .${classes.s}`]: {
    position: "absolute",
    top: 0,
    background: "var(--avatar-bg)",
    "&:after": {
      background: "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)",
    },
  },
  "@keyframes pulsate": {
    "0%": {
      transform: "scale(0.6, 0.6)",
      opacity: 0,
    },
    "50%": {
      opacity: 1,
    },
    "100%": {
      transform: "scale(1, 1)",
      opacity: 0,
    },
  },
  "@-webkit-keyframes pulsate": {
    "0%": {
      transform: "scale(0.6, 0.6)",
      opacity: 0,
    },
    "50%": {
      opacity: 1,
    },
    "100%": {
      transform: "scale(1, 1)",
      opacity: 0,
    },
  },
}));

const ImgSkeleton = (props: Props) => {
  const { width, height, src } = props;
  const [loading, setLoading] = useState(true);

  const onImgLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <Root width={width} height={height} className={classes.root}>
      {src && <img {...props} onLoad={onImgLoad} />}
      {(!src || loading) && (
        <Skeleton classes={{ root: classes.s }} variant="circular" animation="wave" width={width} height={height} />
      )}
    </Root>
  );
};

export default ImgSkeleton;
