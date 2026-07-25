"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SquarePen } from "lucide-react";

import { useState } from "react";
import Restock from "./restock";
import { InventoryActions } from "@/types";

const AdjustInventoryButton = () => {
  const [selected, setSelected] = useState<InventoryActions | null>(null);
  const renderInventoryActions = () => {
    switch (selected) {
      case "restock":
        return <Restock setSelected={setSelected} />;
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <SquarePen />
          Adjust Inventory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        {!selected ? (
          <>
            <DialogHeader>
              <DialogTitle>Adjust inventory</DialogTitle>
              <DialogDescription>
                Please select the action you want to perform.
              </DialogDescription>
            </DialogHeader>

            <Button onClick={() => setSelected("restock")}>Restock</Button>
            <Button>Add new item</Button>
            <Button>Production</Button>
            <Button>Adjustment</Button>
          </>
        ) : (
          renderInventoryActions()
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdjustInventoryButton;
