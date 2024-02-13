import { createRoot } from 'react-dom/client';
import { Analytics, Amplify, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { Home } from '@/components/Home';
import amplifyConfig from '@/aws-exports';
import config from '@/config';


Analytics.disable();

// Amplify.Logger.LOG_LEVEL = 'VERBOSE';

Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: config.region,
    aws_pubsub_endpoint: config.endpoint,
}));

Amplify.configure(amplifyConfig);
PubSub.configure(amplifyConfig);

const container = document.getElementById('app')!;
const root = createRoot(container);

root.render(<Home />);
