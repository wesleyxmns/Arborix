import { Minus, Check } from 'lucide-react';

type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';

interface CheckboxProps {
  state: CheckboxState;
  onChange?: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ state, onChange }) => {
  return (
    <div
      onClick={onChange}
      className="w-4 h-4 border-2 rounded flex items-center justify-center cursor-pointer select-none"
      style={{
        borderColor: '#888',
        backgroundColor: state === 'checked' ? '#3b82f6' : 'white',
      }}
    >
      {state === 'checked' && <Check size={12} className="text-white" />}
      {state === 'indeterminate' && <Minus size={12} className="text-gray-600" />}
    </div>
  );
};