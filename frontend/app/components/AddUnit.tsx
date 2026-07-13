"use client";

import { useState } from "react";

import Button from "./Button";
import Modal from "./Modal";
import Input from "./Input";

interface AddUnitProps {
  activeBuilding: null | string;
  isOpen?: boolean;
  handleClose?: () => void;
  onCreated: () => void;
}

const AddUnit = ({
  activeBuilding,
  isOpen,
  handleClose,
  onCreated,
}: AddUnitProps) => {
  const [number, setNumber] = useState("");
  const [type, setType] = useState("");
  const [floor, setFloor] = useState("");
  const [entrance, setEntrance] = useState("");
  const [size, setSize] = useState("");
  const [share, setShare] = useState("");
  const [constructionYear, setConstructionYear] = useState("");
  const [rooms, setRooms] = useState("");

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (
      !number ||
      !type ||
      !floor ||
      !entrance ||
      !size ||
      !share ||
      !constructionYear ||
      !rooms
    ) {
      alert(
        "Please fill in number, type, floor, entrance, size, share, construction year, and rooms"
      );
      return;
    }

    const response = await fetch("http://localhost:4000/create-unit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number: parseInt(number),
        type,
        floor: parseInt(floor),
        entrance,
        size: parseFloat(size),
        share: parseFloat(share),
        constructionYear: parseInt(constructionYear),
        rooms: parseInt(rooms),
        buildingId: activeBuilding,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || "Failed to create property");
    }

    setNumber("");
    setType("");
    setFloor("");
    setEntrance("");
    setSize("");
    setShare("");
    setConstructionYear("");
    setRooms("");

    onCreated();

    handleClose?.();
  }

  const TypeButton = (value: string) => {
    return (
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setType(value.toLocaleLowerCase());
        }}
        className={`w-full px-7 py-6 rounded-2xl text-lg capitalize border ${
          type === value.toLocaleLowerCase()
            ? "border-night"
            : "border-pale-200"
        }`}
      >
        {value}
      </button>
    );
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} title="Add new property">
      <form className="w-full flex flex-col gap-8 items-center">
        <div className="w-full flex flex-col gap-6">
          <Input
            name="unit-number"
            label="Number"
            placeholder="Enter property name"
            value={number}
            setter={setNumber}
          />
          <div className="flex flex-col gap-3">
            <span className="text-xl font-medium">Type</span>
            <div className="flex gap-3 w-full">
              {TypeButton("Apartment")}
              {TypeButton("Office")}
            </div>
            <div className="flex gap-3 w-full">
              {TypeButton("Garden")}
              {TypeButton("Parking")}
            </div>
          </div>
          <Input
            name="floor"
            label="Floor"
            placeholder="Enter floor number"
            value={floor}
            setter={setFloor}
          />
          <Input
            name="entrance"
            label="Entrance"
            placeholder="How to enter?"
            value={entrance}
            setter={setEntrance}
          />
          <Input
            name="size"
            label="Size"
            placeholder="Enter number"
            value={size}
            setter={setSize}
          />

          <Input
            name="ownership-share"
            label="Co-ownership share"
            placeholder="Enter number"
            value={share}
            setter={setShare}
          />

          <Input
            name="construction-year"
            label="Construction year"
            placeholder="Enter year"
            value={constructionYear}
            setter={setConstructionYear}
          />

          <Input
            name="rooms"
            label="Rooms"
            placeholder="Enter number"
            value={rooms}
            setter={setRooms}
          />
        </div>

        <Button
          label="Add unit"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
        />
      </form>
    </Modal>
  );
};
export default AddUnit;
