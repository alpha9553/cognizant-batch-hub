import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Batch } from "@/context/BatchContext";

interface EditBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: Batch;
  onSave: (updates: Partial<Batch>) => void;
}

const EditBatchDialog = ({ open, onOpenChange, batch, onSave }: EditBatchDialogProps) => {
  const [formData, setFormData] = useState({
    trainer: batch.trainer,
    behavioralTrainer: batch.behavioralTrainer,
    mentor: batch.mentor,
    trainerHours: batch.stakeholders?.trainer.hours || 0,
    trainerRate: batch.stakeholders?.trainer.hourlyRate || 0,
    bhTrainerHours: batch.stakeholders?.behavioralTrainer.hours || 0,
    bhTrainerRate: batch.stakeholders?.behavioralTrainer.hourlyRate || 0,
    mentorHours: batch.stakeholders?.mentor.hours || 0,
    mentorRate: batch.stakeholders?.mentor.hourlyRate || 0,
    building: batch.roomDetails?.building || "",
    floor: batch.roomDetails?.floor || 1,
    odcNumber: batch.roomDetails?.odcNumber || "",
  });

  useEffect(() => {
    setFormData({
      trainer: batch.trainer,
      behavioralTrainer: batch.behavioralTrainer,
      mentor: batch.mentor,
      trainerHours: batch.stakeholders?.trainer.hours || 0,
      trainerRate: batch.stakeholders?.trainer.hourlyRate || 0,
      bhTrainerHours: batch.stakeholders?.behavioralTrainer.hours || 0,
      bhTrainerRate: batch.stakeholders?.behavioralTrainer.hourlyRate || 0,
      mentorHours: batch.stakeholders?.mentor.hours || 0,
      mentorRate: batch.stakeholders?.mentor.hourlyRate || 0,
      building: batch.roomDetails?.building || "",
      floor: batch.roomDetails?.floor || 1,
      odcNumber: batch.roomDetails?.odcNumber || "",
    });
  }, [batch]);

  const handleSave = () => {
    const updates: Partial<Batch> = {
      trainer: formData.trainer,
      behavioralTrainer: formData.behavioralTrainer,
      mentor: formData.mentor,
      stakeholders: {
        trainer: { name: formData.trainer, hours: formData.trainerHours, hourlyRate: formData.trainerRate },
        behavioralTrainer: { name: formData.behavioralTrainer, hours: formData.bhTrainerHours, hourlyRate: formData.bhTrainerRate },
        mentor: { name: formData.mentor, hours: formData.mentorHours, hourlyRate: formData.mentorRate },
      },
      roomDetails: formData.building ? {
        building: formData.building,
        floor: formData.floor,
        odcNumber: formData.odcNumber,
      } : undefined,
    };
    onSave(updates);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Batch Details - {batch.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Trainer Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Trainer Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Trainer Name</Label>
                <Input
                  value={formData.trainer}
                  onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                  placeholder="Enter trainer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Hours</Label>
                <Input
                  type="number"
                  value={formData.trainerHours}
                  onChange={(e) => setFormData({ ...formData, trainerHours: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Hourly Rate (₹)</Label>
                <Input
                  type="number"
                  value={formData.trainerRate}
                  onChange={(e) => setFormData({ ...formData, trainerRate: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Behavioral Trainer Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Behavioral Trainer Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>BH Trainer Name</Label>
                <Input
                  value={formData.behavioralTrainer}
                  onChange={(e) => setFormData({ ...formData, behavioralTrainer: e.target.value })}
                  placeholder="Enter BH trainer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Hours</Label>
                <Input
                  type="number"
                  value={formData.bhTrainerHours}
                  onChange={(e) => setFormData({ ...formData, bhTrainerHours: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Hourly Rate (₹)</Label>
                <Input
                  type="number"
                  value={formData.bhTrainerRate}
                  onChange={(e) => setFormData({ ...formData, bhTrainerRate: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Mentor Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mentor Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Mentor Name</Label>
                <Input
                  value={formData.mentor}
                  onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                  placeholder="Enter mentor name"
                />
              </div>
              <div className="space-y-2">
                <Label>Hours</Label>
                <Input
                  type="number"
                  value={formData.mentorHours}
                  onChange={(e) => setFormData({ ...formData, mentorHours: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Hourly Rate (₹)</Label>
                <Input
                  type="number"
                  value={formData.mentorRate}
                  onChange={(e) => setFormData({ ...formData, mentorRate: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Room Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Room Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Building</Label>
                <Input
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  placeholder="e.g., SDB1"
                />
              </div>
              <div className="space-y-2">
                <Label>Floor</Label>
                <Input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>ODC Number</Label>
                <Input
                  value={formData.odcNumber}
                  onChange={(e) => setFormData({ ...formData, odcNumber: e.target.value })}
                  placeholder="e.g., ODC-301"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBatchDialog;
