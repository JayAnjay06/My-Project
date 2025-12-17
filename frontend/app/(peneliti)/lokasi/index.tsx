import React, { useState } from "react";
import LokasiList from "./list";
import LokasiForm from "./form";
import { FormState } from "@/components/types/lokasi";

export default function LokasiPage() {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [form, setForm] = useState<FormState>({
    lokasi_id: null,
    nama_lokasi: "",
    koordinat: "",
    jumlah: "",
    kerapatan: "",
    tinggi_rata2: "",
    diameter_rata2: "",
    kondisi: "",
    luas_area: "",
    deskripsi: "",
    tanggal_input: null,
  });

  if (mode === "list") {
    return (
      <LokasiList
        onSelectForm={(m, f) => {
          setMode(m);
          if (f) setForm(f);
        }}
      />
    );
  }

  return (
    <LokasiForm
      initialForm={form}
      mode={mode === "edit" ? "edit" : "create"}
      onSuccess={() => {
        setMode("list");
        setForm({
          lokasi_id: null,
          nama_lokasi: "",
          koordinat: "",
          jumlah: "",
          kerapatan: "",
          tinggi_rata2: "",
          diameter_rata2: "",
          kondisi: "",
          luas_area: "",
          deskripsi: "",
          tanggal_input: null,
        });
      }}
      onCancel={() => setMode("list")}
    />
  );
}
