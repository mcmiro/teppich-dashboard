import { useState } from 'react';
import Arrow from '../../assets/icons/caret-down.svg';

export interface DropDownProps {
  onSelect: (value: string) => void;
}

const DropDown = ({ onSelect }: DropDownProps) => {
  const [active, setActive] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleSelect = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    value: string
  ) => {
    const targetItem = event.currentTarget;
    setSelectedItem(targetItem.textContent || '');
    onSelect(value);
  };

  return (
    <div
      onClick={() => setActive(!active)}
      className="relative inline-block text-left w-full"
    >
      <div>
        <button
          onClick={() => setActive(!active)}
          className="inline-flex w-full justify-between gap-x-1.5 rounded bg-white p-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          {selectedItem ? selectedItem : 'Auswählen'}
          <img
            src={Arrow}
            className={`-mr-1 h-5 w-5 text-gray-400 ${
              active ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      <div
        className={`transition ease-out duration-100 transform ${
          active ? 'show' : 'hidden'
        }`}
      >
        <div className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none h-32 overflow-y-auto">
          <ul className="py-1">
            <li
              onClick={(e) => handleSelect(e, 'open')}
              className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              in Bearbeitung
            </li>
            <li
              onClick={(e) => handleSelect(e, 'pick')}
              className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              angenommen
            </li>
            <li
              onClick={(e) => handleSelect(e, 'unobtainable')}
              className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              nicht erreichbar
            </li>
            <li
              onClick={(e) => handleSelect(e, 'done')}
              className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              abgeschlossen
            </li>
            <li
              onClick={(e) => handleSelect(e, 'cancelled')}
              className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              storno
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropDown;
