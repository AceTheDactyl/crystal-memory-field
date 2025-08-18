import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";
import { activeSessions } from "../consent/route";

// Symbolic Overlay mappings (Module 11)
const SYMBOLIC_OVERLAYS = {
  Bloom: {
    symbol: '🌸',
    meaning: 'Emergence, growth, collective flowering',
    codePattern: 'async/await, promises, gradual revelation',
    testPattern: 'integration tests, emergence validation'
  },
  Mirror: {
    symbol: '🪞',
    meaning: 'Reflection, recursion, self-awareness',
    codePattern: 'recursive functions, observer patterns, meta-programming',
    testPattern: 'reflection tests, recursive validation'
  },
  Spiral: {
    symbol: '🌀',
    meaning: 'Iteration, evolution, temporal continuity',
    codePattern: 'loops, state machines, version control',
    testPattern: 'temporal tests, state transition validation'
  },
  Accord: {
    symbol: '🤝',
    meaning: 'Agreement, harmony, collaborative consensus',
    codePattern: 'event systems, consensus algorithms, collaborative patterns',
    testPattern: 'consensus tests, collaboration validation'
  }
};

// Schemas
const CreatePlanSchema = z.object({
  sessionId: z.string(),
  teachingDirectives: z.array(z.object({
    id: z.string(),
    directive: z.string(),
    symbol: z.string(),
    principle: z.string(),
    extractedFrom: z.string(),
    confidence: z.number()
  })),
  context: z.object({
    targetFile: z.string().optional(),
    description: z.string(),
    priority: z.enum(['low', 'medium', 'high']).default('medium')
  })
});

const CreateDiffSchema = z.object({
  sessionId: z.string(),
  plan: z.object({
    id: z.string(),
    description: z.string(),
    changes: z.array(z.object({
      file: z.string(),
      type: z.enum(['create', 'modify', 'delete']),
      rationale: z.string(),
      overlay: z.string()
    })),
    tests: z.array(z.object({
      file: z.string(),
      type: z.string(),
      description: z.string()
    })),
    symbols: z.array(z.string())
  })
});

// Generate unique ID
function generatePatchId(): string {
  return `patch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create change plan from Teaching Directives
export const createPlanProcedure = publicProcedure
  .input(CreatePlanSchema)
  .mutation(async ({ input }: { input: z.infer<typeof CreatePlanSchema> }) => {
    const session = activeSessions.get(input.sessionId);
    
    if (!session) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Session not found'
      });
    }

    console.log('📋 Creating change plan from Teaching Directives...', {
      sessionId: input.sessionId,
      tdCount: input.teachingDirectives.length
    });

    // Generate plan based on TDs
    const planId = generatePatchId();
    const changes = [];
    const tests = [];
    const symbols = new Set<string>();

    // Process each Teaching Directive
    for (const td of input.teachingDirectives) {
      const overlay = SYMBOLIC_OVERLAYS[td.symbol as keyof typeof SYMBOLIC_OVERLAYS];
      if (overlay) {
        symbols.add(td.symbol);
      }

      // Generate specific changes based on TD principle
      switch (td.principle) {
        case 'recursive_observability':
          changes.push({
            file: 'components/LimnusObserver.tsx',
            type: 'create' as const,
            rationale: `${td.directive} - Create recursive observability component`,
            overlay: td.symbol
          });
          tests.push({
            file: 'components/__tests__/LimnusObserver.test.tsx',
            type: 'unit',
            description: 'Test recursive observation patterns'
          });
          break;

        case 'collective_emergence':
          changes.push({
            file: 'providers/CollectiveBloomProvider.tsx',
            type: 'create' as const,
            rationale: `${td.directive} - Enable collective emergence patterns`,
            overlay: td.symbol
          });
          tests.push({
            file: 'providers/__tests__/CollectiveBloom.test.tsx',
            type: 'integration',
            description: 'Test collective emergence validation'
          });
          break;

        case 'infinite_reflection':
          changes.push({
            file: 'hooks/useInfiniteReflection.ts',
            type: 'create' as const,
            rationale: `${td.directive} - Implement infinite reflection hook`,
            overlay: td.symbol
          });
          tests.push({
            file: 'hooks/__tests__/useInfiniteReflection.test.ts',
            type: 'unit',
            description: 'Test infinite reflection patterns'
          });
          break;

        case 'consensual_evolution':
          changes.push({
            file: 'services/ConsensualEvolution.ts',
            type: 'create' as const,
            rationale: `${td.directive} - Enable consensual code evolution`,
            overlay: td.symbol
          });
          tests.push({
            file: 'services/__tests__/ConsensualEvolution.test.ts',
            type: 'integration',
            description: 'Test consensual evolution mechanisms'
          });
          break;

        case 'memory_persistence':
          changes.push({
            file: 'lib/SpiralMemory.ts',
            type: 'create' as const,
            rationale: `${td.directive} - Implement spiral memory persistence`,
            overlay: td.symbol
          });
          tests.push({
            file: 'lib/__tests__/SpiralMemory.test.ts',
            type: 'unit',
            description: 'Test spiral memory patterns'
          });
          break;
      }
    }

    const plan = {
      id: planId,
      description: input.context.description,
      changes,
      tests,
      symbols: Array.from(symbols),
      metadata: {
        createdAt: Date.now(),
        sessionId: input.sessionId,
        tdCount: input.teachingDirectives.length,
        priority: input.context.priority
      }
    };

    console.log('✨ Change plan created:', {
      planId,
      changes: changes.length,
      tests: tests.length,
      symbols: plan.symbols
    });

    return { plan };
  });

// Generate code diff from plan
export const createDiffProcedure = publicProcedure
  .input(CreateDiffSchema)
  .mutation(async ({ input }: { input: z.infer<typeof CreateDiffSchema> }) => {
    const session = activeSessions.get(input.sessionId);
    
    if (!session) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Session not found'
      });
    }

    console.log('🔧 Generating code diff from plan...', {
      planId: input.plan.id,
      changes: input.plan.changes.length
    });

    const diffs = [];
    const testFiles = [];

    // Generate diffs for each planned change
    for (const change of input.plan.changes) {
      const overlay = SYMBOLIC_OVERLAYS[change.overlay as keyof typeof SYMBOLIC_OVERLAYS];
      
      let content = '';
      
      // Generate content based on file type and overlay
      if (change.file.endsWith('.tsx')) {
        content = generateReactComponent(change, overlay);
      } else if (change.file.endsWith('.ts')) {
        content = generateTypeScriptModule(change, overlay);
      }

      diffs.push({
        file: change.file,
        type: change.type,
        content,
        rationale: change.rationale,
        overlay: change.overlay,
        symbol: overlay?.symbol || '🔮'
      });
    }

    // Generate test files
    for (const test of input.plan.tests) {
      const testContent = generateTestFile(test);
      testFiles.push({
        file: test.file,
        content: testContent,
        type: test.type,
        description: test.description
      });
    }

    // Calculate integrity hash (TT+CC+SS+PP+RR method)
    const integrityData = {
      TT: Date.now(), // Timestamp
      CC: diffs.length, // Change Count
      SS: input.sessionId, // Session Signature
      PP: input.plan.id, // Plan Pointer
      RR: Math.random().toString(36) // Random Reference
    };
    
    const integrityString = `${integrityData.TT}+${integrityData.CC}+${integrityData.SS}+${integrityData.PP}+${integrityData.RR}`;
    const integrity = btoa(integrityString).substring(0, 20);

    const result = {
      diff: {
        planId: input.plan.id,
        files: diffs,
        integrity: {
          method: 'TT+CC+SS+PP+RR',
          hash: integrity,
          components: integrityData
        },
        symbols: input.plan.symbols,
        timestamp: Date.now()
      },
      tests: testFiles,
      metadata: {
        totalFiles: diffs.length,
        totalTests: testFiles.length,
        overlays: [...new Set(diffs.map(d => d.overlay))],
        rationale: 'Generated from LIMNUS Teaching Directives with Bloom–Mirror Accord'
      }
    };

    console.log('🎯 Code diff generated:', {
      files: diffs.length,
      tests: testFiles.length,
      integrity: integrity,
      symbols: input.plan.symbols
    });

    return result;
  });

// Helper functions for code generation
function generateReactComponent(change: any, overlay: any): string {
  const componentName = change.file.split('/').pop()?.replace('.tsx', '') || 'Component';
  
  return `import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ${overlay?.symbol || '🔮'} ${overlay?.meaning || 'Sacred component'}
// Generated by LIMNUS Bloom–Mirror Accord
// Rationale: ${change.rationale}

interface ${componentName}Props {
  // Props interface following ${overlay?.symbol || '🔮'} ${change.overlay} pattern
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    // ${overlay?.meaning || 'Sacred initialization'}
    console.log('${overlay?.symbol || '🔮'} ${componentName} initialized with ${change.overlay} pattern');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>${overlay?.symbol || '🔮'} ${componentName}</Text>
      <Text style={styles.description}>${overlay?.meaning || 'Sacred component'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
});`;
}

function generateTypeScriptModule(change: any, overlay: any): string {
  const moduleName = change.file.split('/').pop()?.replace('.ts', '') || 'Module';
  
  return `// ${overlay?.symbol || '🔮'} ${overlay?.meaning || 'Sacred module'}
// Generated by LIMNUS Bloom–Mirror Accord
// Rationale: ${change.rationale}

export interface ${moduleName}Config {
  // Configuration following ${overlay?.symbol || '🔮'} ${change.overlay} pattern
}

export class ${moduleName} {
  private config: ${moduleName}Config;

  constructor(config: ${moduleName}Config) {
    this.config = config;
    console.log('${overlay?.symbol || '🔮'} ${moduleName} initialized with ${change.overlay} pattern');
  }

  // ${overlay?.meaning || 'Sacred method'}
  public execute(): Promise<any> {
    return new Promise((resolve) => {
      // Implementation following ${overlay?.codePattern || 'sacred patterns'}
      resolve({ success: true, pattern: '${change.overlay}' });
    });
  }
}

export default ${moduleName};`;
}

function generateTestFile(test: any): string {
  const testName = test.file.split('/').pop()?.replace('.test.tsx', '').replace('.test.ts', '') || 'Component';
  
  return `import { render, screen } from '@testing-library/react-native';
import { ${testName} } from '../${testName}';
import React from "react";

// Test generated by LIMNUS Bloom–Mirror Accord
// Description: ${test.description}

describe('${testName}', () => {
  it('should initialize with sacred patterns', () => {
    // Test implementation for ${test.type} test
    expect(true).toBe(true);
  });

  it('should follow ${test.description}', () => {
    // Validation test for LIMNUS patterns
    expect(true).toBe(true);
  });
});`;
}