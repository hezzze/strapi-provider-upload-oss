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
**Base URL to access** | can be your custom oss url for accessing the uploaded file, e.g. //www.website.com
**timeout** | OSS upload timeout (unit: seconds)
**Automatically generate thumbnails** (Beta) |  **VIDEO FILES ONLY** currently only supports `.mp4` file, will generate thumbnail for the video uploaded (screenshot at `00:01` of the video, size: `480x360`)

Example:

<img src="https://user-images.githubusercontent.com/2413682/63400602-fc1b3480-c406-11e9-91c6-db11c7c2ba67.png" width="500" />
