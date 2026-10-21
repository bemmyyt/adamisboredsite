const {onRequest}=require('firebase-functions/v2/https');
const {initializeApp}=require('firebase-admin/app');
const {getAuth}=require('firebase-admin/auth');
initializeApp();
const allowed=new Set(['https://forum.adamisbored.xyz','https://adamisbored.xyz']);
exports.exchangeAccountToken=onRequest({region:'europe-west1',cors:[...allowed],maxInstances:10},async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!allowed.has(req.headers.origin))return res.status(403).json({error:'Origin not allowed'});
 const token=req.body?.idToken;
 if(typeof token!=='string'||token.length>5000)return res.status(400).json({error:'Invalid token'});
 try{
  const verified=await getAuth().verifyIdToken(token,true);
  const customToken=await getAuth().createCustomToken(verified.uid);
  res.set('Cache-Control','no-store').json({customToken});
 }catch(e){res.status(401).json({error:'Invalid or expired Firebase login'})}
});
