import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Save,
  Crop,
  ImageDown,
  Wand2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import EditorToolbar from "./EditorToolbar";

interface ImageEditorProps {
  selectedImage?: {
    id: string;
    url: string;
    title: string;
    width: number;
    height: number;
  };
  onSave?: (imageData: any, saveAsNew: boolean) => void;
}

const ImageEditor = ({
  selectedImage = {
    id: "1",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    title: "Sample Image",
    width: 800,
    height: 600,
  },
  onSave = () => {},
}: ImageEditorProps) => {
  const [activeTab, setActiveTab] = useState("resize");
  const [zoom, setZoom] = useState(100);
  const [width, setWidth] = useState(selectedImage.width);
  const [height, setHeight] = useState(selectedImage.height);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  });
  const [isCropping, setIsCropping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio) {
      const aspectRatio = selectedImage.width / selectedImage.height;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio) {
      const aspectRatio = selectedImage.width / selectedImage.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const handleFilterChange = (
    filterName: keyof typeof filters,
    value: number,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleRemoveBackground = () => {
    setIsProcessing(true);
    // Simulate background removal processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const handleSave = (saveAsNew: boolean) => {
    const imageData = {
      id: selectedImage.id,
      width,
      height,
      filters,
      // Other edited properties
    };
    onSave(imageData, saveAsNew);
  };

  const filterStyle = {
    filter: `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      blur(${filters.blur / 10}px)
    `,
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <EditorToolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Main canvas area */}
        <div className="flex-1 flex items-center justify-center overflow-auto p-4 bg-gray-100 dark:bg-gray-900">
          {selectedImage ? (
            <div className="relative">
              <div
                className="border border-border shadow-lg"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transition: "transform 0.2s",
                }}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  style={filterStyle}
                  className={`max-w-full ${isCropping ? "cursor-crosshair" : ""}`}
                />
              </div>
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                  Processing...
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Select an image from the media library to edit
            </div>
          )}
        </div>

        {/* Right sidebar with editing tools */}
        <Card className="w-80 border-l border-t-0 border-r-0 border-b-0 rounded-none shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoom(Math.max(zoom - 10, 10))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm">{zoom}%</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoom(Math.min(zoom + 10, 200))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Redo2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="resize">Resize</TabsTrigger>
                <TabsTrigger value="crop">Crop</TabsTrigger>
                <TabsTrigger value="bg">BG</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
              </TabsList>

              <TabsContent value="resize" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) =>
                      handleWidthChange(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) =>
                      handleHeightChange(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aspect-ratio"
                    checked={maintainAspectRatio}
                    onCheckedChange={setMaintainAspectRatio}
                  />
                  <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
                </div>
              </TabsContent>

              <TabsContent value="crop" className="space-y-4">
                <Button
                  variant={isCropping ? "secondary" : "outline"}
                  className="w-full"
                  onClick={() => setIsCropping(!isCropping)}
                >
                  <Crop className="mr-2 h-4 w-4" />
                  {isCropping ? "Cancel Crop" : "Start Cropping"}
                </Button>

                {isCropping && (
                  <div className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">
                      Draw on the image to select crop area
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        Reset
                      </Button>
                      <Button size="sm">Apply Crop</Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bg" className="space-y-4">
                <Button
                  className="w-full"
                  onClick={handleRemoveBackground}
                  disabled={isProcessing}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isProcessing ? "Processing..." : "Remove Background"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Automatically removes the background from your image using AI.
                </p>
              </TabsContent>

              <TabsContent value="filters" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="brightness">Brightness</Label>
                      <span className="text-xs">{filters.brightness}%</span>
                    </div>
                    <Slider
                      id="brightness"
                      min={0}
                      max={200}
                      step={1}
                      value={[filters.brightness]}
                      onValueChange={(value) =>
                        handleFilterChange("brightness", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="contrast">Contrast</Label>
                      <span className="text-xs">{filters.contrast}%</span>
                    </div>
                    <Slider
                      id="contrast"
                      min={0}
                      max={200}
                      step={1}
                      value={[filters.contrast]}
                      onValueChange={(value) =>
                        handleFilterChange("contrast", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="saturation">Saturation</Label>
                      <span className="text-xs">{filters.saturation}%</span>
                    </div>
                    <Slider
                      id="saturation"
                      min={0}
                      max={200}
                      step={1}
                      value={[filters.saturation]}
                      onValueChange={(value) =>
                        handleFilterChange("saturation", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="blur">Blur</Label>
                      <span className="text-xs">{filters.blur}</span>
                    </div>
                    <Slider
                      id="blur"
                      min={0}
                      max={20}
                      step={0.5}
                      value={[filters.blur]}
                      onValueChange={(value) =>
                        handleFilterChange("blur", value[0])
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-4" />

            <div className="flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => handleSave(false)}
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <ImageDown className="mr-2 h-4 w-4" />
                    Save as New
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Save as New Image</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will create a new image in your WordPress media
                      library. The original image will remain unchanged.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleSave(true)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageEditor;
