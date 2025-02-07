const fetch = require("node-fetch");
const MongoClient = require("mongodb").MongoClient;
const { Sentry } = require("../sentry");
const { nodeCache } = require("../cache");
const {
  EXPIRE_1h,
  EXPIRE_24H,
  EXPIRE_48H,
  MONGO_URL,
  MONGO_OPTIONS,
  MONGO_DB,
  COINGECKO_MARKET_STATS,
  COINGECKO_PRICE_STATS,
  MARKET_CAP_RANK_24H,
  MARKET_CAP_RANK_COLLECTION,
  SUPPORTED_CRYPTOCURRENCY,
} = require("../constants");

const DEFAULT_FIAT = "usd";

const allowedFiats = ["usd", "cad", "eur", "gbp", "cny", "jpy"];

const getCoingeckoStats = async ({ fiat }) => {
  fiat = allowedFiats.includes(fiat) ? fiat : DEFAULT_FIAT;

  let marketStats = nodeCache.get(`${COINGECKO_MARKET_STATS}-${fiat}`);
  let priceStats = nodeCache.get(`${COINGECKO_PRICE_STATS}-${fiat}`);
  let marketCapRank24h = nodeCache.get(MARKET_CAP_RANK_24H);

  const getMarketCapRank24h =
    marketCapRank24h ||
    new Promise((resolve, reject) => {
      let db;
      try {
        MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
          if (err) {
            throw err;
          }
          db = client.db(MONGO_DB);

          db.collection(MARKET_CAP_RANK_COLLECTION)
            .find({
              $query: {
                createdAt: {
                  $lte: new Date(Date.now() - EXPIRE_24H * 1000),
                  $gte: new Date(Date.now() - EXPIRE_48H * 1000),
                },
              },
              $orderby: { value: 1 },
            })
            .toArray((_err, [{ value } = {}] = []) => {
              nodeCache.set(MARKET_CAP_RANK_24H, value, EXPIRE_1h);
              client.close();
              resolve(value);
            });
        });
      } catch (err) {
        console.log("Error", err);
        Sentry.captureException(err);
        reject();
      }
    });

  const getMarketStats =
    marketStats ||
    new Promise(async resolve => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/nano?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=true",
        );

        const {
          market_cap_rank: marketCapRank,
          market_data: {
            market_cap_change_percentage_24h: marketCapChangePercentage24h,
            market_cap: { [fiat]: marketCap },
            total_volume: { [fiat]: volume24h },
            current_price: { [fiat]: currentPrice },
            price_change_percentage_24h: change24h,
            total_supply: totalSupply,
            circulating_supply: circulatingSupply,
          },
        } = await res.json();

        marketStats = {
          marketCapRank,
          marketCap,
          marketCapChangePercentage24h,
          volume24h,
          totalSupply,
          circulatingSupply,
          currentPrice,
          change24h,
        };

        nodeCache.set(`${COINGECKO_MARKET_STATS}-${fiat}`, marketStats, 15);
        resolve(marketStats);
      } catch (err) {
        console.log("Error", err);
        Sentry.captureException(err);
      }
    });

  const getPriceStats =
    priceStats ||
    new Promise(async resolve => {
      try {
        const ids = SUPPORTED_CRYPTOCURRENCY.map(({ id }) => id).join(",");

        const resPrices = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${fiat}&include_24hr_change=true`,
        );
        priceStats = await resPrices.json();

        nodeCache.set(`${COINGECKO_PRICE_STATS}-${fiat}`, priceStats, 15);

        resolve(priceStats);
      } catch (err) {
        console.log("Error", err);
        Sentry.captureException(err);
      }
    });

  [marketCapRank24h, marketStats, priceStats] = await Promise.all([
    getMarketCapRank24h,
    getMarketStats,
    getPriceStats,
  ]);

  return {
    marketStats: Object.assign(marketStats, { marketCapRank24h }),
    priceStats,
  };
};

module.exports = {
  getCoingeckoStats,
};
