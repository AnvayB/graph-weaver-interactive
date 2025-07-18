
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraphConfig } from '../pages/Index';
import { Trash2, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  onLoad: (config: GraphConfig) => void;
  configurations: GraphConfig[];
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onLoad,
  configurations,
}) => {
  const [saveTitle, setSaveTitle] = useState('');

  const handleSave = () => {
    if (!saveTitle.trim()) {
      toast.error('Please enter a title for your configuration');
      return;
    }
    onSave(saveTitle.trim());
    setSaveTitle('');
    onClose();
  };

  const handleLoad = (config: GraphConfig) => {
    onLoad(config);
    onClose();
  };

  const handleDelete = (configId: string) => {
    // In a real app, this would call an API to delete the configuration
    const updated = configurations.filter(c => c.id !== configId);
    localStorage.setItem('bipartite-configs', JSON.stringify(updated));
    toast.success('Configuration deleted');
    // You might want to trigger a refresh of the configurations list here
  };

  const exportConfiguration = (config: GraphConfig) => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bipartite-graph-${config.title.replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Configuration exported');
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string) as GraphConfig;
        onLoad(config);
        onClose();
        toast.success('Configuration imported');
      } catch (error) {
        toast.error('Invalid configuration file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Save & Load Configurations</DialogTitle>
          <DialogDescription>
            Manage your bipartite graph configurations
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="save" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="save">Save</TabsTrigger>
            <TabsTrigger value="load">Load</TabsTrigger>
            <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          </TabsList>

          <TabsContent value="save" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="save-title">Configuration Title</Label>
              <Input
                id="save-title"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="e.g., Gene-Disease Network v1"
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Current Configuration
            </Button>
          </TabsContent>

          <TabsContent value="load" className="space-y-4">
            {configurations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No saved configurations found
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {configurations.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{config.title}</h4>
                      <p className="text-sm text-gray-500">
                        {config.timestamp ? new Date(config.timestamp).toLocaleDateString() : 'Unknown date'} • 
                        {config.groupA.name} ({config.groupA.count}) ↔ {config.groupB.name} ({config.groupB.count})
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportConfiguration(config)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(config.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleLoad(config)}
                      >
                        Load
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="import-export" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Import Configuration</h4>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={importConfiguration}
                    className="flex-1"
                  />
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Select a JSON file to import a saved configuration
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  You can also export individual configurations from the Load tab using the download button.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
