const http = require('http.min');
const dayjs = require('dayjs');

async function getHourlyPrices(aDate, opts) {
  try {
    const data = await http.json({
        uri: 'https://www.nordpoolgroup.com/api/marketdata/page/10?' +
          'currency=,' + opts.currency + ',' + opts.currency + ',' + opts.currency +
          '&endDate=' + aDate.format('DD-MM-YYYY'),
        timeout: 15000
      }
    );
    return parseResult(data, opts);
  } catch (err) {
    throw err;
  }
}

function parseResult(data, opts) {
  var result = [];
  if (data.data && data.data.Rows && data.data.Rows.length) {
    for (var i = 0; i < data.data.Rows.length; i++) {
      var row = data.data.Rows[i];
      if (row.IsExtraRow) {
        continue;
      }

      const date = dayjs.tz(row.StartTime, "YYYY-MM-DD\Thh:mm:ss", 'Europe/Oslo').tz();

      for (var j = 0; j < row.Columns.length; j++) {
        var column = row.Columns[j];
        var value = Math.round(100000 * (parseFloat(column.Value.replace(/,/, '.').replace(' ', '')) / 1000.0)) / 100000;

        if (isNaN(value)) {
          continue
        }
        if (column.Name === opts.priceArea) {
          result.push({
            startsAt: date,
            startIso: date.toISOString(),
            startLocal: date.format(),
            priceArea: opts.priceArea,
            currency: opts.currency,
            price: value
          })
        }
      }
    }
  }
  return result;
}

module.exports = {
  getHourlyPrices
};
