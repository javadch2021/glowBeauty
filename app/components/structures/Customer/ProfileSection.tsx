import React from "react";
import { User } from "../../atoms/types/CustomerTypes";
import { CustomerButton } from "../../atoms/ui/CustomerButton";
import { ProfileEditForm } from "../../forms/Customer/ProfileEditForm";

interface ProfileSectionProps {
  user: User;
  editForm: User;
  isEditing: boolean;
  onFormChange: (field: keyof User, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  user,
  editForm,
  isEditing,
  onFormChange,
  onSave,
  onCancel,
  onEdit,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
      {isEditing ? (
        <ProfileEditForm
          editForm={editForm}
          onFormChange={onFormChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b">
            <span className="font-medium">Name</span>
            <span className="text-gray-600">{user.name}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="font-medium">Email</span>
            <span className="text-gray-600">{user.email}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="font-medium">Phone</span>
            <span className="text-gray-600">{user.phone}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="font-medium">Address</span>
            <span className="text-gray-600 text-right max-w-xs">
              {user.address}
            </span>
          </div>
          <div className="pt-4">
            <CustomerButton onClick={onEdit} variant="primary">
              Edit Profile
            </CustomerButton>
          </div>
        </div>
      )}
    </div>
  );
};
