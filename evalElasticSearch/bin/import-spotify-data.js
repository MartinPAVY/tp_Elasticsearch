const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: "http://localhost:9200" });

const records = {};
const datasetPath = path.resolve(__dirname, '../data/spotify-dataset.csv');
const datasetMapping = {
  properties: {
    track_genre: { type: 'keyword' },
    artists: {
      type: "text",
      fields: {
        keyword: {
          type: "keyword",
          ignore_above: 256
        }
      }
    }
  }
};

fs.readFile(datasetPath, 'UTF-8', (error, fileContent) => {
  const parser = parse(fileContent, { delimiter: ',', columns: true });

  parser.on('readable', function () {
    let record;

    while ((record = parser.read()) !== null) {
      const formattedRecord = formatRecord(record);
      if (!isDuplicate(record)) {
        records[record.track_id] = formattedRecord;
      } else {
        records[record.track_id].track_genre.push(formattedRecord.track_genre[0]);
      }
    }
  });

  parser.on('error', function (error) {
    console.error(error.message);
  });

  parser.on('close', function () {
    client.indices.create({ index: 'songs', mappings: datasetMapping })
      .then(() => {
        const operations = Object.values(records).flatMap(document => [{ index: { _index: 'songs' } }, document]);
        client.bulk({ refresh: true, operations })
          .then(() => { console.log("Imported"); })
          .catch(error => console.error(error));
      });
  });
});

function formatRecord(record) {
  delete record[''];
  record.artists          = record.artists.split(';');
  record.track_genre      = [record.track_genre];
  record.popularity       = parseInt(record.popularity, 10);
  record.duration_ms      = parseInt(record.duration_ms, 10);
  record.explicit         = record.explicit == "True";
  record.danceability     = parseFloat(record.danceability);
  record.energy           = parseFloat(record.energy);
  record.key              = parseInt(record.key);
  record.loudness         = parseFloat(record.loudness);
  record.mode             = parseInt(record.mode);
  record.speechiness      = parseFloat(record.speechiness);
  record.acousticness     = parseFloat(record.acousticness);
  record.instrumentalness = parseFloat(record.instrumentalness);
  record.liveness         = parseFloat(record.liveness);
  record.valence          = parseFloat(record.valence);
  record.tempo            = parseFloat(record.tempo);
  record.time_signature   = parseInt(record.time_signature);

  return record;
}

function isDuplicate(record) {
  const existingRecord = records[record.track_id];
  return existingRecord != null || existingRecord?.track_genre.includes(record.track_genre);
}
