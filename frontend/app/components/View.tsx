"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import type { Property, Building, Unit } from "./Dashboard";
import type { ViewItemType } from "../page";

interface ViewProps {
  type: "property" | "building" | "unit" | null;
  id: string | null;
  setViewItem: (value: ViewItemType) => void;
}

const View = ({ type, id, setViewItem }: ViewProps) => {
  const [data, setData] = useState<Property | Building | Unit | null>(null);

  async function fetchDataById() {
    const typesPlural = {
      property: "properties",
      building: "buildings",
      unit: "units",
    };

    if (!!type && !!id) {
      const response = (await fetch(
        `http://localhost:4000/${typesPlural[type]}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )) as Response;

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error("Cannot fetch item");
      }

      return responseData;
    }
  }

  async function handleDownloadPropertyFile(propertyId: string) {
    const res = await fetch(
      `http://localhost:4000/properties/${propertyId}/file`,
      {
        method: "GET",
      },
    );

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Failed to download file");
    }

    const disposition = res.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="(.+)"/);
    const filename = match?.[1] ?? "document.pdf";

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  }

  useEffect(() => {
    (async () => {
      try {
        const responseData: Property | Building | Unit = await fetchDataById();
        setData(responseData);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [type, id]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const itemClasses = "w-full flex flex-col gap-3";
  const labelClasses = "text-xl font-medium text-grey";

  function renderDetails() {
    switch (type) {
      case "property":
        const property = data as Property | null;

        if (!property) return null;

        return (
          <div className="w-full flex flex-col gap-12">
            <div className={itemClasses}>
              <p className={labelClasses}>Type</p>
              <p className="text-lg">{property.type}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Name</p>
              <p className="text-lg">{property.name}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Manager</p>
              <p className="text-lg">{property.manager}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Accountant</p>
              <p className="text-lg">{property.accountant}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Attached document</p>
              <p className="text-lg">{property.file?.name ?? "—"}</p>
              <button className="flex gap-3 items-center w-max">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.75 14.75V16.25C4.75 17.9069 6.09315 19.25 7.75 19.25H16.25C17.9069 19.25 19.25 17.9069 19.25 16.25V14.75"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14.25V4.75"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.75 10.75L12 14.25L15.25 10.75"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span
                  className="text-lg underline"
                  onClick={async () => {
                    try {
                      await handleDownloadPropertyFile(property.id);
                    } catch (err) {
                      console.error(err);
                      alert(
                        err instanceof Error ? err.message : "Download failed",
                      );
                    }
                  }}
                >
                  Download
                </span>
              </button>
            </div>
          </div>
        );
      case "building":
        const building = data as Building | null;

        if (!building) return null;

        return (
          <div className="w-full flex flex-col gap-12">
            <div className={itemClasses}>
              <p className={labelClasses}>Street</p>
              <p className="text-lg">{building.street}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>House Number</p>
              <p className="text-lg">{building.houseNumber}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Other Details</p>
              <p className="text-lg">{building.otherDetails}</p>
            </div>
          </div>
        );
      case "unit":
        const unit = data as Unit | null;

        if (!unit) return null;

        return (
          <div className="w-full flex flex-col gap-8">
            <div className={itemClasses}>
              <p className={labelClasses}>Number</p>
              <p className="text-lg">{unit.number}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Type</p>
              <p className="text-lg capitalize">{unit.type}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Floor</p>
              <p className="text-lg">{unit.floor}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Entrance</p>
              <p className="text-lg">{unit.entrance}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Size</p>
              <p className="text-lg">{unit.size}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Co-ownership share</p>
              <p className="text-lg">{unit.share}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Construction Year</p>
              <p className="text-lg">{unit.constructionYear}</p>
            </div>

            <div className={itemClasses}>
              <p className={labelClasses}>Rooms</p>
              <p className="text-lg">{unit.rooms}</p>
            </div>
          </div>
        );
    }
  }

  return (
    <Modal
      isOpen={!!type}
      handleClose={() => setViewItem({ type: null, id: null })}
      title={`View details`}
    >
      {renderDetails()}
    </Modal>
  );
};

export default View;
