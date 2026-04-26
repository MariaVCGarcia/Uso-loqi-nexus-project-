import { useState, useEffect } from "react";
import "./settings.css";
import { updateDisplayName, changeEmail, changePassword, deleteAccount } from "../../auth/auth";
import { db } from "../../auth/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";


function StatusMsg({ status }) {
    if (!status) return null;
    return <p className={`settings-status settings-status--${status.type}`}>{status.msg}</p>;
}

function SettingsSection({ title, children, full }) {
    return (
        <div className={`settings-section${full ? " settings-section--full" : ""}`}>
            <h2 className="settings-section-title">{title}</h2>
            {children}
        </div>
    );
}


export default function Settings({ user }) {
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [nameStatus, setNameStatus] = useState(null);
    const [nameLoading, setNameLoading] = useState(false);

    const [newEmail, setNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");
    const [emailStatus, setEmailStatus] = useState(null);
    const [emailLoading, setEmailLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStatus, setPasswordStatus] = useState(null);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [level, setLevel] = useState("");
    const [levelStatus, setLevelStatus] = useState(null);
    const [levelLoading, setLevelLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        getDoc(doc(db, "users", user.uid)).then((snap) => {
            if (snap.exists()) setLevel(snap.data().level || "");
        });
    }, [user]);

    const handleSaveLevel = async () => {
        if (!level) return;
        setLevelLoading(true);
        setLevelStatus(null);
        try {
            await updateDoc(doc(db, "users", user.uid), { level });
            setLevelStatus({ type: "success", msg: "Level updated." });
        } catch (err) {
            setLevelStatus({ type: "error", msg: err.message });
        } finally {
            setLevelLoading(false);
        }
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleSaveName = async () => {
        if (!displayName.trim()) return;
        setNameLoading(true);
        setNameStatus(null);
        try {
            await updateDisplayName(displayName.trim());
            setNameStatus({ type: "success", msg: "Display name updated." });
        } catch (err) {
            setNameStatus({ type: "error", msg: err.message });
        } finally {
            setNameLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!newEmail || !emailPassword) return;
        setEmailLoading(true);
        setEmailStatus(null);
        try {
            await changeEmail(newEmail, emailPassword);
            setEmailStatus({ type: "success", msg: "Email updated successfully." });
            setNewEmail("");
            setEmailPassword("");
        } catch (err) {
            setEmailStatus({ type: "error", msg: err.message });
        } finally {
            setEmailLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordStatus({ type: "error", msg: "New passwords do not match." });
            return;
        }
        if (!currentPassword || !newPassword) return;
        setPasswordLoading(true);
        setPasswordStatus(null);
        try {
            await changePassword(currentPassword, newPassword);
            setPasswordStatus({ type: "success", msg: "Password updated successfully." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordStatus({ type: "error", msg: err.message });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "delete") {
            setDeleteStatus({ type: "error", msg: 'Type "delete" exactly to confirm.' });
            return;
        }
        if (!deletePassword) return;
        setDeleteLoading(true);
        setDeleteStatus(null);
        try {
            await deleteAccount(deletePassword);
        } catch (err) {
            setDeleteStatus({ type: "error", msg: err.message });
            setDeleteLoading(false);
        }
    };

    return (
        <div className="settings">
            <div className="settings-layout">
                <div className="settings-header">
                    <p className="settings-eyebrow">Account</p>
                    <h1 className="settings-title">Account <em>Settings</em></h1>
                    <p className="settings-sub">Manage your account details and preferences.</p>
                </div>

                <div className="settings-body">

                    <SettingsSection title="Display Name">
                        <p className="settings-field-hint">The name shown when interacting in conversations.</p>
                        <div className="settings-form">
                            <input
                                className="settings-input"
                                type="text"
                                placeholder="Name"
                                maxLength={40}
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                            />
                            <button className="settings-btn" type="button" onClick={handleSaveName} disabled={nameLoading}>
                                {nameLoading ? "Saving…" : "Save"}
                            </button>
                        </div>
                        <StatusMsg status={nameStatus} />
                    </SettingsSection>

                    <SettingsSection title="Update Email">
                        <p className="settings-field-hint">Current email: <strong>{user?.email}</strong></p>
                        <div className="settings-form settings-form--col">
                            <input
                                className="settings-input"
                                type="email"
                                placeholder="New email address"
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                            />
                            <input
                                className="settings-input"
                                type="password"
                                placeholder="Current password"
                                value={emailPassword}
                                onChange={e => setEmailPassword(e.target.value)}
                            />
                            <button className="settings-btn" type="button" onClick={handleUpdateEmail} disabled={emailLoading}>
                                {emailLoading ? "Updating…" : "Update Email"}
                            </button>
                        </div>
                        <StatusMsg status={emailStatus} />
                    </SettingsSection>

                    <SettingsSection title="Change Password">
                        <div className="settings-form settings-form--col">
                            <input
                                className="settings-input"
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                            />
                            <input
                                className="settings-input"
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                            <input
                                className="settings-input"
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            <button className="settings-btn" type="button" onClick={handleChangePassword} disabled={passwordLoading}>
                                {passwordLoading ? "Updating…" : "Update Password"}
                            </button>
                        </div>
                        <StatusMsg status={passwordStatus} />
                    </SettingsSection>

                    <SettingsSection title="Proficiency Level">
                        <p className="settings-field-hint">Your Spanish proficiency level used for conversation difficulty.</p>
                        <div className="settings-form">
                            <select
                                className="settings-input"
                                value={level}
                                onChange={e => setLevel(e.target.value)}
                            >
                                <option value="">Select your level…</option>
                                <option value="beginner">Beginner (A1–A2)</option>
                                <option value="intermediate">Intermediate (B1–B2)</option>
                                <option value="advanced">Advanced (C1–C2)</option>
                            </select>
                            <button className="settings-btn" type="button" onClick={handleSaveLevel} disabled={levelLoading}>
                                {levelLoading ? "Saving…" : "Save"}
                            </button>
                        </div>
                        <StatusMsg status={levelStatus} />
                    </SettingsSection>

                    <SettingsSection title="Account Deletion" full>
                        <p className="settings-field-hint">Permanent account deletion. This cannot be undone.</p>
                        {!showDeleteConfirm ? (
                            <button
                                className="settings-btn settings-btn--danger"
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div className="settings-form settings-form--col">
                                <input
                                    className="settings-input"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={deletePassword}
                                    onChange={e => setDeletePassword(e.target.value)}
                                />
                                <p className="settings-field-hint">
                                    Type <strong>delete</strong> below to confirm.
                                </p>
                                <input
                                    className="settings-input"
                                    type="text"
                                    placeholder="delete"
                                    value={deleteConfirmText}
                                    onChange={e => setDeleteConfirmText(e.target.value)}
                                />
                                <StatusMsg status={deleteStatus} />
                                <div className="settings-form settings-form--row">
                                    <button
                                        className="settings-btn settings-btn--danger"
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? "Deleting…" : "Confirm Delete"}
                                    </button>
                                    <button
                                        className="settings-btn settings-btn--ghost"
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </SettingsSection>

                </div>
            </div>
        </div>
    );
}