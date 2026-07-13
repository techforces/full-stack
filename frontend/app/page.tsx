"use client";

import { useState } from "react";

import Dashboard from "./components/Dashboard";
import AddProperty from "./components/AddProperty";
import AddBuilding from "./components/AddBuilding";
import AddUnit from "./components/AddUnit";
import View from "./components/View";

export type ViewItemType = {
  type: "property" | "building" | "unit" | null;
  id: string | null;
};

export default function Home() {
  const [propertyModal, setPropertyModal] = useState(false);
  const [buildingModal, setBuildingModal] = useState(false);
  const [unitModal, setUnitModal] = useState(false);

  const [activeProperty, setActiveProperty] = useState<null | string>(null);
  const [activeBuilding, setActiveBuilding] = useState<null | string>(null);
  const [activeUnit, setActiveUnit] = useState<null | string>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const [viewItem, setViewItem] = useState<ViewItemType>({
    type: null,
    id: null,
  });

  return (
    <div className="flex flex-col px-5 py-6 gap-6 h-screen text-night">
      <h1 className="text-[2rem]">Property Management Dashboard</h1>

      <Dashboard
        toggleProperty={setPropertyModal}
        toggleBuilding={setBuildingModal}
        toggleUnit={setUnitModal}
        activeProperty={activeProperty}
        activeBuilding={activeBuilding}
        activeUnit={activeUnit}
        setActiveProperty={setActiveProperty}
        setActiveBuilding={setActiveBuilding}
        setActiveUnit={setActiveUnit}
        setViewItem={setViewItem}
        refreshKey={refreshKey}
      />
      <AddProperty
        isOpen={propertyModal}
        handleClose={() => setPropertyModal(false)}
        onCreated={() => setRefreshKey((k: number) => k + 1)}
      />
      <AddBuilding
        isOpen={buildingModal}
        handleClose={() => setBuildingModal(false)}
        activeProperty={activeProperty}
        onCreated={() => setRefreshKey((k: number) => k + 1)}
      />
      <AddUnit
        isOpen={unitModal}
        handleClose={() => setUnitModal(false)}
        activeBuilding={activeBuilding}
        onCreated={() => setRefreshKey((k: number) => k + 1)}
      />
      <View type={viewItem.type} id={viewItem.id} setViewItem={setViewItem} />
    </div>
  );
}
