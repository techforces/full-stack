"use client";

import Button from "./Button";
import Modal from "./Modal";
import Input from "./Input";
import { useState } from "react";
import InputPropertyType from "./InputPropertyType";
import FileUpload from "./FileUpload";

interface AddPropertyProps {
  isOpen?: boolean;
  handleClose?: () => void;
  onCreated: () => void;
}

const AddProperty = ({ isOpen, handleClose, onCreated }: AddPropertyProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [manager, setManager] = useState("");
  const [accountant, setAccountant] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!name || !type || !manager || !accountant) {
      alert(
        "Please fill in all required fields: name, type, manager and accountant",
      );
      return;
    }

    if (!file) {
      alert("Please upload the declaration PDF");
      return;
    }

    if (file?.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("manager", manager);
      formData.append("accountant", accountant);
      formData.append("file", file);

      const response = await fetch("http://localhost:4000/create-property", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Failed to create property");
      }

      setName("");
      setType("");
      setManager("");
      setAccountant("");
      setFile(null);

      onCreated();

      handleClose?.();
    } catch (err) {
      console.log(err);
      alert(err instanceof Error ? err.message : "Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} title="Add new property">
      <form className="w-full flex flex-col gap-8 items-center">
        <div className="w-full flex gap-8">
          <InputPropertyType
            imgSrc="/weg.png"
            title="PRVT Property"
            description="Assets, land, buildings, or resources that are owned by an individual, company, or private organization, with access and use controlled by the owner according to applicable laws."
            selected={type === "PRVT"}
            onClick={() => setType("PRVT")}
          />

          <InputPropertyType
            imgSrc="/mv.png"
            title="PUB Property"
            description="Assets, land, buildings, infrastructure, or resources that are owned and maintained by a government or public authority for the use and benefit of the general public, subject to applicable regulations."
            selected={type === "PUB"}
            onClick={() => setType("PUB")}
          />
        </div>
        <div className="w-full flex flex-col gap-6">
          <Input
            name="property-name"
            label="Property name"
            placeholder="Enter property name"
            value={name}
            setter={setName}
          />
          <Input
            name="property-manager"
            label="Property manager"
            placeholder="Enter property manager"
            value={manager}
            setter={setManager}
          />
          <Input
            name="property-accountant"
            label="Property accountant"
            placeholder="Enter property accountant"
            value={accountant}
            setter={setAccountant}
          />
          <FileUpload label="Attached document" onFileSelect={setFile} />
        </div>

        <Button
          disabled={isSubmitting}
          label={isSubmitting ? "Adding..." : "Add property"}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
        />
      </form>
    </Modal>
  );
};

export default AddProperty;
