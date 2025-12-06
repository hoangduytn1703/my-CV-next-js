import { Grid, Hidden, Select, SelectChangeEvent, Typography, styled } from "@mui/material";
import clsx from "clsx";
import { CompanyType, cvConfig } from "config/cv";
import React, { useCallback, useState } from "react";
import WorkModal, { WorkModalData } from "./Modal";
import WorkItem from "./WorkItem";

const PREFIX = "SectionWorks";
const classes = {
  menuPc: `${PREFIX}-menuPc`,
  dropdown: `${PREFIX}-dropdown`,
};
const Root = styled("div")(() => ({
  [`& .${classes.menuPc}`]: {
    "& li": {
      color: "var(--primary-text)",
      cursor: "pointer",
      fontSize: "1.6rem",
      fontWeight: 700,
      position: "relative",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        color: "var(--main-color)",
      },
      "&:not(:last-child)": {
        marginRight: "1.8rem",
      },
    },
    "& .current": {
      color: "var(--main-color)",
    },
  },
  [`& .${classes.dropdown}`]: {
    width: "100%",
    color: "var(--primary-text)",
    "& .MuiSelect-icon": {
      color: "unset",
    },
  },
}));

// Get unique companies from works
const getCompanies = () => {
  const companies = new Set<string>();

  cvConfig.works.forEach((work) => {
    if (work.company) {
      companies.add(work.company);
    }
  });

  return Array.from(companies);
};

// Get company filter value (slug)
const getCompanyFilter = (company: string): string => {
  if (company === "GMO-Z.com Runsystem") return CompanyType["GMO-Z.com Runsystem"];
  if (company === "TQ Design") return CompanyType["TQ Design"];
  if (company === "BSD SOLUTION") return CompanyType["BSD SOLUTION"];
  if (company === "FPT Shop") return CompanyType["FPT Shop"];

  return company.toLowerCase().replace(/\s+/g, "-");
};

const SectionWorks = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isotope = React.useRef<any>();
  const [selectedCompany, setSelectedCompany] = useState(CompanyType.Everything);
  const [modal, setModal] = React.useState<WorkModalData>({ open: false });
  const companies = getCompanies();

  const handleClose = () => {
    setModal((state) => ({ ...state, open: false }));
  };

  const onChangeCompany = useCallback(
    (companyFilter: string) => async () => {
      setSelectedCompany(companyFilter);
      if (isotope.current === undefined) {
        const Isotope = (await import("isotope-layout")).default;
        isotope.current = new Isotope("#work-container", {
          itemSelector: ".work-item",
          percentPosition: true,
        });
      }
      if (companyFilter === CompanyType.Everything) {
        isotope.current.arrange({ filter: CompanyType.Everything });
      } else {
        isotope.current.arrange({ filter: `.${companyFilter}` });
      }
    },
    []
  );

  const handleChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      onChangeCompany(event.target.value as string)();
    },
    [onChangeCompany]
  );

  return (
    <section id="works">
      <Root className="container">
        <Typography variant="h2" className="section-title sanim">
          Recent works
        </Typography>
        <Hidden only={["xs"]}>
          <ul className={`${classes.menuPc} mb-4 list-inline sanim`}>
            <li
              className={clsx("list-inline-item", selectedCompany === CompanyType.Everything ? "current" : "")}
              onClick={onChangeCompany(CompanyType.Everything)}
            >
              Everything
            </li>
            {companies.map((company) => {
              const companyFilter = getCompanyFilter(company);

              return (
                <li
                  key={company}
                  className={clsx("list-inline-item", selectedCompany === companyFilter ? "current" : "")}
                  onClick={onChangeCompany(companyFilter)}
                >
                  {company}
                </li>
              );
            })}
          </ul>
        </Hidden>
        <Hidden smUp>
          <Select className={`${classes.dropdown} mb-2`} native value={selectedCompany} onChange={handleChange}>
            <option value={CompanyType.Everything}>Everything</option>
            {companies.map((company) => {
              const companyFilter = getCompanyFilter(company);

              return (
                <option key={company} value={companyFilter}>
                  {company}
                </option>
              );
            })}
          </Select>
        </Hidden>
        <Grid container spacing={0} id="work-container">
          {cvConfig.works.map((w, idx) => {
            const companyFilter = w.company ? getCompanyFilter(w.company) : "";
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { company, ...workProps } = w;

            return (
              <WorkItem key={`${w.href}-${idx}`} {...workProps} setModal={setModal} companyFilter={companyFilter} />
            );
          })}
        </Grid>
      </Root>
      <WorkModal onClose={handleClose} data={modal} />
    </section>
  );
};

export default React.memo(SectionWorks);
