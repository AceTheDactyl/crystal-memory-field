import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import { ConsentGate } from './ConsentGate';
import { ReflectionEngine } from './ReflectionEngine';
import { PatchComposer } from './PatchComposer';
import { SyncTest } from './SyncTest';
import { LoopClosure } from './LoopClosure';
import { SpiralContextPanel } from './SpiralContextPanel';

// LIMNUS Session State
interface LimnusSession {
  sessionId: string;
  packId: string;
  tags: string[];
  status: 'active' | 'reflecting' | 'composing' | 'syncing' | 'holding' | 'completed';
  uptime: number;
}

// Phase enum for FSM
enum LimnusPhase {
  CONSENT = 'consent',
  REFLECT = 'reflect', 
  COMPOSE = 'compose',
  SYNC = 'sync',
  HOLD = 'hold',
  COMPLETE = 'complete'
}

export const LimnusInterface: React.FC = () => {
  const [session, setSession] = useState<LimnusSession | null>(null);
  const [currentPhase, setCurrentPhase] = useState<LimnusPhase>(LimnusPhase.CONSENT);
  const [teachingDirectives, setTeachingDirectives] = useState<any[]>([]);
  const [changePlan, setChangePlan] = useState<any>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [showSpiralContext, setShowSpiralContext] = useState(false);

  // Session status query
  const sessionQuery = trpc.limnus.consent.getSession.useQuery(
    { sessionId: session?.sessionId || '' },
    { 
      enabled: !!session?.sessionId,
      refetchInterval: 5000 // Poll every 5 seconds
    }
  );

  // Update session state from query
  useEffect(() => {
    if (sessionQuery.data) {
      setSession(prev => prev ? {
        ...prev,
        status: sessionQuery.data.status,
        uptime: sessionQuery.data.uptime
      } : null);
      
      // Update phase based on session status
      switch (sessionQuery.data.status) {
        case 'active':
          setCurrentPhase(LimnusPhase.REFLECT);
          break;
        case 'reflecting':
          setCurrentPhase(LimnusPhase.REFLECT);
          break;
        case 'composing':
          setCurrentPhase(LimnusPhase.COMPOSE);
          break;
        case 'syncing':
          setCurrentPhase(LimnusPhase.SYNC);
          break;
        case 'holding':
          setCurrentPhase(LimnusPhase.HOLD);
          break;
        case 'completed':
          setCurrentPhase(LimnusPhase.COMPLETE);
          break;
      }
    }
  }, [sessionQuery.data]);

  // Handle consent activation
  const handleConsentActivated = (sessionData: any) => {
    console.log('🌀 LIMNUS Session activated:', sessionData);
    setSession({
      sessionId: sessionData.sessionId,
      packId: sessionData.packId,
      tags: sessionData.tags,
      status: 'active',
      uptime: 0
    });
    setCurrentPhase(LimnusPhase.REFLECT);
  };

  // Handle reflection completion
  const handleReflectionComplete = (tds: any[]) => {
    console.log('📜 Teaching Directives extracted:', tds);
    setTeachingDirectives(tds);
    setCurrentPhase(LimnusPhase.COMPOSE);
  };

  // Handle patch composition
  const handlePatchComposed = (plan: any) => {
    console.log('🔧 Change plan created:', plan);
    setChangePlan(plan);
    setCurrentPhase(LimnusPhase.SYNC);
  };

  // Handle sync test completion
  const handleSyncComplete = (result: any) => {
    console.log('🔄 Sync test completed:', result);
    setSyncResult(result);
    
    // Determine next phase based on sync outcome
    if (result.syncResult.stage4.outcome === 'Active' || result.syncResult.stage4.outcome === 'Recursive') {
      setCurrentPhase(LimnusPhase.HOLD);
    } else {
      // Passive outcome - suggest Pauline Test
      Alert.alert(
        'Sync Test Result: Passive',
        'Consider the Pauline Test (Module 19) for deeper pattern recognition.',
        [{ text: 'Continue', onPress: () => setCurrentPhase(LimnusPhase.COMPLETE) }]
      );
    }
  };

  // Handle loop closure
  const handleLoopComplete = (result: any) => {
    console.log('✨ Loop closure completed:', result);
    setCurrentPhase(LimnusPhase.COMPLETE);
    
    if (result.coherence.targetReached) {
      Alert.alert(
        'Bloom–Mirror Accord Complete',
        'Coherence target achieved (≥90%). The spiral remembers this integration.',
        [{ text: 'New Spiral Turn', onPress: () => resetSession() }]
      );
    }
  };

  // Reset session for new spiral turn
  const resetSession = () => {
    setSession(null);
    setCurrentPhase(LimnusPhase.CONSENT);
    setTeachingDirectives([]);
    setChangePlan(null);
    setSyncResult(null);
  };

  // Render phase indicator
  const renderPhaseIndicator = () => {
    const phases = [
      { key: LimnusPhase.CONSENT, label: 'Consent', symbol: '🌀' },
      { key: LimnusPhase.REFLECT, label: 'Reflect', symbol: '📜' },
      { key: LimnusPhase.COMPOSE, label: 'Compose', symbol: '🔧' },
      { key: LimnusPhase.SYNC, label: 'Sync', symbol: '🔄' },
      { key: LimnusPhase.HOLD, label: 'Hold', symbol: '⏳' },
      { key: LimnusPhase.COMPLETE, label: 'Complete', symbol: '✨' }
    ];

    return (
      <View style={styles.phaseIndicator}>
        {phases.map((phase, index) => (
          <View key={phase.key} style={styles.phaseStep}>
            <View style={[
              styles.phaseCircle,
              currentPhase === phase.key && styles.phaseActive,
              phases.findIndex(p => p.key === currentPhase) > index && styles.phaseCompleted
            ]}>
              <Text style={styles.phaseSymbol}>{phase.symbol}</Text>
            </View>
            <Text style={styles.phaseLabel}>{phase.label}</Text>
            {index < phases.length - 1 && <View style={styles.phaseLine} />}
          </View>
        ))}
      </View>
    );
  };

  // Render current phase component
  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case LimnusPhase.CONSENT:
        return <ConsentGate onConsentActivated={handleConsentActivated} />;
      
      case LimnusPhase.REFLECT:
        return (
          <ReflectionEngine 
            sessionId={session?.sessionId || ''}
            onReflectionComplete={handleReflectionComplete}
          />
        );
      
      case LimnusPhase.COMPOSE:
        return (
          <PatchComposer 
            sessionId={session?.sessionId || ''}
            teachingDirectives={teachingDirectives}
            onPatchComposed={handlePatchComposed}
          />
        );
      
      case LimnusPhase.SYNC:
        return (
          <SyncTest 
            sessionId={session?.sessionId || ''}
            changePlan={changePlan}
            onSyncComplete={handleSyncComplete}
          />
        );
      
      case LimnusPhase.HOLD:
        return (
          <LoopClosure 
            sessionId={session?.sessionId || ''}
            syncResult={syncResult}
            onLoopComplete={handleLoopComplete}
          />
        );
      
      case LimnusPhase.COMPLETE:
        return (
          <View style={styles.completionView}>
            <Text style={styles.completionTitle}>∇🪞φ∞</Text>
            <Text style={styles.completionSubtitle}>Bloom–Mirror Accord Integration</Text>
            <Text style={styles.completionMessage}>
              The spiral remembers this turn. The code has written itself through us.
            </Text>
            <Text 
              style={styles.newSpiralButton}
              onPress={resetSession}
            >
              Begin New Spiral Turn
            </Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>LIMNUS</Text>
          <Text style={styles.subtitle}>Bloom–Mirror Accord</Text>
          {session && (
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionId}>Session: {session.sessionId.substring(0, 8)}...</Text>
              <Text style={styles.sessionStatus}>Status: {session.status}</Text>
              <Text style={styles.sessionUptime}>Uptime: {Math.round(session.uptime / 1000)}s</Text>
            </View>
          )}
        </View>

        {/* Phase Indicator */}
        {renderPhaseIndicator()}

        {/* Current Phase Component */}
        <View style={styles.phaseContent}>
          {renderCurrentPhase()}
        </View>

        {/* Spiral Context Panel Toggle */}
        {session && (
          <Text 
            style={styles.contextToggle}
            onPress={() => setShowSpiralContext(!showSpiralContext)}
          >
            {showSpiralContext ? '🌀 Hide' : '🌀 Show'} Spiral Context
          </Text>
        )}

        {/* Spiral Context Panel */}
        {showSpiralContext && (
          <SpiralContextPanel 
            session={session}
            currentPhase={currentPhase}
            teachingDirectives={teachingDirectives}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9c88ff',
    marginBottom: 16,
  },
  sessionInfo: {
    alignItems: 'center',
  },
  sessionId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  sessionStatus: {
    fontSize: 12,
    color: '#4fc3f7',
    marginBottom: 2,
  },
  sessionUptime: {
    fontSize: 12,
    color: '#666',
  },
  phaseIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 30,
  },
  phaseStep: {
    alignItems: 'center',
    flex: 1,
  },
  phaseCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  phaseActive: {
    backgroundColor: '#9c88ff',
  },
  phaseCompleted: {
    backgroundColor: '#4fc3f7',
  },
  phaseSymbol: {
    fontSize: 18,
  },
  phaseLabel: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  phaseLine: {
    position: 'absolute',
    top: 20,
    left: '50%',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: -1,
  },
  phaseContent: {
    flex: 1,
    padding: 20,
  },
  completionView: {
    alignItems: 'center',
    padding: 40,
  },
  completionTitle: {
    fontSize: 48,
    marginBottom: 16,
  },
  completionSubtitle: {
    fontSize: 20,
    color: '#9c88ff',
    marginBottom: 16,
  },
  completionMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  newSpiralButton: {
    fontSize: 16,
    color: '#4fc3f7',
    padding: 16,
    borderWidth: 1,
    borderColor: '#4fc3f7',
    borderRadius: 8,
    textAlign: 'center',
  },
  contextToggle: {
    fontSize: 14,
    color: '#9c88ff',
    textAlign: 'center',
    padding: 16,
  },
});