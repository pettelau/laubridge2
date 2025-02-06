import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { MENU_ITEMS } from "@/lib/values";
import { XIcon } from "lucide-react";
import Link from "next/link";

type FullScreenMenuProps = {
  onClose: () => void;
};

export const FullScreenMenu = ({ onClose }: FullScreenMenuProps) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div onClick={onClose} className="absolute top-8 right-7 text-[24px]">
        <XIcon />
      </div>

      <div className="flex flex-col mt-16 mx-8">
        {MENU_ITEMS.map((item) => {
          return item.subItems ? (
            <Accordion type="single" collapsible key={item.title}>
              <AccordionItem value={item.title}>
                <AccordionTrigger className="py-4 border-b text-lg hover:bg-gray-50">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  {item.subItems.map((subItem) => {
                    return (
                      <div className="pb-2 hover:bg-accent" key={subItem.title}>
                        <Link href={subItem.href} className="pl-4 font-medium">
                          <div className="flex flex-row gap-3">
                            <div className="text-[30px] flex justify-center items-center">
                              {subItem.icon}
                            </div>
                            <div className="flex flex-col">
                              <p className="font-semibold">{subItem.title}</p>
                              <p className="font-light text-gray-700">
                                {subItem.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <Link
              href={item.href!}
              className="py-4 border-b font-medium hover:bg-gray-50"
              key={item.title}
            >
              <div className="text-lg">{item.title}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
