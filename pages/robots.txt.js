export default function Robots() {
  return null;
}

export async function getServerSideProps({ res }) {
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://www.dhurataperbebe.com/sitemap.xml`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(content);
  res.end();

  return { props: {} };
}