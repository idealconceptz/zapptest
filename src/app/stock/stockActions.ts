"use server";

import { Database } from "@sqlitecloud/drivers";
import { StockItemType } from "../types/StockItemType";

export async function uploadStockCsvActions(items: StockItemType[]) {
  if (items?.length < 1) return { error: "Items not found", status: 500 };
  let db;
  try {
    db = new Database(process.env.SQLITECLOUD_URL!);

    let values = "";
    for (const item of items) {
      values += `('${item.sku}','${item.description}','${item.store}',${item.quantity}),`;
    }
    values = values.slice(0, -1); // Remove the trailing comma

    const command = `USE DATABASE ${process.env.SQLITECLOUD_DB!}; INSERT INTO stock (sku,description,store,quantity) values ${values};`;
    await db.sql(command);
    return { status: 200, message: "Success" };
  } catch (error) {
    let message = "An unknown error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message, status: 500 };
  } finally {
    db?.close();
  }
}
