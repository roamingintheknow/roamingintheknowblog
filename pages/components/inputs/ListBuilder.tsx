import { useState, useEffect } from "react";
import QuillTextEditor from './quill'

interface ListItem {
  id: number;
  text: string;
  subItems: SubItem[];
}

interface SubItem {
  id: number;
  text: string;
  subSubItems: SubSubItem[];
}

interface SubSubItem {
  id: number;
  text: string;
}

const ListBuilder = ({ index, onChange, existingList }: { 
  index: number; 
  onChange: (index: number, value: string) => void; 
  existingList: { id: number; text: string; subItems: any[] }[];
}) => {

  const [list, setList] = useState<ListItem[]>(existingList);
  useEffect(() => {
    // Update the list if existingList changes
    setList(existingList);
  }, [existingList]);
  
  useEffect(() => {
    // Sending the updated list back up to the main edit component so it is saved with the blog
    onChange(index, list); // Call the function directly
  }, [list]); 

  const addListItem = () => {
    setList((prev) => [
      ...prev,
      { id: Date.now(), text: "", subItems: [] }
    ]);
  };

  const addSubItem = (itemId: number) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              subItems: [
                ...item.subItems,
                { id: Date.now(), text: "", subSubItems: [] }
              ]
            }
          : item
      )
    );
  };

  const addSubSubItem = (itemId: number, subItemId: number) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              subItems: item.subItems.map((subItem) =>
                subItem.id === subItemId
                  ? {
                      ...subItem,
                      subSubItems: [
                        ...subItem.subSubItems,
                        { id: Date.now(), text: "" }
                      ]
                    }
                  : subItem
              )
            }
          : item
      )
    );
  };

  const updateText = (type: "list" | "sub" | "subSub", newText: string, itemId: number, subItemId?: number, subSubItemId?: number) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? type === "list"
            ? { ...item, text: newText }
            : {
                ...item,
                subItems: item.subItems.map((subItem) =>
                  subItem.id === subItemId
                    ? type === "sub"
                      ? { ...subItem, text: newText }
                      : {
                          ...subItem,
                          subSubItems: subItem.subSubItems.map((subSubItem) =>
                            subSubItem.id === subSubItemId
                              ? { ...subSubItem, text: newText }
                              : subSubItem
                          )
                        }
                    : subItem
                )
              }
          : item
      )
    );
  };

  const deleteListItem = (itemId: number) => {
    setList((prev) => prev.filter((item) => item.id !== itemId));
  };

  const deleteSubItem = (itemId: number, subItemId: number) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              subItems: item.subItems.filter((subItem) => subItem.id !== subItemId)
            }
          : item
      )
    );
  };

  const deleteSubSubItem = (itemId: number, subItemId: number, subSubItemId: number) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              subItems: item.subItems.map((subItem) =>
                subItem.id === subItemId
                  ? {
                      ...subItem,
                      subSubItems: subItem.subSubItems.filter(
                        (subSubItem) => subSubItem.id !== subSubItemId
                      )
                    }
                  : subItem
              )
            }
          : item
      )
    );
  };

  return (
<div className="flex flex-col w-full">
  <ul className="fill-width">
    {list.map((item) => (
      <li key={item.id} className="bg-white p-3">
        {/* Main List Item */}
        <div className="flex justify-between items-center w-full">
          <div className="w-4/5">
            <QuillTextEditor
              element={{ content: item.text, type: 'string' }}
              onChange={(index: number, value: string) => {
                if (value === "<p><br></p>") return;
                updateText("list", value, item.id);
              }}
              index={item.id}
            />
          </div>
          <button
            className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-4"
            onClick={() => deleteListItem(item.id)}
          >
            &times;
          </button>
        </div>

        {/* SubItems Section - Stacked Vertically */}
        <ul className="ml-6 mt-2 space-y-2">
          {item.subItems.map((subItem) => (
            <li
              key={subItem.id}
              className="bg-gray-200 p-2 rounded text-sm text-gray-700 flex flex-col space-y-2"
            >
              {/* SubItem */}
              <div className="flex justify-between items-center w-full">
                <div className="w-4/5">
                  <QuillTextEditor
                    element={{ content: subItem.text, type: 'string' }}
                    onChange={(index: number, value: string) => {
                      if (value === "<p><br></p>") return;
                      updateText("sub", value, item.id, subItem.id);
                    }}
                    index={subItem.id}
                  />
                </div>
                <button
                  className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-4"
                  onClick={() => deleteSubItem(item.id, subItem.id)}
                >
                  &times;
                </button>
              </div>

              {/* SubSubItems Section - Stacked Vertically */}
              <ul className="ml-6 mt-2 space-y-1">
                {subItem.subSubItems.map((subSubItem) => (
                  <li
                    key={subSubItem.id}
                    className="text-gray-700 text-sm flex flex-col space-y-1"
                  >
                    {/* SubSubItem */}
                    <div className="flex justify-between items-center w-full">
                      <div className="w-4/5">
                        <QuillTextEditor
                          element={{ content: subSubItem.text, type: 'string' }}
                          onChange={(index: number, value: string) => {
                            if (value === "<p><br></p>") return;
                            updateText(
                              "subSub",
                              value,
                              item.id,
                              subItem.id,
                              subSubItem.id
                            );
                          }}
                          index={subSubItem.id}
                        />
                      </div>
                      <button
                        className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() =>
                          deleteSubSubItem(item.id, subItem.id, subSubItem.id)
                        }
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Button to add a new SubSubItem */}
              <button
                className="ml-6 bg-yellow-500 text-white px-2 py-1 rounded mt-2"
                onClick={() => addSubSubItem(item.id, subItem.id)}
              >
                + Add Sub-Subitem
              </button>
            </li>
          ))}
        </ul>

        {/* Button to add a new SubItem */}
        <button
          className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
          onClick={() => addSubItem(item.id)}
        >
          + Sublist
        </button>
      </li>
    ))}
  </ul>

  {/* Button to add a new List Item */}
  <button
    onClick={addListItem}
    className="mb-4 bg-blue-500 text-white px-3 py-1 rounded"
  >
    Add List Item
  </button>
</div>




  );
};

export default ListBuilder;
