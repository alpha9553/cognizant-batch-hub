import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, DollarSign } from "lucide-react";

interface StakeholderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  role: string;
  contributionHours: number;
  hourlyRate: number;
}

const StakeholderDialog = ({
  open,
  onOpenChange,
  name,
  role,
  contributionHours,
  hourlyRate,
}: StakeholderDialogProps) => {
  const totalPayout = contributionHours * hourlyRate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{role}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">Total Hours</span>
            </div>
            <span className="text-2xl font-bold">{contributionHours}h</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success" />
              <span className="font-medium">Hourly Rate</span>
            </div>
            <span className="text-2xl font-bold">₹{hourlyRate}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-medium">Total Payout</span>
            </div>
            <span className="text-2xl font-bold text-primary">₹{totalPayout.toLocaleString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StakeholderDialog;
