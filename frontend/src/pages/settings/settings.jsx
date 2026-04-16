import { useState } from "react";
import "./settings.css";


function SettingsSection({ title, children }) {
    return (
        <div className="settings-section">
            <h2 className="settings-section-title">{title}</h2>
            {children}
        </div>
    );
}


export default function Settings({ user }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <div className="settings">
            <div className="settings-layout">
                <div className="settings-header">
                    <p className="settings-eyebrow">Account</p>
                    <h1 className="settings-title">Account <em>Settings</em></h1>
                    <p className="settings-sub">Manage your account details and form selections.</p>
                </div>


                <div className="settings-body">


                    <SettingsSection title="Display Name">
                        <p className="settings-field-hint">The name utilized when interacting in conversations.</p>
                        <div className="settings-form">
                            <input
                                className="settings-input"
                                type="text"
                                placeholder="Name"
                                maxLength={40}
                            />
                            <button className="settings-btn" type="button">Save</button>
                        </div>
                    </SettingsSection>


                    <SettingsSection title="Update Email">
                        <p className="settings-field-hint">Current email: <strong>{user?.email}</strong></p>
                        <div className="settings-form settings-form--col">
                            <input
                                className="settings-input"
                                type="email"
                                placeholder="New email address"
                            />
                            <input
                                className="settings-input"
                                type="password"
                                placeholder="Current password"
                            />
                            <button className="settings-btn" type="button">Update Email</button>
                        </div>
                    </SettingsSection>


                    <SettingsSection title="Change Password">
                        <div className="settings-form settings-form--col">
                            <input
                                className="settings-input"
                                type="password"
                                placeholder="Current password"
                            />
                            <input
                                className="settings-input"
                                type="password"
                                placeholder="New password"
                            />
                            <input
                                className="settings-input"
                                type="password"
                                placeholder="Confirm new password"
                            />
                            <button className="settings-btn" type="button">Update Password</button>
                        </div>
                    </SettingsSection>


                    <SettingsSection title="Account Deletion">
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
                                />
                                <p className="settings-field-hint">
                                    Type <strong>delete my account</strong> below to confirm.
                                </p>
                                <input
                                    className="settings-input"
                                    type="text"
                                    placeholder="delete my account"
                                />
                                <div className="settings-form settings-form--row">
                                    <button className="settings-btn settings-btn--danger" type="button">
                                        Confirm Delete
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
