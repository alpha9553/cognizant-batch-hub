import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Save, Download, CalendarRange } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Trainee } from "@/context/BatchContext";
import { useAttendance } from "@/context/AttendanceContext";
import * as XLSX from "xlsx";

interface AttendanceSectionProps {
  batchId: string;
  totalTrainees: number;
  trainees?: Trainee[];
}

const AttendanceSection = ({ batchId, totalTrainees, trainees = [] }: AttendanceSectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [absentIds, setAbsentIds] = useState<Set<string>>(new Set());
  const [exportDates, setExportDates] = useState<Date[]>([]);
  const [isExportPopoverOpen, setIsExportPopoverOpen] = useState(false);
  const { saveAttendance, getTraineeAttendance, attendanceData } = useAttendance();

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
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const presentIds = displayTrainees.filter(t => !absentIds.has(t.id)).map(t => t.id);
    const absentIdsList = Array.from(absentIds);
    
    saveAttendance(batchId, dateStr, presentIds, absentIdsList, displayTrainees);
    
    const presentCount = presentIds.length;
    const absentCount = absentIdsList.length;
    
    toast.success(`Attendance saved for ${format(selectedDate, "PPP")}! Present: ${presentCount}, Absent: ${absentCount}`);
    setAbsentIds(new Set());
  };

  const handleExportDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateStr = format(date, "yyyy-MM-dd");
    const isSelected = exportDates.some(d => format(d, "yyyy-MM-dd") === dateStr);
    
    if (isSelected) {
      setExportDates(prev => prev.filter(d => format(d, "yyyy-MM-dd") !== dateStr));
    } else {
      setExportDates(prev => [...prev, date]);
    }
  };

  const handleExportAttendance = () => {
    if (exportDates.length === 0) {
      toast.error("Please select at least one date to export");
      return;
    }

    // Get all attendance data for selected dates
    const exportData: any[] = [];
    
    displayTrainees.forEach(trainee => {
      const traineeAttendance = getTraineeAttendance(trainee.id);
      const row: any = {
        "Student Name": trainee.name,
        "Student ID": trainee.id,
        "Email": trainee.email,
      };
      
      exportDates.sort((a, b) => a.getTime() - b.getTime()).forEach(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        const record = traineeAttendance.find(r => r.date === dateStr);
        row[format(date, "dd-MMM-yyyy")] = record ? (record.status === "present" ? "Present" : "Absent") : "No Data";
      });
      
      exportData.push(row);
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    
    const dateRange = exportDates.length === 1 
      ? format(exportDates[0], "dd-MMM-yyyy")
      : `${format(exportDates[0], "dd-MMM")}_to_${format(exportDates[exportDates.length - 1], "dd-MMM-yyyy")}`;
    
    XLSX.writeFile(wb, `Attendance_${dateRange}.xlsx`);
    
    toast.success(`Exported attendance for ${exportDates.length} date(s)`);
    setExportDates([]);
    setIsExportPopoverOpen(false);
  };

  // Get dates that have attendance data
  const datesWithData = new Set<string>();
  attendanceData.forEach(traineeAtt => {
    traineeAtt.records.forEach(record => {
      datesWithData.add(record.date);
    });
  });

  return (
    <Card className="animate-fade-in border-l-4 border-l-primary" style={{ animationDelay: "0.6s" }}>
      <CardHeader className="bg-gradient-to-r from-primary/10 via-info/5 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Calendar className="w-5 h-5" />
            Daily Attendance Management
          </CardTitle>
          <Popover open={isExportPopoverOpen} onOpenChange={setIsExportPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 hover:border-success hover:text-success">
                <Download className="w-4 h-4" />
                <CalendarRange className="w-4 h-4" />
                Export by Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Select dates to export</h4>
                  <p className="text-xs text-muted-foreground mb-3">Click dates with attendance data (highlighted)</p>
                  <CalendarComponent
                    mode="multiple"
                    selected={exportDates}
                    onSelect={(dates) => setExportDates(dates || [])}
                    modifiers={{
                      hasData: (date) => datesWithData.has(format(date, "yyyy-MM-dd"))
                    }}
                    modifiersStyles={{
                      hasData: { backgroundColor: "hsl(var(--success) / 0.2)", borderRadius: "4px" }
                    }}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {exportDates.length} date(s) selected
                  </span>
                  <Button 
                    size="sm" 
                    onClick={handleExportAttendance}
                    disabled={exportDates.length === 0}
                    className="gap-2 bg-gradient-to-r from-success to-info"
                  >
                    <Download className="w-4 h-4" />
                    Export Excel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
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
