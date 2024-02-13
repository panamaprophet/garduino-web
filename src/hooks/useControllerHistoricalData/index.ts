import { useEffect, useState } from 'react';
import config from '@/config';
import { ControllerId } from '@/types';

const getControllerHistoricalData = (controllerId: ControllerId, { startDate, endDate }: { startDate: number, endDate: number }) => {
    const url = `${config.dataCollectorApi}/${controllerId}?startDate=${startDate}&endDate=${endDate}`;

    return fetch(url).then(response => response.json());
};

export const useControllerHistoricalData = (controllerId: ControllerId, options: { startDate?: number, endDate?: number } = {}) => {
    const {
        startDate = Date.now() - 24 * 60 * 60 * 1000,
        endDate = Date.now(),
    } = options;

    const [data, setData] = useState<any>([]);

    useEffect(() => {
        getControllerHistoricalData(controllerId, { startDate, endDate }).then(setData);
    }, [startDate, endDate, controllerId]);

    return [data];
};
