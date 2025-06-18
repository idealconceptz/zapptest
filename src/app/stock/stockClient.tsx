"use client";

import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import StockList from "./components/StockList";
import { StockItemType } from "../types/StockItemType";
import { parse } from "csv-parse/sync";
import { uploadStockCsvActions } from "./stockActions";

export default function Stock() {
  const [stock, setStock] = useState<StockItemType[] | null>(null);
  const uploadFileRef = useRef<HTMLInputElement>(null);

  const getStock = async () => {
    try {
      const res = await fetch("/api/stock", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.json();
      if (response?.error) {
        toast.error(`Error: ${response?.error?.message}`);
      } else {
        setStock(response.stock);
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleUploadStockCsv = async () => {
    if (!uploadFileRef.current?.files?.length) {
      toast.error("Please select a CSV file to upload.");
      return;
    }
    const file = uploadFileRef.current.files[0];
    if (file.type !== "text/csv") {
      toast.error("Please upload a valid CSV file.");
      return;
    }

    const data = await file.text();

    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
    });
    if (records?.length < 1) toast.error("No items found in the CSV.");

    try {
      const response: { error?: string | { message: string } } = await uploadStockCsvActions(records);

      if (response?.error) {
        toast.error(`Error: ${typeof response?.error === "string" ? response?.error : response?.error?.message}`);
      } else {
        getStock();
      }
      toast.success("Products uploaded successfully.");
    } catch (error) {
      console.error("Upload failed:", error);

      toast.error(`Upload failed: ${(error as Error).message}`);
    } finally {
      uploadFileRef.current.value = ""; // Clear the file input
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!itemId) {
      toast.error("You must choose an item to delete");
      return;
    }
    try {
      const res = await fetch(`/api/stock/${itemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.json();
      if (response?.error) {
        toast.error(`Error: ${response?.error?.message}`);
      } else {
        toast.success("Item deleted successfully");
        getStock();
      }
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    getStock();
  }, []);

  return (
    <div className="items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <ToastContainer></ToastContainer>
      <h1 className="text-xl">Stock</h1>

      {!stock && <Loading />}
      {stock && <StockList stock={stock} handleDeleteItem={handleDeleteItem} />}

      <h2 className="mt-8">Upload stock</h2>
      <input id="fileSelector" type="file" accept=".csv" onChange={handleUploadStockCsv} className="input-field" ref={uploadFileRef} />
    </div>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
