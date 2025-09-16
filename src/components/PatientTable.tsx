import { Patient } from "@/classes/Patient";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  data: Patient[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export default function PatientTable({
  data,
  searchTerm,
  setSearchTerm,
  handleSearch,
  dataSource,
  setDataSource,
}: {
  data: Patient[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: () => void;
  dataSource: "all" | "daily";
  setDataSource: (value: "all" | "daily") => void;
}) {
  return (
    <div className="rounded-xl p-4 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-2 md:mb-0">
          <img src="/icons/patient.svg" alt="Patient Icon" className="w-5" />
          Patient List
        </div>
        <div className="mb-4 px-4 flex gap-2 items-center">
          <Select value={dataSource} onValueChange={setDataSource}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Pilih Data" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="daily" className="rounded-lg">
          Rekapan Per Hari
              </SelectItem>
              <SelectItem value="all" className="rounded-lg">
          Keseluruhan
              </SelectItem>
            </SelectContent>
          </Select>
          <input
            type="text"
            placeholder="No. Antrian / Registrasi / Nama"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="min-w-full table-fixed text-sm text-left bg-white rounded-md overflow-hidden border border-gray-200">
          <thead className="bg-gray-200 text-gray-700 border-b border-gray-300">
            <tr>
              <th className="px-5 py-3">No.</th>
              <th className="px-6 py-3">No. Pasien</th>
              <th className="px-6 py-3">Lab Reg</th>
              <th className="px-6 py-3">Ruang / Outlet</th>
              <th className="px-6 py-3">Loket</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, index) => (
              <tr key={p.id} className="border-t border-gray-300">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{p.patientNumber}</td>
                <td className="px-6 py-4">{p.labReg}</td>
                <td className="px-6 py-4">{p.outlet}</td>
                <td className="px-6 py-4">{p.loket}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.status === "COMPLETE"
                        ? "bg-green-100 text-green-700"
                        : p.status === "CANCELED"
                        ? "bg-red-100 text-red-700"
                        : p.status === "WAITING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
