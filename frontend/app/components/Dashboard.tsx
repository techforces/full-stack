"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import type { ViewItemType } from "../page";

interface DashboardProps {
  toggleProperty: (value: boolean) => void;
  toggleBuilding: (value: boolean) => void;
  toggleUnit: (value: boolean) => void;

  activeProperty: null | string;
  activeBuilding: null | string;
  activeUnit: null | string;

  setActiveProperty: (value: null | string) => void;
  setActiveBuilding: (value: null | string) => void;
  setActiveUnit: (value: null | string) => void;

  setViewItem: (value: ViewItemType) => void;
  refreshKey: number;
}

export type Property = {
  id: string;
  name: string;
  type: "PRVT" | "PUB";
  manager: string;
  accountant: string;
  file: { name: string };
};

export type Building = {
  id: string;
  street: string;
  houseNumber: string;
  otherDetails: string;
  propertyId: string;
};

export type Unit = {
  id: string;
  number: number;
  type: string;
  floor: number;
  entrance: string;
  size: number;
  share: number;
  constructionYear: number;
  rooms: number;
  buildingId: string;
};

const Dashboard = ({
  toggleProperty,
  toggleBuilding,
  toggleUnit,

  activeProperty,
  activeBuilding,
  activeUnit,

  setActiveProperty,
  setActiveBuilding,
  setActiveUnit,

  setViewItem,
  refreshKey,
}: DashboardProps) => {
  const [propertiesData, setPropertiesData] = useState<Property[]>([]);
  const [buildingsData, setBuildingsData] = useState<Building[]>([]);
  const [unitsData, setUnitsData] = useState<Unit[]>([]);

  const columnClasses = "w-full h-full flex flex-col gap-3";
  const columnHeaderClasses =
    "w-full h-max flex justify-between items-center p-6 bg-pale-100 border-b border-pale-200";

  const itemClasses =
    "flex items-center p-6 gap-1 text-lg duration-100 cursor-pointer w-full";

  const viewButtonClasses =
    "absolute right-6 top-1/2 -translate-y-1/2 box-border px-3 py-[0.375rem] border border-grey-600 rounded-lg bg-white hover:bg-pale-100";

  async function fetchData(type: "properties" | "buildings" | "units") {
    const response = (await fetch(`http://localhost:4000/${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })) as Response;

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Cannot fetch ${type}`);
    }

    return data;
  }

  useEffect(() => {
    (async () => {
      try {
        const data: Property[] = await fetchData("properties");
        setPropertiesData(data);
      } catch (err) {
        console.error(err);
      }
    })();

    (async () => {
      try {
        const data: Building[] = await fetchData("buildings");
        setBuildingsData(data);
      } catch (err) {
        console.error(err);
      }
    })();

    (async () => {
      try {
        const data: Unit[] = await fetchData("units");
        setUnitsData(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [refreshKey]);

  return (
    <div className="flex rounded-3xl border border-grey-200 flex-auto">
      <div className={columnClasses}>
        <div className={columnHeaderClasses}>
          <h2 className="text-xl">Properties</h2>
          <Button
            label="Add new property"
            onClick={() => toggleProperty(true)}
          />
        </div>

        <div className="flex flex-col">
          {propertiesData.map((property) => {
            return (
              <div key={property.id} className="relative w-full">
                <button
                  onClick={() => {
                    setActiveProperty(property.id);
                    setActiveBuilding(null);
                    setActiveUnit(null);
                  }}
                  className={
                    itemClasses +
                    ` ${
                      activeProperty === property.id
                        ? "bg-blue-light"
                        : "hover:bg-pale-100"
                    }`
                  }
                >
                  <span className="w-[3.75rem] text-grey text-left">
                    {property.type}
                  </span>
                  <span>{property.name}</span>
                </button>
                <button
                  className={viewButtonClasses}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    setViewItem({ type: "property", id: property.id });
                  }}
                >
                  View
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className={columnClasses + " border-l border-r border-pale-200"}>
        <div className={columnHeaderClasses}>
          <h2 className="text-xl">Buildings</h2>
          <Button
            label="Add new building"
            onClick={() => toggleBuilding(true)}
            disabled={!activeProperty}
          />
        </div>

        <div className="flex flex-col">
          {buildingsData
            .filter((building) => building.propertyId === activeProperty)
            .map((building) => {
              return (
                <div key={building.id} className="relative w-full">
                  <button
                    onClick={() => {
                      setActiveBuilding(building.id);
                      setActiveUnit(null);
                    }}
                    className={
                      itemClasses +
                      ` ${
                        activeBuilding === building.id
                          ? "bg-blue-light"
                          : "hover:bg-pale-100"
                      }`
                    }
                  >
                    <span>{building.street + " " + building.houseNumber}</span>
                  </button>
                  <button
                    className={viewButtonClasses}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      setViewItem({ type: "building", id: building.id });
                    }}
                  >
                    View
                  </button>
                </div>
              );
            })}
        </div>
      </div>
      <div className={columnClasses}>
        <div className={columnHeaderClasses}>
          <h2 className="text-xl">Units</h2>
          <Button
            label="Add new unit"
            onClick={() => toggleUnit(true)}
            disabled={!activeBuilding}
          />
        </div>

        <div className="flex flex-col">
          {unitsData
            .filter((unit) => unit.buildingId === activeBuilding)
            .map((unit) => {
              return (
                <div key={unit.id} className="relative w-full">
                  <button
                    onClick={() => {
                      setActiveUnit(unit.id);
                    }}
                    className={
                      itemClasses +
                      ` ${
                        activeUnit === unit.id
                          ? "bg-blue-light"
                          : "hover:bg-pale-100"
                      }`
                    }
                  >
                    <span className="w-[6.25rem] capitalize text-grey text-left">
                      {unit.type}
                    </span>
                    <span>{unit.number}</span>
                  </button>
                  <button
                    className={viewButtonClasses}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      setViewItem({ type: "unit", id: unit.id });
                    }}
                  >
                    View
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
