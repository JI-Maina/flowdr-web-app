import { CreateCompanyForm } from "@/components/company/create-company";
import { fetchCountries, fetchCurrencies } from "@/data/company/get-companies";

const CompanySetUpPage = async () => {
  const [countries, currencies] = await Promise.all([
    fetchCountries(),
    fetchCurrencies(),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Company
          </h1>
          <p className="text-lg text-gray-600">
            Set up your company profile to get started with Flowdr. Main branch
            will automatically be created for your company. You can create other
            branches later.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <CreateCompanyForm countries={countries} currencies={currencies} />
        </div>
      </div>
    </main>
  );
};

export default CompanySetUpPage;
