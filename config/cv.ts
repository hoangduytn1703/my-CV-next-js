import { MoreType } from "components/Section/Works/WorkItem";

export const WorkType: { [key: string]: string } = {
  Everything: "*",
  Web: "web",
  Mobile: "mobile",
  Own: "own",
};

export const cvConfig = {
  title: "Nguyen Hoang Duy",
  description:
    "DuyNH CV is a personal portfolio/CV/resume website template built with NextJs and Mterial-UI. This was created especially for those who want to build up their portfolio sites.",
  name: "Nguyen Hoang Duy",
  about: `I am Nguyen Hoang Duy, a frontend developer from Ho Chi Minh City, Viet Nam. I have rich experience in web apps & mobile apps. I am strong at VueJS and NuxtJS. Besides, I also code ReactJS and NextJS`,
  mainJob: ["Front-end developer", "Use VueJS/NuxtJS (main) and ReactJS/NextJS"],
  cvDownloadLink:
    "https://www.topcv.vn/xem-cv/Vg5WVlZRV1EOBQECBQIJXFJUVgFTAAgAUwEBUAc19e?fbclid=IwAR1n2BWyvSn6pay_I8ibt0aQkYHfoBrB5pPqtcxvdFqQk0E7CwPepyTP_D0",
  skills: [
    {
      name: "HTML/SCSS",
      value: 95,
      bgColor: "#e96228",
    },
    {
      name: "Javascript/ Typescript/ Jquery",
      value: 90,
      bgColor: "#0866a9",
    },
    {
      name: "VueJS",
      value: 90,
      bgColor: "#6aab80",
    },
    {
      name: "NuxtJS",
      value: 90,
      bgColor: "#6aab80",
    },
    {
      name: "ReactJS/ NextJS",
      value: 70,
      bgColor: "#60dafa",
    },
  ],
  facts: [
    {
      icon: "icon-fire",
      name: "Projects completed",
      count: 25,
    },
    {
      icon: "icon-cup",
      name: "Cup of coffee",
      count: 45,
    },
    // {
    //     icon: "icon-people",
    //     name: "Satisfied clients",
    //     count: 11,
    // },
    {
      icon: "icon-badge",
      name: "Nominees winner",
      count: 2,
    },
  ],
  menu: [
    {
      label: "Home",
      href: "home",
      className: "icon-home",
    },
    {
      label: "About",
      href: "about",
      className: "icon-user-following",
    },
    {
      label: "Services",
      href: "services",
      className: "icon-briefcase",
    },
    {
      label: "Experience",
      href: "experience",
      className: "icon-graduation",
    },
    // {
    //   label: "Works",
    //   href: "works",
    //   className: "icon-layers",
    // },
    {
      label: "Blog",
      href: "blog",
      className: "icon-note",
    },
    {
      label: "Contact",
      href: "contact",
      className: "icon-bubbles",
    },
  ],
  services: [
    {
      className: "text-light",
      imgSrc: "/images/service-1.svg",
      bgColor: "#6aab80",
      name: "Web Development",
      description:
        "I'm currently working with VueJS. Besides, I can also code with ReactJS. The applications I make are high performance and have beautiful effects. NuxtJS/ NextJs is my favorite framework.",
    },
    {
      className: "text-dark",
      imgSrc: "/images/service-2.svg",
      bgColor: "#F9D74C",
      name: "Web Development",
      description: "In addition, I am also good at converting designs (Figma, Photoshop) to websites using html/css/js",
    },
    {
      className: "text-light",
      imgSrc: "/images/service-3.svg",
      bgColor: "#F97B8B",
      name: "Blogger & SEOer",
      description: "In my free time, I write blog posts to share my experiences.",
    },
  ],
  experience: {
    education: [
      {
        time: "09/2013 - 11/2017",
        title: "Ho Chi Minh City University of Science",
        description: "Major: Software technology",
      },
    ],
    work: [
      {
        time: "6/2019 - Present",
        title: "Front end Developer",
        company: "GMO Z.Com Runsystem HCM",
        description: `Front end developer, develop web app, use VueJS/NuxtJS, ReactJS/NextJS, HTML5/CSS3, Javascript/Typescript, Jquery, Bootstrap, TailwindCSS, SCSS...`,
      },
      {
        time: "7/2017 - 4/ 2019",
        title: "Full stack Developer",
        company: "TQDesign",
        description: `develop product sugar cane house manager for TTC Group`,
      },
      {
        time: "7/2017 - 4/2017",
        title: "NET Developer",
        company: "BSD SOLUTION",
        description: `develop product sugar cane house manager for TTC Group`,
      },
      {
        time: "3/2016 - 1/2017",
        title: "NET Developer",
        company: "FPT SHOP",
        description: `Develop web MVC webform, use database SQL sever for back-end, use bootstrap, html5/css3, jquery library, technical web responsive..`,
      },
    ],
  },
  works: [
    {
      type: [WorkType.Mobile, WorkType.Web],
      title: "TQ Design",
      term: "ASP.NET MVC, HTML5/CSS3, Jquery",
      description: "",
      moreIcon: MoreType.Link,
      thumbnail: "/images/works/tqdesign.jpg",
      href: "https://www.tqdesign.vn/home.html",
    },
    {
      type: [WorkType.Web],
      title: "AKARI City website",
      term: "ASP.NET MVC, HTML5/CSS3, Jquery",
      description: "",
      moreIcon: MoreType.Link,
      thumbnail: "/images/works/AKARI-nha.jpg",
      href: "https://akaricity.vn/",
    },
    {
      type: [WorkType.Web],
      title: "Dragon village",
      term: "ASP.NET MVC, HTML5/CSS3, Jquery",
      description: "メタバ占いbyGMO|No1を目指すオンライン通話型メタバース",
      moreIcon: MoreType.Options,
      thumbnail: "/images/works/dragonvillage.png",
      href: "https://www.metauranai.com/",
    },
    {
      type: [WorkType.Mobile, WorkType.Web],
      title: "NHK for School",
      term: "VueJS",
      description:
        "NHK for School is like an online school where you can study various subjects with relatively simple Japanese.",
      moreIcon: MoreType.Options,
      thumbnail: "/images/works/nhk.jpg",
      href: "https://www.nhk.or.jp/school",
    },
    {
      type: [WorkType.Mobile, WorkType.Web],
      title: "Chikipay",
      term: "VueJS",
      description: "",
      moreIcon: MoreType.Options,
      thumbnail: "/images/works/chikipay.png",
      href: "https://web.chikipay-kyousou.jp/",
    },
    {
      type: [WorkType.Mobile, WorkType.Web],
      title: "Metauranai",
      term: "NextJS",
      description: "",
      moreIcon: MoreType.Options,
      thumbnail: "/images/works/metauranai.png",
      href: "https://metauranai.com/",
    },
    // {
    //   type: [WorkType.Mobile],
    //   title: "FX｜Securities smartphone app",
    //   term: "Xamarin Forms",
    //   moreIcon: MoreType.Link,
    //   thumbnail: "/images/works/sys-fx.webp",
    //   href: "https://kabu.com/app/sysfx/default.html",
    // },
    // {
    //   type: [WorkType.Mobile],
    //   title: "Bmoji - Custom Emojis by Designers",
    //   term: "Xamarin Forms",
    //   moreIcon: MoreType.Link,
    //   thumbnail: "/images/works/bmoji.webp",
    //   href: "http://www.thebmoji.com",
    // },
    // {
    //   type: [WorkType.Own, WorkType.Web],
    //   title: "AkiraGosho1703 - My blog",
    //   term: "Gatsby",
    //   moreIcon: MoreType.Link,
    //   thumbnail: "/images/works/my-blog.webp",
    //   href: "https://xn--t-lia.vn",
    // },
  ],
};
