import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    let products;
    if (category) {
      products = await db.products.getByCategory(category);
    } else if (available === 'true') {
      products = await db.products.getAvailable();
    } else {
      products = await db.products.getAll();
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, stock_quantity, image_url, is_available } = body;

    if (!name || !price || !category || stock_quantity === undefined) {
      return NextResponse.json({ error: 'Name, price, category, and stock quantity are required' }, { status: 400 });
    }

    const product = await db.products.create({
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      stock_quantity: parseInt(stock_quantity),
      image_url: image_url || '',
      is_available: is_available !== false,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
