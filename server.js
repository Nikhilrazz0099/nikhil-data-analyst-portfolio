const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.csv':'text/csv; charset=utf-8','.pdf':'application/pdf','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
http.createServer((req,res)=>{
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400).end('Bad request'); return; }
  const target = path.resolve(root, '.' + pathname);
  if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
  const file = pathname.endsWith('/') ? path.join(target,'index.html') : target;
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(err.code==='ENOENT'?404:500,{'Content-Type':'text/plain; charset=utf-8'}).end(err.code==='ENOENT'?'Not found':'Server error');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','X-Content-Type-Options':'nosniff'}).end(data);
  });
}).listen(process.env.PORT||8000,()=>console.log(`Portfolio ready at http://localhost:${process.env.PORT||8000}`));
