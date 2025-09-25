import { useState } from "react";

export const useToggle = (initialState = false) => {
  const [isOpenModal, setIsOpenModal] = useState(initialState);

  const openModal = () => setIsOpenModal(true);

  const closeModal = () => setIsOpenModal(false);
  const toggleModal = () => setIsOpenModal((prev) => !prev);
  return { isOpenModal, openModal, closeModal, toggleModal };
};