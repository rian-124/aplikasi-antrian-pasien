"use client";

import { Circle } from "lucide-react";
import { Patient } from "@/classes/Patient";

interface QueueDetailProps {
  onComplete: (patient: Patient) => void | Promise<void>;
  onRecall: (patient: Patient) => void | Promise<void>;
  onCancel: (patient: Patient) => void | Promise<void>;
  patients: Patient[];
  currentPatient: Patient | null;
  clearCurrent: () => void;
  fetchPatients: () => void;
}

export default function QueueDetail({
  patients,
  currentPatient,
  clearCurrent,
  fetchPatients,
}: QueueDetailProps) {
  const handleApiCall = async (
    endpoint: string,
    method: "PATCH" | "POST" | "PUT" | "DELETE",
    body: object,
    successMessage: string,
    errorMessage: string
  ) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Error: Anda tidak login. Silakan login terlebih dahulu.");
      return;
    }

    try {
      const res = await fetch(`http://192.168.1.19:4000/api/${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null); // Catch if response is not json
        const message = errorData?.message || `HTTP error! status: ${res.status}`;
        throw new Error(message);
      }
      
      // alert(successMessage); // Optional: uncomment for success feedback
      fetchPatients();
      return true;
    } catch (err: any) {
      console.error(err);
      alert(`${errorMessage}: ${err.message}`);
      return false;
    }
  };

  const handleCompleteClick = async () => {
    if (!currentPatient) return;
    const success = await handleApiCall(
      `antrian-pasien/${currentPatient.id}`,
      "PATCH",
      { status: "COMPLETE" },
      "Pasien telah diselesaikan.",
      "Gagal menyelesaikan pasien"
    );
    if (success) {
      clearCurrent();
    }
  };

  const handleCancelClick = async () => {
    if (!currentPatient) return;
    const success = await handleApiCall(
      `antrian-pasien/${currentPatient.id}`,
      "PATCH",
      { status: "CANCELED" },
      "Antrian pasien telah dibatalkan.",
      "Gagal membatalkan pasien"
    );
    if (success) {
      clearCurrent();
    }
  };

  const handleRecallClick = async () => {
    if (!currentPatient) return;
    if (!["CALL", "RECALL"].includes(currentPatient.status)) {
      alert("Recall hanya bisa dilakukan setelah pasien dipanggil (CALL).");
      return;
    }

    const nextBintang = currentPatient.bintang + 1;
    let endpoint = `antrian-pasien/${currentPatient.id}`;
    let body: { status: "RECALL" | "CANCELED"; bintang: number };
    let success;

    if (nextBintang >= 2) {
      body = { status: "CANCELED", bintang: nextBintang };
      success = await handleApiCall(
        endpoint, "PATCH", body,
        "Pasien dibatalkan setelah 2x recall.",
        "Gagal membatalkan pasien"
      );
      if (success) clearCurrent();
    } else {
      body = { status: "RECALL", bintang: nextBintang };
      success = await handleApiCall(
        endpoint, "PATCH", body,
        "Pasien berhasil di-recall.",
        "Gagal me-recall pasien"
      );
      // Don't clear current on recall
    }
  };

  const handleSkipClick = async () => {
    if (!currentPatient) return;
    const nextBintang = currentPatient.bintang + 1;
    let endpoint = `antrian-pasien/${currentPatient.id}`;
    let body: { status: "SKIPPED" | "CANCELED"; bintang: number };
    let success;

    if (nextBintang >= 3) {
        body = { status: "CANCELED", bintang: nextBintang };
        success = await handleApiCall(
            endpoint, "PATCH", body,
            "Pasien dibatalkan setelah 3x skip.",
            "Gagal membatalkan pasien"
        );
        if (success) clearCurrent();
    } else {
        body = { status: "SKIPPED", bintang: nextBintang };
        success = await handleApiCall(
            endpoint, "PATCH", body,
            "Pasien berhasil di-skip.",
            "Gagal men-skip pasien"
        );
        if (success) clearCurrent();
    }
  };

  return (
    <div className="space-y-6 h-flex flex flex-col p-1">
      <div className="bg-white rounded-xl p-6 shadow space-y-6 flex-1 flex flex-col">
        <h2 className="text-3xl font-bold text-black">Queue Calling Patient</h2>
        {currentPatient ? (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-300 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-900">
              <div>
                <p className="font-semibold">No. Pasien</p>
                <p className="text-gray-600">{currentPatient.patientNumber}</p>
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
              <div>
                <p className="font-semibold">Register</p>
                <p className="text-gray-600">
                  {new Date(currentPatient.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div></div>
              <div>
                <p className="font-semibold">Lab Register</p>
                <p className="text-gray-600">{currentPatient.labReg}</p>
              </div>
              <div></div>
            </div>

            <div className="flex flex-col gap-4 items-end mt-6 md:mt-0">
              <div className="flex flex-col gap-3 w-32">
                <button
                  onClick={handleCompleteClick}
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
                  onClick={handleCancelClick}
                  className="bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-md font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSkipClick}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-semibold text-sm"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No patient currently being called.</p>
        )}

        {/* List pasien */}
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
              {patients
                .filter(
                  (patient) =>
                    patient.status !== "COMPLETE" &&
                    patient.status !== "CANCELED"
                )
                .map((patient, i) => (
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
                          patient.status === "WAITING"
                            ? "bg-yellow-100 text-yellow-800"
                            : patient.status === "SKIPPED"
                            ? "bg-blue-100 text-blue-700"
                            : patient.status === "RECALL"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
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
