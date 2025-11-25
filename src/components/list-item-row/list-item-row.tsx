import classNames from "classnames";

import { useStringListStore } from "@/store/useStringListStore";

import "./list-item-row.scss";

interface ListItemRowProps {
  itemKey: string;
  text: string;
  selected: boolean;
}

export const ListItemRow = ({ itemKey, text, selected }: ListItemRowProps) => {
  const { toggleSelection } = useStringListStore();

  return (
    <div
      className={classNames("list-item-row", { "list-item-row--selected": selected })}
      onClick={() => toggleSelection(itemKey)}
    >
      {text}
    </div>
  );
};
