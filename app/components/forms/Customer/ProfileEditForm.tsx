import React from "react";
import { User } from "../../atoms/types/CustomerTypes";
import { CustomerInput } from "../../atoms/ui/CustomerInput";
import { CustomerTextarea } from "../../atoms/ui/CustomerTextarea";
import { CustomerButton } from "../../atoms/ui/CustomerButton";

interface ProfileEditFormProps {
  editForm: User;
  onFormChange: (field: keyof User, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  editForm,
  onFormChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="space-y-4">
      <CustomerInput
        label="Full Name"
        value={editForm.name}
        onChange={(e) => onFormChange("name", e.target.value)}
      />

      <CustomerInput
        label="Email"
        type="email"
        value={editForm.email}
        onChange={(e) => onFormChange("email", e.target.value)}
      />

      <CustomerInput
        label="Phone"
        type="tel"
        value={editForm.phone}
        onChange={(e) => onFormChange("phone", e.target.value)}
      />

      <CustomerTextarea
        label="Address"
        value={editForm.address}
        onChange={(e) => onFormChange("address", e.target.value)}
        rows={3}
      />

      <div className="flex gap-3 pt-4">
        <CustomerButton onClick={onSave} variant="primary">
          Save Changes
        </CustomerButton>
        <CustomerButton onClick={onCancel} variant="secondary">
          Cancel
        </CustomerButton>
      </div>
    </div>
  );
};
