import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingDown, TrendingUp, User, GraduationCap, CheckCircle, Circle, Building2, MapPin, BookOpen } from "lucide-react";
import StakeholderDialog from "./StakeholderDialog";
import QualifierDialog from "./QualifierDialog";
import { Batch } from "@/context/BatchContext";

interface BatchCardProps {
  batch: Batch;
  index: number;
}

const BatchCard = ({ batch, index }: BatchCardProps) => {
  const navigate = useNavigate();
  const [stakeholderDialog, setStakeholderDialog] = useState<{
    open: boolean;
    name: string;
    role: string;
    hours: number;
    rate: number;
  }>({ open: false, name: "", role: "", hours: 0, rate: 0 });
  const [qualifierDialog, setQualifierDialog] = useState(false);
  
  const onSchedulePercent = (batch.scheduleStatus.onSchedule / batch.totalTrainees) * 100;
  const behindPercent = (batch.scheduleStatus.behind / batch.totalTrainees) * 100;

  const handleStakeholderClick = (e: React.MouseEvent, type: 'trainer' | 'behavioralTrainer' | 'mentor') => {
    e.stopPropagation();
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

  const handleQualifierClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (batch.milestones.qualifier.completed && batch.qualifierScores) {
      setQualifierDialog(true);
    }
  };

  return (
    <>
      <Card 
        className="hover:shadow-lg transition-all duration-300 cursor-pointer hover-scale animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s` }}
        onClick={() => navigate(`/batch/${batch.id}`)}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {batch.name}
              {batch.status === "graduated" ? (
                <Badge variant="secondary" className="bg-success/10 text-success border border-success/20">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Graduated
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Ongoing Training
                </Badge>
              )}
            </span>
            <Users className="w-5 h-5 text-muted-foreground" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">{batch.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {batch.roomDetails && (
            <div className="p-3 bg-muted rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="font-medium">{batch.roomDetails.building}</span>
                <span className="text-muted-foreground">- Floor {batch.roomDetails.floor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">{batch.roomDetails.odcNumber}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Trainees</span>
            <span className="text-2xl font-bold">{batch.totalTrainees}</span>
          </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-success">
              <TrendingUp className="w-4 h-4" />
              On Schedule
            </span>
            <span className="font-semibold">{onSchedulePercent.toFixed(0)}%</span>
          </div>
          <Progress value={onSchedulePercent} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-warning">
              <TrendingDown className="w-4 h-4" />
              Behind Schedule
            </span>
            <span className="font-semibold">{behindPercent.toFixed(0)}%</span>
          </div>
          <Progress value={behindPercent} className="h-2" />
        </div>

        <div className="pt-2 border-t grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="text-muted-foreground">On Track</p>
            <p className="text-lg font-bold text-success">{batch.scheduleStatus.onSchedule}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Behind</p>
            <p className="text-lg font-bold text-warning">{batch.scheduleStatus.behind}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Advanced</p>
            <p className="text-lg font-bold text-info">{batch.scheduleStatus.advanced}</p>
          </div>
        </div>

        <div className="pt-3 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Trainer:</span>
            <button 
              onClick={(e) => handleStakeholderClick(e, 'trainer')}
              className="font-medium hover:text-primary hover:underline transition-colors"
            >
              {batch.trainer}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">BH Trainer:</span>
            <button 
              onClick={(e) => handleStakeholderClick(e, 'behavioralTrainer')}
              className="font-medium hover:text-primary hover:underline transition-colors"
            >
              {batch.behavioralTrainer}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Mentor:</span>
            <button 
              onClick={(e) => handleStakeholderClick(e, 'mentor')}
              className="font-medium hover:text-primary hover:underline transition-colors"
            >
              {batch.mentor}
            </button>
          </div>
        </div>

        <div className="pt-3 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2">Milestones</p>
          <div className="flex items-center justify-between text-xs">
            <button 
              onClick={handleQualifierClick}
              className={`flex items-center gap-1 ${batch.milestones.qualifier.completed ? 'hover:text-primary transition-colors' : ''}`}
              disabled={!batch.milestones.qualifier.completed}
            >
              {batch.milestones.qualifier.completed ? (
                <CheckCircle className="w-3 h-3 text-success" />
              ) : (
                <Circle className="w-3 h-3 text-muted-foreground" />
              )}
              <span>Qualifier</span>
            </button>
            <div className="flex items-center gap-1">
              {batch.milestones.interim.completed ? (
                <CheckCircle className="w-3 h-3 text-success" />
              ) : (
                <Circle className="w-3 h-3 text-muted-foreground" />
              )}
              <span>Interim</span>
            </div>
            <div className="flex items-center gap-1">
              {batch.milestones.final.completed ? (
                <CheckCircle className="w-3 h-3 text-success" />
              ) : (
                <Circle className="w-3 h-3 text-muted-foreground" />
              )}
              <span>Final</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

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
    </>
  );
};

export default BatchCard;
