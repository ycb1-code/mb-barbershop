export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Test Page</h1>
        <p className="text-gray-700">If you can see this text styled correctly, Tailwind is working.</p>
        <div className="mt-4 p-4 bg-blue-200 rounded">
          <p className="text-blue-800">This should have a blue background.</p>
        </div>
      </div>
    </div>
  );
}