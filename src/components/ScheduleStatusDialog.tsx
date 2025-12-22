import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Zap, Users } from "lucide-react";
import { Trainee } from "@/context/BatchContext";

interface ScheduleStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainees: Trainee[];
  scheduleStatus: {
    onSchedule: number;
    behind: number;
    advanced: number;
  };
}

const ScheduleStatusDialog = ({
  open,
  onOpenChange,
  trainees,
  scheduleStatus,
}: ScheduleStatusDialogProps) => {
  const onScheduleTrainees = trainees.filter(t => t.scheduleAdherence === "On Schedule");
  const behindTrainees = trainees.filter(t => t.scheduleAdherence === "Behind Schedule");
  const advancedTrainees = trainees.filter(t => t.scheduleAdherence === "Advanced");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Schedule Status Breakdown
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* On Schedule */}
          <div className="p-4 rounded-lg bg-success/5 border border-success/20 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-success">On Schedule</h3>
              <Badge className="bg-success/10 text-success ml-auto">
                {scheduleStatus.onSchedule} trainees
              </Badge>
            </div>
            {onScheduleTrainees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {onScheduleTrainees.map((trainee, idx) => (
                  <div 
                    key={trainee.id} 
                    className="p-2 bg-card rounded-md text-sm hover:bg-success/10 transition-colors"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <p className="font-medium">{trainee.name}</p>
                    <p className="text-xs text-muted-foreground">{trainee.employeeId}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No trainees on schedule</p>
            )}
          </div>

          {/* Behind Schedule */}
          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-warning">Behind Schedule</h3>
              <Badge className="bg-warning/10 text-warning ml-auto">
                {scheduleStatus.behind} trainees
              </Badge>
            </div>
            {behindTrainees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {behindTrainees.map((trainee, idx) => (
                  <div 
                    key={trainee.id} 
                    className="p-2 bg-card rounded-md text-sm hover:bg-warning/10 transition-colors"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <p className="font-medium">{trainee.name}</p>
                    <p className="text-xs text-muted-foreground">{trainee.employeeId}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No trainees behind schedule</p>
            )}
          </div>

          {/* Advanced */}
          <div className="p-4 rounded-lg bg-info/5 border border-info/20 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-info" />
              <h3 className="font-semibold text-info">Advanced</h3>
              <Badge className="bg-info/10 text-info ml-auto">
                {scheduleStatus.advanced} trainees
              </Badge>
            </div>
            {advancedTrainees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {advancedTrainees.map((trainee, idx) => (
                  <div 
                    key={trainee.id} 
                    className="p-2 bg-card rounded-md text-sm hover:bg-info/10 transition-colors"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <p className="font-medium">{trainee.name}</p>
                    <p className="text-xs text-muted-foreground">{trainee.employeeId}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No advanced trainees</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleStatusDialog;