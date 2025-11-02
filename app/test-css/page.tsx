export default function TestCSSPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'red', fontSize: '24px', marginBottom: '10px' }}>Test CSS Page</h1>
      <p style={{ color: 'black', marginBottom: '10px' }}>This text should be black and visible.</p>
      <div style={{ backgroundColor: 'lightblue', padding: '10px', borderRadius: '5px' }}>
        <p style={{ color: 'darkblue' }}>This should have a light blue background.</p>
      </div>
      <div className="mt-4 p-4 bg-red-200 rounded">
        <p className="text-red-800">If this text is red with a red background, Tailwind is working.</p>
      </div>
    </div>
  );
}