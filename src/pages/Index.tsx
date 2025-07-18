
import React, { useEffect, useRef, useState } from 'react';
import { BipartiteGraph } from '../components/BipartiteGraph';
import { GraphControls } from '../components/GraphControls';
import { EdgeControls } from '../components/EdgeControls';
import { SaveLoadModal } from '../components/SaveLoadModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export interface NodeGroup {
  name: string;
  count: number;
  color: string;
}

export interface EdgeWeight {
  from: number;
  to: number;
  weight: number;
  evidence: 'Preliminary' | 'Weak' | 'Moderate' | 'Strong';
}

export interface GraphConfig {
  id?: string;
  title: string;
  timestamp?: string;
  groupA: NodeGroup;
  groupB: NodeGroup;
  edges: EdgeWeight[];
  rotation: number;
}

const Index = () => {
  const [groupA, setGroupA] = useState<NodeGroup>({
    name: 'Users',
    count: 3,
    color: '#3b82f6'
  });
  
  const [groupB, setGroupB] = useState<NodeGroup>({
    name: 'Features',
    count: 4,
    color: '#ef4444'
  });
  
  const [edges, setEdges] = useState<EdgeWeight[]>([]);
  const [rotation, setRotation] = useState(0);
  const [graphGenerated, setGraphGenerated] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<GraphConfig[]>([]);

  // Initialize edges when groups change
  useEffect(() => {
    const newEdges: EdgeWeight[] = [];
    for (let i = 0; i < groupA.count; i++) {
      for (let j = 0; j < groupB.count; j++) {
        newEdges.push({
          from: i,
          to: j,
          weight: 1.0,
          evidence: 'Moderate'
        });
      }
    }
    setEdges(newEdges);
  }, [groupA.count, groupB.count]);

  const generateRandomData = () => {
    const sampleNamesA = ['Gene1', 'Gene2', 'Gene3', 'Protein1', 'Enzyme1'];
    const sampleNamesB = ['Disease1', 'Disease2', 'Symptom1', 'Condition1', 'Trait1'];
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    
    setGroupA({
      name: sampleNamesA[Math.floor(Math.random() * sampleNamesA.length)],
      count: Math.floor(Math.random() * 5) + 3,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    
    setGroupB({
      name: sampleNamesB[Math.floor(Math.random() * sampleNamesB.length)],
      count: Math.floor(Math.random() * 5) + 3,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    
    // Random edge weights will be set by the useEffect above
    toast.success('Random data generated!');
  };

  const generateGraph = () => {
    setGraphGenerated(true);
    toast.success('Graph generated successfully!');
  };

  const saveConfiguration = async (title: string) => {
    const config: GraphConfig = {
      id: Date.now().toString(),
      title,
      timestamp: new Date().toISOString(),
      groupA,
      groupB,
      edges,
      rotation
    };
    
    // Simulate API call - in real app, this would be a fetch to your backend
    const saved = [...savedConfigs, config];
    setSavedConfigs(saved);
    localStorage.setItem('bipartite-configs', JSON.stringify(saved));
    toast.success('Configuration saved!');
  };

  const loadConfiguration = (config: GraphConfig) => {
    setGroupA(config.groupA);
    setGroupB(config.groupB);
    setEdges(config.edges);
    setRotation(config.rotation);
    setGraphGenerated(true);
    toast.success('Configuration loaded!');
  };

  // Load saved configurations on mount
  useEffect(() => {
    const saved = localStorage.getItem('bipartite-configs');
    if (saved) {
      setSavedConfigs(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Bipartite Graph Designer
          </h1>
          <p className="text-gray-600">
            Create and customize interactive bipartite network visualizations
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <GraphControls
                groupA={groupA}
                groupB={groupB}
                rotation={rotation}
                onGroupAChange={setGroupA}
                onGroupBChange={setGroupB}
                onRotationChange={setRotation}
              />
              
              <div className="flex gap-2 mt-6">
                <Button onClick={generateGraph} className="flex-1">
                  Generate Graph
                </Button>
                <Button onClick={generateRandomData} variant="outline">
                  Random Data
                </Button>
              </div>
            </Card>

            {graphGenerated && (
              <Card className="p-6">
                <EdgeControls
                  edges={edges}
                  groupA={groupA}
                  groupB={groupB}
                  onEdgesChange={setEdges}
                />
              </Card>
            )}

            <Card className="p-6">
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowSaveModal(true)} 
                  className="w-full"
                  disabled={!graphGenerated}
                >
                  Save/Load Configurations
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Panel - Graph */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[600px]">
              {graphGenerated ? (
                <BipartiteGraph
                  groupA={groupA}
                  groupB={groupB}
                  edges={edges}
                  rotation={rotation}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔗</div>
                    <p className="text-lg">Configure your graph and click "Generate Graph" to begin</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <SaveLoadModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveConfiguration}
        onLoad={loadConfiguration}
        configurations={savedConfigs}
      />
    </div>
  );
};

export default Index;
