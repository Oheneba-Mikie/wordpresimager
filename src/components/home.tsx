import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaSidebar from "./MediaSidebar";
import ImageEditor from "./ImageEditor";
import { Button } from "./ui/button";
import { User, LogOut } from "lucide-react";
import {
  authenticateWithWordPress,
  fetchWordPressMedia,
  saveEditedImage,
  deleteWordPressMedia,
  WordPressMedia,
  WordPressUser,
} from "@/lib/wordpress";
import { useToast } from "@/components/ui/use-toast";

interface HomeProps {}

const Home = ({}: HomeProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [selectedImage, setSelectedImage] = useState<WordPressMedia | null>(
    null,
  );
  const [mediaItems, setMediaItems] = useState<WordPressMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadMediaItems();
    }
  }, [isAuthenticated]);

  const loadMediaItems = async () => {
    setIsLoading(true);
    try {
      const media = await fetchWordPressMedia();
      setMediaItems(media);

      if (media.length === 0) {
        toast({
          title: "No media found",
          description: "Check your WordPress site URL and credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error loading media",
        description: "Could not connect to your WordPress media library",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Get the site URL from the input field
      const storedCredentials = localStorage.getItem("wordpress_credentials");
      let siteUrl = "";
      if (storedCredentials) {
        const { site_url } = JSON.parse(storedCredentials);
        siteUrl = site_url;
      }

      const userData = await authenticateWithWordPress({
        username,
        password,
        siteUrl,
      });

      setUser(userData);
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Connected to WordPress media library",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          "Could not authenticate with WordPress. Check your site URL and credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSelectedImage(null);
    setMediaItems([]);
    toast({
      title: "Logged out",
      description: "Disconnected from WordPress",
    });
  };

  const handleImageSelect = (media: WordPressMedia) => {
    setSelectedImage(media);
  };

  const handleSaveImage = async (imageData: any, saveAsNew: boolean) => {
    setIsLoading(true);
    try {
      const savedImage = await saveEditedImage(imageData, saveAsNew);
      toast({
        title: "Image saved",
        description: saveAsNew
          ? "New image created in your media library"
          : "Image updated successfully",
      });

      // Refresh media items
      await loadMediaItems();

      // Update selected image to the saved one
      setSelectedImage(savedImage);
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save image to WordPress",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    setIsLoading(true);
    try {
      await deleteWordPressMedia(mediaId);
      toast({
        title: "Media deleted",
        description: "Item removed from your media library",
      });

      // If the deleted item was selected, clear selection
      if (selectedImage && selectedImage.id === mediaId) {
        setSelectedImage(null);
      }

      // Refresh media items
      await loadMediaItems();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete media from WordPress",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">WordPress Media Editor</h1>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div>
              {/* Login button removed as it's handled in the sidebar */}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-[300px] border-r bg-card">
          <MediaSidebar
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            mediaItems={mediaItems}
            onLogin={handleLogin}
            onImageSelect={handleImageSelect}
            onMediaDelete={handleDeleteMedia}
          />
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 bg-background">
          {isAuthenticated ? (
            selectedImage ? (
              <ImageEditor
                selectedImage={selectedImage}
                onSave={handleSaveImage}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <Card className="p-8 max-w-md text-center">
                  <h2 className="text-xl font-semibold mb-4">
                    No Image Selected
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Select an image from your WordPress media library to start
                    editing.
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1598791318878-10e76d178023?w=600&q=80"
                    alt="Select an image"
                    className="rounded-md mx-auto mb-4"
                  />
                </Card>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <Card className="p-8 max-w-md text-center">
                <h2 className="text-xl font-semibold mb-4">
                  WordPress Media Editor
                </h2>
                <p className="text-muted-foreground mb-4">
                  Connect to your WordPress account to access and edit your
                  media library.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80"
                  alt="WordPress connection"
                  className="rounded-md mx-auto mb-4"
                />
                <Button onClick={handleLogin} className="mt-2">
                  <User className="h-4 w-4 mr-2" />
                  Login with WordPress
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
