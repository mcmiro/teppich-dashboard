import { useEffect, useState } from 'react';

interface LabelObject {
  status: string;
  bgColor: string;
}

export interface LabelProps {
  status: string;
}

const Label = ({ status }: LabelProps) => {
  const [labelValues, setLabelValues] = useState<LabelObject>({
    status: '',
    bgColor: '',
  });

  const handleStatus = () => {
    switch (status) {
      case 'open':
        setLabelValues({
          status: 'offen',
          bgColor: 'border border-yellow-300 bg-yellow-50 text-yellow-500',
        });
        return;
      case 'unobtainable':
        setLabelValues({
          status: 'nicht erreichbar',
          bgColor: 'border border-gray-300 bg-gray-100 text-gray-500',
        });
        return;
      case 'cancelled':
        setLabelValues({
          status: 'storno',
          bgColor: 'border border-red-300 bg-red-50 text-red-500',
        });
        return;
      case 'pick':
        setLabelValues({
          status: 'wird abgeholt',
          bgColor: 'border border-blue-300 bg-blue-50 text-blue-500',
        });
        return;
      case 'done':
        setLabelValues({
          status: 'abgeschlossen',
          bgColor: 'border border-green-300 bg-green-50 text-green-500',
        });
        return;
      default:
        setLabelValues({
          status: '',
          bgColor: '',
        });
    }
  };

  useEffect(() => {
    handleStatus();
  }, [status]);

  return (
    <div
      className={`rounded-full px-3 py-0.5 text-xs font-light ${labelValues.bgColor}`}
    >
      {labelValues.status}
    </div>
  );
};

export default Label;
