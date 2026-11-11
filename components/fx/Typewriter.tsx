import { useEffect, useState } from "react";

/** Types, pauses, deletes and cycles through `words`. */
const Typewriter = ({ words, start = true, className }: { words: string[]; start?: boolean; className?: string }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!start || words.length === 0) return;
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = words[wordIndex % words.length];
      if (!deleting) {
        charIndex++;
        setText(word.slice(0, charIndex));
        if (charIndex >= word.length) {
          deleting = true;
          timer = setTimeout(tick, 1900);

          return;
        }
        timer = setTimeout(tick, 40 + Math.random() * 45);
      } else {
        charIndex--;
        setText(word.slice(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          wordIndex++;
          timer = setTimeout(tick, 380);

          return;
        }
        timer = setTimeout(tick, 22);
      }
    };
    timer = setTimeout(tick, 500);

    return () => clearTimeout(timer);
  }, [start, words]);

  return (
    <span className={className}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>{text}</span>
      <span className="typewriter-caret" aria-hidden />
    </span>
  );
};

export default Typewriter;
