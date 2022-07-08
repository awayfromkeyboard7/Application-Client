const Github = require("../../models/github");

export default function(req, res) {
  try {
    const result = Github(req, res);
  } catch (error) {
    console.error(error)
  }
}