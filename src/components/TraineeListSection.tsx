import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Trainee } from "@/context/BatchContext";
import { useAttendance } from "@/context/AttendanceContext";
import AddTraineeDialog from "./AddTraineeDialog";
import TraineeDetailsDialog from "./TraineeDetailsDialog";
import AttendanceViewDialog from "./AttendanceViewDialog";

interface TraineeListSectionProps {
  batchId: string;
  trainees: Trainee[];
  onAddTrainee: (trainee: Trainee) => void;
}

const TraineeListSection = ({ batchId, trainees, onAddTrainee }: TraineeListSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [attendanceTrainee, setAttendanceTrainee] = useState<Trainee | null>(null);
  const { hasAttendanceData } = useAttendance();

  const filteredTrainees = trainees.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.employeeId.includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "On Schedule": "bg-success/10 text-success border border-success/20",
      "Behind Schedule": "bg-warning/10 text-warning border border-warning/20",
      "Advanced": "bg-info/10 text-info border border-info/20",
      "Completed": "bg-success/10 text-success border border-success/20",
      "In Progress": "bg-primary/10 text-primary border border-primary/20",
      "Not Started": "bg-muted text-muted-foreground",
      "Pending": "bg-muted text-muted-foreground",
      "Eligible": "bg-success/10 text-success border border-success/20",
    };
    return variants[status] || "bg-muted text-muted-foreground";
  };

  const handleNameClick = (e: React.MouseEvent, trainee: Trainee) => {
    e.stopPropagation();
    setSelectedTrainee(trainee);
    setShowDetailsDialog(true);
  };

  const handleAttendanceClick = (e: React.MouseEvent, trainee: Trainee) => {
    e.stopPropagation();
    setAttendanceTrainee(trainee);
    setShowAttendanceDialog(true);
  };

  return (
    <>
      <Card className="animate-fade-in overflow-hidden border-l-4 border-l-info">
        <CardHeader className="bg-gradient-to-r from-info/10 via-primary/5 to-transparent border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-info">
              <Users className="w-5 h-5" />
              Trainees ({trainees.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="hover:border-info">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <Button size="sm" onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-info to-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-1" />
                Add Trainee
              </Button>
            </div>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all focus:ring-2 focus:ring-info/20"
                />
              </div>
            </div>

            {filteredTrainees.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-muted/80 to-muted/40">
                      <TableHead>Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Schedule Status</TableHead>
                      <TableHead>Learning Status</TableHead>
                      <TableHead>Interim</TableHead>
                      <TableHead>Final</TableHead>
                      <TableHead>Qualifier Score</TableHead>
                      <TableHead>Eligibility</TableHead>
                      <TableHead>Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrainees.map((trainee, index) => {
                      const hasAttendance = hasAttendanceData(trainee.id);
                      return (
                        <TableRow
                          key={trainee.id}
                          className="cursor-pointer hover:bg-muted/50 animate-fade-in transition-colors"
                          style={{ animationDelay: `${index * 0.03}s` }}
                        >
                          <TableCell>
                            <button
                              onClick={(e) => handleNameClick(e, trainee)}
                              className="text-left hover:text-primary transition-colors"
                            >
                              <p className="font-medium hover:underline">{trainee.name}</p>
                              <p className="text-xs text-muted-foreground">{trainee.email}</p>
                            </button>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{trainee.employeeId}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(trainee.scheduleAdherence)}>
                              {trainee.scheduleAdherence}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(trainee.learningStatus)}>
                              {trainee.learningStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(trainee.interimStatus || "Pending")}>
                              {trainee.interimStatus || "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(trainee.finalStatus || "Pending")}>
                              {trainee.finalStatus || "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {trainee.qualifierScore !== null ? (
                              <span className={`font-semibold ${trainee.qualifierScore >= 60 ? "text-success" : "text-destructive"}`}>
                                {trainee.qualifierScore}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(trainee.eligibility)}>
                              {trainee.eligibility}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={hasAttendance ? "default" : "outline"}
                              size="sm"
                              onClick={(e) => handleAttendanceClick(e, trainee)}
                              disabled={!hasAttendance}
                              className={`gap-1 transition-all ${
                                hasAttendance 
                                  ? 'bg-gradient-to-r from-success to-info text-white hover:opacity-90' 
                                  : 'opacity-50 cursor-not-allowed'
                              }`}
                              title={hasAttendance ? "View attendance" : "No attendance recorded yet"}
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-dashed">
                {searchQuery ? "No trainees match your search" : "No trainees added yet. Upload an Excel file or add manually."}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <AddTraineeDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSave={onAddTrainee} />
      
      <TraineeDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        trainee={selectedTrainee}
      />

      {attendanceTrainee && (
        <AttendanceViewDialog
          open={showAttendanceDialog}
          onOpenChange={setShowAttendanceDialog}
          traineeName={attendanceTrainee.name}
          traineeId={attendanceTrainee.id}
          traineeEmail={attendanceTrainee.email}
        />
      )}
    </>
  );
};

export default TraineeListSection;
