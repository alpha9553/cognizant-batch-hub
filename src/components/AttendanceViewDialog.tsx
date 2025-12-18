import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Download, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useAttendance, AttendanceRecord } from "@/context/AttendanceContext";

interface AttendanceViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  traineeName: string;
  traineeId: string;
  traineeEmail: string;
}

const AttendanceViewDialog = ({
  open,
  onOpenChange,
  traineeName,
  traineeId,
  traineeEmail,
}: AttendanceViewDialogProps) => {
  const { getTraineeAttendance } = useAttendance();
  
  const attendanceRecords: AttendanceRecord[] = useMemo(() => {
    return getTraineeAttendance(traineeId).slice(0, 10);
  }, [traineeId, getTraineeAttendance]);

  const presentCount = attendanceRecords.filter(r => r.status === "present").length;
  const absentCount = attendanceRecords.filter(r => r.status === "absent").length;
  const attendancePercentage = attendanceRecords.length > 0 
    ? Math.round((presentCount / attendanceRecords.length) * 100) 
    : 0;

  const handleDownloadExcel = () => {
    if (attendanceRecords.length === 0) {
      toast.error("No attendance data to export");
      return;
    }

    const worksheetData = attendanceRecords.map(record => ({
      "Trainee Name": traineeName,
      "Employee ID": traineeId,
      "Email": traineeEmail,
      "Date": record.date,
      "Day": new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' }),
      "Status": record.status === "present" ? "Present" : "Absent",
    }));

    worksheetData.push({
      "Trainee Name": "",
      "Employee ID": "",
      "Email": "",
      "Date": "SUMMARY",
      "Day": `Present: ${presentCount}, Absent: ${absentCount}`,
      "Status": `${attendancePercentage}% Attendance`,
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    
    const colWidths = [
      { wch: 25 },
      { wch: 15 },
      { wch: 30 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `${traineeName.replace(/\s+/g, '_')}_Attendance.xlsx`);
    toast.success("Attendance downloaded successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Attendance - {traineeName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Last {attendanceRecords.length} recorded days</p>
        </DialogHeader>

        {attendanceRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-warning mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Attendance Recorded</h3>
            <p className="text-muted-foreground max-w-sm">
              Attendance data will appear here once it has been recorded in the Daily Attendance Management section.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20 text-center transition-all hover:scale-105">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold text-success">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Days Present</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 text-center transition-all hover:scale-105">
                <XCircle className="w-6 h-6 mx-auto mb-2 text-destructive" />
                <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Days Absent</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center transition-all hover:scale-105">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-primary">{attendancePercentage}%</p>
                <p className="text-xs text-muted-foreground">Attendance Rate</p>
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record, index) => (
                    <TableRow 
                      key={record.date} 
                      className="animate-fade-in transition-colors hover:bg-muted/30"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          className={record.status === "present" 
                            ? "bg-success/10 text-success border border-success/20" 
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                          }
                        >
                          {record.status === "present" ? (
                            <><CheckCircle2 className="w-3 h-3 mr-1" /> Present</>
                          ) : (
                            <><XCircle className="w-3 h-3 mr-1" /> Absent</>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            onClick={handleDownloadExcel} 
            disabled={attendanceRecords.length === 0}
            className="gap-2 bg-gradient-to-r from-primary to-info hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceViewDialog;
