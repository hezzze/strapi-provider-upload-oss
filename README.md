# strapi-provider-upload-oss
A provider for strapi server to upload file to Aliyun OSS.

# Requirements
- Node.js >= 10
- npm > 6

# Installation
```bash
$ npm install strapi-provider-upload-oss --save
```

or

```bash
$ yarn add strapi-provider-upload-oss --save
```

For more details, please see: https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#using-a-provider

# Usage


### Strapi v4

The lastest version of the provider supports v4 by default, configuration is updated a little bit. See example below for ```./config/plugins.js```:

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-oss', // full package name is required
      providerOptions: {
        accessKeyId: env('ACCESS_KEY_ID'),
        accessKeySecret: env('ACCESS_KEY_SECRET'),
        region: env('REGION'),
        bucket: env('BUCKET'),
        uploadPath: env('UPLOAD_PATH'),
        baseUrl: env('BASE_URL'),
        timeout: env('TIMEOUT'),
        secure: env('OSS_SECURE'),
        internal: env.bool('OSS_INTERNAL', false),
      }
    }
  }
});
```

Official documentation [here](https://docs.strapi.io/developer-docs/latest/plugins/upload.html#enabling-the-provider)

### Strapi v3

With a stable release of Strapi 3.0.0, the configuration was moved to a JavaScript file. Official documentation [here](https://docs-v3.strapi.io/developer-docs/latest/development/plugins/upload.html#enabling-the-provider).

To enable the provider, create or edit the file at ```./config/plugins.js```.

```javascript
module.exports = ({ env }) => ({
  upload: {
    provider: 'oss',
    providerOptions: {
      accessKeyId: env('ACCESS_KEY_ID'),
      accessKeySecret: env('ACCESS_KEY_SECRET'),
      region: env('REGION'),
      bucket: env('BUCKET'),
      uploadPath: env('UPLOAD_PATH'),
      baseUrl: env('BASE_URL'),
      timeout: env('TIMEOUT'),
      secure: env('OSS_SECURE'), //default to true
      internal: env.bool('OSS_INTERNAL', false),
    }
  }
});
```

### Provider Options

Property | type |  value
----- | ---- | ------------
**accessKeyId** | string | &lt;aliyun access key id&gt;
**accessKeySecret** | string | &lt;aliyun access key secret&gt;
**region** | string | OSS region (see reference below)
**bucket** | string | bucket name
**uploadPath** | string | path to store the file
**baseUrl** | string | can be your custom oss url for accessing the uploaded file, e.g. //www.website.com
**timeout** | integer | OSS upload timeout (unit: seconds)
**secure** | boolean | will https mode be enabled for oss client
**autoThumb** (Beta) | boolean |  **VIDEO FILES ONLY** currently only supports `.mp4` file, will generate thumbnail for the video uploaded (screenshot at `00:01` of the video, size: `480x360`)
**internal** | boolean | access OSS with aliyun internal network or not, default is false. If your servers are running on aliyun too, you can set true to save lot of money.


# OSS Region reference
https://help.aliyun.com/document_detail/31837.html#title-qvx-r3a-xr4

# Troubleshooting

Q: getting "The bucket you are attempting to access must be addressed using the specified endpoint. Please send all future requests to this endpoint."

A: Check if the OSS region is correct for the bucket you're using

# Contribution
This repo is maintained periodically, any contribution is highly welcomed
