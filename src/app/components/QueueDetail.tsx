import { Circle, Star } from "lucide-react";

export interface Patient {
  patientNumber: string;
  outlet: string;
  labReg: string;
  status: string;
}

interface QueueDetailProps {
  onComplete: () => void;
  onRecall: () => void;
  onSkip: () => void;
  onCancel: () => void;
  patients: Patient[];
}

export default function QueueDetail({
  patients,
}: QueueDetailProps) {
  return (
    <div className="space-y-6 h-flex flex flex-col p-1">
        <div className="bg-white rounded-xl p-6 shadow space-y-6 flex-1 flex flex-col">
        <h2 className="text-3xl font-bold text-black">Queue Calling Patient</h2>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-300 rounded-xl p-6">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-900">
            <div>
              <p className="font-semibold">No. Pasien</p>
              <p className="text-gray-600">001</p>
            </div>
            <div>
              <p className="font-semibold">Outlet</p>
              <p className="text-gray-600">Outlet 1</p>
            </div>
            <div>
              <p className="font-semibold">Lab Register</p>
              <p className="text-gray-600">LAB-1001</p>
            </div>
            <div>
              <p className="font-semibold">Register</p>
              <p className="text-gray-600">21 Juli 2025</p>
            </div>
            <div>
              <p className="font-semibold">Sample</p>
              <p className="text-gray-600">IPRJ</p>
            </div>
            <div>
              <p className="font-semibold">Name</p>
              <p className="text-gray-600">Meja 10</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="font-semibold mr-2">Calling</p>
              <Circle className="w-5 h-5 text-blue-500 fill-blue-500" />
              <Circle className="w-5 h-5 text-blue-500 fill-blue-500" />
            </div>
          </div>

          <div className="flex flex-col gap-4 items-end mt-6 md:mt-0">
            <div className="flex flex-col gap-3 w-32">
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-sm">Complete</button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold text-sm">Recall</button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold text-sm">Skip</button>
              <button className="bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-md font-semibold text-sm">Cancel</button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-x">
            <table className="min-w-full text-sm text-left">
                <thead>
                <tr className="bg-gray-300 text-gray-700 rounded-t-xl">
                    <th className="px-4 py-3 rounded-tl-xl">No.</th>
                    <th className="px-4 py-3">No. Pasien</th>
                    <th className="px-4 py-3">Lab Reg</th>
                    <th className="px-4 py-3">Ruang / Outlet</th>
                    <th className="px-4 py-3 rounded-tr-xl">Status</th>
                </tr>
                </thead>
                <tbody className="text-gray-800">
                {patients.map((patient, i) => (
                    <tr
                    key={i}
                    className="bg-white border-b last:border-b-0  border-gray-300 shadow-sm hover:shadow-md transition rounded-lg"
                    >
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold">{patient.patientNumber}</td>
                    <td className="px-4 py-3">{patient.labReg}</td>
                    <td className="px-4 py-3">{patient.outlet}</td>
                    <td className="px-4 py-3">
                        <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            patient.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : patient.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                        >
                        {patient.status}
                        </span>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
