'use strict';

const EAWConstants = require('../eaw-constants');

/**
 * Function to return an email structure.
 */
function UserRegisteredEmail(
  name = '',
  role = '',
  email = '',
  pass = '',
  textData,
) {
  const eawConstants = new EAWConstants();
  const imageName = 'UserRegisterEmail.png';

  this.getHtml = async () => {
    let customHtml =
      `
    <!DOCTYPE html>
    <html lang="${textData.lang}">
      <head>
        <title>¡Confirmación de registro!</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <style>
          @import url('https://fonts.googleapis.com/css?family=Lato:400,700');
          .card {
            min-width: 200px;
            transition: 0.3s;
            font-size: 20px !important;
            margin-bottom: 40px;
            background-color: #ffffff; 
            height: 50%; border-radius: 5%;
          }
          .shadow {
            border-bottom: 5px solid #00000029;
            border-right: 1px solid #00000029;
            border-left: 1px solid #00000029;
          }
          .text-container {
            padding: 10px 60px 20px 60px;
            text-align: center;
          }
          body {
            height: auto;
            width: 100% !important;
            color: #0e2431;
            font-family: 'Lato', sans-serif;
            font-size: 18px !important;
            padding: 0;
            margin-top: 5%;
          }
          .card-container {
            margin: auto;
            width: 60%;
          }
          @media (max-width:500px) {
            body {
              width: 100% !important;
            }
            .text-container {
              padding: 10px 10px 20px 10px !important;
            }
          }
        </style>
      </head>
      <body style= "margin: auto !important;
        max-width: 600px !important;"
      >
        <div class="card-container">
          <div
          class="card shadow">` +
      `<img src="${eawConstants.EnvVars.API_ENDPOINT}/containers/img/download/${imageName}" alt="${textData.administrator.userRegisteredEmail.imageAlt}" style="width:100%" />` +
      ` <div class="text-container">
          <h1 style="font-size: 20px !important; font-weight: normal !important; color: #0E2431;"> ${textData.administrator.userRegisteredEmail.cardInfo1} <b>${role}</b> ${textData.administrator.userRegisteredEmail.cardInfo2}
          </h1>
          </div>
        </div>
        </div>
        <div style="margin: 40px 60px 30px 60px;">
          <p style = "font-size: 18px !important;"> ${textData.administrator.userRegisteredEmail.registrationText1} ${name}! ${textData.administrator.userRegisteredEmail.registrationText2}: </p>` +
      `<h2 style = "font-size: 18px !important; font-weight: normal !important;"> <b>${textData.administrator.userRegisteredEmail.lables.mail}:</b> ${email} </h2>` +
      `<h2 style = "font-size: 18px !important; font-weight: normal !important;"> <b>${textData.administrator.userRegisteredEmail.lables.password}:</b> ${pass}</h2>` +
      `</div>
      </body>
    </html>
    `;
    return customHtml;
  };
}

module.exports = UserRegisteredEmail;
