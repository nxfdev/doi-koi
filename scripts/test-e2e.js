async function runE2ETests() {
  console.log('=== STARTING DOI KOI FULL-STACK E2E VERIFICATION ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Test Homepage
    console.log('--- 1. Testing Homepage (SSR & Assets) ---');
    const homeRes = await fetch('http://localhost:3000/');
    assert(homeRes.status === 200, 'Homepage responded with HTTP 200');
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes('hero-doi.png'), 'Hero Doi circular PNG referenced');
    assert(homeHtml.includes('hero-hypnotic-overlay.png'), 'Hypnotic overlay PNG referenced');
    assert(homeHtml.includes('ORDER NOW'), 'ORDER NOW CTA button present');
    assert(homeHtml.includes('about-video.mp4'), 'About video asset referenced');
    assert(homeHtml.includes('Mishti Doi'), 'Mishti Doi present in catalog');
    assert(homeHtml.includes('Diabetic Doi'), 'Diabetic Doi present in catalog');
    assert(homeHtml.includes('Shahi Doi'), 'Shahi Doi present in catalog');
    assert(homeHtml.includes('Kheersha'), 'Kheersha present in catalog');
    assert(homeHtml.includes('BOGURA'), 'Bogura Heritage Map illustrated');

    // 2. Test Products API
    console.log('\n--- 2. Testing Products API ---');
    const prodRes = await fetch('http://localhost:3000/api/products');
    assert(prodRes.status === 200, 'Products API returned HTTP 200');
    const prodData = await prodRes.json();
    assert(prodData.products && prodData.products.length === 4, 'Exactly 4 authentic Bogura products returned');
    
    const mishti = prodData.products.find(p => p.slug === 'mishti-doi');
    const diabetic = prodData.products.find(p => p.slug === 'diabetic-doi');
    const shahi = prodData.products.find(p => p.slug === 'shahi-doi');
    const kheersha = prodData.products.find(p => p.slug === 'kheersha');

    assert(mishti && mishti.price === 350, 'Mishti Doi price is ৳350');
    assert(diabetic && diabetic.price === 450, 'Diabetic Doi price is ৳450');
    assert(shahi && shahi.price === 500, 'Shahi Doi price is ৳500');
    assert(kheersha && kheersha.price === 0, 'Kheersha price is initially unassigned / admin-configurable (no fake price invented)');

    // 3. Test Order Creation (Commerce Security & Server-side Pricing Validation)
    console.log('\n--- 3. Testing Order Placement & Server-side Pricing ---');
    const orderPayload = {
      customer: {
        fullName: 'Tanvir Hossain',
        phone: '01711998877',
        email: 'tanvir@example.com',
        division: 'Dhaka',
        district: 'Dhaka',
        area: 'Banani',
        fullAddress: 'House 15, Road 11, Banani, Dhaka',
        deliveryInstructions: 'Keep in thermal bag upon delivery.',
      },
      items: [
        { productId: mishti.id, quantity: 2 },
        { productId: shahi.id, quantity: 1 }
      ],
      deliveryZoneId: 'zone_dhaka_central',
      paymentMethod: 'CASH_ON_DELIVERY',
      notes: 'Please dispatch cold.'
    };

    const initialMishtiStock = mishti.stock;

    const orderRes = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    assert(orderRes.status === 201, 'Order created successfully with HTTP 201');
    const orderData = await orderRes.json();
    assert(orderData.success === true, 'Order creation returned success flag');
    assert(orderData.order && orderData.order.orderNumber.startsWith('DK-'), `Generated order number: ${orderData.order?.orderNumber}`);
    
    // Server pricing check: 350*2 + 500*1 = 1200 subtotal, delivery 80 -> total 1280
    assert(orderData.order.subtotal === 1200, 'Subtotal correctly verified server-side: ৳1200');
    assert(orderData.order.deliveryFee === 80, 'Delivery fee calculated server-side: ৳80');
    assert(orderData.order.total === 1280, 'Total payable accurately calculated: ৳1280');

    // 4. Verify Inventory Decrement
    console.log('\n--- 4. Testing Server Inventory Deduction ---');
    const verifyProdRes = await fetch('http://localhost:3000/api/products');
    const verifyProdData = await verifyProdRes.json();
    const updatedMishti = verifyProdData.products.find(p => p.slug === 'mishti-doi');
    assert(updatedMishti.stock === initialMishtiStock - 2, `Mishti Doi stock decremented from ${initialMishtiStock} to ${updatedMishti.stock}`);

    // 5. Test Order Lookup by ID
    console.log('\n--- 5. Testing Order Tracking Lookup ---');
    const trackRes = await fetch(`http://localhost:3000/api/orders/${orderData.order.orderNumber}`);
    assert(trackRes.status === 200, 'Order tracking endpoint returned HTTP 200');
    const trackData = await trackRes.json();
    assert(trackData.order.customer.fullName === 'Tanvir Hossain', 'Customer record verified');
    assert(trackData.order.orderStatus === 'PENDING', 'Initial order status is PENDING');

    // 6. Test Admin Authentication & Protected Route Access
    console.log('\n--- 6. Testing Admin Authentication & Analytics ---');
    // Unauthorized attempt
    const unauthAnalytics = await fetch('http://localhost:3000/api/admin/analytics');
    assert(unauthAnalytics.status === 401, 'Unauthenticated request to admin analytics correctly blocked with HTTP 401');

    // Admin login
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@doikoi.com', password: 'doikoi2026' }),
    });
    assert(loginRes.status === 200, 'Admin login succeeded with HTTP 200');
    const cookie = loginRes.headers.get('set-cookie');
    assert(cookie && cookie.includes('dk_admin_session'), 'Secure admin session cookie issued');

    // Authorized attempt
    const authAnalytics = await fetch('http://localhost:3000/api/admin/analytics', {
      headers: { Cookie: cookie },
    });
    assert(authAnalytics.status === 200, 'Authenticated admin analytics returned HTTP 200');
    const analyticsData = await authAnalytics.json();
    assert(analyticsData.totalOrders >= 1, `Total orders tracked in analytics: ${analyticsData.totalOrders}`);
    assert(analyticsData.totalRevenue >= 1280, `Total revenue tracked in analytics: ৳${analyticsData.totalRevenue}`);

    // 7. Test Admin Status Update
    console.log('\n--- 7. Testing Admin Order Status Transition ---');
    const updateStatusRes = await fetch(`http://localhost:3000/api/orders/${orderData.order.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ orderStatus: 'OUT FOR DELIVERY', paymentStatus: 'PAID' }),
    });
    assert(updateStatusRes.status === 200, 'Order status updated to OUT FOR DELIVERY');
    const updatedOrderData = await updateStatusRes.json();
    assert(updatedOrderData.order.orderStatus === 'OUT FOR DELIVERY', 'Verified order status is OUT FOR DELIVERY');
    assert(updatedOrderData.order.paymentStatus === 'PAID', 'Verified payment status updated to PAID');

    console.log(`\n=== ALL TESTS FINISHED: ${passed} PASSED, ${failed} FAILED ===\n`);
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runE2ETests();
