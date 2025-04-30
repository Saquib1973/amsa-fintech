interface ColorSwatchProps {
  name: string;
  color: string;
}

export const ColorSwatch = ({ name, color }: ColorSwatchProps) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-12 rounded-lg border border-gray-200"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{color}</p>
      </div>
    </div>
  );
};