const res = await fetch('http://localhost:4000/api/v1/media-collections/1');
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
