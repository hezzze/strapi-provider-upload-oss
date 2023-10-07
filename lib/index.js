'use strict';

const OSS = require('ali-oss');

const errLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('>>>>>>> upload oss <<<<<<<');
    console.debug(...args);
  }
};

module.exports = {
  provider: 'aliyun-oss',
  name: 'Aliyun Web Service OSS',
  init: (config) => {
    const ossClient = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      timeout: +(config.timeout * 1000),
      secure: !(config.secure === false),
      internal: config.internal === true,
    });

    const upload = (file, customParams = {}) =>
      new Promise((resolve, reject) => {
        // upload file on OSS bucket
        const path = config.uploadPath ? `${config.uploadPath}/` : '';
        const fileName = `${file.hash}${file.ext}`;
        const fullPath = `${path}${fileName}`;

        ossClient.put(fullPath, file.stream || Buffer.from(file.buffer, 'binary'), customParams)
          .then((result) => {
            if (config.baseUrl) {
              // use http protocol by default, but you can configure it as https protocol
              // deprecate config.domain, use baseUrl to specify protocol and domain.
              let baseUrl = config.baseUrl.replace(/\/$/, '');
              let name = (result.name || '').replace(/^\//, '');
              file.url = `${baseUrl}/${name}`;
            } else {
              file.url = result.url;
            }

            resolve();
          })
          .catch((err) => {
            reject(err);
            errLog(err);
          });
      });

    return {
      uploadStream(file, customParams = {}) {
        return upload(file, customParams);
      },
      upload(file, customParams = {}) {
        return upload(file, customParams);
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on OSS bucket
          const path = config.uploadPath ? `${config.uploadPath}/` : '';
          const fullPath = `${path}${file.hash}${file.ext}`;

          ossClient.delete(fullPath, customParams)
            .then((resp) => {
              if (resp.res && /2[0-9]{2}/.test(resp.res.statusCode)) {
                resolve();
              } else {
                reject(new Error('OSS file deletion error'));
              }
            })
            .catch((err) => {
              reject(err);
            })
        });
      },
    };
  },
};
