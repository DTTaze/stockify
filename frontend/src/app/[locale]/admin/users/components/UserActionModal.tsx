import { Info, KeyRound, ShieldAlert, UserPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { ButtonCustom } from "@/components/common/form/button";
import { useLanguage } from "@/providers/LanguageProvider";
import { AdminUserItem, RoleItem } from "@/types/user/user.type";

import { CreateUserForm } from "./CreateUserForm";
import { EditRolesForm } from "./EditRolesForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { ViewDetailsContent } from "./ViewDetailsContent";

export interface UserActionConfirmData {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  roles?: string[];
  roleIds?: string[];
}

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit-roles" | "reset-password" | "view-details" | null;
  user: AdminUserItem | null;
  availableRoles: RoleItem[];
  onConfirm: (data: UserActionConfirmData) => Promise<void> | void;
  isLoading?: boolean;
}

export function UserActionModal({
  isOpen,
  onClose,
  mode,
  user,
  availableRoles = [],
  onConfirm,
  isLoading = false,
}: UserActionModalProps) {
  const { t } = useLanguage();

  // Create Mode states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["user"]);

  // Reset Password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Edit Roles states
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Local validation error
  const [validationError, setValidationError] = useState("");

  // Reset fields on open/mode change
  useEffect(() => {
    if (isOpen) {
      setValidationError("");
      if (mode === "create") {
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setSelectedRoles(["user"]);
      } else if (mode === "reset-password") {
        setNewPassword("");
        setConfirmNewPassword("");
      } else if (mode === "edit-roles" && user) {
        setUserRoles(user.roles || []);
      }
    }
  }, [isOpen, mode, user]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mode) {
    return null;
  }

  const handleRoleCheckboxChange = (roleName: string) => {
    if (mode === "create") {
      if (selectedRoles.includes(roleName)) {
        if (selectedRoles.length > 1) {
          setSelectedRoles(selectedRoles.filter((r) => r !== roleName));
        }
      } else {
        setSelectedRoles([...selectedRoles, roleName]);
      }
    } else if (mode === "edit-roles") {
      if (userRoles.includes(roleName)) {
        if (userRoles.length > 1) {
          setUserRoles(userRoles.filter((r) => r !== roleName));
        }
      } else {
        setUserRoles([...userRoles, roleName]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (mode === "create") {
      if (!email.trim() || !username.trim() || !password.trim()) {
        setValidationError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
        return;
      }
      if (password !== confirmPassword) {
        setValidationError("Mật khẩu xác nhận không khớp.");
        return;
      }
      if (password.length < 6) {
        setValidationError("Mật khẩu phải chứa ít nhất 6 ký tự.");
        return;
      }

      await onConfirm({
        email: email.trim(),
        username: username.trim(),
        password: password,
        confirmPassword: confirmPassword,
        roles: selectedRoles,
      });
    } else if (mode === "reset-password") {
      if (!newPassword.trim()) {
        setValidationError("Vui lòng nhập mật khẩu mới.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setValidationError("Mật khẩu xác nhận không khớp.");
        return;
      }
      if (newPassword.length < 6) {
        setValidationError("Mật khẩu phải chứa ít nhất 6 ký tự.");
        return;
      }

      await onConfirm({
        password: newPassword,
      });
    } else if (mode === "edit-roles") {
      const roleIds = userRoles
        .map((rName) => availableRoles.find((r) => r.name === rName)?.id)
        .filter((id): id is string => !!id);

      await onConfirm({
        roleIds,
      });
    }
  };

  const renderModalHeader = () => {
    let title = "";
    let Icon = Info;
    let iconBg =
      "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400";

    if (mode === "create") {
      title = t("adminUsers.actionAddUser");
      Icon = UserPlus;
      iconBg =
        "bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400";
    } else if (mode === "edit-roles") {
      title = t("adminUsers.actionEditRoles");
      Icon = ShieldAlert;
      iconBg =
        "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400";
    } else if (mode === "reset-password") {
      title = t("adminUsers.actionResetPassword");
      Icon = KeyRound;
      iconBg =
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400";
    } else if (mode === "view-details") {
      title = t("adminUsers.actionViewDetails");
      Icon = Info;
    }

    return (
      <div className="flex items-start justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <div className="flex items-center space-x-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg leading-6 font-semibold text-neutral-900 dark:text-neutral-50">
            {title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-1.5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div
      onClick={onClose}
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="border-border bg-card text-card-foreground w-full max-w-md scale-100 transform overflow-hidden rounded-xl border p-6 shadow-xl transition-all"
      >
        {renderModalHeader()}

        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
          {mode === "create" && (
            <CreateUserForm
              email={email}
              setEmail={setEmail}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              selectedRoles={selectedRoles}
              handleRoleCheckboxChange={handleRoleCheckboxChange}
              availableRoles={availableRoles}
              validationError={validationError}
            />
          )}
          {mode === "edit-roles" && (
            <EditRolesForm
              user={user}
              userRoles={userRoles}
              handleRoleCheckboxChange={handleRoleCheckboxChange}
              availableRoles={availableRoles}
              validationError={validationError}
            />
          )}
          {mode === "reset-password" && (
            <ResetPasswordForm
              user={user}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmNewPassword={confirmNewPassword}
              setConfirmNewPassword={setConfirmNewPassword}
              validationError={validationError}
            />
          )}
          {mode === "view-details" && <ViewDetailsContent user={user} />}
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <ButtonCustom
            type="button"
            onClick={onClose}
            variant="outline"
            height="h-9"
            className="border-border bg-background hover:bg-muted text-foreground cursor-pointer"
          >
            {mode === "view-details" ? "Đóng" : t("adminUsers.cancelText")}
          </ButtonCustom>
          {mode !== "view-details" && (
            <ButtonCustom
              type="submit"
              loading={isLoading}
              variant={mode === "reset-password" ? "secondary" : "default"}
              height="h-9"
              className="cursor-pointer"
            >
              {mode === "create" && t("adminUsers.actionAddUser")}
              {mode === "edit-roles" && "Cập nhật vai trò"}
              {mode === "reset-password" && "Lưu mật khẩu mới"}
            </ButtonCustom>
          )}
        </div>
      </form>
    </div>
  );
}
