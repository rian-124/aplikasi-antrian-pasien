"use client";

import { Circle } from "lucide-react";
import { Patient } from "@/classes/Patient";
import Swal from "sweetalert2";

interface QueueDetailProps {
  onComplete: () => void;
  onRecall: () => void;
  onCancel: () => void;
  patients: Patient[];
  currentPatient: Patient | null;
}

export default function QueueDetail({
  patients,
  currentPatient,
  onComplete,
  onRecall,
  onCancel,
}: QueueDetailProps) {
  const confirmAction = (
    title: string,
    text: string,
    callback: () => void
  ) => {
    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Lanjutkan",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
        Swal.fire("Berhasil!", "Aksi telah dijalankan.", "success");
      }
    });
  };

  const handleRecallClick = () => {
    if (!currentPatient) return;
    // Jika sudah 2 kali recall, otomatis cancel
    if (currentPatient.bintang >= 2) {
      confirmAction(
        "Batalkan Pasien?",
        "Pasien sudah dipanggil 2 kali, sekarang akan dibatalkan.",
        onCancel
      );
    } else {
      confirmAction(
        "Recall Pasien?",
        "Pasien akan dipanggil kembali",
        onRecall
      );
    }
  };

  return (
    <div className="space-y-6 h-flex flex flex-col p-1">
      <div className="bg-white rounded-xl p-6 shadow space-y-6 flex-1 flex flex-col">
        <h2 className="text-3xl font-bold text-black">Queue Calling Patient</h2>

        {currentPatient ? (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-300 rounded-xl p-6">
            {/* Detail Pasien */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-900">
              <div>
                <p className="font-semibold">No. Pasien</p>
                <p className="text-gray-600">{currentPatient.patientNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Outlet</p>
                <p className="text-gray-600">{currentPatient.outlet}</p>
              </div>
              <div>
                <p className="font-semibold">Lab Register</p>
                <p className="text-gray-600">{currentPatient.labReg}</p>
              </div>
              <div>
                <p className="font-semibold">Register</p>
                <p className="text-gray-600">
                  {currentPatient.createdAt.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="font-semibold">Name</p>
                <p className="text-gray-600">{currentPatient.userName}</p>
              </div>
              <div className="flex items-center gap-1">
                <p className="font-semibold mr-2">Calling</p>
                {Array.from({ length: 2 }, (_, i) => (
                  <Circle
                    key={i}
                    className={`w-5 h-5 ${
                      i < currentPatient.bintang
                        ? "text-blue-500 fill-blue-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col gap-4 items-end mt-6 md:mt-0">
              <div className="flex flex-col gap-3 w-32">
                <button
                  onClick={() =>
                    confirmAction(
                      "Selesaikan Pasien?",
                      "Pasien akan ditandai sebagai COMPLETE",
                      onComplete
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-sm"
                >
                  Complete
                </button>
                <button
                  onClick={handleRecallClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold text-sm"
                >
                  Recall
                </button>
                <button
                  onClick={() =>
                    confirmAction(
                      "Batalkan Pasien?",
                      "Pasien akan ditandai sebagai CANCELED",
                      onCancel
                    )
                  }
                  className="bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-md font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No patient currently being called.</p>
        )}

        {/* Table Pasien */}
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
                  className="bg-white border-b last:border-b-0 border-gray-300 shadow-sm hover:shadow-md transition rounded-lg"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold">
                    {patient.patientNumber}
                  </td>
                  <td className="px-4 py-3">{patient.labReg}</td>
                  <td className="px-4 py-3">{patient.outlet}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        patient.status === "COMPLETE"
                          ? "bg-green-100 text-green-700"
                          : patient.status === "CANCELED"
                          ? "bg-red-100 text-red-700"
                          : patient.status === "WAITING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-700"
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
