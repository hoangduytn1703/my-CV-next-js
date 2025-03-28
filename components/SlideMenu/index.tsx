import { Button, debounce, Hidden, styled, SwipeableDrawer, Theme, Tooltip } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Logo from "assets/images/logo192.webp";
import clsx from "clsx";
import DarkModeSwitch from "components/DarkModeSwitch";
import GrowingCircleAnimation from "components/GrowingCircleAnimation";
import HambugerMenu from "components/HambugerMenu";
import { cvConfig } from "config/cv";
import { drawerWidth, THEME_MODE_STORAGE_KEY } from "constants/app";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { logDev } from "utils/logs";
import { getLocalStorage } from "utils/storage";

const PREFIX = "SlideMenu";
const classes = {
  logo: `${PREFIX}-logo`,
  menu: `${PREFIX}-menu`,
  footer: `${PREFIX}-footer`,
  themeMode: `${PREFIX}-themeMode`,
  drawer: `${PREFIX}-drawer`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  wrapper: `${PREFIX}-wrapper`,
};
const Root = styled(SwipeableDrawer)(({ theme }) => ({
  [`& .${classes.logo}`]: {
    display: "flex",
    alignItems: "center",
    marginTop: "2rem",
    [theme.breakpoints.up("md")]: {
      marginTop: "4rem",
    },
    marginLeft: "2.2rem",
    "& .title": {
      fontWeight: 700,
      fontSize: "2rem",
      color: "var(--primary-text)",
      marginLeft: "1rem",
      transition: "color 0.5s",
    },
  },
  [`& .${classes.menu}`]: {
    overflowY: "auto",
    height: "calc(100vh - 15rem)",
    marginTop: "3rem",
    "& .MuiButtonBase-root": {
      justifyContent: "flex-start",
      transition: "color 0.5s",
    },
    "& .link": {
      width: "100%",
      padding: "1.5rem 1rem 1.5rem 3rem",
      fontWeight: 700,
      color: "var(--primary-text)",
      "& i": {
        color: "var(--active-text)",
        marginRight: "2rem",
        transition: "color 0.5s",
      },
    },
    "& .link.active": {
      color: "var(--active-text)",
    },
  },
  [`& .${classes.footer}`]: {
    position: "absolute",
    bottom: "2rem",
    left: "3rem",
    "& .copyright": {
      color: "var(--light-gray-text)",
    },
  },
  [`& .${classes.themeMode}`]: {
    position: "absolute",
    bottom: "2rem",
    right: "2rem",
    color: "var(--primary-text)",
    transition: "color 1s",
  },
  [`&.${classes.drawer}`]: {
    width: drawerWidth,
    flexShrink: 0,
  },
  [`& .${classes.drawerPaper}`]: {
    width: "80%",
    maxWidth: drawerWidth,
  },
  [`& .${classes.wrapper}`]: {
    height: "100%",
    overflow: "hidden",
    [theme.breakpoints.down("md")]: {
      backgroundColor: "var(--main-bg)",
      transition: "background-color 0.5s",
    },
  },
}));

const onClickLogo = () => {
  window.open("https://www.facebook.com/AkiraGosho1703/");
};

enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

const setTheme = (mode: ThemeMode) => {
  switch (mode) {
    case ThemeMode.Light:
      document.body.classList.remove(ThemeMode.Dark);
      break;
    case ThemeMode.Dark:
      document.body.classList.add(ThemeMode.Dark);
      break;
  }
};

const SlideMenu = () => {
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isPc = useMediaQuery<Theme>((theme) => theme.breakpoints.up("md"));

  const [currentPath, setCurrentPath] = useState("");
  const onMenuClick = useCallback(
    (open: boolean) => () => {
      setOpenMenu(open);
    },
    []
  );
  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      onMenuClick(open)();
    },
    [onMenuClick]
  );
  const onItemClick = useCallback(
    (href: string) => (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!isPc) {
        toggleDrawer(false)(ev);
      }
      setCurrentPath(href);
      const targetScroll = document.getElementById(href);
      window.scrollTo(0, targetScroll?.offsetTop ?? 0);
    },
    [isPc, toggleDrawer]
  );

  useEffect(() => {
    setOpenMenu(isPc);
  }, [isPc]);

  useEffect(() => {
    const sections = cvConfig.menu.map((item) => {
      return document.getElementById(item.href) as HTMLElement;
    });
    const onScroll = debounce(() => {
      if (window.scrollY >= 0 && window.scrollY <= window.innerHeight / 2) {
        setCurrentPath(cvConfig.menu[0].href);

        return;
      }
      for (let i = 1; i < sections.length; i++) {
        if (
          sections[i]?.offsetTop - window.scrollY < window.innerHeight / 2.2 &&
          sections[i + 1]?.offsetTop - window.scrollY >= window.innerHeight / 2
        ) {
          setCurrentPath(cvConfig.menu[i].href);

          return;
        }
      }
      if (window.scrollY >= sections[cvConfig.menu.length - 1]?.offsetTop - window.innerHeight / 2 - 300) {
        setCurrentPath(cvConfig.menu[cvConfig.menu.length - 1].href);

        return;
      }
    }, 50);
    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    let theme = getLocalStorage(THEME_MODE_STORAGE_KEY) as ThemeMode;
    if (!theme) {
      // Use OS System Preferences
      theme = prefersDarkMode ? ThemeMode.Dark : ThemeMode.Light;
    }
    logDev("prefersDarkMode", theme);
    setTheme(theme);
    setThemeMode(theme);
  }, [prefersDarkMode]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeTheme = useCallback((_checked: boolean, event: any) => {
    logDev("aa");
    setThemeMode((s) => {
      const newTheme = s === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;
      setTheme(newTheme);
      localStorage.setItem(THEME_MODE_STORAGE_KEY, newTheme);

      const bodyRect = document.body.getBoundingClientRect();
      const elemRect = event.target.getBoundingClientRect();
      const offsetTop = elemRect.top - bodyRect.top;
      const offsetLeft = elemRect.left - bodyRect.left;

      // this tells us how much the user has zoomed in using the pinch gesture
      const deviceZoomRatio = document.documentElement.clientWidth / window.innerWidth;

      const customEventState = {
        x: offsetLeft + elemRect.width / 2,
        // if the user is pinch zoomed in, then use the pinch zoom coordinate detection logic,
        // otherwise, use the distance of the icon from the top of the page. For some reason
        // offsetTop doesn't work when the user scrolls down and the zoom ratio == 1 (iOS14)
        y: (deviceZoomRatio > 1 ? offsetTop : elemRect.top) + elemRect.height / 2,
      };

      const darkModeToggleEvent = new CustomEvent("darkModeToggle", {
        detail: customEventState,
      });
      dispatchEvent(darkModeToggleEvent);

      return newTheme;
    });
  }, []);

  return (
    <>
      <Hidden mdUp>
        <HambugerMenu isOpen={isOpenMenu} onClick={onMenuClick(!isOpenMenu)} />
      </Hidden>
      <Root
        id="slide-menu"
        variant={isPc ? "persistent" : undefined}
        anchor={isPc ? "left" : "right"}
        open={isOpenMenu}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableSwipeToOpen
        transitionDuration={isPc ? 0 : 300}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.wrapper}>
          <div className={classes.logo}>
            <Image
              className="button border-radius"
              width={32}
              height={32}
              src={Logo}
              alt="https://www.facebook.com/AkiraGosho1703/"
              onClick={onClickLogo}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <span className="title">DuyNH CV</span>
          </div>
          <div className={classes.menu} onKeyDown={toggleDrawer(false)}>
            {cvConfig.menu.map((item) => (
              <Button
                key={item.href}
                className={clsx(
                  "link",
                  currentPath === item.href ? "active" : "",
                  item.href === "blog" ? "opacity-50" : ""
                )}
                onClick={onItemClick(item.href)}
                disabled={item.href === "blog"}
              >
                <i className={item.className} />
                {item.label}
              </Button>
            ))}
          </div>
          <div className={classes.footer}>
            <span className="copyright">
              © {new Date().getFullYear()}{" "}
              <a href="https://www.facebook.com/AkiraGosho1703/" target="_blank" rel="noreferrer">
                DuyNH
              </a>
            </span>
          </div>
          <Tooltip title="Toggle light/dark theme" arrow>
            <DarkModeSwitch
              className={classes.themeMode}
              checked={themeMode === ThemeMode.Light}
              onChange={onChangeTheme}
              sunColor="#fa6437"
              moonColor="#fadd37"
              size={30}
            />
          </Tooltip>
        </div>
      </Root>
      {isPc && <GrowingCircleAnimation isDark={themeMode === ThemeMode.Dark} />}
    </>
  );
};

export default SlideMenu;
