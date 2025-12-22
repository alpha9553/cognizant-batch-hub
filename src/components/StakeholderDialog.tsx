import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, User } from "lucide-react";

interface StakeholderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  role: string;
  contributionHours: number;
}

const StakeholderDialog = ({
  open,
  onOpenChange,
  name,
  role,
  contributionHours,
}: StakeholderDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-white font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
            {name}
          </DialogTitle>
          <DialogDescription>{role}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 transition-all hover:border-primary/40">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">Total Contribution Hours</span>
            </div>
            <span className="text-2xl font-bold text-primary">{contributionHours}h</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-info/10 to-info/5 rounded-lg border border-info/20 transition-all hover:border-info/40">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-info" />
              <span className="font-medium">Role</span>
            </div>
            <span className="text-lg font-semibold text-info">{role}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StakeholderDialog;
