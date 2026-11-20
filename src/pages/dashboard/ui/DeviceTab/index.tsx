import { useQuery } from '@tanstack/react-query';

import { queries } from '@/entities/controller';
import { useLatestEvents } from '@/entities/controller-event';

import { ControllerRebootButton } from '@/features/controller/reboot';
import { ControllerRemoveButton } from '@/features/controller/remove';
import { ControllerRenameForm } from '@/features/controller/rename';
import { ControllerRotateCertificateButton } from '@/features/controller/rotate-certificate';

import { Divider } from '@/shared/ui/Divider';
import { formatDate } from '@/shared/lib/date';

const Row = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between gap-4">
        <span className="text-slate-400 shrink-0">{label}</span>
        <span className="text-slate-800 truncate">{value}</span>
    </div>
);

export const DeviceTab = ({ controllerId, onRemoved }: { controllerId: string, onRemoved: () => void }) => {
    const { data: controller } = useQuery(queries.get(controllerId));
    const { data: latest } = useLatestEvents(controllerId);

    const boot = latest?.boot;
    const connection = latest?.connection;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-xs">
                <Row label="ID" value={controllerId} />
                {controller && <Row label="Created" value={formatDate(controller.createdAt)} />}
                {boot && <Row label="Firmware" value={boot.data.firmwareVersion} />}
                {boot && <Row label="Modules" value={boot.data.modules.join(', ')} />}
                {boot && <Row label="Last boot" value={`${formatDate(boot.ts)} · ${boot.data.resetReason}`} />}
                {connection && !connection.data.online && connection.data.reason && (
                    <Row label="Disconnected" value={connection.data.reason} />
                )}
            </div>

            <Divider />

            <ControllerRenameForm controllerId={controllerId} />

            <Divider />

            <div className="flex flex-col gap-2">
                <ControllerRebootButton controllerId={controllerId} />
                <ControllerRotateCertificateButton controllerId={controllerId} />
                <ControllerRemoveButton controllerId={controllerId} onRemoved={onRemoved} />
            </div>
        </div>
    );
};
