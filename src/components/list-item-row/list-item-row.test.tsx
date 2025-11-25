import { render, screen } from "@testing-library/react";

import { ListItemRow } from "./list-item-row";

describe("ListItemRow Component", () => {
  const itemKey = "test-key";
  const text = "Test Item";

  test("renders with given text", () => {
    render(<ListItemRow itemKey={itemKey} text={text} selected={false} />);

    const listItem = screen.getByText(text);
    expect(listItem).toBeInTheDocument();
  });

  test("applies selected class when selected is true", () => {
    render(<ListItemRow itemKey={itemKey} text={text} selected={true} />);

    const listItem = screen.getByText(text);
    expect(listItem).toHaveClass("list-item-row--selected");
  });

  test("does not apply selected class when selected is false", () => {
    render(<ListItemRow itemKey={itemKey} text={text} selected={false} />);

    const listItem = screen.getByText(text);
    expect(listItem).not.toHaveClass("list-item-row--selected");
  });

  test("adds selected class when selected is true", () => {
    render(<ListItemRow itemKey="1" text="Hello" selected={true} />);

    const item = screen.getByText("Hello");
    expect(item.classList.contains("list-item-row--selected")).toBe(true);
  });

  test("does not add selected class when selected is false", () => {
    render(<ListItemRow itemKey="1" text="Hello" selected={false} />);

    const item = screen.getByText("Hello");
    expect(item.classList.contains("list-item-row--selected")).toBe(false);
  });
});
