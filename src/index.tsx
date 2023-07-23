import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { Analytics, Amplify, PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';

import amplifyConfig from './aws-exports';
import config from './config';


Analytics.disable();
Auth.signOut();

// Amplify.Logger.LOG_LEVEL = 'VERBOSE';

Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: config.region,
    aws_pubsub_endpoint: config.endpoint,
}));

Amplify.configure(amplifyConfig);
PubSub.configure(amplifyConfig);


const container = document.getElementById('app')!;
const root = createRoot(container);

root.render(<App />);
