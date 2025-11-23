import BackButton from "@/components/common/back-button";
import ProductCreateForm from "@/components/products/product-form";
// import { fetchCategories } from "@/data/category/get-category";
// import {
//   fetchCompany,
//   fetchCountries,
//   fetchCurrencies,
// } from "@/data/company/get-companies";

type AddProps = {
  params: Promise<{ companyId: string }>;
};

const AddProductsPage = async ({ params }: AddProps) => {
  const { companyId } = await params;

  // const [company, categories] = await Promise.all([
  //   fetchCompany(),
  //   fetchCategories(companyId),
  // ]);

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
        <ProductCreateForm
          companyId={companyId}
          // branches={company[0].branches}
          // categories={categories}
        />
      </section>
    </main>
  );
};

export default AddProductsPage;
