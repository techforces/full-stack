"use client";

import { useState } from "react";

import Button from "./Button";
import Modal from "./Modal";
import Input from "./Input";

interface AddBuildingProps {
  activeProperty: null | string;
  isOpen?: boolean;
  handleClose?: () => void;
  onCreated: () => void;
}

const AddBuilding = ({
  activeProperty,
  isOpen,
  handleClose,
  onCreated,
}: AddBuildingProps) => {
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [otherDetails, setOtherDetails] = useState("");

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!street || !houseNumber || !otherDetails) {
      alert("Please fill in all required fields: street and house number");
      return;
    }

    const response = await fetch("http://localhost:4000/create-building", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        street,
        houseNumber,
        otherDetails,
        propertyId: activeProperty,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || "Failed to create building");
    }

    console.log(response.json());

    setStreet("");
    setHouseNumber("");
    setOtherDetails("");

    onCreated();

    handleClose?.();
  }

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} title="Add new building">
      <form className="w-full flex flex-col gap-8 items-center">
        <div className="w-full flex flex-col gap-6">
          <Input
            name="street"
            label="Street"
            placeholder="Enter street"
            value={street}
            setter={setStreet}
          />
          <Input
            name="house-number"
            label="House number"
            placeholder="Enter house number"
            value={houseNumber}
            setter={setHouseNumber}
          />
          <Input
            name="other details"
            label="Other details"
            placeholder="Enter details"
            value={otherDetails}
            setter={setOtherDetails}
          />
        </div>

        <Button
          label="Add building"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
        />
      </form>
    </Modal>
  );
};

export default AddBuilding;
