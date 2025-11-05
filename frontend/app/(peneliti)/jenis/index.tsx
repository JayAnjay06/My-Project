import React, { useState } from "react";
import JenisList from "./list";
import JenisForm from "./form";
import { FormState } from "@/components/types/jenis";

export default function JenisPage() {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [form, setForm] = useState<FormState>({
    jenis_id: null,
    nama_ilmiah: "",
    nama_lokal: "",
    deskripsi: "",
    gambar: null,
  });

  if (mode === "list") {
    return (
      <JenisList
        onSelectForm={(m, f) => {
          setMode(m);
          if (f) setForm(f);
        }}
      />
    );
  }

  return (
    <JenisForm
      initialForm={form}
      mode={mode === "edit" ? "edit" : "create"}
      onSuccess={() => {
        setMode("list");
        setForm({
          jenis_id: null,
          nama_ilmiah: "",
          nama_lokal: "",
          deskripsi: "",
          gambar: null,
        });
      }}
      onCancel={() => setMode("list")}
    />
  );
}
