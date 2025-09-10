"use client";
import { ArrowRight, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { Patient } from "@/classes/Patient";

interface PatientListProps {
  patients: (Patient & { isRecalled?: boolean })[];
  onCallPatient: (patient: Patient) => void;
  currentPatient: Patient | null;
  disableCall: boolean;
  selectedLoket: number | null;
  lokets: { id: number; nama_loket: string }[];
}

export default function PatientList({
  patients,
  onCallPatient,
  currentPatient,
  disableCall,
  selectedLoket,
  lokets, 
}: PatientListProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.patientNumber.toLowerCase().includes(term) ||
      p.labReg.toLowerCase().includes(term)
    );
  });

  const firstWaitingPatientId = filteredPatients.find(
    (p) => p.status === "WAITING"
  )?.id;

  const displayPatients = filteredPatients
    .filter(
      (p) =>
        p.status === "WAITING" ||
        p.status === "SKIPPED"
    )
    .sort((a, b) => {
      if (a.status === "SKIPPED" && b.status !== "SKIPPED") return 1;
      if (a.status !== "SKIPPED" && b.status === "SKIPPED") return -1;
      return a.no - b.no;
    });

  const loketName =
    selectedLoket && lokets
      ? lokets.find((l: { id: number; nama_loket: string }) => l.id === selectedLoket)?.nama_loket
      : "";

  function numberToIndoWords(num: number): string {
    const satuan = [
      "", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"
    ];
    if (num < 12) return satuan[num];
    if (num < 20) return satuan[num - 10] + " belas";
    if (num < 100) {
      const puluhan = Math.floor(num / 10);
      const sisa = num % 10;
      return satuan[puluhan] + " puluh" + (sisa ? " " + satuan[sisa] : "");
    }
    if (num < 200) return "seratus" + (num > 100 ? " " + numberToIndoWords(num - 100) : "");
    if (num < 1000) {
      const ratusan = Math.floor(num / 100);
      const sisa = num % 100;
      return satuan[ratusan] + " ratus" + (sisa ? " " + numberToIndoWords(sisa) : "");
    }
    return num.toString();
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <img
          src="/icons/patient.svg"
          alt="User Icon"
          className="w-5 h-5 mr-2"
        />
        <h2 className="text-xl font-semibold text-gray-800">Queue Patient</h2>
      </div>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none"
        />
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
        {displayPatients.map((patient) => {
          // Pisahkan huruf dan angka
          const match = patient.patientNumber.match(/^([A-Za-z]+)?(\d+)$/);
          let patientNumberWords = patient.patientNumber;
          if (match) {
            const huruf = match[1] ? match[1].toUpperCase() + " " : "";
            const angka = match[2] ? numberToIndoWords(Number(match[2])) : "";
            patientNumberWords = huruf + angka;
          }

          return (
            <div
              key={patient.id}
              className="bg-white shadow rounded-xl p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {patient.patientNumber}
                </h3>
                <div className="flex gap-1 text-blue-500">
                  {Array.from({ length: 2 }, (_, i) => (
                    <Circle
                      key={i}
                      className={`w-5 h-5 ${
                        i < patient.bintang
                          ? "text-blue-500 fill-blue-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                Lab Reg: {patient.labReg}
              </p>

              {!currentPatient &&
                (patient.id === firstWaitingPatientId ||
                  patient.status === "SKIPPED" ||
                  (patient.isRecalled && patient.status === "WAITING")) && (
                  <div className="flex justify-end mt-3">
                    <button
                      disabled={disableCall}
                      onClick={() => {
                        onCallPatient(patient);

                        const synth = window.speechSynthesis;
                        let voices = synth.getVoices();
                        if (!voices.length) {
                          window.speechSynthesis.onvoiceschanged = () => {
                            voices = synth.getVoices();
                          };
                        }
                        const googleVoice = voices.find(
                          (v) =>
                            v.lang === "id-ID" &&
                            v.name.toLowerCase().includes("google")
                        );

                        const utter1 = new window.SpeechSynthesisUtterance(
                          "Nomor antrian"
                        );
                        utter1.lang = "id-ID";
                        utter1.rate = 0.8;
                        utter1.pitch = 1.2;
                        if (googleVoice) utter1.voice = googleVoice;
                        synth.speak(utter1);

                        setTimeout(() => {
                          const loketText = loketName
                            ? `, silakan menuju ${loketName}`
                            : "";
                          const utter2 = new window.SpeechSynthesisUtterance(
                            `${patientNumberWords},${loketText}`
                          );
                          utter2.lang = "id-ID";
                          utter2.rate = 0.7;
                          utter2.pitch = 1.2;
                          if (googleVoice) utter2.voice = googleVoice;
                          synth.speak(utter2);
                        }, 2500);
                      }}
                      className={`border rounded-md p-1 text-gray-600 hover:bg-gray-100 flex items-center ${
                        disableCall ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label="Panggil"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
