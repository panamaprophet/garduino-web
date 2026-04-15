import { usePubSubClient } from "@/shared/pubsub";
import { Button } from "@/shared/ui/Button";

export const RebootButton = ({ controllerId }: { controllerId: string }) => {
    const [isConnected, publish] = usePubSubClient({});

    const onClick = () => {
        const isConfirmed = confirm('Reboot the controller?');

        if (!isConfirmed) {
            return;
        }

        publish(`controllers/${controllerId}/reboot/sub`);
    };

    return (
        <Button width="full" theme="secondary" onClick={onClick} disabled={!isConnected}>
            Reboot
        </Button>
    );
}
