import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LeaveResultDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LeaveResultDialog = ({ open, onCancel, onConfirm }: LeaveResultDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md" aria-describedby="leave-result-desc">
        <DialogHeader>
          <DialogTitle>Leave page?</DialogTitle>
        </DialogHeader>
        <DialogDescription id="leave-result-desc">
          You have a comparison result. Navigating away will lose it. Continue?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveResultDialog;
