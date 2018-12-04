'use strict';

const _ = require('lodash');
const OSS = require('ali-oss');

module.exports = {
  provider: 'aliyun-oss',
  name: 'Aliyun Web Service OSS',
  auth: {
    accessKeyId: {
      label: 'Access Key Id',
      type: 'text'
    },
    accessKeySecret: {
      label: 'Access Key Secret',
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
    },
    uploadPath: {
      label: 'Upload Path',
      type: 'text'
    },
    domain: {
      label: 'Domain to access',
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
          const path = config.uploadPath ? `${config.uploadPath}/` : '';

          const name = `${path}${file.hash}${file.ext}`;


          ossClient.put(name, new Buffer(file.buffer, 'binary'))
            .then((result) => {
              if (config.domain) {
                file.url = `http://${config.domain}/${result.name}`;
              } else {
                file.url = result.url;
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
          const name = `${path}${file.hash}${file.ext}`;

          ossClient.delete(name)
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
      }
    };
  }
};
