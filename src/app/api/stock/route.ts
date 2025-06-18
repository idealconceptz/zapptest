import { type NextRequest, NextResponse } from "next/server";
import { Database } from "@sqlitecloud/drivers";

export async function GET() {
  let db;
  try {
    db = new Database(process.env.SQLITECLOUD_URL!);
    const result = await db.sql(`USE DATABASE ${process.env.SQLITECLOUD_DB!}; SELECT * FROM stock;`);
    return NextResponse.json({ status: 200, message: "Success", stock: result }, { status: 200 });
  } catch (error) {
    let message = "An unknown error occurred";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    db?.close();
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { sku, store, quantity } = body;
  if (!sku || !store || quantity < 0) return NextResponse.json({ error: "Missing parameters" }, { status: 500 });
  const description = body.description ?? "";

  let db;
  try {
    db = new Database(process.env.SQLITECLOUD_URL!);
    const values = `('${sku}','${description}','${store}',${body.quantity})`;
    const result = await db.sql(`USE DATABASE ${process.env.SQLITECLOUD_DB!}; INSERT INTO stock (sku,description,store,quantity) values ${values};`);
    return NextResponse.json({ status: 200, message: "Success", stock: result }, { status: 200 });
  } catch (error) {
    let message = "An unknown error occurred";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    db?.close();
  }
}
