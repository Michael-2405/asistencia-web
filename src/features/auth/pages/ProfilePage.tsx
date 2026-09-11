import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { AccountSection } from "../components/profile/AccountSection";
import { ChangeEmailDialog } from "../components/profile/ChangeEmailDialog";
import { ChangePasswordDialog } from "../components/profile/ChangePasswordDialog";
import { DangerZoneSection } from "../components/profile/DangerZoneSection";
import { DisableTwoFactorDialog } from "../components/profile/DisableTwoFactorDialog";
import { type ProfileSection, ProfileSidebar } from "../components/profile/ProfileSidebar";
import { SecuritySection } from "../components/profile/SecuritySection";
import { SuspendAccountDialog } from "../components/profile/SuspendAccountDialog";
import { TeacherConfigSection } from "../components/profile/TeacherConfigSection";
import { TwoFactorSetup } from "../components/profile/TwoFactorSetup";
import { useMyProfile } from "../hooks/useProfile";
import { useSession } from "../lib/auth-client";

export function ProfilePage() {
	const { data: session, refetch } = useSession();
	const { data: profile } = useMyProfile();
	const [section, setSection] = useState<ProfileSection>("cuenta");
	const [changeEmailOpen, setChangeEmailOpen] = useState(false);
	const [changePasswordOpen, setChangePasswordOpen] = useState(false);
	const [setupOpen, setSetupOpen] = useState(false);
	const [disableOpen, setDisableOpen] = useState(false);
	const [suspendOpen, setSuspendOpen] = useState(false);

	if (!session || !profile) return null;

	const twoFactorEnabled = Boolean(
		(session.user as { twoFactorEnabled?: boolean }).twoFactorEnabled,
	);

	return (
		<div className="flex min-h-full">
			<ProfileSidebar active={section} onChange={setSection} />

			<div className="flex max-w-190 flex-1 flex-col gap-6 p-9">
				<div>
					<h1 className="mb-1 text-2xl font-extrabold text-[#1a1d21]">Perfil del docente</h1>
					<span className="text-[13.5px] text-[#8a8f98]">{profile.name}</span>
				</div>

				{section === "cuenta" && (
					<AccountSection
						email={session.user.email}
						onChangeEmail={() => setChangeEmailOpen(true)}
						onChangePassword={() => setChangePasswordOpen(true)}
					/>
				)}

				{section === "docente" && (
					<TeacherConfigSection
						educationLevel={profile.educationLevel}
						isHomeroomTeacher={profile.isHomeroomTeacher}
						subjectName={profile.subjectName}
					/>
				)}

				{section === "seguridad" && (
					<SecuritySection
						twoFactorEnabled={twoFactorEnabled}
						onEnable={() => setSetupOpen(true)}
						onDisable={() => setDisableOpen(true)}
					/>
				)}

				{section === "zona" && <DangerZoneSection onSuspend={() => setSuspendOpen(true)} />}
			</div>

			<ChangeEmailDialog open={changeEmailOpen} onOpenChange={setChangeEmailOpen} />
			<ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
			<DisableTwoFactorDialog
				open={disableOpen}
				onOpenChange={setDisableOpen}
				onDone={() => {
					setDisableOpen(false);
					refetch();
				}}
			/>
			<SuspendAccountDialog open={suspendOpen} onOpenChange={setSuspendOpen} />

			<Dialog open={setupOpen} onOpenChange={setSetupOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Activar verificación en dos pasos</DialogTitle>
					</DialogHeader>
					<TwoFactorSetup
						onDone={() => {
							setSetupOpen(false);
							refetch();
						}}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
