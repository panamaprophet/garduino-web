export interface Controller {
    controllerId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Certificates {
    root: string;
    pem: string;
    privateKey: string;
    publicKey: string;
}

export interface ProvisionedController extends Controller {
    certificates: Certificates;
    endpoint: string;
}

export interface RemovedController extends Controller {
    revokedCertificates: string[];
}

export interface RotatedCertificate {
    controllerId: string;
    certificates: Certificates;
    endpoint: string;
    revokedCertificates: string[];
}
