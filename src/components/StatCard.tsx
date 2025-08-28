import Image from "next/image";

type StatCardProps = {
  title: string;
  value: number;
  icon: string;
  color: string;
  active?: boolean;
  onClick?: () => void;
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  active = false,
  onClick,
}: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-md min-h-[150px] flex flex-col justify-between transition-transform hover:scale-105 focus:outline-none ${
        active ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <div className="w-6 h-6">
          <Image src={icon} alt="status icon" width={24} height={24} />
        </div>
      </div>
      <div className={`text-4xl font-bold mt-6 ${color}`}>{value}</div>
    </button>
  );
}
