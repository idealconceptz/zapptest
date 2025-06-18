"use client";

import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { StockItemType } from "@/app/types/StockItemType";

const newStockItem = {
  uuid: "",
  sku: "",
  store: "",
  quantity: 0,
  description: "",
};

interface Errors {
  sku?: string;
  store?: string;
  quantity?: string;
  description?: string;
}

export default function StockItem() {
  const [item, setItem] = useState<StockItemType>(newStockItem);
  const [waiting, setWaiting] = useState(false);
  const [errors, setErrors] = useState<Errors | undefined>();
  const params = useParams();
  const router = useRouter();

  const handleChangeItem = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      // [name]: name === "quantity" ? Number(value) : value,
      [name]: value,
    }));
  };

  const getItem = async (uuid: string) => {
    try {
      setWaiting(true);
      const res: any = await fetch(`/api/stock/${uuid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.json();
      if (response?.error) {
        toast.error(`Error: ${response?.error?.message}`);
      } else {
        setItem(response.item);
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setWaiting(false);
    }
  };

  useEffect(() => {
    if (params?.uuid) {
      if (params.uuid === "new") {
        setItem({ uuid: "", sku: "", store: "", quantity: 0, description: "" });
      } else {
        getItem(params.uuid as string);
      }
    }
  }, [params?.uuid]);

  const handleSaveItem = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrors(undefined);

    if (!item?.store) {
      setErrors({ store: "Please select which store" });
      return;
    }
    if (item?.quantity < 0) {
      setErrors({ quantity: "Please enter a quantity of 0 or more" });
      return;
    }

    try {
      setWaiting(true);
      const url = item?.uuid ? `/api/stock/${item.uuid}` : "/api/stock";
      const method = item?.uuid ? "PUT" : "POST";
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const response = await res.json();
      if (response?.error) {
        toast.error(`Error: ${response?.error?.message}`);
      } else {
        toast.success("Item saved successfully");
      }
    } catch (error: any) {
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className=" items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <ToastContainer></ToastContainer>
      <button className="bg-slate-300 ml-16 float-left" onClick={() => router.push("/stock")}>
        Back to Stock List
      </button>
      <div className="mt-16 flex flex-col items-center justify-center">
        <h1 className="">{item ? "Edit Stock Item" : "Add Stock Item"}</h1>
        <form onSubmit={handleSaveItem} className="flex flex-col gap-4 w-full max-w-md">
          <label htmlFor="uuid">
            UUID
            <input className="float-right" type="number" name="uuid" value={item?.uuid || ""} onChange={handleChangeItem} required disabled />
          </label>
          <label htmlFor="sku">
            SKU
            <input className="float-right" type="text" name="sku" value={item?.sku || ""} onChange={handleChangeItem} required />
          </label>
          <label htmlFor="description">
            Description
            <input className="ml-4 float-right" type="text" name="description" value={item?.description || ""} onChange={handleChangeItem} />
          </label>

          <label className="dashboard-label">
            Store
            <select name="store" onChange={handleChangeItem} required aria-label="Store" value={item?.store} className="float-right">
              <option className="">[select]</option>
              <option value="KEN" className="">
                KEN
              </option>
              <option value="BAT" className="">
                BAT
              </option>
            </select>
            {errors?.store && <p className="error">{errors.store}</p>}
          </label>
          <label htmlFor="name">
            Quantity
            <input className="float-right" type="number" name="quantity" value={item?.quantity || ""} onChange={handleChangeItem} required min="0" />
            {errors?.quantity && <p className="error">{errors.quantity}</p>}
          </label>
          <button type="submit" disabled={waiting} className={`${waiting ? "bg-blue-100" : "bg-blue-500"}`}>
            {waiting ? "Processing" : item?.uuid ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
