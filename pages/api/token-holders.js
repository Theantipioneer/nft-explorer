const sidusHolders = require("../../data/sidus.json");

export default function handler(req, res) {
    res.status(200).json(sidusHolders);
}
