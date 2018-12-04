'use strict';

const _ = require('lodash');
const OSS = require('ali-oss');

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
      ]
    },
    bucket: {
      label: 'Bucket',
      type: 'text'
    }
  },
  init: (config) => {
    const ossClient = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket
    });

    return {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          // upload file on OSS bucket
          const path = file.path ? `${file.path}/` : '';

          const name = `${path}${file.hash}${file.ext}`;

          ossClient.put(name, new Buffer(file.buffer, 'binary'))
            .then((result) => {
              file.url = result.name;
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
          const path = file.path ? `${file.path}/` : '';
          const name = `${path}${file.hash}${file.ext}`;

          ossClient.deleteObject(name)
            .then((result) => {
              if (result.status === '200') {
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
