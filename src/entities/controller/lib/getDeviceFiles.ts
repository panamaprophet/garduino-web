import type { DownloadFile } from '@/shared/lib/download';
import type { Certificates } from '../model/controller';

export const getDeviceFiles = ({ controllerId, certificates, endpoint }: {
    controllerId: string,
    certificates: Certificates,
    endpoint: string,
}): DownloadFile[] => {
    const config = {
        controllerId,
        host: endpoint,
        wifi: { ssid: '', password: '' },
        pins: { fan: 12, light: 14, sensor: 2 },
    };

    return [
        { name: 'config.json', content: JSON.stringify(config, null, 4) },
        { name: 'controller.cert.pem', content: certificates.pem },
        { name: 'controller.private.key', content: certificates.privateKey },
        { name: 'controller.key', content: certificates.publicKey },
        { name: 'root.crt', content: certificates.root },
    ];
};
