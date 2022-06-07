import fs from 'fs';
import * as http from 'http';
// To parse csv files
import { parse } from 'csv-parse';
import path from 'path';
import { ApiResponse, ApiRequest, baseUrl } from './types';

const filePatth = path.join(__dirname, '../src/customers.csv');
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const requestAsync = (data: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const postReq = http.request(baseUrl + '/messages', options, res => {
      res.setEncoding('utf8');
      res.on('data', resData => {
        resolve(resData);
      });
      res.on('error', err => {
        reject(err);
      });
    });
    postReq.write(data);
    postReq.end();
  });

const scheduleEmail = (
  email: string,
  text: string,
  ms: number,
): Promise<any> => {
  const requestBody: ApiRequest = {
    email: email,
    text: text,
  };
  const data = JSON.stringify(requestBody);
  const promise = new Promise(async function(resolve, reject) {
    try {
      await sleep(ms);
      process.nextTick(async function() {
        console.log(
          `sending email to ${email} at ${ms} ms with text - ${text}`,
        );
        const invoiceRes: string = await requestAsync(data);
        resolve(invoiceRes);
      });
    } catch (err) {
      reject(err);
    }
  });

  return promise;
};

const parser = parse({ delimiter: ',', fromLine: 2 }, async function(
  err,
  invoiceArray,
) {
  const promise = invoiceArray.map(async (invoice: string[]) => {
    const invoiceEmail: string = invoice[0];
    const invoiceText: string = invoice[1];
    const invoiceEmailScheduledTimes: string[] = invoice[2].split('-');
    const scheduledTimesInSec: number[] = invoiceEmailScheduledTimes.map(
      (timeInSeconds: string) => Number(timeInSeconds.slice(0, -1)),
    );
    let j = 0;
    const len = scheduledTimesInSec.length;
    while (j < len) {
      let nextRunInSec;
      if (j === 0) {
        nextRunInSec = scheduledTimesInSec[0];
      } else {
        nextRunInSec = scheduledTimesInSec[j] - scheduledTimesInSec[j - 1];
      }
      const invoiceRes: string = await scheduleEmail(
        invoiceEmail,
        invoiceText,
        nextRunInSec * 1000,
      );

      const res: ApiResponse = JSON.parse(invoiceRes);
      if (res.paid) {
        console.log(`invoice for ${res.email} is paid now`);
        break;
      }
      j++;
    }
  });
  await Promise.all(promise);
  console.log(
    'Finished sending all messages. Press control+C to stop commservice app and see results',
  );
});

fs.createReadStream(filePatth).pipe(parser);
