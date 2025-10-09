import BackButton from "@/components/common/back-button";
import ProductCreateForm from "@/components/products/product-form";

type AddProps = {
  params: Promise<{ companyId: string }>;
};

const AddProductsPage = async ({ params }: AddProps) => {
  const { companyId } = await params;

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <header className="flex items-center mb-6">
        <BackButton />

        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-500">Add a new product to your inventory</p>
        </div>
      </header>

      <section className="bg-white rounded-lg border p-6 shadow-sm">
        <ProductCreateForm companyId={companyId} />
      </section>
    </main>
  );
};

export default AddProductsPage;
