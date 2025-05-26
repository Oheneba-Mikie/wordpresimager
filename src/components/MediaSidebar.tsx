import React, { useState, useEffect } from "react";
import { Search, Trash2, FolderOpen, Grid, List, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";

interface MediaItem {
  id: string;
  title: string;
  url: string;
  date: string;
  type: string;
}

import { WordPressMedia } from "@/lib/wordpress";

interface MediaSidebarProps {
  isAuthenticated?: boolean;
  isLoading?: boolean;
  mediaItems?: WordPressMedia[];
  onLogin?: (username: string, password: string, siteUrl: string) => void;
  onImageSelect?: (media: WordPressMedia) => void;
  onMediaDelete?: (mediaId: string) => void;
}

const MediaSidebar = ({
  isAuthenticated = false,
  isLoading = false,
  mediaItems = [],
  onLogin = () => {},
  onImageSelect = () => {},
  onMediaDelete = () => {},
}: MediaSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginDialogOpen, setLoginDialogOpen] = useState(!isAuthenticated);
  const [siteUrl, setSiteUrl] = useState("");
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Close login dialog if user becomes authenticated
    if (isAuthenticated) {
      setLoginDialogOpen(false);

      // Load stored site URL if available
      const storedCredentials = localStorage.getItem("wordpress_credentials");
      if (storedCredentials) {
        const { site_url } = JSON.parse(storedCredentials);
        if (site_url) {
          setSiteUrl(site_url);
        }
      }
    }
  }, [isAuthenticated]);

  const filteredMedia = mediaItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLoginSubmit = () => {
    if (username && password && siteUrl) {
      // Make sure the URL has the correct format
      let formattedUrl = siteUrl;
      if (
        !formattedUrl.startsWith("http://") &&
        !formattedUrl.startsWith("https://")
      ) {
        formattedUrl = "https://" + formattedUrl;
      }
      onLogin(username, password, formattedUrl);
      setSiteUrl(formattedUrl);
    }
  };

  const handleMediaItemClick = (media: MediaItem) => {
    onImageSelect(media);
  };

  const handleDeleteClick = (e: React.MouseEvent, mediaId: string) => {
    e.stopPropagation();
    onMediaDelete(mediaId);
  };

  return (
    <div className="h-full w-[300px] border-r bg-background flex flex-col">
      {isAuthenticated ? (
        <>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Media Library</h2>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">
                  {filteredMedia.length} items
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={viewMode === "grid" ? "bg-accent" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={viewMode === "list" ? "bg-accent" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="flex-1">
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All Media
                </TabsTrigger>
                <TabsTrigger value="images" className="flex-1">
                  Images
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex-1">
                  Videos
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div
                  className={`p-4 ${viewMode === "grid" ? "grid grid-cols-2 gap-2" : "space-y-2"}`}
                >
                  {isLoading ? (
                    <div className="col-span-2 py-8 text-center text-muted-foreground">
                      Loading media items...
                    </div>
                  ) : errorMessage ? (
                    <div className="col-span-2 py-8 text-center text-muted-foreground">
                      <p className="text-red-500 mb-2">{errorMessage}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLogin(username, password, siteUrl)}
                      >
                        Retry Connection
                      </Button>
                    </div>
                  ) : filteredMedia.length === 0 ? (
                    <div className="col-span-2 py-8 text-center text-muted-foreground">
                      No media items found
                    </div>
                  ) : (
                    filteredMedia.map((media) =>
                      viewMode === "grid" ? (
                        <Card
                          key={media.id}
                          className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          onClick={() => handleMediaItemClick(media)}
                        >
                          <div className="aspect-square relative">
                            <img
                              src={media.url}
                              alt={media.title}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=400&q=80";
                              }}
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                              onClick={(e) => handleDeleteClick(e, media.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <CardContent className="p-2">
                            <p className="text-xs font-medium truncate">
                              {media.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {media.date}
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div
                          key={media.id}
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                          onClick={() => handleMediaItemClick(media)}
                        >
                          <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={media.url}
                              alt={media.title}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=400&q=80";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {media.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {media.date}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-50 hover:opacity-100"
                            onClick={(e) => handleDeleteClick(e, media.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ),
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="images" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="p-4 text-center text-muted-foreground">
                  Filter applied: Images only
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="videos" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="p-4 text-center text-muted-foreground">
                  Filter applied: Videos only
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" size="sm">
              <FolderOpen className="mr-2 h-4 w-4" />
              Organize Media
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-muted/20">
          <div className="text-center space-y-4 max-w-xs">
            <h2 className="text-xl font-semibold">WordPress Media Editor</h2>
            <p className="text-sm text-muted-foreground">
              Connect to your WordPress media library to edit and manage your
              images.
            </p>
            <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <LogIn className="mr-2 h-4 w-4" />
                  Connect to WordPress
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>WordPress Login</DialogTitle>
                  <DialogDescription>
                    Enter your WordPress credentials to connect to your media
                    library.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-url">WordPress Site URL</Label>
                    <Input
                      id="site-url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="https://your-wordpress-site.com"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Include the full URL with https://
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username or Email</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={handleLoginSubmit}
                      disabled={isLoading || !username || !password}
                    >
                      {isLoading ? "Connecting..." : "Login"}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSidebar;
