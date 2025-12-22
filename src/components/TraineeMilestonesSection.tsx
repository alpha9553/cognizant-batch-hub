import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Award, CheckCircle, Circle, Edit2, Save } from "lucide-react";
import { Trainee } from "@/context/BatchContext";
import { toast } from "sonner";

interface TraineeMilestonesSectionProps {
  trainee: Trainee;
  onUpdateMilestones: (updates: Partial<Trainee>) => void;
}

const TraineeMilestonesSection = ({ trainee, onUpdateMilestones }: TraineeMilestonesSectionProps) => {
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    type: "qualifier" | "interim" | "final";
  }>({ open: false, type: "qualifier" });
  const [score, setScore] = useState("");
  const [status, setStatus] = useState("");

  const milestones = [
    {
      type: "qualifier" as const,
      label: "Qualifier",
      score: trainee.qualifierScore,
      status: trainee.qualifierScore !== null ? (trainee.qualifierScore >= 60 ? "Passed" : "Failed") : null,
      color: "primary",
    },
    {
      type: "interim" as const,
      label: "Interim Evaluation",
      score: null, // Add to Trainee type if needed
      status: trainee.interimStatus,
      color: "info",
    },
    {
      type: "final" as const,
      label: "Final Evaluation",
      score: null, // Add to Trainee type if needed
      status: trainee.finalStatus,
      color: "success",
    },
  ];

  const handleEdit = (type: "qualifier" | "interim" | "final") => {
    const milestone = milestones.find(m => m.type === type);
    setScore(milestone?.score?.toString() || "");
    setStatus(milestone?.status || "");
    setEditDialog({ open: true, type });
  };

  const handleSave = () => {
    const updates: Partial<Trainee> = {};
    
    if (editDialog.type === "qualifier" && score) {
      updates.qualifierScore = Number(score);
    } else if (editDialog.type === "interim") {
      updates.interimStatus = status;
    } else if (editDialog.type === "final") {
      updates.finalStatus = status;
    }

    onUpdateMilestones(updates);
    toast.success(`${editDialog.type.charAt(0).toUpperCase() + editDialog.type.slice(1)} updated!`);
    setEditDialog({ open: false, type: "qualifier" });
    setScore("");
    setStatus("");
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-muted text-muted-foreground";
    if (status === "Passed" || status === "Completed") return "bg-success/10 text-success";
    if (status === "Failed") return "bg-destructive/10 text-destructive";
    if (status === "In Progress") return "bg-info/10 text-info";
    return "bg-muted text-muted-foreground";
  };

  return (
    <>
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Milestones & Evaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {milestones.map((milestone, idx) => (
              <div
                key={milestone.type}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md animate-fade-in bg-${milestone.color}/5 border-${milestone.color}/20`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {milestone.status ? (
                      <CheckCircle className={`w-4 h-4 text-${milestone.color}`} />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{milestone.label}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(milestone.type)}
                    className="h-7 w-7 p-0"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </div>
                
                {milestone.score !== null && (
                  <div className="text-2xl font-bold text-primary mb-1">
                    {milestone.score}%
                  </div>
                )}
                
                {milestone.status && (
                  <Badge className={getStatusColor(milestone.status)}>
                    {milestone.status}
                  </Badge>
                )}
                
                {!milestone.status && !milestone.score && (
                  <p className="text-sm text-muted-foreground">Not completed</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ ...editDialog, open })}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-primary" />
              Edit {editDialog.type.charAt(0).toUpperCase() + editDialog.type.slice(1)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editDialog.type === "qualifier" ? (
              <div className="space-y-2">
                <Label htmlFor="score">Score (%)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter score"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  placeholder="e.g., Completed, In Progress, Not Started"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ ...editDialog, open: false })}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TraineeMilestonesSection;