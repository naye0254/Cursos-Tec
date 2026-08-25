'use strict';

const EAWConstants = require('../eaw-constants');

/**
 * Function to return an email structure.
 * @param {*} accessToken
 * @param {*} userId
 */
function forgotPasswordRequest(accessToken, userId, textData) {
  const eawConstants = new EAWConstants();

  this.getHtml = async () => {
    let customHtml = `<html lang="${textData.lang}>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          @import url('https://fonts.googleapis.com/css?family=Lato:400,700');
          body {
            font-family: 'Lato', sans-serif;
          }
          
          p {
            margin-top: 50px;
            color: #4B4B4B;
          }
          
          a {
            color: #0080C4;
            word-break: break-all;
          }
          
          .signature {
            font-style: italic;
            color: #4B4B4B;
            font-size: 0.9em;
          }
          
          .footer {
            margin-top: 50px;
            background: #0e2431 0% 0% no-repeat padding-box;
            height: 100px;
            padding-top: 40px;
            padding-left: 50px;
          }
          
          .link-footer {
            text-decoration: underline;
            text-align: right;
            color: #FFFFFF;
            margin-right: 10px;
          }
          /* Boostrap */
          
          *,
          ::after,
          ::before {
            box-sizing: border-box
          }
          
          .container {
            width: 100%;
            padding-right: 15px;
            padding-left: 15px;
            margin-right: auto;
            margin-left: auto
          }
          
          @media (min-width:576px) {
            .container {
              max-width: 540px
            }
          }
          
          @media (min-width:768px) {
            .container {
              max-width: 720px
            }
          }
          
          @media (min-width:992px) {
            .container {
              max-width: 960px
            }
          }
          
          @media (min-width:1200px) {
            .container {
              max-width: 1140px
            }
          }
          
          .row {
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            margin-right: -15px;
            margin-left: -15px
          }
          
          .col-lg-3,
          .col-lg-5,
          .col-lg-7,
          .col-lg-9,
          .col-sm-12 {
            position: relative;
            width: 100%;
            padding-right: 15px;
            padding-left: 15px
          }
          
          @media (min-width:576px) {
            .col-sm-12 {
              -ms-flex: 0 0 100%;
              flex: 0 0 100%;
              max-width: 100%
            }
          }
          
          @media (min-width:992px) {
            .col-lg-3 {
              -ms-flex: 0 0 25%;
              flex: 0 0 25%;
              max-width: 25%
            }
            .col-lg-5 {
              -ms-flex: 0 0 41.666667%;
              flex: 0 0 41.666667%;
              max-width: 41.666667%
            }
            .col-lg-6 {
              -ms-flex: 0 0 50%;
              flex: 0 0 50%;
              max-width: 50%
            }
            .col-lg-7 {
              -ms-flex: 0 0 58.333333%;
              flex: 0 0 58.333333%;
              max-width: 58.333333%
            }
            .col-lg-9 {
              -ms-flex: 0 0 75%;
              flex: 0 0 75%;
              max-width: 75%
            }
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="row">
            <div style="text-align: center" class="col-lg-6 col-sm-12">
              <img src="${eawConstants.EnvVars.API_ENDPOINT}/containers/img/download/password.jpeg" height="auto" width="100%" alt="${textData.administrator.forgotPasswordRequest.altDraw}.">
            </div>
            <div class="col-lg-6 col-sm-12">
              <img src="${eawConstants.EnvVars.API_ENDPOINT}/containers/img/download/Evaluador_logo.png" style="text-align: center" height="auto" width="auto" alt="${textData.administrator.forgotPasswordRequest.altEvaluator}">
              <p> 
              ${textData.administrator.forgotPasswordRequest.headerText}
                <br><br><br> ${textData.administrator.forgotPasswordRequest.link}: <a href="${eawConstants.EnvVars.ENDPOINT}user-restore?access_token=${accessToken}&i=${userId}">  ${textData.administrator.forgotPasswordRequest.enter} </a>
              </p>
              <br><span class="signature"><b>- ${textData.administrator.forgotPasswordRequest.evaluatorTeam} -</b></span>
            </div>
          </div>
          <div class="container footer">
            <div class="row">
              <div class="col-lg-9">
                <a class="link-footer" href="${eawConstants.EnvVars.ENDPOINT}/contact" style="color:#FFF">${textData.administrator.forgotPasswordRequest.contact}</a>
              </div>
              <div class="col-lg-3" style="text-align: right">
                <a class="link-footer" href="https://www.facebook.com/inclutecr/" target="_blank"><img src="${eawConstants.EnvVars.API_ENDPOINT}/containers/img/download/facebook.png" height="auto" width="auto" alt="Facebook"></a>
                <a class="link-footer" href="https://www.linkedin.com/company/inclutec/about/" target="_blank"><img src="${eawConstants.EnvVars.API_ENDPOINT}/containers/img/download/linkedin.png" height="auto" width="auto" alt="Linkedin"></a>
                <a class="link-footer" href="https://www.youtube.com/channel/UCz3MCiuSh21YYTfqJA9QUXA/featured" target="_blank"><img src="${eawConstants.EnvVars.API_ENDPOINT}/containers/img/download/youtube.png" height="auto" width="auto" alt="Youtube"></a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>`;

    return customHtml;
  };
}

module.exports = forgotPasswordRequest;
