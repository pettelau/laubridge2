import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

type ConfirmationModalProps = {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  type: "warning" | "danger" | "success";
  children: React.ReactNode;
};

export function ConfirmationModal({
  title,
  description,
  actionText,
  onAction,
  type,
  children,
}: ConfirmationModalProps) {
  const [open, setOpen] = useState(false);

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="h-10 w-10 text-yellow-500" />,
          buttonClass: "bg-yellow-500 hover:bg-yellow-600",
        };
      case "danger":
        return {
          icon: <AlertCircle className="h-10 w-10 text-red-500" />,
          buttonClass: "bg-red-500 hover:bg-red-600",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="h-10 w-10 text-green-500" />,
          buttonClass: "bg-green-500 hover:bg-green-600",
        };
      default:
        return {
          icon: null,
          buttonClass: "",
        };
    }
  };

  const { icon, buttonClass } = getTypeStyles();

  const handleAction = () => {
    onAction();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="mb-4">
          <AlertDialogTitle className="mb-0 flex flex-col items-center gap-2 text-center text-black">
            {icon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mx-auto">
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction className={buttonClass} onClick={handleAction}>
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
