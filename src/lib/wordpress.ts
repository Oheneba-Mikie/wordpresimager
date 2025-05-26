export interface WordPressCredentials {
  username: string;
  password: string;
  siteUrl?: string;
}

export interface WordPressMedia {
  id: string;
  title: string;
  url: string;
  date: string;
  type: string;
  width?: number;
  height?: number;
}

export interface WordPressUser {
  id: string;
  name: string;
  avatar: string;
}

// Store WordPress credentials in localStorage
export const storeWordPressCredentials = async (
  credentials: WordPressCredentials,
) => {
  const wordpressData = {
    username: credentials.username,
    site_url: credentials.siteUrl || "",
    // Note: In a production app, you would encrypt the password
    password: credentials.password,
  };

  // Store in localStorage for demo purposes
  localStorage.setItem("wordpress_credentials", JSON.stringify(wordpressData));

  // Test the connection to WordPress
  try {
    if (!wordpressData.site_url) {
      throw new Error("Please provide a valid WordPress site URL");
    }

    const baseUrl = wordpressData.site_url.endsWith("/")
      ? wordpressData.site_url.slice(0, -1)
      : wordpressData.site_url;

    const testConnection = await fetch(
      `${baseUrl}/wp-json/wp/v2/media?per_page=1`,
      {
        headers: {
          Authorization: `Basic ${btoa(`${wordpressData.username}:${wordpressData.password}`)}`,
        },
      },
    );

    if (!testConnection.ok) {
      throw new Error(`Connection test failed: ${testConnection.statusText}`);
    }
  } catch (error) {
    console.warn("WordPress connection test failed:", error);
    // We'll continue anyway and let the actual media fetch handle errors
  }

  return [wordpressData];
};

// Authenticate with WordPress
export const authenticateWithWordPress = async (
  credentials: WordPressCredentials,
): Promise<WordPressUser> => {
  // In a real app, this would make an API call to WordPress
  // For now, we'll simulate a successful authentication

  try {
    // Store credentials locally instead of Supabase
    await storeWordPressCredentials(credentials);

    // Return mock user data
    return {
      id: "1",
      name: credentials.username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username}`,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Failed to authenticate with WordPress");
  }
};

// Fetch media from WordPress
export const fetchWordPressMedia = async (): Promise<WordPressMedia[]> => {
  try {
    // Get stored WordPress credentials
    const storedCredentials = localStorage.getItem("wordpress_credentials");
    if (!storedCredentials) {
      throw new Error("No WordPress credentials found");
    }

    const { username, password, site_url } = JSON.parse(storedCredentials);
    const siteUrl = site_url || "https://wordpress.example.com";

    // Remove trailing slash if present
    const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;

    // Create Basic Auth header
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    // Fetch media from WordPress REST API
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/media?per_page=20`, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    const mediaItems = await response.json();

    // Transform WordPress media format to our app format
    return mediaItems.map((item: any) => ({
      id: item.id.toString(),
      title: item.title?.rendered || "Untitled",
      url: item.source_url,
      date: new Date(item.date).toISOString().split("T")[0],
      type: item.mime_type,
      width: item.media_details?.width,
      height: item.media_details?.height,
    }));
  } catch (error) {
    console.error("Error fetching WordPress media:", error);

    // Return empty array on error
    return [];
  }
};

// Save edited image back to WordPress
export const saveEditedImage = async (
  imageData: any,
  saveAsNew: boolean,
): Promise<WordPressMedia> => {
  try {
    // Get stored WordPress credentials
    const storedCredentials = localStorage.getItem("wordpress_credentials");
    if (!storedCredentials) {
      throw new Error("No WordPress credentials found");
    }

    const { username, password, site_url } = JSON.parse(storedCredentials);
    const siteUrl = site_url || "https://wordpress.example.com";

    // Remove trailing slash if present
    const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;

    // Create Basic Auth header
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    // Convert base64 image data to a Blob
    const base64Data = imageData.dataUrl?.split(",")[1];
    if (!base64Data) {
      throw new Error("No image data provided");
    }

    const blob = await fetch(
      `data:${imageData.type};base64,${base64Data}`,
    ).then((res) => res.blob());

    // Create FormData for the file upload
    const formData = new FormData();
    const fileName = saveAsNew
      ? `${imageData.title} (Edited).jpg`
      : `${imageData.title}.jpg`;
    formData.append("file", blob, fileName);

    if (saveAsNew) {
      // Upload as new file
      const response = await fetch(`${baseUrl}/wp-json/wp/v2/media`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload media: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        id: result.id.toString(),
        title: result.title?.rendered || fileName,
        url: result.source_url,
        date: new Date().toISOString().split("T")[0],
        type: result.mime_type || "image/jpeg",
        width: imageData.width,
        height: imageData.height,
      };
    } else {
      // Update existing file
      // Note: WordPress REST API doesn't directly support replacing media files
      // We'll delete the old one and upload a new one with the same name
      await deleteWordPressMedia(imageData.id);

      const response = await fetch(`${baseUrl}/wp-json/wp/v2/media`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update media: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        id: result.id.toString(),
        title: imageData.title,
        url: result.source_url,
        date: new Date().toISOString().split("T")[0],
        type: result.mime_type || "image/jpeg",
        width: imageData.width,
        height: imageData.height,
      };
    }
  } catch (error) {
    console.error("Error saving edited image:", error);

    // Return the original image data on error
    return {
      id: saveAsNew ? `${Date.now()}` : imageData.id,
      title: saveAsNew ? `${imageData.title} (Edited)` : imageData.title,
      url: imageData.url,
      date: new Date().toISOString().split("T")[0],
      type: "image/jpeg",
      width: imageData.width,
      height: imageData.height,
    };
  }
};

// Delete image from WordPress
export const deleteWordPressMedia = async (
  mediaId: string,
): Promise<boolean> => {
  try {
    // Get stored WordPress credentials
    const storedCredentials = localStorage.getItem("wordpress_credentials");
    if (!storedCredentials) {
      throw new Error("No WordPress credentials found");
    }

    const { username, password, site_url } = JSON.parse(storedCredentials);
    const siteUrl = site_url || "https://wordpress.example.com";

    // Remove trailing slash if present
    const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;

    // Create Basic Auth header
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    // Delete media from WordPress REST API
    const response = await fetch(
      `${baseUrl}/wp-json/wp/v2/media/${mediaId}?force=true`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to delete media: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting WordPress media:", error);
    return false;
  }
};
