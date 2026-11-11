import { Reveal, SplitWords } from "components/fx/Reveal";
import s from "./SectionHeading.module.scss";

interface Props {
  index: string;
  eyebrow: string;
  title: string;
  highlight?: string;
}

const SectionHeading = ({ index, eyebrow, title, highlight }: Props) => (
  <div className={s.heading}>
    <Reveal y={20} blur={false}>
      <span className={s.eyebrow}>
        <span className={s.index}>{index}</span>
        <span className={s.line} aria-hidden />
        {eyebrow}
      </span>
    </Reveal>
    <SplitWords text={title} highlight={highlight} className={s.title} />
  </div>
);

export default SectionHeading;
