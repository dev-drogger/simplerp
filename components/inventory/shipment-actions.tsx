import { MoreHorizontal } from "lucide-react";
import { ShipmentSummary } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdateShipmentButton from "../shipments/update-shipment-button";

const ShipmentActions = ({ shipment }: { shipment: ShipmentSummary }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="bottom"
        onFocusOutside={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <UpdateShipmentButton shipment={shipment} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShipmentActions;
