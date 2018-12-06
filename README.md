# strapi-provider-upload-oss
A provider for strapi server to upload file to Aliyun OSS

# Installation
```bash
$ npm install strapi-provider-upload-oss --save
```
The installation will trigger a refresh for the server, and then you can go to http://your-strapi-server/admin/plugins/upload/configurations/development, choose **Aliyun Web Service OSS** in the dropdown to activate the provider.

For more details, please see: https://strapi.io/documentation/guides/upload.html#install-providers

# Usage

The description for each fields to fill in strapi's configuration UI are as follows:

Field | value
----- | -----
**AccessKeyId token** | &lt;aliyun access key id&gt;
**AccessKeySecret token token** | &lt;aliyun access key secret&gt;
**Region** | OSS region
**Bucket** | bucket name
**Upload Path** | path to store the file
**Domain to access** | can be your custom oss domain for access
**Automatically generate thumbnails** (Beta) |  **VIDEO FILES ONLY** currently only supports `.mp4` file, will generate thumbnail for the video uploaded (screenshot at `00:01` of the video, size: `480x360`)

Example:

<img src="https://user-images.githubusercontent.com/2413682/49428606-7ce6c180-f7e1-11e8-81c4-23ef8de7e4a9.png" width="500" />
