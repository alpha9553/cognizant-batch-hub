import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ContributionEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
}

interface TrainerContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  role: string;
  contributions?: ContributionEntry[];
  onSaveContribution?: (entry: ContributionEntry) => void;
}

const TrainerContributionDialog = ({
  open,
  onOpenChange,
  name,
  role,
  contributions = [],
  onSaveContribution,
}: TrainerContributionDialogProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "17:00",
  });
  const [localContributions, setLocalContributions] = useState<ContributionEntry[]>(contributions);

  const calculateHours = (start: string, end: string): number => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    return (endH + endM / 60) - (startH + startM / 60);
  };

  const handleAddEntry = () => {
    const hours = calculateHours(newEntry.startTime, newEntry.endTime);
    if (hours <= 0) {
      toast.error("End time must be after start time");
      return;
    }

    const entry: ContributionEntry = {
      id: crypto.randomUUID(),
      date: newEntry.date,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      hours,
    };

    setLocalContributions([...localContributions, entry]);
    onSaveContribution?.(entry);
    toast.success("Contribution entry added!");
    setShowAddForm(false);
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "17:00",
    });
  };

  const handleRemoveEntry = (id: string) => {
    setLocalContributions(localContributions.filter(c => c.id !== id));
    toast.success("Entry removed");
  };

  const totalHours = localContributions.reduce((sum, c) => sum + c.hours, 0);

  // Group contributions by week
  const groupedByWeek = localContributions.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];
    
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(entry);
    return acc;
  }, {} as Record<string, ContributionEntry[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-white font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span>{name}</span>
              <p className="text-sm text-muted-foreground font-normal">{role}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Summary Card */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold text-primary">{totalHours.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Total Hours</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-info" />
                <p className="text-3xl font-bold text-info">{localContributions.length}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Entry Form */}
          {showAddForm ? (
            <Card className="animate-fade-in border-primary/20">
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium flex items-center gap-2 text-primary">
                  <Plus className="w-4 h-4" />
                  Add Contribution Entry
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newEntry.startTime}
                      onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newEntry.endTime}
                      onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddEntry} size="sm" className="bg-gradient-to-r from-success to-success/80">
                    Save Entry
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button variant="outline" className="w-full gap-2 border-dashed hover:border-primary hover:text-primary transition-colors" onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4" />
              Add Contribution Entry
            </Button>
          )}

          {/* Weekly Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Weekly Breakdown
            </h4>
            
            {Object.keys(groupedByWeek).length === 0 ? (
              <p className="text-center text-muted-foreground py-8 bg-muted/30 rounded-lg border border-dashed">
                No contribution entries yet. Add your first entry above.
              </p>
            ) : (
              Object.entries(groupedByWeek)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([weekKey, entries]) => {
                  const weekTotal = entries.reduce((sum, e) => sum + e.hours, 0);
                  return (
                    <Card key={weekKey} className="animate-fade-in overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium">Week of {new Date(weekKey).toLocaleDateString()}</p>
                          <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                            {weekTotal.toFixed(1)} hours
                          </span>
                        </div>
                        <div className="space-y-2">
                          {entries.map((entry, idx) => (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/50 to-transparent rounded-md text-sm group hover:from-muted transition-all animate-fade-in"
                              style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                                <span className="text-muted-foreground">
                                  {entry.startTime} - {entry.endTime}
                                </span>
                                <span className="font-semibold text-primary">{entry.hours.toFixed(1)}h</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveEntry(entry.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-gradient-to-r from-primary to-info hover:opacity-90">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerContributionDialog;
