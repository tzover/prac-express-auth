// 現在アクセスされているURLが入っているreq.originalFullUrlプロパティを生成する独自ミドルウェア
function originalFullUrl(req, res, next) {
  req.originalFullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  next();
}

module.exports = originalFullUrl;
