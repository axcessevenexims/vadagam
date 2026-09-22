// AXCES SEVEN EXIMS / DKB - Centralized Supabase Client & Service Layer

const SUPABASE_CONFIG = {
  url: "https://cuifbnlhixxfmzmmpzre.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aWZibmxoaXh4Zm16bW1wenJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5Nzk2MDEsImV4cCI6MjEwNTU1NTYwMX0.3HH7ZLn69jTzqymk1aRE0AqIQj0ZTcS2ZfjMz-Galrk"
};

// Initialize Supabase Client instance
let _supabaseClient = null;
function getSupabase() {
  if (!_supabaseClient && window.supabase) {
    _supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }
  return _supabaseClient;
}

// ---------------------------------------------------------------------------
// 1. PRODUCT SERVICE
// ---------------------------------------------------------------------------
const ProductService = {
  async getProducts(category = 'all', searchQuery = '') {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('[ProductService] Supabase not loaded, falling back to local dataset');
      return typeof PRODUCTS_DATA !== 'undefined' ? PRODUCTS_DATA : [];
    }

    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category_slug', category);
      }

      const { data, error } = await query;
      if (error) throw error;

      let list = data || [];
      // Normalize field names for storefront compatibility
      list = list.map(p => ({
        ...p,
        category: p.category_slug || p.category,
        image: p.image_url || p.image || 'assets/plain-rice-vadagam.jpg'
      }));

      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        list = list.filter(p => 
          `${p.name_en} ${p.name_ta} ${p.subtitle_en || ''} ${p.subtitle_ta || ''} ${(p.ingredients_en || []).join(' ')} ${(p.benefits_en || []).join(' ')}`
            .toLowerCase()
            .includes(q)
        );
      }

      return list;
    } catch (err) {
      console.error('[ProductService.getProducts] Error:', err);
      return typeof PRODUCTS_DATA !== 'undefined' ? PRODUCTS_DATA : [];
    }
  },

  async getAllAdminProducts() {
    const supabase = getSupabase();
    if (!supabase) return typeof PRODUCTS_DATA !== 'undefined' ? PRODUCTS_DATA : [];

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(p => ({
        ...p,
        category: p.category_slug || p.category,
        image: p.image_url || p.image || 'assets/plain-rice-vadagam.jpg'
      }));
    } catch (err) {
      console.error('[ProductService.getAllAdminProducts] Error:', err);
      return [];
    }
  },

  async getProductById(id) {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return { ...data, category: data.category_slug, image: data.image_url };
  },

  async createProduct(product) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client unavailable');

    const slug = product.slug || (product.name_en ? product.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `prod-${Date.now()}`);

    const record = {
      slug: slug,
      category_slug: product.category || product.category_slug || 'fermented',
      name_en: product.name_en,
      name_ta: product.name_ta,
      subtitle_en: product.subtitle_en || '',
      subtitle_ta: product.subtitle_ta || '',
      badge_en: product.badge_en || 'Popular',
      badge_ta: product.badge_ta || 'பிரபலமானது',
      badge_type: product.badge_type || 'gold',
      image_url: product.image_url || product.image || 'assets/plain-rice-vadagam.jpg',
      short_desc_en: product.short_desc_en || '',
      short_desc_ta: product.short_desc_ta || '',
      prices: product.prices || { "250g": 90, "500g": 170, "1kg": 320, "5kg": 1500 },
      ingredients_en: product.ingredients_en || ["Raw Rice", "Cumin", "Hing", "Salt"],
      ingredients_ta: product.ingredients_ta || ["பச்சரிசி", "சீரகம்", "பெருங்காயம்", "உப்பு"],
      benefits_en: product.benefits_en || ["Rich in natural energy and traditional South Indian spices."],
      benefits_ta: product.benefits_ta || ["உடலுக்கு ஆற்றல் மற்றும் பாரம்பரிய சுவை தரக்கூடியது."],
      spice_level: product.spice_level || 'Mild',
      drying_method: product.drying_method || '100% Traditional Solar Sun-Dried',
      shelf_life: product.shelf_life || '12 Months',
      export_ready: product.export_ready !== false,
      in_stock: product.in_stock !== false,
      is_active: true
    };

    const { data, error } = await supabase
      .from('products')
      .insert([record])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id, product) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client unavailable');

    const updateFields = {};
    if (product.name_en !== undefined) updateFields.name_en = product.name_en;
    if (product.name_ta !== undefined) updateFields.name_ta = product.name_ta;
    if (product.subtitle_en !== undefined) updateFields.subtitle_en = product.subtitle_en;
    if (product.subtitle_ta !== undefined) updateFields.subtitle_ta = product.subtitle_ta;
    if (product.category !== undefined) updateFields.category_slug = product.category;
    if (product.category_slug !== undefined) updateFields.category_slug = product.category_slug;
    if (product.image_url !== undefined) updateFields.image_url = product.image_url;
    if (product.image !== undefined) updateFields.image_url = product.image;
    if (product.short_desc_en !== undefined) updateFields.short_desc_en = product.short_desc_en;
    if (product.short_desc_ta !== undefined) updateFields.short_desc_ta = product.short_desc_ta;
    if (product.prices !== undefined) updateFields.prices = product.prices;
    if (product.spice_level !== undefined) updateFields.spice_level = product.spice_level;
    if (product.in_stock !== undefined) updateFields.in_stock = product.in_stock;
    if (product.is_active !== undefined) updateFields.is_active = product.is_active;

    const { data, error } = await supabase
      .from('products')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async toggleStock(id, inStock) {
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase
      .from('products')
      .update({ in_stock: inStock })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteProduct(id) {
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// ---------------------------------------------------------------------------
// 2. ORDER SERVICE
// ---------------------------------------------------------------------------
const OrderService = {
  async getOrders() {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(o => ({
        id: o.order_number || o.id,
        db_id: o.id,
        date: new Date(o.created_at).toLocaleString(),
        name: o.customer_name,
        phone: o.customer_phone,
        address: o.customer_address,
        city: o.customer_city,
        state: o.customer_state,
        pincode: o.customer_pincode,
        total: Number(o.total_amount),
        payment: o.payment_preference,
        status: o.status,
        notes: o.notes || '',
        items: (o.order_items || []).map(i => ({
          name_en: i.product_name_en,
          name_ta: i.product_name_ta,
          packSize: i.pack_size,
          qty: i.quantity,
          price: Number(i.unit_price)
        }))
      }));
    } catch (err) {
      console.error('[OrderService.getOrders] Error:', err);
      return [];
    }
  },

  async createOrder(orderPayload, items) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not available');

    const orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const orderRecord = {
      order_number: orderNumber,
      customer_name: orderPayload.name,
      customer_phone: orderPayload.phone,
      customer_address: orderPayload.address,
      customer_city: orderPayload.city,
      customer_state: orderPayload.state || 'Tamil Nadu',
      customer_pincode: orderPayload.pincode,
      payment_preference: orderPayload.payment || 'UPI / GPay / PhonePe',
      total_amount: orderPayload.total,
      notes: orderPayload.notes || '',
      status: 'New'
    };

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert([orderRecord])
      .select()
      .single();

    if (orderErr) throw orderErr;

    if (items && items.length > 0) {
      const orderItemsRecords = items.map(item => ({
        order_id: order.id,
        product_name_en: item.name_en || 'Vadagam',
        product_name_ta: item.name_ta || 'வத்தல்',
        pack_size: item.packSize || '250g',
        unit_price: item.price,
        quantity: item.quantity || 1,
        subtotal: item.price * (item.quantity || 1)
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItemsRecords);

      if (itemsErr) console.error('[OrderService] Error inserting order items:', itemsErr);
    }

    return order;
  },

  async updateOrderStatus(orderIdOrNumber, status) {
    const supabase = getSupabase();
    if (!supabase) return;

    let query = supabase.from('orders').update({ status });
    if (orderIdOrNumber.startsWith('ORD-')) {
      query = query.eq('order_number', orderIdOrNumber);
    } else {
      query = query.eq('id', orderIdOrNumber);
    }

    const { error } = await query;
    if (error) throw error;
  },

  async deleteOrder(orderNumber) {
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('order_number', orderNumber);
    if (error) throw error;
  }
};

// ---------------------------------------------------------------------------
// 3. EXPORT RFQ SERVICE
// ---------------------------------------------------------------------------
const RFQService = {
  async getRFQs() {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('export_rfqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(r => ({
        id: r.rfq_number || r.id,
        db_id: r.id,
        date: new Date(r.created_at).toLocaleString(),
        name: r.name,
        email: r.email,
        phone: r.phone,
        country: r.country,
        volume: r.volume,
        products: r.products,
        notes: r.notes || '',
        status: r.status
      }));
    } catch (err) {
      console.error('[RFQService.getRFQs] Error:', err);
      return [];
    }
  },

  async createRFQ(rfqData) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client unavailable');

    const rfqNumber = 'RFQ-' + Math.floor(500 + Math.random() * 500);
    const record = {
      rfq_number: rfqNumber,
      name: rfqData.name,
      email: rfqData.email,
      phone: rfqData.phone,
      country: rfqData.country,
      volume: rfqData.volume,
      products: rfqData.products,
      notes: rfqData.notes || '',
      status: 'New'
    };

    const { data, error } = await supabase
      .from('export_rfqs')
      .insert([record])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRFQStatus(rfqNumber, status) {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from('export_rfqs')
      .update({ status })
      .eq('rfq_number', rfqNumber);

    if (error) throw error;
  },

  async deleteRFQ(rfqNumber) {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from('export_rfqs')
      .delete()
      .eq('rfq_number', rfqNumber);

    if (error) throw error;
  }
};

// ---------------------------------------------------------------------------
// 4. SITE CMS SERVICE
// ---------------------------------------------------------------------------
const CMSService = {
  async getAllCMS() {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('site_cms')
        .select('*');

      if (error) throw error;

      const cmsTree = {};
      (data || []).forEach(row => {
        cmsTree[row.section_key] = row.content;
      });

      return cmsTree;
    } catch (err) {
      console.error('[CMSService.getAllCMS] Error:', err);
      return null;
    }
  },

  async saveSection(sectionKey, contentData) {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from('site_cms')
      .upsert({
        section_key: sectionKey,
        content: contentData
      });

    if (error) throw error;
  },

  async saveAllCMS(cmsFullTree) {
    const supabase = getSupabase();
    if (!supabase) return;

    const sections = ['branding', 'pillars', 'story', 'export', 'footer'];
    for (const sec of sections) {
      if (cmsFullTree[sec]) {
        await supabase
          .from('site_cms')
          .upsert({
            section_key: sec,
            content: cmsFullTree[sec]
          });
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 5. TESTIMONIALS SERVICE
// ---------------------------------------------------------------------------
const TestimonialService = {
  async getTestimonials() {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(t => ({
        id: t.id,
        author: t.author_name,
        location: t.location_role,
        rating: t.rating,
        quote: t.quote,
        initials: t.avatar_initials || t.author_name.slice(0, 2).toUpperCase()
      }));
    } catch (err) {
      console.error('[TestimonialService] Error:', err);
      return [];
    }
  },

  async createTestimonial(testData) {
    const supabase = getSupabase();
    if (!supabase) return;

    const initials = (testData.author || 'CU').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        author_name: testData.author,
        location_role: testData.location,
        rating: Number(testData.rating) || 5,
        quote: testData.quote,
        avatar_initials: initials,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTestimonial(id, testData) {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
      .from('testimonials')
      .update({
        author_name: testData.author,
        location_role: testData.location,
        rating: Number(testData.rating) || 5,
        quote: testData.quote
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTestimonial(id) {
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// ---------------------------------------------------------------------------
// 6. SITE SETTINGS SERVICE
// ---------------------------------------------------------------------------
const SettingsService = {
  async getSettings() {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[SettingsService] Error:', err);
      return null;
    }
  },

  async saveSettings(settings) {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 'global',
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        tagline: settings.tagline
      });

    if (error) throw error;
  }
};

// ---------------------------------------------------------------------------
// 7. SUPABASE STORAGE SERVICE (Media & Image Uploads)
// ---------------------------------------------------------------------------
const StorageService = {
  async uploadImage(file, bucketName = 'product-images', customName = null) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client unavailable');

    const ext = file.name.split('.').pop() || 'jpg';
    const cleanBase = (customName || file.name).replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `${Date.now()}_${cleanBase}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  }
};

// Export services onto global window
window.ProductService = ProductService;
window.OrderService = OrderService;
window.RFQService = RFQService;
window.CMSService = CMSService;
window.TestimonialService = TestimonialService;
window.SettingsService = SettingsService;
window.StorageService = StorageService;
window.getSupabase = getSupabase;
