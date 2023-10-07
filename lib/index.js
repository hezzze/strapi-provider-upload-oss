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
        "oss-cn-hangzhou",
        "oss-cn-shanghai",
        "oss-cn-qingdao",
        "oss-cn-beijing",
        "oss-cn-zhangjiakou",
        "oss-cn-huhehaote",
        "oss-cn-shenzhen",
        "oss-cn-heyuan",
        "oss-cn-chengdu",
        "oss-cn-hongkong",
        "oss-us-west-1",
        "oss-us-east-1",
        "oss-ap-southeast-1",
        "oss-ap-southeast-2",
        "oss-ap-southeast-3",
        "oss-ap-southeast-5",
        "oss-ap-northeast-1",
        "oss-ap-south-1",
        "oss-eu-central-1",
        "oss-eu-west-1",
        "oss-me-east-1"
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
    timeout: {
      label: 'timeout for oss uploading, unit: seconds',
      type: 'number'
    },
    secure: {
      label: 'Instruct OSS client to use HTTPS or HTTP protocol.',
      type: 'boolean',
    },
  },
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
