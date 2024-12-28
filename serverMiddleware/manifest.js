export default (req, res) => {
  const themeColor = req.query.theme_color || '#f9fafb';

  const manifest = {
    name: 'Sagrada Escritura',
    short_name: 'Sagrada Escritura',
    description: 'Aplicativo da Sagrada Escritura',
    lang: 'pt-BR',
    theme_color: themeColor,
    background_color: themeColor,
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(manifest));
};
