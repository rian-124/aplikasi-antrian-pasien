import Image from "next/image";

export default function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md min-h-[150px] ml-4 mr-4 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <div className="w-6 h-6">
          <Image src={icon} alt="status icon" width={24} height={24} />
        </div>
      </div>
      <div className={`text-4xl font-bold mt-6 ${color}`}>{value}</div>
    </div>
  );
}
