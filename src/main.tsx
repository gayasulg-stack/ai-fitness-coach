import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Workbox Service Worker immediately for offline capability
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New FitAI Coach update available.');
  },
  onOfflineReady() {
    console.log('FitAI Coach is ready for offline workouts.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);

