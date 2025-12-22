import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Users, User, Building2, MapPin, Edit, Plus, BookOpen, GraduationCap, UserPlus } from "lucide-react";
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
import MilestoneDatesSection from "@/components/MilestoneDatesSection";

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
  }>({ open: false, name: "", role: "", hours: 0 });
  const [qualifierDialog, setQualifierDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [addTrainerDialog, setAddTrainerDialog] = useState<{
    open: boolean;
    type: "trainer" | "behavioralTrainer" | "mentor" | "buddyMentor";
  }>({ open: false, type: "trainer" });
  const [contributionDialog, setContributionDialog] = useState<{
    open: boolean;
    name: string;
    role: string;
  }>({ open: false, name: "", role: "" });

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

  const handleStakeholderClick = (type: 'trainer' | 'behavioralTrainer' | 'mentor' | 'buddyMentor') => {
    if (batch.stakeholders && batch.stakeholders[type]) {
      const stakeholder = batch.stakeholders[type];
      const roleNames: Record<string, string> = {
        trainer: "Trainer",
        behavioralTrainer: "Behavioral Trainer",
        mentor: "Mentor",
        buddyMentor: "Buddy Mentor"
      };
      setStakeholderDialog({
        open: true,
        name: stakeholder.name,
        role: roleNames[type],
        hours: stakeholder.hours,
      });
    }
  };

  const handleSaveBatch = (updates: Partial<typeof batch>) => {
    updateBatch(batch.id, updates);
  };

  const handleAddTrainee = (trainee: Trainee) => {
    addTrainee(batch.id, trainee);
  };

  const handleAddTrainer = (trainerData: { name: string; type: string; category: "internal" | "external" }) => {
    const trainerType = addTrainerDialog.type;
    const updates: Partial<typeof batch> = {};
    
    if (trainerType === "trainer") {
      updates.trainer = trainerData.name;
    } else if (trainerType === "behavioralTrainer") {
      updates.behavioralTrainer = trainerData.name;
    } else if (trainerType === "mentor") {
      updates.mentor = trainerData.name;
    } else if (trainerType === "buddyMentor") {
      (updates as any).buddyMentor = trainerData.name;
    }

    if (batch.stakeholders) {
      updates.stakeholders = {
        ...batch.stakeholders,
        [trainerType]: {
          name: trainerData.name,
          hours: 0,
        },
      };
    }

    updateBatch(batch.id, updates);
  };

  const handleViewContributions = (type: 'trainer' | 'behavioralTrainer' | 'mentor' | 'buddyMentor') => {
    if (batch.stakeholders && batch.stakeholders[type]) {
      const stakeholder = batch.stakeholders[type];
      const roleNames: Record<string, string> = {
        trainer: "Trainer",
        behavioralTrainer: "Behavioral Trainer",
        mentor: "Mentor",
        buddyMentor: "Buddy Mentor"
      };
      setContributionDialog({
        open: true,
        name: stakeholder.name,
        role: roleNames[type],
      });
    }
  };

  const buddyMentor = (batch as any).buddyMentor || "Not Assigned";

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2 hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => setEditDialog(true)} className="gap-2 hover:border-primary hover:text-primary transition-all">
                <Edit className="w-4 h-4" />
                Edit Details
              </Button>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{batch.name}</h1>
                {batch.status === "graduated" ? (
                  <Badge className="bg-success/10 text-success border border-success/20">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Graduated
                  </Badge>
                ) : (
                  <Badge className="bg-primary/10 text-primary border border-primary/20 animate-pulse-glow">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Ongoing Training
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{batch.description}</p>
              {batch.currentWeek && (
                <p className="text-sm text-primary mt-1 font-medium">
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
            <Card className="mb-8 animate-fade-in overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-info/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Training Room Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-muted to-muted/50 rounded-lg border transition-all hover:border-primary/30">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Building</p>
                      <p className="font-semibold">{batch.roomDetails.building}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-muted to-muted/50 rounded-lg border transition-all hover:border-info/30">
                    <MapPin className="w-5 h-5 text-info" />
                    <div>
                      <p className="text-xs text-muted-foreground">Floor</p>
                      <p className="font-semibold">Floor {batch.roomDetails.floor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-muted to-muted/50 rounded-lg border transition-all hover:border-success/30">
                    <MapPin className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-xs text-muted-foreground">Room Number</p>
                      <p className="font-semibold">{batch.roomDetails.odcNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trainer Cards - Updated with Buddy Mentor */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="animate-fade-in cursor-pointer card-hover bg-gradient-to-br from-card to-primary/5 border-primary/10" onClick={() => handleViewContributions('trainer')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Trainer
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-primary/20" onClick={(e) => { e.stopPropagation(); setAddTrainerDialog({ open: true, type: "trainer" }); }}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-primary">{batch.trainer}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to view</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in cursor-pointer card-hover bg-gradient-to-br from-card to-info/5 border-info/10" style={{ animationDelay: "0.1s" }} onClick={() => handleViewContributions('behavioralTrainer')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-info" />
                    BH Trainer
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-info/20" onClick={(e) => { e.stopPropagation(); setAddTrainerDialog({ open: true, type: "behavioralTrainer" }); }}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-info">{batch.behavioralTrainer}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to view</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in cursor-pointer card-hover bg-gradient-to-br from-card to-success/5 border-success/10" style={{ animationDelay: "0.2s" }} onClick={() => handleViewContributions('mentor')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-success" />
                    Mentor
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-success/20" onClick={(e) => { e.stopPropagation(); setAddTrainerDialog({ open: true, type: "mentor" }); }}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-success">{batch.mentor}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to view</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in cursor-pointer card-hover bg-gradient-to-br from-card to-warning/5 border-warning/10" style={{ animationDelay: "0.25s" }} onClick={() => handleViewContributions('buddyMentor')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-warning" />
                    Buddy Mentor
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-warning/20" onClick={(e) => { e.stopPropagation(); setAddTrainerDialog({ open: true, type: "buddyMentor" as any }); }}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-warning">{buddyMentor}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to view</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in bg-gradient-to-br from-card to-muted" style={{ animationDelay: "0.3s" }}>
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
            <Card className="animate-fade-in cursor-pointer card-hover" style={{ animationDelay: "0.4s" }} onClick={() => setScheduleDialog(true)}>
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Schedule Status Distribution
                </CardTitle>
                <p className="text-xs text-muted-foreground">Click to view detailed breakdown</p>
              </CardHeader>
              <CardContent className="pt-4">
                <ProgressChart data={batch.scheduleStatus} />
              </CardContent>
            </Card>

            <MilestoneDatesSection batchId={batch.id} milestones={batch.milestones} />
          </div>

          {/* Trainee List Section */}
          <div className="mb-8">
            <TraineeListSection batchId={batch.id} trainees={batch.trainees || []} onAddTrainee={handleAddTrainee} />
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
      />

      {batch.qualifierScores && (
        <QualifierDialog open={qualifierDialog} onOpenChange={setQualifierDialog} batchName={batch.name} qualifierScores={batch.qualifierScores} />
      )}

      <EditBatchDialog open={editDialog} onOpenChange={setEditDialog} batch={batch} onSave={handleSaveBatch} />

      <ScheduleStatusDialog open={scheduleDialog} onOpenChange={setScheduleDialog} trainees={batch.trainees || []} scheduleStatus={batch.scheduleStatus} />

      <AddTrainerDialog open={addTrainerDialog.open} onOpenChange={(open) => setAddTrainerDialog({ ...addTrainerDialog, open })} onSave={handleAddTrainer} trainerType={addTrainerDialog.type} />

      <TrainerContributionDialog open={contributionDialog.open} onOpenChange={(open) => setContributionDialog({ ...contributionDialog, open })} name={contributionDialog.name} role={contributionDialog.role} />
    </>
  );
};

export default BatchDetail;
