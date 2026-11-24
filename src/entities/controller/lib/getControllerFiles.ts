import type { DownloadFile } from '@/shared/lib/download';
import type { Certificates, ProvisionedController } from '../model/controller';

export const getCertificateFiles = (certificates: Certificates): DownloadFile[] => [
    { name: 'root.crt', content: certificates.root },
    { name: 'controller.cert.pem', content: certificates.pem },
    { name: 'controller.private.key', content: certificates.privateKey },
];

export const getControllerFiles = ({ controllerId, certificates, endpoint }: ProvisionedController): DownloadFile[] => {
    const config = {
        controllerId,
        host: endpoint,
        wifi: { ssid: '', password: '' },
        pins: { fan: 12, light: 14, sensor: 2 },
    };

    return [
        { name: 'config.json', content: JSON.stringify(config, null, 4) },
        ...getCertificateFiles(certificates),
    ];
};
