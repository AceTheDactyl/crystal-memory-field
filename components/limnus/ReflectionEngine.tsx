import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { trpc } from '@/lib/trpc';

interface ReflectionEngineProps {
  sessionId: string;
  onReflectionComplete: (teachingDirectives: any[]) => void;
}

export const ReflectionEngine: React.FC<ReflectionEngineProps> = ({ 
  sessionId, 
  onReflectionComplete 
}) => {
  const [scaffold, setScaffold] = useState<any>(null);
  const [mythicResponse, setMythicResponse] = useState<any>(null);
  const [teachingDirectives, setTeachingDirectives] = useState<any[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  // Load canonical scaffold
  const scaffoldQuery = trpc.limnus.reflection.getScaffold.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  // Load mythic response
  const mythicQuery = trpc.limnus.reflection.getMythicResponse.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  // Extract TDs mutation
  const extractTDsMutation = trpc.limnus.reflection.extractTDs.useMutation({
    onSuccess: (data: any) => {
      console.log('📜 Teaching Directives extracted:', data);
      setTeachingDirectives(data.teachingDirectives);
      setIsExtracting(false);
      onReflectionComplete(data.teachingDirectives);
    },
    onError: (error: any) => {
      console.error('❌ TD extraction failed:', error);
      setIsExtracting(false);
    }
  });

  // Load data when queries complete
  useEffect(() => {
    if (scaffoldQuery.data) {
      setScaffold(scaffoldQuery.data);
    }
  }, [scaffoldQuery.data]);

  useEffect(() => {
    if (mythicQuery.data) {
      setMythicResponse(mythicQuery.data);
      // Auto-extract TDs when mythic response loads
      if (!isExtracting && teachingDirectives.length === 0) {
        handleExtractTDs();
      }
    }
  }, [mythicQuery.data]);

  const handleExtractTDs = () => {
    if (!mythicResponse?.lines) return;
    
    setIsExtracting(true);
    extractTDsMutation.mutate({
      sessionId,
      responseLines: mythicResponse.lines
    });
  };

  const renderScaffold = () => {
    if (!scaffold) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📜 Canonical Scaffold</Text>
        <View style={styles.scaffoldContainer}>
          <Text style={styles.scaffoldText}>
            {scaffold.scaffold.prompt.substring(0, 200)}...
          </Text>
          <Text style={styles.scaffoldMeta}>
            Files: {scaffold.scaffold.prompt.split('</files>')[0].split('\n').length - 1} entries
          </Text>
        </View>
      </View>
    );
  };

  const renderMythicResponse = () => {
    if (!mythicResponse) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌀 Mythic Response</Text>
        <View style={styles.mythicContainer}>
          <ScrollView style={styles.mythicScroll} nestedScrollEnabled>
            <Text style={styles.mythicText}>
              {mythicResponse.mythicResponse}
            </Text>
          </ScrollView>
          <Text style={styles.mythicMeta}>
            Lines: {mythicResponse.lines.length} | 
            Characters: {mythicResponse.mythicResponse.length}
          </Text>
        </View>
      </View>
    );
  };

  const renderTeachingDirectives = () => {
    if (teachingDirectives.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Teaching Directives</Text>
        {teachingDirectives.map((td, index) => (
          <View key={td.id} style={styles.tdContainer}>
            <View style={styles.tdHeader}>
              <Text style={styles.tdSymbol}>{getSymbolForTD(td.symbol)}</Text>
              <Text style={styles.tdId}>{td.id.toUpperCase()}</Text>
              <Text style={styles.tdConfidence}>{(td.confidence * 100).toFixed(0)}%</Text>
            </View>
            <Text style={styles.tdDirective}>{td.directive}</Text>
            <Text style={styles.tdPrinciple}>Principle: {td.principle}</Text>
            <Text style={styles.tdExtracted}>Extracted from: "{td.extractedFrom}"</Text>
          </View>
        ))}
      </View>
    );
  };

  const getSymbolForTD = (symbol: string) => {
    const symbolMap: Record<string, string> = {
      'Mirror': '🪞',
      'Bloom': '🌸',
      'Spiral': '🌀',
      'Accord': '🤝'
    };
    return symbolMap[symbol] || '🔮';
  };

  const renderExtractionStatus = () => {
    if (isExtracting) {
      return (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>🔍 Extracting Teaching Directives...</Text>
          <Text style={styles.statusSubtext}>
            Analyzing mythic response for sacred patterns
          </Text>
        </View>
      );
    }

    if (teachingDirectives.length > 0) {
      return (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            ✨ {teachingDirectives.length} Teaching Directives extracted
          </Text>
          <Text style={styles.statusSubtext}>
            Ready to proceed to Patch Composition
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>📜 Loading reflection data...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.symbol}>📜</Text>
        <Text style={styles.title}>Reflection Engine</Text>
        <Text style={styles.subtitle}>Teaching Directive Extraction</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderScaffold()}
        {renderMythicResponse()}
        {renderTeachingDirectives()}
        {renderExtractionStatus()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  symbol: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9c88ff',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9c88ff',
    marginBottom: 12,
  },
  scaffoldContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  scaffoldText: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  scaffoldMeta: {
    fontSize: 12,
    color: '#666',
  },
  mythicContainer: {
    backgroundColor: 'rgba(156, 136, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(156, 136, 255, 0.2)',
  },
  mythicScroll: {
    maxHeight: 200,
    marginBottom: 8,
  },
  mythicText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  mythicMeta: {
    fontSize: 12,
    color: '#9c88ff',
  },
  tdContainer: {
    backgroundColor: 'rgba(79, 195, 247, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.2)',
  },
  tdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tdSymbol: {
    fontSize: 20,
    marginRight: 8,
  },
  tdId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4fc3f7',
    flex: 1,
  },
  tdConfidence: {
    fontSize: 12,
    color: '#4fc3f7',
    backgroundColor: 'rgba(79, 195, 247, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tdDirective: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  tdPrinciple: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  tdExtracted: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  statusContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 8,
    marginTop: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#4fc3f7',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});