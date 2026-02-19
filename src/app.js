
// import react , { useState } from 'react';

// function App() {
//   const [emailText, setEmailText] = useState('');
//   const [result, setResult] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Call your backend API endpoint here
//     const response = await fetch('YOUR_BACKEND_URL/api/detect', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email: emailText }),
//     });
//     const data = await response.json();
//     setResult(data.result);
//   }; 
     
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-4 text-gray-700">Email Scam Detector</h2>
//         <textarea
//           className="w-full p-2 border rounded mb-4"
//           rows={6}
//           value={emailText}
//           onChange={e => setEmailText(e.target.value)}
//           placeholder="Paste email content here..."
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded w-full"
//         >
//           Detect
//         </button>
//         {result && (
//           <div className={`mt-5 p-3 rounded text-center ${result === 'scam' ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'}`}>
//             {result === 'scam' ? 'Scam Detected' : 'Not a Scam'}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }

// export default App;
