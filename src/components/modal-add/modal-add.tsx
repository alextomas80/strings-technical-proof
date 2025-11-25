import { useEffect, useRef, useState } from "react";

import { useStringListStore } from "@/store/useStringListStore";
import { CustomButton } from "../custom-button";

import "./modal-add.scss";

interface ModalAddProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalAdd = ({ isOpen, onClose }: ModalAddProps) => {
  const { addString } = useStringListStore();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleAddClick = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && trimmedValue.length > 0) {
      addString(trimmedValue);
      setInputValue("");
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddClick();
    }
  };

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  return (
    <div className="modal-add" data-testid="modal-add">
      <div className="modal-add__content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-add__text">Add item to list</h2>
        <input
          autoComplete="off"
          className="modal-add__input"
          name="modal-add-input"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type the text here..."
          ref={inputRef}
          type="text"
          value={inputValue}
        />
        <div className="modal-add__actions">
          <CustomButton label="Add" onClick={handleAddClick} disabled={!inputValue.trim()} />
          <CustomButton label="Cancel" variant="outline" onClick={handleClose} />
        </div>
      </div>
    </div>
  );
};
