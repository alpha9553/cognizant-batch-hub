import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingDown, TrendingUp, User, GraduationCap, CheckCircle, Circle, Building2, MapPin, BookOpen, ExternalLink, Home } from "lucide-react";
import QualifierDialog from "./QualifierDialog";
import { Batch } from "@/context/BatchContext";

interface BatchCardProps {
  batch: Batch;
  index: number;
}

const BatchCard = ({ batch, index }: BatchCardProps) => {
  const navigate = useNavigate();
  const [qualifierDialog, setQualifierDialog] = useState(false);
  
  const onSchedulePercent = (batch.scheduleStatus.onSchedule / batch.totalTrainees) * 100;
  const behindPercent = (batch.scheduleStatus.behind / batch.totalTrainees) * 100;

  const handleQualifierClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (batch.milestones.qualifier.completed && batch.qualifierScores) {
      setQualifierDialog(true);
    }
  };

  // Get trainer category from stakeholders
  const getTrainerCategory = (type: 'trainer' | 'behavioralTrainer' | 'mentor') => {
    // Check if we have category info in stakeholders (can be extended)
    const stakeholder = batch.stakeholders?.[type];
    // Default to internal if not specified - in a real app this would come from data
    return (stakeholder as any)?.category || "internal";
  };

  const TrainerBadge = ({ category }: { category: string }) => (
    <Badge 
      variant="outline" 
      className={`text-[10px] px-1.5 py-0 ${
        category === "external" 
          ? "bg-accent/10 text-accent border-accent/30" 
          : "bg-primary/10 text-primary border-primary/30"
      }`}
    >
      {category === "external" ? (
        <><ExternalLink className="w-2.5 h-2.5 mr-0.5" />Ext</>
      ) : (
        <><Home className="w-2.5 h-2.5 mr-0.5" />Int</>
      )}
    </Badge>
  );

  return (
    <>
      <Card 
        className="hover:shadow-lg transition-all duration-300 cursor-pointer hover-scale animate-fade-in group colorful-shadow"
        style={{ animationDelay: `${index * 0.1}s` }}
        onClick={() => navigate(`/batch/${batch.id}`)}
      >
        <CardHeader className="bg-gradient-to-r from-primary/10 via-info/5 to-accent/5 border-b border-primary/10">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {batch.name}
              {batch.status === "graduated" ? (
                <Badge variant="secondary" className="bg-success/10 text-success border border-success/20">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Graduated
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 animate-pulse-glow">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Ongoing Training
                </Badge>
              )}
            </span>
            <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">{batch.description}</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {batch.roomDetails && (
            <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-lg space-y-1 border border-border/50">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="font-medium">{batch.roomDetails.building}</span>
                <span className="text-muted-foreground">- Floor {batch.roomDetails.floor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-info" />
                <span className="font-medium">{batch.roomDetails.odcNumber}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm p-3 bg-gradient-to-r from-primary/5 to-info/5 rounded-lg">
            <span className="text-muted-foreground">Total Trainees</span>
            <span className="text-2xl font-bold text-primary">{batch.totalTrainees}</span>
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

        <div className="pt-2 border-t grid grid-cols-2 gap-2 text-center text-sm">
          <div className="p-2 rounded-lg bg-success/5 border border-success/10 transition-all hover:bg-success/10">
            <p className="text-muted-foreground text-xs">On Track</p>
            <p className="text-lg font-bold text-success">{batch.scheduleStatus.onSchedule}</p>
          </div>
          <div className="p-2 rounded-lg bg-warning/5 border border-warning/10 transition-all hover:bg-warning/10">
            <p className="text-muted-foreground text-xs">Behind</p>
            <p className="text-lg font-bold text-warning">{batch.scheduleStatus.behind}</p>
          </div>
        </div>

        <div className="pt-3 space-y-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-colors">
            <User className="w-3 h-3 text-primary" />
            <span className="text-muted-foreground">Trainer:</span>
            <span className="font-medium flex-1">{batch.trainer}</span>
            <TrainerBadge category={getTrainerCategory('trainer')} />
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-info/5 to-transparent hover:from-info/10 transition-colors">
            <User className="w-3 h-3 text-info" />
            <span className="text-muted-foreground">BH Trainer:</span>
            <span className="font-medium flex-1">{batch.behavioralTrainer}</span>
            <TrainerBadge category={getTrainerCategory('behavioralTrainer')} />
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-success/5 to-transparent hover:from-success/10 transition-colors">
            <User className="w-3 h-3 text-success" />
            <span className="text-muted-foreground">Mentor:</span>
            <span className="font-medium flex-1">{batch.mentor}</span>
            <TrainerBadge category={getTrainerCategory('mentor')} />
          </div>
        </div>

        <div className="pt-3 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2">Milestones</p>
          <div className="flex items-center justify-between text-xs">
            <button 
              onClick={handleQualifierClick}
              className={`flex items-center gap-1 p-2 rounded-lg transition-all ${batch.milestones.qualifier.completed ? 'hover:bg-success/10 text-success' : 'text-muted-foreground'}`}
              disabled={!batch.milestones.qualifier.completed}
            >
              {batch.milestones.qualifier.completed ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
              <span>Qualifier</span>
            </button>
            <div className={`flex items-center gap-1 p-2 rounded-lg ${batch.milestones.interim.completed ? 'text-success' : 'text-muted-foreground'}`}>
              {batch.milestones.interim.completed ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
              <span>Interim</span>
            </div>
            <div className={`flex items-center gap-1 p-2 rounded-lg ${batch.milestones.final.completed ? 'text-success' : 'text-muted-foreground'}`}>
              {batch.milestones.final.completed ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
              <span>Final</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

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
