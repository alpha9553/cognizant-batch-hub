import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface AddTrainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (trainer: { name: string; type: string; category: "internal" | "external" }) => void;
  trainerType: "trainer" | "behavioralTrainer" | "mentor" | "buddyMentor";
}

const AddTrainerDialog = ({ open, onOpenChange, onSave, trainerType }: AddTrainerDialogProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState<"internal" | "external">("internal");

  const trainerTypeLabels: Record<string, string> = {
    trainer: "Trainer",
    behavioralTrainer: "Behavioral Trainer",
    mentor: "Mentor",
    buddyMentor: "Buddy Mentor",
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter trainer name");
      return;
    }
    if (!type.trim()) {
      toast.error("Please enter trainer type/specialization");
      return;
    }

    onSave({
      name: name.trim(),
      type: type.trim(),
      category,
    });

    toast.success(`${trainerTypeLabels[trainerType]} added successfully!`);
    setName("");
    setType("");
    setCategory("internal");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add {trainerTypeLabels[trainerType]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter trainer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type / Specialization</Label>
            <Input
              id="type"
              placeholder="e.g., Java Expert, Soft Skills"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as "internal" | "external")}>
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    Internal (Cognizant)
                  </span>
                </SelectItem>
                <SelectItem value="external">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-info" />
                    External (Third-party)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add {trainerTypeLabels[trainerType]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTrainerDialog;