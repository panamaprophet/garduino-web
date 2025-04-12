import { usePubSubClient } from "@/features/pubsub";
import { Button } from "@/shared/ui/Button";

export const RebootButton = ({ controllerId }: { controllerId: string }) => {
    const [isConnected, publish] = usePubSubClient({});

    const onClick = () => publish(`controllers/${controllerId}/reboot/sub`);

    return (
        <Button onClick={onClick} disabled={!isConnected}>
            Reboot
        </Button>
    )
}
