import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Flag, Edit, Save, X, CheckCircle2, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Milestone {
  id: string;
  name: string;
  date: string;
  message: string;
  completed: boolean;
}

interface MilestoneDatesSectionProps {
  batchId: string;
  milestones: {
    qualifier: { completed: boolean; date: string };
    interim: { completed: boolean; date: string };
    final: { completed: boolean; date: string };
  };
  onUpdateMilestones?: (milestones: Milestone[]) => void;
}

const MilestoneDatesSection = ({ batchId, milestones, onUpdateMilestones }: MilestoneDatesSectionProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [milestoneData, setMilestoneData] = useState<Milestone[]>([
    {
      id: "qualifier",
      name: "Qualifier Assessment",
      date: milestones.qualifier.date,
      message: "Initial assessment to evaluate basic understanding",
      completed: milestones.qualifier.completed,
    },
    {
      id: "interim",
      name: "Interim Evaluation",
      date: milestones.interim.date,
      message: "Mid-program evaluation to track progress",
      completed: milestones.interim.completed,
    },
    {
      id: "final",
      name: "Final Assessment",
      date: milestones.final.date,
      message: "Comprehensive final evaluation",
      completed: milestones.final.completed,
    },
  ]);

  const [editForm, setEditForm] = useState({ date: "", message: "" });

  const handleEdit = (milestone: Milestone) => {
    setEditingId(milestone.id);
    setEditForm({ date: milestone.date, message: milestone.message });
  };

  const handleSave = (id: string) => {
    setMilestoneData(prev =>
      prev.map(m =>
        m.id === id ? { ...m, date: editForm.date, message: editForm.message } : m
      )
    );
    setEditingId(null);
    toast.success("Milestone updated successfully!");
    onUpdateMilestones?.(milestoneData);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ date: "", message: "" });
  };

  const getMilestoneColor = (completed: boolean, index: number) => {
    if (completed) return "from-success/20 to-success/5 border-success/30";
    if (index === 0) return "from-primary/20 to-primary/5 border-primary/30";
    if (index === 1) return "from-warning/20 to-warning/5 border-warning/30";
    return "from-info/20 to-info/5 border-info/30";
  };

  const getMilestoneIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle2 className="w-5 h-5 text-success" />
    ) : (
      <Clock className="w-5 h-5 text-warning animate-pulse" />
    );
  };

  return (
    <Card className="animate-fade-in overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-info/5 border-b">
        <CardTitle className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-primary" />
          Milestone Dates
        </CardTitle>
        <p className="text-sm text-muted-foreground">Click edit to modify milestone dates and messages</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {milestoneData.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`p-4 rounded-lg border bg-gradient-to-r ${getMilestoneColor(milestone.completed, index)} transition-all duration-300 hover:shadow-md animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {editingId === milestone.id ? (
                <div className="space-y-4 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getMilestoneIcon(milestone.completed)}
                      <h4 className="font-semibold">{milestone.name}</h4>
                    </div>
                    <Badge variant={milestone.completed ? "default" : "secondary"}>
                      {milestone.completed ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g., Mar 15, 2024"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        placeholder="Milestone description..."
                        value={editForm.message}
                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                        className="min-h-[60px] transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={handleCancel} className="gap-1">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleSave(milestone.id)} className="gap-1 bg-gradient-to-r from-success to-success/80">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getMilestoneIcon(milestone.completed)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{milestone.name}</h4>
                        <Badge variant={milestone.completed ? "default" : "secondary"} className="text-xs">
                          {milestone.completed ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3" />
                        {milestone.date}
                      </p>
                      <p className="text-sm text-foreground/80">{milestone.message}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(milestone)}
                    className="gap-1 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneDatesSection;
