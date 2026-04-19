import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://admin:postgres_password_123@127.0.0.1:5432/psci_platform',
});

try {
  await client.connect();
  const res = await client.query('SELECT * FROM collection_images;');
  console.log('--- collection_images ---');
  console.log(res.rows);

  const colRes = await client.query('SELECT * FROM media_collections;');
  console.log('--- media_collections ---');
  console.log(colRes.rows);

} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
