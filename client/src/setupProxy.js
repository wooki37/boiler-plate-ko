const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('setupProxy.js loaded');
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      logLevel: 'debug',
      // 들어온 경로를 그대로 유지 (/api/hello -> /api/hello)
      pathRewrite: (path, req) => '/api' + path,
      onProxyReq: (proxyReq, req) => {
        console.log('[HPM:onProxyReq]', req.method, req.originalUrl, '->', proxyReq.path);
      },
      onProxyRes: (proxyRes, req) => {
        console.log('[HPM:onProxyRes]', req.method, req.originalUrl, '->', proxyRes.statusCode);
      },
    })
  );
};
