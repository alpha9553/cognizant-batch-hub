import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, TrendingUp, TrendingDown } from "lucide-react";

interface QualifierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchName: string;
  qualifierScores: {
    average: number;
    highest: number;
    lowest: number;
    passRate: number;
  };
}

const QualifierDialog = ({
  open,
  onOpenChange,
  batchName,
  qualifierScores,
}: QualifierDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Qualifier Scores</DialogTitle>
          <DialogDescription>{batchName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-medium">Average Score</span>
            </div>
            <span className="text-2xl font-bold">{qualifierScores.average}%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="font-medium">Highest Score</span>
            </div>
            <span className="text-2xl font-bold text-success">{qualifierScores.highest}%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-warning" />
              <span className="font-medium">Lowest Score</span>
            </div>
            <span className="text-2xl font-bold text-warning">{qualifierScores.lowest}%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-medium">Pass Rate</span>
            </div>
            <span className="text-2xl font-bold text-primary">{qualifierScores.passRate}%</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QualifierDialog;
