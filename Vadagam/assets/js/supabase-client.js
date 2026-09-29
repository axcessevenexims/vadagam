/**
 * AXCES SEVEN EXIMS - Central Supabase Client & Data Access Layer
 * Production-ready integration for Supabase PostgreSQL Database, Storage, and Authentication.
 */

const SUPABASE_CONFIG = {
  url: "https://tdrmuybbgyjodhxnfzhw.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcm11eWJiZ3lqb2RoeG5memh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1OTgyODksImV4cCI6MjEwNjE3NDI4OX0.D0Sw4dXO5xv-vWGpE3_RjvzEqsJW9CtMdO7Fr03diMc"
};

// Initialize Supabase Client
let _supabaseInstance = null;

function getSupabaseClient() {
  if (!_supabaseInstance) {
    if (typeof window !== "undefined" && window.supabase && window.supabase.createClient) {
      _supabaseInstance = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    } else {
      console.warn("Supabase SDK not loaded yet. Waiting for script to load...");
    }
  }
  return _supabaseInstance;
}

// Global AppSupabase Helper
const AppSupabase = {
  config: SUPABASE_CONFIG,

  getClient() {
    return getSupabaseClient();
  },

  // Helper to convert base64/dataURL to Blob for storage upload
  dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },

  // Storage Upload Service
  async uploadFile(bucket, fileOrDataUrl, folder = 'uploads') {
    const client = this.getClient();
    if (!client) throw new Error("Supabase client is not available.");

    let blob;
    let fileExt = 'jpg';

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      blob = this.dataURLtoBlob(fileOrDataUrl);
      const mime = fileOrDataUrl.split(',')[0].match(/:(.*?);/)[1];
      fileExt = mime.split('/')[1] || 'jpg';
      if (fileExt === 'jpeg') fileExt = 'jpg';
    } else if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      blob = fileOrDataUrl;
      if (fileOrDataUrl.name) {
        fileExt = fileOrDataUrl.name.split('.').pop() || 'jpg';
      }
    } else {
      // It might already be a standard path/URL
      return fileOrDataUrl;
    }

    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const { data, error } = await client.storage.from(bucket).upload(fileName, blob, {
      cacheControl: '3600',
      upsert: true
    });

    if (error) {
      console.error(`Error uploading to ${bucket}:`, error);
      throw error;
    }

    const { data: publicUrlData } = client.storage.from(bucket).getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  },

  // Delete File from Storage
  async deleteFile(bucket, filePathOrUrl) {
    const client = this.getClient();
    if (!client || !filePathOrUrl) return;

    try {
      let path = filePathOrUrl;
      if (filePathOrUrl.includes(bucket)) {
        path = filePathOrUrl.split(`${bucket}/`)[1];
      }
      if (path) {
        await client.storage.from(bucket).remove([path]);
      }
    } catch (err) {
      console.warn("Storage deletion warning:", err);
    }
  },

  // ==========================================
  // 1. PRODUCTS SERVICE
  // ==========================================
  products: {
    async getAll(options = {}) {
      const client = AppSupabase.getClient();
      if (!client) return [];

      let query = client.from('products').select('*');

      if (options.type && options.type !== 'all') {
        query = query.eq('type', options.type);
      }
      if (options.category && options.category !== 'all') {
        query = query.eq('category', options.category);
      }
      if (options.status) {
        query = query.eq('status', options.status);
      }

      query = query.order('display_order', { ascending: true }).order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      return data || [];
    },

    async getById(id) {
      const client = AppSupabase.getClient();
      if (!client) return null;

      const { data, error } = await client.from('products').select('*').eq('id', id).maybeSingle();
      if (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
      }
      return data;
    },

    async save(product) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      // Handle image upload if data URL
      let imageUrl = product.image;
      if (imageUrl && imageUrl.startsWith('data:')) {
        imageUrl = await AppSupabase.uploadFile('product-images', imageUrl, product.type || 'food');
      }

      const payload = {
        ...product,
        image: imageUrl || 'assets/images/prod-turmeric-mortar.jpg'
      };

      const { data, error } = await client.from('products').upsert(payload).select().single();
      if (error) {
        console.error("Error saving product:", error);
        throw error;
      }
      return data;
    },

    async delete(id) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      const { error } = await client.from('products').delete().eq('id', id);
      if (error) {
        console.error("Error deleting product:", error);
        throw error;
      }
      return true;
    }
  },

  // ==========================================
  // 2. INQUIRIES & LEADS SERVICE
  // ==========================================
  inquiries: {
    async getAll(options = {}) {
      const client = AppSupabase.getClient();
      if (!client) return [];

      let query = client.from('inquiries').select('*');

      if (options.status && options.status !== 'all') {
        query = query.eq('status', options.status);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching inquiries:", error);
        throw error;
      }
      return data || [];
    },

    async getById(id) {
      const client = AppSupabase.getClient();
      if (!client) return null;

      const { data, error } = await client.from('inquiries').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    },

    async create(inquiry) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      const id = inquiry.id || `INQ-2026-${Date.now().toString().slice(-4)}`;
      const payload = {
        ...inquiry,
        id,
        status: inquiry.status || 'new',
        created_at: new Date().toISOString()
      };

      const { data, error } = await client.from('inquiries').insert(payload).select().single();
      if (error) {
        console.error("Error inserting inquiry:", error);
        throw error;
      }
      return data;
    },

    async updateStatus(id, status) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      const { data, error } = await client.from('inquiries').update({ status }).eq('id', id).select().single();
      if (error) {
        console.error("Error updating inquiry status:", error);
        throw error;
      }
      return data;
    },

    async delete(id) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      const { error } = await client.from('inquiries').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
  },

  // ==========================================
  // 3. FACILITY GALLERY SERVICE
  // ==========================================
  facility: {
    async getAll() {
      const client = AppSupabase.getClient();
      if (!client) return [];

      const { data, error } = await client.from('facility_gallery').select('*').order('display_order', { ascending: true });
      if (error) {
        console.error("Error fetching facility gallery:", error);
        throw error;
      }
      return data || [];
    },

    async save(item) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      let imageUrl = item.image;
      if (imageUrl && imageUrl.startsWith('data:')) {
        imageUrl = await AppSupabase.uploadFile('facility-images', imageUrl, 'facility');
      }

      const payload = {
        ...item,
        image: imageUrl || 'assets/images/warehouse-1.jpg'
      };

      const { data, error } = await client.from('facility_gallery').upsert(payload).select().single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      const { error } = await client.from('facility_gallery').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
  },

  // ==========================================
  // 4. CERTIFICATES SERVICE
  // ==========================================
  certificates: {
    async getAll() {
      const client = AppSupabase.getClient();
      if (!client) return [];

      const { data, error } = await client.from('certificates').select('*').order('display_order', { ascending: true });
      if (error) {
        console.error("Error fetching certificates:", error);
        throw error;
      }
      return data || [];
    },

    async save(item) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      let imageUrl = item.image;
      if (imageUrl && imageUrl.startsWith('data:')) {
        imageUrl = await AppSupabase.uploadFile('certificate-images', imageUrl, 'certificates');
      }

      const payload = {
        ...item,
        image: imageUrl || 'assets/images/cert-gst.jpg'
      };

      const { data, error } = await client.from('certificates').upsert(payload).select().single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      const { error } = await client.from('certificates').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
  },

  // ==========================================
  // 5. SITE SETTINGS SERVICE
  // ==========================================
  settings: {
    async get() {
      const client = AppSupabase.getClient();
      if (!client) return null;

      const { data, error } = await client.from('site_settings').select('*').eq('id', 'default').maybeSingle();
      if (error) {
        console.error("Error fetching site settings:", error);
        throw error;
      }
      return data;
    },

    async save(settings) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      const payload = {
        id: 'default',
        company_name: settings.company_name || settings.companyName,
        tagline: settings.tagline,
        primary_phone: settings.primary_phone || settings.primaryPhone,
        secondary_phone: settings.secondary_phone || settings.secondaryPhone,
        email: settings.email,
        backup_email: settings.backup_email || settings.backupEmail,
        address: settings.address,
        contact_person: settings.contact_person || settings.contactPerson,
        established: settings.established,
        experience: settings.experience,
        social_links: settings.social_links || settings.socialLinks || {},
        updated_at: new Date().toISOString()
      };

      const { data, error } = await client.from('site_settings').upsert(payload).select().single();
      if (error) {
        console.error("Error updating site settings:", error);
        throw error;
      }
      return data;
    }
  },

  // ==========================================
  // 6. AUTHENTICATION SERVICE
  // ==========================================
  auth: {
    async signIn(email, password) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      return data;
    },

    async signOut() {
      const client = AppSupabase.getClient();
      if (!client) return;

      const { error } = await client.auth.signOut();
      if (error) throw error;
    },

    async getSession() {
      const client = AppSupabase.getClient();
      if (!client) return null;

      const { data, error } = await client.auth.getSession();
      if (error) return null;
      return data.session;
    },

    async getUser() {
      const client = AppSupabase.getClient();
      if (!client) return null;

      const { data: { user }, error } = await client.auth.getUser();
      if (error) return null;
      return user;
    },

    async updatePassword(newPassword) {
      const client = AppSupabase.getClient();
      if (!client) throw new Error("Supabase client unavailable");

      const { data, error } = await client.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return data;
    },

    onAuthStateChange(callback) {
      const client = AppSupabase.getClient();
      if (!client) return;
      return client.auth.onAuthStateChange(callback);
    }
  }
};

// Expose globally
window.AppSupabase = AppSupabase;
