/* eslint-disable */
"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ComboboxProps {
  items: ComboboxItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  notFoundText?: string;
}

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Velg et element...",
  searchPlaceholder = "Søk...",
  className,
  notFoundText = "Ingen element funnet.",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="w-full"
          />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {[...items]
                .sort((a, b) => a.label.localeCompare(b.label))
                .filter((item) =>
                  item.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={(currentValue: string) => {
                      if (item.disabled) return;

                      const selectedItem = items.find(
                        (item) => item.label === currentValue
                      );
                      if (selectedItem?.value === value) {
                        onChange("");
                        setOpen(false);
                        return;
                      }
                      onChange(selectedItem?.value || "");
                      setOpen(false);
                    }}
                    disabled={item.disabled}
                    className={cn(
                      item.disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                    {item.disabled && " (allerede valgt)"}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
