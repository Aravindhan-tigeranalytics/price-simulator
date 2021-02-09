// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl : 'http://localhost:8000',
  // baseUrl : 'https://mars-russia-api.azurewebsites.net',

  powerBI: {
    reportBaseURL: 'https://app.powerbi.com/reportEmbed',
    qnaBaseURL: 'https://app.powerbi.com/qnaEmbed',
    tileBaseURL: 'https://app.powerbi.com/embed',
    groupID: '3268f3d7-5cf6-4067-a92f-b8e07bc1c3f0',
    reportID: '1a45603b-db56-4fc4-b141-c70f657fbdd5'
}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
