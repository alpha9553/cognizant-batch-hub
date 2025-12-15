import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Plus, Trash2, DollarSign } from "lucide-react";
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
  hourlyRate: number;
  contributions?: ContributionEntry[];
  onSaveContribution?: (entry: ContributionEntry) => void;
}

const TrainerContributionDialog = ({
  open,
  onOpenChange,
  name,
  role,
  hourlyRate,
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
  const totalPayout = totalHours * hourlyRate;

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
            <Clock className="w-5 h-5 text-primary" />
            {name} - Contribution Hours
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{role}</p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Summary Card */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-primary">{totalHours.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Total Hours</p>
              </CardContent>
            </Card>
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold text-success">₹{hourlyRate}</p>
                <p className="text-xs text-muted-foreground">Hourly Rate</p>
              </CardContent>
            </Card>
            <Card className="bg-info/5 border-info/20">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-2 text-info" />
                <p className="text-2xl font-bold text-info">₹{totalPayout.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Total Payout</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Entry Form */}
          {showAddForm ? (
            <Card className="animate-fade-in">
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium flex items-center gap-2">
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newEntry.startTime}
                      onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newEntry.endTime}
                      onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddEntry} size="sm">
                    Save Entry
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button variant="outline" className="w-full gap-2" onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4" />
              Add Contribution Entry
            </Button>
          )}

          {/* Weekly Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Weekly Breakdown
            </h4>
            
            {Object.keys(groupedByWeek).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No contribution entries yet. Add your first entry above.
              </p>
            ) : (
              Object.entries(groupedByWeek)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([weekKey, entries]) => {
                  const weekTotal = entries.reduce((sum, e) => sum + e.hours, 0);
                  return (
                    <Card key={weekKey} className="animate-fade-in">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium">Week of {new Date(weekKey).toLocaleDateString()}</p>
                          <span className="text-sm text-primary font-medium">
                            {weekTotal.toFixed(1)} hours
                          </span>
                        </div>
                        <div className="space-y-2">
                          {entries.map((entry) => (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm group hover:bg-muted transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                                <span className="text-muted-foreground">
                                  {entry.startTime} - {entry.endTime}
                                </span>
                                <span className="font-medium">{entry.hours.toFixed(1)}h</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
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
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerContributionDialog;