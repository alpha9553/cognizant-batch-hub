import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Users, User, Building2, MapPin, Edit, Plus, BookOpen, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBatches, Trainee } from "@/context/BatchContext";
import ProgressChart from "@/components/ProgressChart";
import AttendanceSection from "@/components/AttendanceSection";
import StakeholderDialog from "@/components/StakeholderDialog";
import QualifierDialog from "@/components/QualifierDialog";
import EditBatchDialog from "@/components/EditBatchDialog";
import TraineeListSection from "@/components/TraineeListSection";
import ScheduleStatusDialog from "@/components/ScheduleStatusDialog";
import AddTrainerDialog from "@/components/AddTrainerDialog";
import TrainerContributionDialog from "@/components/TrainerContributionDialog";

const BatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBatchById, updateBatch, addTrainee } = useBatches();
  const batch = getBatchById(id || "");
  
  const [stakeholderDialog, setStakeholderDialog] = useState<{
    open: boolean;
    name: string;
    role: string;
    hours: number;
    rate: number;
  }>({ open: false, name: "", role: "", hours: 0, rate: 0 });
  const [qualifierDialog, setQualifierDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [addTrainerDialog, setAddTrainerDialog] = useState<{
    open: boolean;
    type: "trainer" | "behavioralTrainer" | "mentor";
  }>({ open: false, type: "trainer" });
  const [contributionDialog, setContributionDialog] = useState<{
    open: boolean;
    name: string;
    role: string;
    hourlyRate: number;
  }>({ open: false, name: "", role: "", hourlyRate: 0 });

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/");
    }
  }, [navigate]);

  if (!batch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Batch not found</h2>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleStakeholderClick = (type: 'trainer' | 'behavioralTrainer' | 'mentor') => {
    if (batch.stakeholders) {
      const stakeholder = batch.stakeholders[type];
      const roleNames = {
        trainer: "Trainer",
        behavioralTrainer: "Behavioral Trainer",
        mentor: "Mentor"
      };
      setStakeholderDialog({
        open: true,
        name: stakeholder.name,
        role: roleNames[type],
        hours: stakeholder.hours,
        rate: stakeholder.hourlyRate,
      });
    }
  };

  const handleSaveBatch = (updates: Partial<typeof batch>) => {
    updateBatch(batch.id, updates);
  };

  const handleAddTrainee = (trainee: Trainee) => {
    addTrainee(batch.id, trainee);
  };

  const handleAddTrainer = (trainerData: { name: string; type: string; category: "internal" | "external"; hourlyRate: number }) => {
    // Update the batch with new trainer info
    const trainerType = addTrainerDialog.type;
    const updates: Partial<typeof batch> = {};
    
    if (trainerType === "trainer") {
      updates.trainer = trainerData.name;
    } else if (trainerType === "behavioralTrainer") {
      updates.behavioralTrainer = trainerData.name;
    } else if (trainerType === "mentor") {
      updates.mentor = trainerData.name;
    }

    if (batch.stakeholders) {
      updates.stakeholders = {
        ...batch.stakeholders,
        [trainerType]: {
          name: trainerData.name,
          hours: 0,
          hourlyRate: trainerData.hourlyRate,
        },
      };
    }

    updateBatch(batch.id, updates);
  };

  const handleViewContributions = (type: 'trainer' | 'behavioralTrainer' | 'mentor') => {
    if (batch.stakeholders) {
      const stakeholder = batch.stakeholders[type];
      const roleNames = {
        trainer: "Trainer",
        behavioralTrainer: "Behavioral Trainer",
        mentor: "Mentor"
      };
      setContributionDialog({
        open: true,
        name: stakeholder.name,
        role: roleNames[type],
        hourlyRate: stakeholder.hourlyRate,
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => setEditDialog(true)} className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Details
              </Button>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{batch.name}</h1>
                {batch.status === "graduated" ? (
                  <Badge className="bg-success/10 text-success border border-success/20">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Graduated
                  </Badge>
                ) : (
                  <Badge className="bg-primary/10 text-primary border border-primary/20">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Ongoing Training
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{batch.description}</p>
              {batch.currentWeek && (
                <p className="text-sm text-primary mt-1">
                  Week {batch.currentWeek} of {batch.totalWeeks || "N/A"}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Room Details */}
          {batch.roomDetails && (
            <Card className="mb-8 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Training Room Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Building</p>
                      <p className="font-semibold">{batch.roomDetails.building}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Floor</p>
                      <p className="font-semibold">Floor {batch.roomDetails.floor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Room Number</p>
                      <p className="font-semibold">{batch.roomDetails.odcNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="animate-fade-in cursor-pointer card-hover" onClick={() => handleViewContributions('trainer')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Trainer
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddTrainerDialog({ open: true, type: "trainer" });
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold hover:text-primary transition-colors">{batch.trainer}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to view contributions</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in cursor-pointer card-hover" style={{ animationDelay: "0.1s" }} onClick={() => handleViewContributions('behavioralTrainer')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Behavioral Trainer
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddTrainerDialog({ open: true, type: "behavioralTrainer" });
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold hover:text-primary transition-colors">{batch.behavioralTrainer}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to view contributions</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in cursor-pointer card-hover" style={{ animationDelay: "0.2s" }} onClick={() => handleViewContributions('mentor')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Mentor
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddTrainerDialog({ open: true, type: "mentor" });
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold hover:text-primary transition-colors">{batch.mentor}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to view contributions</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{batch.startDate || "N/A"}</p>
                <p className="text-xs text-muted-foreground">to</p>
                <p className="text-sm font-medium">{batch.endDate || "N/A"}</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card 
              className="animate-fade-in cursor-pointer card-hover" 
              style={{ animationDelay: "0.4s" }}
              onClick={() => setScheduleDialog(true)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Schedule Status Distribution
                </CardTitle>
                <p className="text-xs text-muted-foreground">Click to view detailed breakdown</p>
              </CardHeader>
              <CardContent>
                <ProgressChart data={batch.scheduleStatus} />
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <span className="text-sm font-medium">On Schedule</span>
                  <span className="text-2xl font-bold text-success">
                    {batch.scheduleStatus.onSchedule}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                  <span className="text-sm font-medium">Behind Schedule</span>
                  <span className="text-2xl font-bold text-warning">
                    {batch.scheduleStatus.behind}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-info/10 rounded-lg">
                  <span className="text-sm font-medium">Advanced</span>
                  <span className="text-2xl font-bold text-info">
                    {batch.scheduleStatus.advanced}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Total Trainees</span>
                    <span className="text-2xl font-bold">{batch.totalTrainees}</span>
                  </div>
                </div>
                {batch.milestones.qualifier.completed && batch.qualifierScores && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setQualifierDialog(true)}
                  >
                    View Qualifier Scores
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Trainee List Section */}
          <div className="mb-8">
            <TraineeListSection
              batchId={batch.id}
              trainees={batch.trainees || []}
              onAddTrainee={handleAddTrainee}
            />
          </div>

          {/* Attendance Section */}
          <AttendanceSection batchId={batch.id} totalTrainees={batch.totalTrainees} trainees={batch.trainees || []} />
        </main>
      </div>

      <StakeholderDialog
        open={stakeholderDialog.open}
        onOpenChange={(open) => setStakeholderDialog({ ...stakeholderDialog, open })}
        name={stakeholderDialog.name}
        role={stakeholderDialog.role}
        contributionHours={stakeholderDialog.hours}
        hourlyRate={stakeholderDialog.rate}
      />

      {batch.qualifierScores && (
        <QualifierDialog
          open={qualifierDialog}
          onOpenChange={setQualifierDialog}
          batchName={batch.name}
          qualifierScores={batch.qualifierScores}
        />
      )}

      <EditBatchDialog
        open={editDialog}
        onOpenChange={setEditDialog}
        batch={batch}
        onSave={handleSaveBatch}
      />

      <ScheduleStatusDialog
        open={scheduleDialog}
        onOpenChange={setScheduleDialog}
        trainees={batch.trainees || []}
        scheduleStatus={batch.scheduleStatus}
      />

      <AddTrainerDialog
        open={addTrainerDialog.open}
        onOpenChange={(open) => setAddTrainerDialog({ ...addTrainerDialog, open })}
        onSave={handleAddTrainer}
        trainerType={addTrainerDialog.type}
      />

      <TrainerContributionDialog
        open={contributionDialog.open}
        onOpenChange={(open) => setContributionDialog({ ...contributionDialog, open })}
        name={contributionDialog.name}
        role={contributionDialog.role}
        hourlyRate={contributionDialog.hourlyRate}
      />
    </>
  );
};

export default BatchDetail;