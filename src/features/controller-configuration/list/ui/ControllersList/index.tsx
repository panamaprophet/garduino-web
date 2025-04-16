import { Dropdown } from "@/shared/ui/Dropdown";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/entities/configuration";

export const ControllerList = ({ selectedId, onSelect }: { selectedId?: string; onSelect: (controllerId: string) => void }) => {
    const { data: controllerIds = [] } = useQuery(queries.listConfigurations);

    return (
        <Dropdown
            title="Select Controller"
            value={selectedId}
            options={controllerIds}
            onChange={onSelect}
        />
    );
}
