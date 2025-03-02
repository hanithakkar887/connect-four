
// import './App.css'

// function App() {
  

//   return (
//     <h1 className="text-3xl font-bold underline">
//       hello
//     </h1>
//   )
// }

// export default App
import React from 'react';
import ConnectFour from './components/ConnectFour';
import './index.css';

function App() {
  return (
    <div className="App min-h-screen bg-gray-100 py-8">
      <ConnectFour />
    </div>
  );
}

export default App;