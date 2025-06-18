// import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@sqlitecloud/drivers";

export async function GET(req: NextRequest, { params }: { params: Params }) {
  let db;
  try {
    const { uuid } = await params;
    if (!uuid) return NextResponse.json({ error: "UUID required" }, { status: 500 });

    db = new Database(process.env.SQLITECLOUD_URL!);

    const result = await db.sql(`USE DATABASE chinook.sqlite; SELECT * FROM stock WHERE uuid = ${uuid} LIMIT 1;`);

    return NextResponse.json({ status: 200, message: "Success", item: result?.[0] }, { status: 200 });
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

export async function PUT(req: NextRequest) {
  const body = await req.json();
  let db;
  try {
    db = new Database(process.env.SQLITECLOUD_URL!);

    const { sku, description, store, quantity } = body;
    if (!sku || !store || quantity < 0) return NextResponse.json({ error: "Missing parameters" }, { status: 500 });

    const result = await db.sql(
      `USE DATABASE ${process.env.SQLITECLOUD_DB!}; UPDATE stock SET sku = '${sku}', description = '${description}', store = '${store}', quantity = ${quantity} WHERE uuid = ${body.uuid};`
    );

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

interface Params {
  uuid: string;
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { uuid } = await params;

  if (!uuid) return NextResponse.json({ error: "UUID required" }, { status: 500 });

  let db;
  try {
    db = new Database(process.env.SQLITECLOUD_URL!);
    const result = await db.sql(`USE DATABASE ${process.env.SQLITECLOUD_DB!}; DELETE FROM stock WHERE uuid = ${uuid};`);
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
