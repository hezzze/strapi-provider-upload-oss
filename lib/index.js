'use strict';

const _ = require('lodash');
const OSS = require('ali-oss');
const which = require('which');
const fs = require('fs');
const os = require('os');
const childProcess = require('child_process');

const THUMBNAIL_SIZE = '480x360';

const log = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    strapi.log.debug('>>>>>>> upload oss <<<<<<<');
    strapi.log.debug(...args);
  }
};

const getTmpFilePath = name => `${os.tmpdir()}/${name}`;

module.exports = {
  provider: 'aliyun-oss',
  name: 'Aliyun Web Service OSS',
  auth: {
    accessKeyId: {
      label: 'AccessKeyId token',
      type: 'text'
    },
    accessKeySecret: {
      label: 'AccessKeySecret token',
      type: 'text'
    },
    region: {
      label: 'Region',
      type: 'enum',
      values: [
        'oss-cn-hangzhou',
        'oss-cn-shanghai',
        'oss-cn-qingdao',
        'oss-cn-beijing',
        'oss-cn-shenzhen',
        'oss-cn-hongkong',
        'oss-us-west-1',
        'oss-ap-southeast-1',
        'oss-ap-southeast-3',
      ]
    },
    bucket: {
      label: 'Bucket',
      type: 'text'
    },
    uploadPath: {
      label: 'Upload Path',
      type: 'text'
    },
    baseUrl: {
      label: 'Base URL to access',
      type: 'text'
    },
    autoThumb: {
      label: 'VIDEO FILE ONLY: Automatically generate thumbnails for video (supported format .mp4, thumbnail size 480x360)',
      type: 'enum',
      values: ['no', 'yes']
    },
    timeout: {
      label: 'timeout for oss uploading, unit: seconds',
      type: 'number'
    }
  },
  init: (config) => {
    const ossClient = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      timeout: +(config.timeout * 1000)
    });

    return {
      upload: (file) => {
        log(file);
        return new Promise((resolve, reject) => {
          // upload file on OSS bucket
          const path = config.uploadPath ? `${config.uploadPath}/` : '';
          const fileName = `${file.hash}${file.ext}`;
          const fullPath = `${path}${fileName}`;

          const fileBuffer = Buffer.from(file.buffer, 'binary');

          const tmpPath = getTmpFilePath(fileName);

          const generateThumbnail = () => {
            which('ffmpeg', (err) => {
              if (!err) {
                fs.writeFileSync(tmpPath, fileBuffer);

                const proc = childProcess.spawn('ffmpeg', [
                  '-hide_banner',
                  '-i', tmpPath,
                  '-ss', '00:00:01',
                  '-vframes', '1',
                  '-s', THUMBNAIL_SIZE,
                  '-c:v', 'png',
                  '-f', 'image2pipe',
                  // pipe:1 means output to std out
                  'pipe:1',
                ]);

                proc.stderr.on('data', function (data) {
                  // log errors from ffmpeg
                  log('stderr: ' + data);
                });

                ossClient.putStream(`${path}${file.hash}-${THUMBNAIL_SIZE}.png`, proc.stdout)
                  .then((result) => {
                    // delete tmp file
                    fs.unlinkSync(tmpPath);

                    log('thumbnail generated ok', result);
                  })
                  .catch((err) => {
                    log('thumbnail generation failed', err);
                  });

              } else {
                log('ffmpeg not found, therefore no thumbnails are generated ');
              }
            })
          };


          ossClient.put(fullPath, fileBuffer)
            .then((result) => {
              log(result);
              if (config.baseUrl) {
                // use http protocol by default, but you can configure it as https protocol
                // deprecate config.domain, use baseUrl to specify protocol and domain.
                let baseUrl = config.baseUrl.replace(/\/$/, '');
                let name = (result.name || '').replace(/^\//, '');
                file.url = `${baseUrl}/${name}`;
              } else {
                file.url = result.url;
              }

              if (config.autoThumb === 'yes' && file.ext === '.mp4') {
                log('start generating thumbnail...');
                // automatically generate thumbnails
                generateThumbnail();
              }

              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
      delete: (file) => {
        return new Promise((resolve, reject) => {
          // delete file on OSS bucket
          const path = config.uploadPath ? `${config.uploadPath}/` : '';
          const fullPath = `${path}${file.hash}${file.ext}`;

          ossClient.delete(fullPath)
            .then((resp) => {
              log(resp);
              if (resp.res && /2[0-9]{2}/.test(resp.res.statusCode)) {
                // clean up possible existing thumbnails
                log('clean up possible existing thumbnails...');
                ossClient.delete(`${path}${file.hash}-${THUMBNAIL_SIZE}.png`)
                  .then((result) => log('thumbnail deleted', result))
                  .catch((err) => log('thumbnail deletion error', err))

                resolve();
              } else {
                reject(new Error('OSS file deletion error'));
              }
            })
            .catch((err) => {
              reject(err);
            })
        });
      }
    };
  }
};
