import { usePubSubClient } from "@/features/pubsub"
import { Button } from "@/shared/ui/Button"
import { Arrows } from "@/shared/ui/Icon"

export const GetStateButton = ({ controllerId }: { controllerId: string }) => {
    const [isConnected] = usePubSubClient({});

    const onClick = () => {

    };

    return (
        <Button onClick={onClick} disabled={!isConnected}>
            <Arrows />
        </Button>
    )
}
