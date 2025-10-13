import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { FaAngleDoubleUp } from "react-icons/fa";
import scss from "./ButtonUp.module.scss";

export const ButtonUp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = debounce(() => {
    setIsVisible(window.scrollY > 600);
  }, 100);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel(); // Cleanup debounce
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Płynny scroll na górę strony
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOnClick();
    }
  };

  return (
    <button
      name="upButton"
      className={`${scss["up-button"]} ${
        isVisible ? scss["visible"] : scss["hidden"]
      }`} // Zmienia klasę na visible, gdy przycisk ma się wyświetlać
      type="button"
      onClick={handleOnClick}
      onKeyDown={handleKeyDown}
      aria-label="Scroll to top"
      // style={{ display: isVisible ? "block" : "none" }} // Przycisk jest widoczny tylko, gdy isVisible jest true
    >
      <FaAngleDoubleUp />
    </button>
  );
};
