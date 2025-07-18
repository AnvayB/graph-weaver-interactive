
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { NodeGroup } from '../pages/Index';

interface GraphControlsProps {
  groupA: NodeGroup;
  groupB: NodeGroup;
  rotation: number;
  onGroupAChange: (group: NodeGroup) => void;
  onGroupBChange: (group: NodeGroup) => void;
  onRotationChange: (rotation: number) => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  groupA,
  groupB,
  rotation,
  onGroupAChange,
  onGroupBChange,
  onRotationChange,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Graph Configuration</h3>
      
      {/* Group A Controls */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800">Group A</h4>
        
        <div className="space-y-2">
          <Label htmlFor="groupA-name">Group Name</Label>
          <Input
            id="groupA-name"
            value={groupA.name}
            onChange={(e) => onGroupAChange({ ...groupA, name: e.target.value })}
            placeholder="e.g., Users, Genes"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="groupA-count">Node Count: {groupA.count}</Label>
          <Slider
            id="groupA-count"
            min={1}
            max={10}
            step={1}
            value={[groupA.count]}
            onValueChange={([value]) => onGroupAChange({ ...groupA, count: value })}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="groupA-color">Color</Label>
          <div className="flex items-center gap-2">
            <input
              id="groupA-color"
              type="color"
              value={groupA.color}
              onChange={(e) => onGroupAChange({ ...groupA, color: e.target.value })}
              className="w-12 h-8 rounded border cursor-pointer"
            />
            <span className="text-sm text-gray-600">{groupA.color}</span>
          </div>
        </div>
      </div>

      {/* Group B Controls */}
      <div className="space-y-4 p-4 bg-red-50 rounded-lg">
        <h4 className="font-medium text-red-800">Group B</h4>
        
        <div className="space-y-2">
          <Label htmlFor="groupB-name">Group Name</Label>
          <Input
            id="groupB-name"
            value={groupB.name}
            onChange={(e) => onGroupBChange({ ...groupB, name: e.target.value })}
            placeholder="e.g., Features, Diseases"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="groupB-count">Node Count: {groupB.count}</Label>
          <Slider
            id="groupB-count"
            min={1}
            max={10}
            step={1}
            value={[groupB.count]}
            onValueChange={([value]) => onGroupBChange({ ...groupB, count: value })}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="groupB-color">Color</Label>
          <div className="flex items-center gap-2">
            <input
              id="groupB-color"
              type="color"
              value={groupB.color}
              onChange={(e) => onGroupBChange({ ...groupB, color: e.target.value })}
              className="w-12 h-8 rounded border cursor-pointer"
            />
            <span className="text-sm text-gray-600">{groupB.color}</span>
          </div>
        </div>
      </div>

      {/* Rotation Control */}
      <div className="space-y-2">
        <Label htmlFor="rotation">Graph Rotation: {rotation}°</Label>
        <Slider
          id="rotation"
          min={-180}
          max={180}
          step={5}
          value={[rotation]}
          onValueChange={([value]) => onRotationChange(value)}
          className="w-full"
        />
      </div>
    </div>
  );
};
