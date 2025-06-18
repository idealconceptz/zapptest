import { useRouter } from "next/navigation";
import { StockItemType } from "@/app/types/StockItemType";

export default function StockItem({ item, handleDeleteItem }: { readonly item: StockItemType; readonly handleDeleteItem: (uuid: string) => void }) {
  const router = useRouter();
  return (
    <tr key={item.uuid} className="site-item">
      <td>{item.uuid}</td>
      <td>{item.sku}</td>
      <td>{item.description}</td>
      <td> {item.store}</td>
      <td>{item.quantity}</td>
      <td>
        <button onClick={() => router.push(`/stock/${item.uuid}`)}>Edit</button>
      </td>
      <td>
        <button onClick={() => item.uuid && handleDeleteItem(item.uuid)} className="bg-red-500">
          Delete
        </button>
      </td>
    </tr>
  );
}
