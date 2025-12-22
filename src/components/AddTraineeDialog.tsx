import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trainee } from "@/context/BatchContext";

interface AddTraineeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (trainee: Trainee) => void;
}

const AddTraineeDialog = ({ open, onOpenChange, onSave }: AddTraineeDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    scheduleAdherence: "On Schedule",
    learningStatus: "In Progress",
    interimStatus: "Not Started",
    finalStatus: "Not Started",
    qualifierScore: "",
    eligibility: "Eligible",
  });

  const handleSave = () => {
    const trainee: Trainee = {
      id: `trainee-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      employeeId: formData.employeeId,
      scheduleAdherence: formData.scheduleAdherence,
      learningStatus: formData.learningStatus,
      interimStatus: formData.interimStatus,
      finalStatus: formData.finalStatus,
      qualifierScore: formData.qualifierScore ? Number(formData.qualifierScore) : null,
      eligibility: formData.eligibility,
    };
    onSave(trainee);
    setFormData({
      name: "",
      email: "",
      employeeId: "",
      scheduleAdherence: "On Schedule",
      learningStatus: "In Progress",
      interimStatus: "Not Started",
      finalStatus: "Not Started",
      qualifierScore: "",
      eligibility: "Eligible",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Trainee</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="e.g., 123456"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@cognizant.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Schedule Status</Label>
              <Select
                value={formData.scheduleAdherence}
                onValueChange={(v) => setFormData({ ...formData, scheduleAdherence: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Schedule">On Schedule</SelectItem>
                  <SelectItem value="Behind Schedule">Behind Schedule</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Learning Status</Label>
              <Select
                value={formData.learningStatus}
                onValueChange={(v) => setFormData({ ...formData, learningStatus: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Qualifier Score</Label>
              <Input
                type="number"
                value={formData.qualifierScore}
                onChange={(e) => setFormData({ ...formData, qualifierScore: e.target.value })}
                placeholder="0-100"
              />
            </div>
            <div className="space-y-2">
              <Label>Eligibility</Label>
              <Select
                value={formData.eligibility}
                onValueChange={(v) => setFormData({ ...formData, eligibility: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eligible">Eligible</SelectItem>
                  <SelectItem value="Not Eligible">Not Eligible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.email}>
              Add Trainee
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTraineeDialog;
