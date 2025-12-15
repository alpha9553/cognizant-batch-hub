import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Plus, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Trainee } from "@/context/BatchContext";
import AddTraineeDialog from "./AddTraineeDialog";

interface TraineeListSectionProps {
  batchId: string;
  trainees: Trainee[];
  onAddTrainee: (trainee: Trainee) => void;
}

const TraineeListSection = ({ batchId, trainees, onAddTrainee }: TraineeListSectionProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredTrainees = trainees.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.employeeId.includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "On Schedule": "bg-success/10 text-success",
      "Behind Schedule": "bg-warning/10 text-warning",
      "Advanced": "bg-info/10 text-info",
      "Completed": "bg-success/10 text-success",
      "In Progress": "bg-primary/10 text-primary",
      "Not Started": "bg-muted text-muted-foreground",
    };
    return variants[status] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Trainees ({trainees.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Trainee
              </Button>
            </div>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredTrainees.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Schedule Status</TableHead>
                      <TableHead>Learning Status</TableHead>
                      <TableHead>Qualifier Score</TableHead>
                      <TableHead>Eligibility</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrainees.map((trainee) => (
                      <TableRow
                        key={trainee.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/student/${trainee.id}`)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{trainee.name}</p>
                            <p className="text-xs text-muted-foreground">{trainee.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{trainee.employeeId}</TableCell>
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
                          {trainee.qualifierScore !== null ? (
                            <span className={trainee.qualifierScore >= 60 ? "text-success" : "text-destructive"}>
                              {trainee.qualifierScore}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              trainee.eligibility === "Eligible"
                                ? "bg-success/10 text-success"
                                : "bg-destructive/10 text-destructive"
                            }
                          >
                            {trainee.eligibility}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No trainees match your search" : "No trainees added yet. Upload an Excel file or add manually."}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <AddTraineeDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={onAddTrainee}
      />
    </>
  );
};

export default TraineeListSection;
