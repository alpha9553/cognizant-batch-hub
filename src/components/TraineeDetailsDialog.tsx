import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Hash, Calendar, TrendingUp } from "lucide-react";
import { Trainee } from "@/context/BatchContext";

interface TraineeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainee: Trainee | null;
}

const TraineeDetailsDialog = ({ open, onOpenChange, trainee }: TraineeDetailsDialogProps) => {
  if (!trainee) return null;

  const getStatusColor = (status: string) => {
    if (status === "On Schedule" || status === "Completed" || status === "Eligible") 
      return "bg-success/10 text-success border-success/20";
    if (status === "Behind Schedule" || status === "In Progress") 
      return "bg-warning/10 text-warning border-warning/20";
    if (status === "Advanced") 
      return "bg-info/10 text-info border-info/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-white font-bold text-lg animate-pulse-glow">
              {trainee.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xl">{trainee.name}</span>
              <p className="text-sm text-muted-foreground font-normal">Trainee Profile</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Basic Info */}
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10 transition-all hover:border-primary/30">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-semibold">{trainee.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-info/5 to-transparent rounded-lg border border-info/10 transition-all hover:border-info/30">
              <Hash className="w-5 h-5 text-info" />
              <div>
                <p className="text-xs text-muted-foreground">Employee ID</p>
                <p className="font-semibold">{trainee.employeeId}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-success/5 to-transparent rounded-lg border border-success/10 transition-all hover:border-success/30">
              <Mail className="w-5 h-5 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="font-semibold break-all">{trainee.email}</p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Current Status
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Schedule</p>
                <Badge className={getStatusColor(trainee.scheduleAdherence)}>
                  {trainee.scheduleAdherence}
                </Badge>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Learning</p>
                <Badge className={getStatusColor(trainee.learningStatus)}>
                  {trainee.learningStatus}
                </Badge>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Eligibility</p>
                <Badge className={getStatusColor(trainee.eligibility)}>
                  {trainee.eligibility}
                </Badge>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Qualifier Score</p>
                <span className={`text-lg font-bold ${trainee.qualifierScore && trainee.qualifierScore >= 60 ? "text-success" : trainee.qualifierScore ? "text-destructive" : "text-muted-foreground"}`}>
                  {trainee.qualifierScore !== null ? `${trainee.qualifierScore}%` : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Evaluation Scores */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Evaluation Results
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-br from-warning/10 to-transparent rounded-lg border border-warning/20">
                <p className="text-xs text-muted-foreground mb-1">Interim</p>
                <Badge className={getStatusColor(trainee.interimStatus)}>
                  {trainee.interimStatus || "Pending"}
                </Badge>
              </div>
              <div className="p-3 bg-gradient-to-br from-success/10 to-transparent rounded-lg border border-success/20">
                <p className="text-xs text-muted-foreground mb-1">Final</p>
                <Badge className={getStatusColor(trainee.finalStatus)}>
                  {trainee.finalStatus || "Pending"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TraineeDetailsDialog;
