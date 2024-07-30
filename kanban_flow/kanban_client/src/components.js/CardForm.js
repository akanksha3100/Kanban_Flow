// import React, { useState } from 'react';

// function CardForm({ addNewItem }) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!title || !description) return;
//     addNewItem(title, description);
//     setTitle('');
//     setDescription('');
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Title"
//         style={{ marginRight: '8px' }}
//       />
//       <input
//         type="text"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         placeholder="Description"
//         style={{ marginRight: '8px' }}
//       />
//       <button type="submit">Add Item</button>
//     </form>
//   );
// }

// export default CardForm;
