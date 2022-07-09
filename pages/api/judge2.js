const Judge = require("../../models/judge");

export default async function(req, res) {
  // judge 서버에 채점 요청
  console.log('api judge');
  const result = await Judge(req.body['code']);
  res.status(200).json(result);
}