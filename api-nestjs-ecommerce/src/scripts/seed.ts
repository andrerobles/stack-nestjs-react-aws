// scripts/seed.ts
import { connect, disconnect } from 'mongoose';
import { faker } from '@faker-js/faker';
import * as mongoose from 'mongoose';

// Importe seus schemas
import { CategorySchema } from '../modules/categories/schemas/category.schema/category.schema';
import { ProductSchema } from '../modules/products/schemas/product.schema/product.schema';
import { OrderSchema } from '../modules/orders/schemas/order.schema/order.schema';

// Configuração da conexão
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://root:password@localhost:27017/ecommerce?authSource=admin';

async function seed() {
  try {
    console.log('Conectando ao MongoDB...');
    await connect(MONGODB_URI);
    console.log('Conexão estabelecida com sucesso!');

    // Registrar os modelos
    const CategoryModel = mongoose.model('Category', CategorySchema);
    const ProductModel = mongoose.model('Product', ProductSchema);
    const OrderModel = mongoose.model('Order', OrderSchema);

    console.log('Limpando coleções existentes...');
    await CategoryModel.deleteMany({});
    await ProductModel.deleteMany({});
    await OrderModel.deleteMany({});

    console.log('\n--- ETAPA 1: Criando categorias ---');
    const categoryIds = await createCategories(CategoryModel);
    console.log(`✅ ${categoryIds.length} categorias criadas com sucesso.`);

    console.log('\n--- ETAPA 2: Criando produtos ---');
    const productIds = await createProducts(ProductModel, categoryIds);
    console.log(`✅ ${productIds.length} produtos criados com sucesso.`);

    console.log('\n--- ETAPA 3: Criando pedidos ---');
    const orderCount = await createOrders(OrderModel, ProductModel, productIds);
    console.log(`✅ ${orderCount} pedidos criados com sucesso.`);

    console.log('\nSeed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
  } finally {
    // Desconectar do MongoDB
    await disconnect();
    console.log('Desconectado do MongoDB.');
  }
}

async function createCategories(CategoryModel) {
  const categoryNames = [
    'Eletrônicos',
    'Roupas',
    'Alimentos',
    'Livros',
    'Jogos',
    'Móveis',
    'Esportes',
    'Beleza',
    'Saúde',
    'Ferramentas',
  ];

  const categoryIds = [];

  for (const name of categoryNames) {
    try {
      const category = new CategoryModel({ name });
      const savedCategory = await category.save();

      // Armazenar o ID real gerado pelo MongoDB
      const categoryId = savedCategory._id.toString();
      categoryIds.push(categoryId);

      console.log(`Categoria criada: ${name} (ID: ${categoryId})`);
    } catch (error) {
      console.error(`Erro ao criar categoria ${name}:`, error.message);
    }
  }

  return categoryIds;
}

async function createProducts(ProductModel, categoryIds) {
  const productIds = [];

  for (let i = 0; i < 50; i++) {
    try {
      // Seleciona 1-3 categorias aleatórias para cada produto
      const randomCategoryIds = faker.helpers.arrayElements(
        categoryIds,
        faker.number.int({ min: 1, max: 3 }),
      );

      const product = new ProductModel({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        categoryIds: randomCategoryIds, // Usando os IDs reais das categorias
        imageUrl: faker.image.url(),
      });

      const savedProduct = await product.save();
      const productId = savedProduct._id.toString();
      productIds.push(productId);

      if (i % 10 === 0 || i === 49) {
        console.log(`Progresso: ${i + 1}/50 produtos criados`);
      }
    } catch (error) {
      console.error(`Erro ao criar produto #${i + 1}:`, error.message);
    }
  }

  return productIds;
}

async function createOrders(OrderModel, ProductModel, productIds) {
  let orderCount = 0;

  for (let i = 0; i < 200; i++) {
    try {
      // Seleciona 1-5 produtos aleatórios para cada pedido
      const selectedProductIds = faker.helpers.arrayElements(
        productIds,
        faker.number.int({ min: 1, max: 5 }),
      );

      // Busca os produtos para calcular o total
      const selectedProducts = await ProductModel.find({
        _id: {
          $in: selectedProductIds.map(
            (id) => new mongoose.Types.ObjectId(id as string),
          ),
        },
      });

      // Calcula o total baseado nos produtos selecionados
      const total = selectedProducts.reduce(
        (sum, product) => sum + product.price,
        0,
      );

      const order = new OrderModel({
        productIds: selectedProductIds, // Usando os IDs reais dos produtos
        total,
        date: faker.date.recent({ days: 30 }),
      });

      await order.save();
      orderCount++;

      if (i % 50 === 0 || i === 199) {
        console.log(`Progresso: ${i + 1}/200 pedidos criados`);
      }
    } catch (error) {
      console.error(`Erro ao criar pedido #${i + 1}:`, error.message);
    }
  }

  return orderCount;
}

// Executar o seed
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Erro fatal durante o seed:', error);
    process.exit(1);
  });
