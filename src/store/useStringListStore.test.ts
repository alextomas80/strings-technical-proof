import { useStringListStore } from "./useStringListStore";

describe("useStringListStore", () => {
  beforeEach(() => {
    const { getState, setState } = useStringListStore;
    setState({
      strings: [],
      lastDeletedStrings: [],
      addString: getState().addString,
      toggleSelection: getState().toggleSelection,
      removeSelectedStrings: getState().removeSelectedStrings,
      restoreDeletedStrings: getState().restoreDeletedStrings,
    });
  });

  test("adds a string", () => {
    const { addString } = useStringListStore.getState();
    addString("Test String");

    const updatedStrings = useStringListStore.getState().strings;

    expect(updatedStrings.length).toBe(1);
    expect(updatedStrings[0].value).toBe("Test String");
    expect(updatedStrings[0].isSelected).toBe(false);
  });

  test("toggles string selection", () => {
    const { addString, toggleSelection } = useStringListStore.getState();
    addString("Test String");

    const stringKey = useStringListStore.getState().strings[0].key;
    toggleSelection(stringKey);

    const updatedString = useStringListStore.getState().strings[0];
    expect(updatedString.isSelected).toBe(true);
  });

  test("removes selected strings", () => {
    const { addString, toggleSelection, removeSelectedStrings } = useStringListStore.getState();

    addString("String 1");
    addString("String 2");

    const stringKey1 = useStringListStore.getState().strings[0].key;
    const stringKey2 = useStringListStore.getState().strings[1].key;

    toggleSelection(stringKey1);
    toggleSelection(stringKey2);

    removeSelectedStrings();

    const updatedStrings = useStringListStore.getState().strings;
    expect(updatedStrings.length).toBe(0);
  });

  test("restores deleted strings", () => {
    const { addString, toggleSelection, removeSelectedStrings, restoreDeletedStrings } = useStringListStore.getState();

    addString("String 1");
    addString("String 2");

    const stringKey1 = useStringListStore.getState().strings[0].key;
    const stringKey2 = useStringListStore.getState().strings[1].key;

    toggleSelection(stringKey1);
    toggleSelection(stringKey2);

    removeSelectedStrings();
    restoreDeletedStrings();

    const restoredStrings = useStringListStore.getState().strings;
    expect(restoredStrings.length).toBe(2);
    expect(restoredStrings[0].isSelected).toBe(false);
    expect(restoredStrings[1].isSelected).toBe(false);
  });
});
