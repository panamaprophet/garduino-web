import { useQuery } from '@tanstack/react-query';
import { queries } from '@/entities/controller-configuration';
import { Dropdown } from '@/shared/ui/Dropdown';

export const ControllerList = ({ selectedId, onSelect }: { selectedId?: string; onSelect: (controllerId: string) => void }) => {
    const { data: controllerIds = [], isLoading } = useQuery(queries.listConfigurations);

    return (
        <Dropdown
            title={isLoading ? 'Loading...' : 'Select Controller'}
            disabled={isLoading}
            value={selectedId}
            options={controllerIds}
            onChange={onSelect}
        />
    );
}
