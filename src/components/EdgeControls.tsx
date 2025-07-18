
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NodeGroup, EdgeWeight } from '../pages/Index';
import { toast } from 'sonner';

interface EdgeControlsProps {
  edges: EdgeWeight[];
  groupA: NodeGroup;
  groupB: NodeGroup;
  onEdgesChange: (edges: EdgeWeight[]) => void;
}

export const EdgeControls: React.FC<EdgeControlsProps> = ({
  edges,
  groupA,
  groupB,
  onEdgesChange,
}) => {
  const updateEdge = (index: number, updates: Partial<EdgeWeight>) => {
    const newEdges = [...edges];
    newEdges[index] = { ...newEdges[index], ...updates };
    onEdgesChange(newEdges);
  };

  const bulkSetEvidence = (evidence: EdgeWeight['evidence']) => {
    const newEdges = edges.map(edge => ({ ...edge, evidence }));
    onEdgesChange(newEdges);
    toast.success(`All edges set to ${evidence}`);
  };

  const randomizeWeights = () => {
    const newEdges = edges.map(edge => ({
      ...edge,
      weight: Math.round((Math.random() * 4.5 + 0.5) * 10) / 10
    }));
    onEdgesChange(newEdges);
    toast.success('Edge weights randomized');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Edge Controls</h3>
        <span className="text-sm text-gray-600">{edges.length} connections</span>
      </div>

      {/* Bulk Actions */}
      <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
        <Label className="text-sm font-medium">Bulk Actions</Label>
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => bulkSetEvidence('Strong')}
          >
            All Strong
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => bulkSetEvidence('Moderate')}
          >
            All Moderate
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => bulkSetEvidence('Weak')}
          >
            All Weak
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={randomizeWeights}
          >
            Random Weights
          </Button>
        </div>
      </div>

      {/* Individual Edge Controls */}
      <div className="max-h-96 overflow-y-auto space-y-3">
        {edges.map((edge, index) => (
          <div key={`${edge.from}-${edge.to}`} className="p-3 border rounded-lg bg-white">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {groupA.name} {edge.from + 1} → {groupB.name} {edge.to + 1}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Weight: {edge.weight}</Label>
                <Slider
                  min={0.5}
                  max={5.0}
                  step={0.1}
                  value={[edge.weight]}
                  onValueChange={([value]) => updateEdge(index, { weight: value })}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Evidence</Label>
                <Select
                  value={edge.evidence}
                  onValueChange={(value: EdgeWeight['evidence']) => 
                    updateEdge(index, { evidence: value })
                  }
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preliminary">Preliminary</SelectItem>
                    <SelectItem value="Weak">Weak</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Strong">Strong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
