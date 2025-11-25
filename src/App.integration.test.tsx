import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, test } from "vitest";

import App from "./App";
import { useStringListStore } from "./store/useStringListStore";

const resetStore = () => {
  useStringListStore.setState({ strings: [], lastDeletedStrings: [] });
  localStorage.clear();
};

const addStringThroughModal = (text: string) => {
  fireEvent.click(screen.getByText("ADD"));
  const input = screen.getByPlaceholderText("Type the text here...");
  fireEvent.change(input, { target: { value: text } });
  fireEvent.click(screen.getByText("Add"));
};

const getDeleteButton = () => screen.getByText("DELETE") as HTMLButtonElement;
const getRestoreButton = () => screen.getByTestId("restore-button") as HTMLButtonElement;

describe("Flujos completos de la aplicación", () => {
  beforeEach(() => {
    resetStore();
  });

  test("permite crear un string desde el modal y visualizarlo en la lista", () => {
    render(<App />);

    addStringThroughModal("Nuevo elemento");

    expect(screen.getByText("Nuevo elemento")).toBeInTheDocument();
  });

  test("permite seleccionar, eliminar y restaurar un string", () => {
    render(<App />);

    addStringThroughModal("Elemento a eliminar");

    const listItem = screen.getByText("Elemento a eliminar");
    fireEvent.click(listItem);

    const deleteButton = screen.getByText("DELETE") as HTMLButtonElement;
    expect(deleteButton.disabled).toBe(false);
    fireEvent.click(deleteButton);

    expect(screen.queryByText("Elemento a eliminar")).not.toBeInTheDocument();

    const restoreButton = screen.getByTestId("restore-button") as HTMLButtonElement;
    expect(restoreButton.disabled).toBe(false);
    fireEvent.click(restoreButton);

    expect(screen.getByText("Elemento a eliminar")).toBeInTheDocument();
  });

  test("permite eliminar y restaurar múltiples strings manteniendo el estado de los botones", () => {
    render(<App />);

    addStringThroughModal("Elemento 1");
    addStringThroughModal("Elemento 2");

    fireEvent.click(screen.getByText("Elemento 1"));
    fireEvent.click(screen.getByText("Elemento 2"));

    const deleteButton = getDeleteButton();
    expect(deleteButton.disabled).toBe(false);
    fireEvent.click(deleteButton);

    expect(screen.queryByText("Elemento 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Elemento 2")).not.toBeInTheDocument();

    const restoreButton = getRestoreButton();
    expect(restoreButton.disabled).toBe(false);
    fireEvent.click(restoreButton);

    expect(screen.getByText("Elemento 1")).toBeInTheDocument();
    expect(screen.getByText("Elemento 2")).toBeInTheDocument();
    expect(getDeleteButton().disabled).toBe(true);
    expect(getRestoreButton().disabled).toBe(true);
  });

  test("añade un string con la tecla Enter y evita valores vacíos", () => {
    render(<App />);

    fireEvent.click(screen.getByText("ADD"));

    const input = screen.getByPlaceholderText("Type the text here...") as HTMLInputElement;
    const addButton = screen.getByText("Add") as HTMLButtonElement;

    expect(addButton.disabled).toBe(true);

    fireEvent.change(input, { target: { value: "   " } });
    expect(addButton.disabled).toBe(true);

    fireEvent.change(input, { target: { value: "Nuevo con Enter" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(screen.queryByTestId("modal-add")).not.toBeInTheDocument();
    expect(screen.getByText("Nuevo con Enter")).toBeInTheDocument();
  });

  test("cancela la creación y limpia el valor del input al reabrir el modal", () => {
    render(<App />);

    fireEvent.click(screen.getByText("ADD"));

    let input = screen.getByPlaceholderText("Type the text here...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Temporal" } });

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("modal-add")).not.toBeInTheDocument();
    expect(screen.queryByText("Temporal")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("ADD"));
    input = screen.getByPlaceholderText("Type the text here...") as HTMLInputElement;
    expect(input.value).toBe("");
  });
});

