import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Save } from "lucide-react";
import { toast } from "sonner";
import { Trainee } from "@/context/BatchContext";
import { useAttendance } from "@/context/AttendanceContext";

interface AttendanceSectionProps {
  batchId: string;
  totalTrainees: number;
  trainees?: Trainee[];
}

const AttendanceSection = ({ batchId, totalTrainees, trainees = [] }: AttendanceSectionProps) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [absentIds, setAbsentIds] = useState<Set<string>>(new Set());
  const { saveAttendance } = useAttendance();

  const displayTrainees = trainees.length > 0 
    ? trainees.map(t => ({ id: t.id, name: t.name, email: t.email }))
    : Array.from({ length: totalTrainees }, (_, i) => ({
        id: `trainee-${i + 1}`,
        name: `Trainee ${i + 1}`,
        email: `trainee${i + 1}@example.com`,
      }));

  const handleToggleAbsent = (traineeId: string) => {
    setAbsentIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(traineeId)) {
        newSet.delete(traineeId);
      } else {
        newSet.add(traineeId);
      }
      return newSet;
    });
  };

  const handleSaveAttendance = () => {
    const presentIds = displayTrainees.filter(t => !absentIds.has(t.id)).map(t => t.id);
    const absentIdsList = Array.from(absentIds);
    
    saveAttendance(batchId, date, presentIds, absentIdsList, displayTrainees);
    
    const presentCount = presentIds.length;
    const absentCount = absentIdsList.length;
    
    toast.success(`Attendance saved for ${date}! Present: ${presentCount}, Absent: ${absentCount}`);
    setAbsentIds(new Set()); // Reset selection after save
  };

  return (
    <Card className="animate-fade-in border-l-4 border-l-primary" style={{ animationDelay: "0.6s" }}>
      <CardHeader className="bg-gradient-to-r from-primary/10 via-info/5 to-transparent">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Calendar className="w-5 h-5" />
          Daily Attendance Management
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground font-medium">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="max-w-xs border-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Mark Absent Trainees (Others will be marked present)</Label>
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto bg-gradient-to-br from-muted/30 to-muted/10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayTrainees.map((trainee, idx) => (
                  <div 
                    key={trainee.id} 
                    className={`flex items-center space-x-2 p-3 rounded-lg transition-all animate-fade-in cursor-pointer ${
                      absentIds.has(trainee.id) 
                        ? 'bg-destructive/10 border border-destructive/30' 
                        : 'hover:bg-success/10 border border-transparent hover:border-success/30'
                    }`}
                    style={{ animationDelay: `${idx * 0.02}s` }}
                    onClick={() => handleToggleAbsent(trainee.id)}
                  >
                    <Checkbox
                      id={trainee.id}
                      checked={absentIds.has(trainee.id)}
                      onCheckedChange={() => handleToggleAbsent(trainee.id)}
                      className="transition-all"
                    />
                    <label
                      htmlFor={trainee.id}
                      className="text-sm font-medium leading-none cursor-pointer flex-1"
                    >
                      {trainee.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 rounded-full bg-success/10 text-success border border-success/20">
                Present: {displayTrainees.length - absentIds.size}
              </span>
              <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                Absent: {absentIds.size}
              </span>
            </div>
          </div>

          <Button 
            onClick={handleSaveAttendance} 
            className="gap-2 bg-gradient-to-r from-primary to-info hover:opacity-90 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Attendance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceSection;
