# strapi-provider-upload-oss
A provider for strapi server to upload file to Aliyun OSS

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

For more details, please see: https://strapi.io/documentation/v3.x/plugins/upload.html#using-a-provider

# Usage

### Strapi version > 3.0.0

With a stable release of Strapi 3.0.0, the configuration was moved to a JavaScript file. Official documentation [here](https://strapi.io/documentation/v3.x/plugins/upload.html#using-a-provider).

To enable the provider, create or edit the file at ```./config/plugins.js```.

```javascript
module.exports = ({ env }) => ({
  upload: {
    provider: 'aliyun-oss',
    providerOptions: {
      accessKeyId: env('ACCESS_KEY_ID'),
      accessKeySecret: env('ACCESS_KEY_SECRET'),
      region: env('REGION'),
      bucket: env('BUCKET'),
      uploadPath: env('UPLOAD_PATH'),
      baseUrl: env('BASE_URL'),
      timeout: env('TIMEOUT')
    }
  }
});
```

See below table for description of each provider option.

### Strapi Beta or alpha

The description for each fields to fill in strapi's configuration UI are as follows:

Field | value
----- | -----
**AccessKeyId token** | &lt;aliyun access key id&gt;
**AccessKeySecret token token** | &lt;aliyun access key secret&gt;
**Region** | OSS region (see reference below)
**Bucket** | bucket name
**Upload Path** | path to store the file
**Base URL to access** | can be your custom oss url for accessing the uploaded file, e.g. //www.website.com
**timeout** | OSS upload timeout (unit: seconds)
**Automatically generate thumbnails** (Beta) |  **VIDEO FILES ONLY** currently only supports `.mp4` file, will generate thumbnail for the video uploaded (screenshot at `00:01` of the video, size: `480x360`)

Example:

<img src="https://user-images.githubusercontent.com/2413682/63400602-fc1b3480-c406-11e9-91c6-db11c7c2ba67.png" width="500" />


# OSS Region reference
https://help.aliyun.com/document_detail/31837.html#title-qvx-r3a-xr4

# Contribution
This repo is maintained periodically, any contribution is highly welcomed
