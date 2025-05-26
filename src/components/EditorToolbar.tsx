import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CropIcon,
  ImageIcon,
  SaveIcon,
  UndoIcon,
  RedoIcon,
  Trash2Icon,
  DownloadIcon,
  SlidersIcon,
  WandIcon,
  LayersIcon,
} from "lucide-react";

interface EditorToolbarProps {
  onSave?: () => void;
  onResize?: (width: number, height: number) => void;
  onCrop?: () => void;
  onRemoveBackground?: () => void;
  onFilter?: (filter: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  selectedTool?: string;
  setSelectedTool?: (tool: string) => void;
}

const EditorToolbar = ({
  onSave = () => {},
  onResize = () => {},
  onCrop = () => {},
  onRemoveBackground = () => {},
  onFilter = () => {},
  onUndo = () => {},
  onRedo = () => {},
  onDelete = () => {},
  selectedTool = "",
  setSelectedTool = () => {},
}: EditorToolbarProps) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [filterValue, setFilterValue] = useState("none");
  const [activeTab, setActiveTab] = useState("main");

  const handleDimensionChange = (
    dimension: "width" | "height",
    value: string,
  ) => {
    const numValue = parseInt(value) || 0;
    setDimensions((prev) => ({ ...prev, [dimension]: numValue }));
  };

  const handleResizeApply = () => {
    onResize(dimensions.width, dimensions.height);
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    onFilter(value);
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    setActiveTab(tool);
  };

  return (
    <div className="w-full bg-background border-b flex flex-col">
      {/* Main toolbar */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === "resize" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleToolSelect("resize")}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Resize</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Resize Image</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === "crop" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleToolSelect("crop")}
                >
                  <CropIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Crop</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Crop Image</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    selectedTool === "background" ? "secondary" : "ghost"
                  }
                  size="sm"
                  onClick={() => handleToolSelect("background")}
                >
                  <LayersIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Background</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove Background</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === "filter" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleToolSelect("filter")}
                >
                  <SlidersIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Apply Filters</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === "effects" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleToolSelect("effects")}
                >
                  <WandIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Effects</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Apply Effects</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onUndo}>
                  <UndoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onRedo}>
                  <RedoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-6" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onDelete}>
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <SaveIcon className="h-4 w-4 mr-1" />
                <span>Save</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Save Options</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose how to save your image
                  </p>
                </div>
                <div className="grid gap-2">
                  <Button onClick={onSave}>Update Existing</Button>
                  <Button variant="outline">Save as New</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tool-specific options */}
      {activeTab !== "main" && (
        <div className="p-3 border-t">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsContent value="resize" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={dimensions.width}
                    onChange={(e) =>
                      handleDimensionChange("width", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={dimensions.height}
                    onChange={(e) =>
                      handleDimensionChange("height", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor="maintain-ratio"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Switch id="maintain-ratio" />
                  <span>Maintain aspect ratio</span>
                </Label>
              </div>
              <Button onClick={handleResizeApply}>Apply Resize</Button>
            </TabsContent>

            <TabsContent value="crop" className="space-y-4">
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Free
                  </Button>
                  <Button variant="outline" size="sm">
                    1:1
                  </Button>
                  <Button variant="outline" size="sm">
                    4:3
                  </Button>
                  <Button variant="outline" size="sm">
                    16:9
                  </Button>
                  <Button variant="outline" size="sm">
                    3:2
                  </Button>
                </div>
              </div>
              <Button onClick={onCrop}>Apply Crop</Button>
            </TabsContent>

            <TabsContent value="background" className="space-y-4">
              <div className="space-y-2">
                <Label>Background Removal Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="smart-removal" />
                    <Label htmlFor="smart-removal">
                      Smart subject detection
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="keep-shadows" />
                    <Label htmlFor="keep-shadows">Keep shadows</Label>
                  </div>
                </div>
              </div>
              <Button onClick={onRemoveBackground}>Remove Background</Button>
            </TabsContent>

            <TabsContent value="filter" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filter-select">Filter</Label>
                <Select value={filterValue} onValueChange={handleFilterChange}>
                  <SelectTrigger id="filter-select">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="grayscale">Grayscale</SelectItem>
                    <SelectItem value="sepia">Sepia</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="blur">Blur</SelectItem>
                    <SelectItem value="sharpen">Sharpen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Intensity</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              <div className="space-y-2">
                <Label>Brightness</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label>Contrast</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label>Saturation</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
