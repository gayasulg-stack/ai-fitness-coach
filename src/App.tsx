import React from 'react';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Navbar } from './components/Navbar';
import { DashboardScreen } from './screens/DashboardScreen';
import { WorkoutScreen } from './screens/WorkoutScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { AICoachScreen } from './screens/AICoachScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './screens/SettingsModal';
import { ExerciseDetailModal } from './screens/ExerciseDetailModal';
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen';
import { WorkoutCompleteScreen } from './screens/WorkoutCompleteScreen';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ExerciseSwapModal } from './components/ExerciseSwapModal';
import { AIFormVisionModal } from './components/AIFormVisionModal';
import { AIMealScannerModal } from './components/AIMealScannerModal';
import { AIDayTuneModal } from './components/AIDayTuneModal';
import { LiveVoiceCoachModal } from './components/LiveVoiceCoachModal';
import { VeoVideoGeneratorModal } from './components/VeoVideoGeneratorModal';

const MainLayout: React.FC = () => {
  const { 
    activeScreen, 
    activeSession, 
    selectedExerciseDetail, 
    setSelectedExerciseDetail,
    lastCompletedWorkout,
    startWorkout,
    isFormVisionOpen,
    targetFormExercise,
    closeFormVisionModal,
    isMealScannerOpen,
    closeMealScannerModal,
    isDayTuneOpen,
    closeDayTuneModal,
    isVoiceCoachOpen,
    closeVoiceCoachModal,
    isVeoModalOpen,
    closeVeoModal
  } = useFitness();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased selection:bg-lime-400 selection:text-neutral-950 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {activeScreen === 'dashboard' && <DashboardScreen />}
          {activeScreen === 'workout' && <WorkoutScreen />}
          {activeScreen === 'progress' && <ProgressScreen />}
          {activeScreen === 'ai-coach' && <AICoachScreen />}
          {activeScreen === 'profile' && <ProfileScreen />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Fullscreen Overlays & Modals */}
      <OnboardingModal />
      <SettingsModal />

      {/* Exercise Detail Modal */}
      {selectedExerciseDetail && (
        <ExerciseDetailModal
          exercise={selectedExerciseDetail}
          onClose={() => setSelectedExerciseDetail(null)}
          onStartExercise={() => {
            setSelectedExerciseDetail(null);
            startWorkout();
          }}
        />
      )}

      {/* Exercise Swap Modal */}
      <ExerciseSwapModal />

      {/* Interactive AI Tools Modals */}
      <AIFormVisionModal
        isOpen={isFormVisionOpen}
        onClose={closeFormVisionModal}
        initialExercise={targetFormExercise}
      />

      <AIMealScannerModal
        isOpen={isMealScannerOpen}
        onClose={closeMealScannerModal}
      />

      <AIDayTuneModal
        isOpen={isDayTuneOpen}
        onClose={closeDayTuneModal}
      />

      <LiveVoiceCoachModal
        isOpen={isVoiceCoachOpen}
        onClose={closeVoiceCoachModal}
      />

      <VeoVideoGeneratorModal
        isOpen={isVeoModalOpen}
        onClose={closeVeoModal}
      />

      {/* Active Workout Tracking Fullscreen Mode */}
      {activeSession && <ActiveWorkoutScreen />}

      {/* Workout Complete Celebration Screen */}
      {lastCompletedWorkout && <WorkoutCompleteScreen />}

      {/* Offline Status & Local Cache Banner */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <FitnessProvider>
      <MainLayout />
    </FitnessProvider>
  );
}
