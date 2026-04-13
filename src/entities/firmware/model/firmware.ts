export interface Firmware {
    key: string;
    md5: string;
    size: number;
    lastModified: number;
}

export interface FirmwareVersion {
    url: string;
    md5: string;
}
