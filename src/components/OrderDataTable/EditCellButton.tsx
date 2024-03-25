import { OrderDataModel } from '../../models/order';
import { ICON } from '../../assets/icons';

export interface EditCellButtonProps {
  data: OrderDataModel;
  onClick: (e: any) => void;
}

const EditCellButton = ({ data, onClick }: EditCellButtonProps) => {
  const handleClick = () => {
    onClick(data);
  };

  return (
    <button onClick={handleClick} className="h-8">
      <img src={ICON.Pencil} alt="Bearbeiten" />
    </button>
  );
};

export default EditCellButton;
