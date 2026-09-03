/**
 * Shopify Curated UNIKMO Product Setup Script
 * Run this to create the three curated products in your Shopify store
 * 
 * Usage: npx ts-node setup-curated-products.ts
 * 
 * Prerequisites:
 * - SHOPIFY_ACCESS_TOKEN env var set
 * - SHOPIFY_STORE_DOMAIN env var set
 */

const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || '';
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN || '';

if (!storeDomain || !accessToken) {
  console.error('❌ Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ACCESS_TOKEN environment variables');
  process.exit(1);
}

interface ShopifyProduct {
  title: string;
  bodyHtml: string;
  productType: string;
  vendor: string;
  variants: Array<{
    title: string;
    price: string;
    sku: string;
  }>;
  tags: string;
}

async function createProduct(product: ShopifyProduct) {
  const mutation = `
    mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      title: product.title,
      bodyHtml: product.bodyHtml,
      productType: product.productType,
      vendor: product.vendor,
      variants: product.variants.map(v => ({
        title: v.title,
        price: v.price,
        sku: v.sku,
      })),
      tags: product.tags,
    },
  };

  try {
    const response = await fetch(`https://${storeDomain}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const data: any = await response.json();

    if (data.errors) {
      console.error(`❌ Error creating ${product.title}:`, data.errors);
      return null;
    }

    if (data.data?.productCreate?.userErrors?.length > 0) {
      console.error(`❌ GraphQL error creating ${product.title}:`, data.data.productCreate.userErrors);
      return null;
    }

    const createdProduct = data.data?.productCreate?.product;
    if (createdProduct) {
      console.log(`✅ Created: ${createdProduct.title}`);
      console.log(`   Handle: ${createdProduct.handle}`);
      console.log(`   Product ID: ${createdProduct.id.split('/').pop()}`);
      
      createdProduct.variants.edges.forEach((edge: any) => {
        const variantId = edge.node.id.split('/').pop();
        console.log(`   - ${edge.node.title}: ${variantId} ($${edge.node.price})`);
      });

      return createdProduct;
    }

    return null;
  } catch (error) {
    console.error(`❌ Network error creating ${product.title}:`, error);
    return null;
  }
}

async function main() {
  console.log('🚀 Setting up Curated UNIKMO Shopify Products\n');
  console.log(`Store: ${storeDomain}\n`);

  // TODO: SET YOUR PRICES HERE
  const KEEP_IT_PRICE = '99.00';
  const KEEP_IT_DIGITAL_PRICE = '69.00';
  const TIMES_SQUARE_PRICE = '299.00';
  const TIMES_SQUARE_DIGITAL_PRICE = '269.00';
  const EXTRAS_PRICE = '12.00';

  const products: ShopifyProduct[] = [
    {
      title: 'Curated UNIKMO - Keep It',
      bodyHtml: `<p>Professional curation and editing of your selected moments into one finished UNIKMO memory.</p>
<p><strong>Includes:</strong></p>
<ul>
<li>Professional curation and editing</li>
<li>One completed UNIKMO memory</li>
<li>Customer approval before finalization</li>
<li>Choice of delivery (physical card or digital)</li>
</ul>`,
      productType: 'Curated Service',
      vendor: 'UNIKMO',
      variants: [
        { title: 'Physical UNIKMO Card', price: KEEP_IT_PRICE, sku: 'CURATED-KEEP-PHYSICAL' },
        { title: 'Digital Delivery', price: KEEP_IT_DIGITAL_PRICE, sku: 'CURATED-KEEP-DIGITAL' },
      ],
      tags: 'curated,concierge,memory',
    },
    {
      title: 'Curated UNIKMO - Times Square Edition',
      bodyHtml: `<p>Professional curation with a Times Square appearance. Your finished moment goes public.</p>
<p><strong>Includes:</strong></p>
<ul>
<li>Everything in Keep It — Curated</li>
<li>Times Square creative preparation</li>
<li>Times Square appearance (subject to availability)</li>
<li>Display capture incorporated into finished memory</li>
<li>Choice of delivery (physical card or digital)</li>
</ul>
<p><em>Times Square availability and scheduling confirmed during your concierge brief.</em></p>`,
      productType: 'Curated Service',
      vendor: 'UNIKMO',
      variants: [
        { title: 'Physical UNIKMO Card', price: TIMES_SQUARE_PRICE, sku: 'CURATED-TIMES-PHYSICAL' },
        { title: 'Digital Delivery', price: TIMES_SQUARE_DIGITAL_PRICE, sku: 'CURATED-TIMES-DIGITAL' },
      ],
      tags: 'curated,times-square,concierge,premium',
    },
    {
      title: 'Curated UNIKMO - Extra Keepsake Card',
      bodyHtml: `<p>Additional physical UNIKMO cards with the same finished curated memory.</p>
<p>Perfect for sharing with family, friends, colleagues or employees who were part of the moment.</p>
<ul>
<li>$${EXTRAS_PRICE} per card</li>
<li>Same finished curated memory</li>
<li>Personalized physical UNIKMO card</li>
</ul>`,
      productType: 'Add-on',
      vendor: 'UNIKMO',
      variants: [{ title: '1 Extra Card', price: EXTRAS_PRICE, sku: 'CURATED-EXTRAS' }],
      tags: 'curated,keepsake,add-on',
    },
  ];

  const results = [];
  for (const product of products) {
    const result = await createProduct(product);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
  }

  console.log('\n📋 Summary\n');
  console.log('Copy the Product IDs below into lib/curated-products.ts:\n');

  results.forEach((product, index) => {
    if (product) {
      const productId = product.id.split('/').pop();
      console.log(`PRODUCT ${index + 1}: ${product.title}`);
      console.log(`  productionId: 'gid://shopify/Product/${productId}',`);
      console.log(`  Variants:`);

      product.variants.edges.forEach((edge: any) => {
        const variantId = edge.node.id.split('/').pop();
        const variantKey = edge.node.title.includes('Physical') ? 'physical' : edge.node.title.includes('Digital') ? 'digital' : 'standard';
        console.log(`    ${variantKey}: productionVariantId: 'gid://shopify/ProductVariant/${variantId}',`);
      });

      console.log();
    }
  });

  console.log('✅ Done! Update lib/curated-products.ts with the IDs above.');
}

main().catch(console.error);
