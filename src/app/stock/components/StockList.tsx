import { useRouter } from "next/navigation";

import { StockItemType } from "../../types/StockItemType";
import StockItem from "./StockItem";

export default function StockList({ stock, handleDeleteItem }: { readonly stock: StockItemType[]; readonly handleDeleteItem: (uuid: string) => void }) {
  const router = useRouter();

  const handleAddStockItem = async () => {
    router.push("/stock/new");
  };

  return (
    <div className="">
      <button className="mt-4" onClick={handleAddStockItem}>
        Add New Item
      </button>

      <table className="mt-4">
        <thead>
          <tr>
            <th>UUID</th>
            <th>SKU</th>
            <th>Description</th>
            <th>Store</th>
            <th>Quantity</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{stock?.map((item) => <StockItem key={item.uuid} item={item} handleDeleteItem={handleDeleteItem} />)}</tbody>
      </table>
      {stock?.length === 0 && <p>No stock items found. Please add or upload some stock.</p>}
    </div>
  );
}
